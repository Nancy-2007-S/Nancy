from datetime import datetime, timezone
import html
from typing import Any, Dict

import bcrypt
from fastapi import HTTPException, status
from jose import jwt

from app.core.config import JWT_ALGORITHM, JWT_SECRET_KEY, get_access_token_expires
from app.core.firebase import auth as firebase_auth
from app.db.firestore import get_users_collection
from app.models.user import UserModel
from app.schemas.auth import GoogleLoginRequest, LoginRequest, SignupRequest

def _sanitize_text(value: str) -> str:
    return html.escape(value.strip(), quote=True)


def _normalize_email(email: str) -> str:
    return _sanitize_text(email).lower()


def _verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))


def _hash_password(password: str) -> str:
    hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
    return hashed.decode("utf-8")


def _create_access_token(data: Dict[str, Any]) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + get_access_token_expires()
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return encoded_jwt


async def create_user(payload: SignupRequest) -> dict:
    users_collection = get_users_collection()
    normalized_email = _normalize_email(payload.email)
    existing = users_collection.where("email", "==", normalized_email).limit(1).stream()
    existing_user = next(existing, None)
    if existing_user is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already exists")

    hashed_password = _hash_password(payload.password)
    user = UserModel(
        name=_sanitize_text(payload.name),
        email=normalized_email,
        password=hashed_password,
    )

    now = datetime.now(timezone.utc)
    doc_ref = users_collection.document()
    doc_ref.set(
        {
            "name": user.name,
            "email": user.email,
            "password": user.password,
            "created_at": now,
        }
    )

    return {"message": "User registered successfully"}


async def authenticate_user(payload: LoginRequest) -> dict:
    users_collection = get_users_collection()
    normalized_email = _normalize_email(payload.email)
    query = users_collection.where("email", "==", normalized_email).limit(1).stream()
    user_doc = next(query, None)

    if not user_doc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    user_data = user_doc.to_dict() or {}
    stored_password = user_data.get("password")
    if not stored_password or not _verify_password(payload.password, stored_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token_payload = {
        "user_id": str(user_doc.id),
        "email": user_data.get("email"),
    }
    access_token = _create_access_token(token_payload)
    return {"access_token": access_token, "token_type": "bearer"}


async def authenticate_google_user(payload: GoogleLoginRequest) -> dict:
    print(f"[Backend-Auth] Received Google login request. Token length: {len(payload.id_token)}")
    try:
        # Verify the Firebase ID token
        print("[Backend-Auth] Verifying ID token with Firebase Admin...")
        decoded_token = firebase_auth.verify_id_token(payload.id_token)
        print(f"[Backend-Auth] ID Token verified for: {decoded_token.get('email')}")
        
        email = decoded_token.get("email")
        # Try different common fields for the user's name
        name = decoded_token.get("name") or decoded_token.get("displayName") or decoded_token.get("given_name", "Google User")

        if not email:
            print("[Backend-Auth] ERROR: Email not provided in Google ID token.")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email not provided by Google account",
            )

        print(f"[Backend-Auth] Processing user email: {email}")
        users_collection = get_users_collection()
        normalized_email = _normalize_email(email)
        
        # Check if user already exists
        query = users_collection.where("email", "==", normalized_email).limit(1).stream()
        user_doc = next(query, None)

        if not user_doc:
            print(f"[Backend-Auth] User {normalized_email} NOT FOUND in Firestore. Creating new entry...")
            now = datetime.now(timezone.utc)
            doc_ref = users_collection.document()
            
            # Explicitly log the data being set
            user_data = {
                "name": name,
                "email": normalized_email,
                "provider": "google",
                "created_at": now,
            }
            print(f"[Backend-Auth] Writing to Firestore collection 'users' with ID: {doc_ref.id}")
            doc_ref.set(user_data)
            user_id = doc_ref.id
            print(f"[Backend-Auth] SUCCESS: New user stored in Firestore. ID: {user_id}")
        else:
            user_id = user_doc.id
            print(f"[Backend-Auth] SUCCESS: Existing user found in Firestore. ID: {user_id}")

        token_payload = {
            "user_id": str(user_id),
            "email": normalized_email,
        }
        access_token = _create_access_token(token_payload)
        print("[Backend-Auth] Internal JWT generated. authentication successful.")
        return {"access_token": access_token, "token_type": "bearer"}

    except Exception as e:
        print(f"[Backend-Auth] EXCEPTION during Google auth: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid Google token: {str(e)}",
        )
