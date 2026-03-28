from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

from app.core.config import JWT_ALGORITHM, JWT_SECRET_KEY
from app.db.firestore import get_users_collection

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        email: str | None = payload.get("email")
        user_id: str | None = payload.get("user_id")

        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    users_collection = get_users_collection()

    user_doc = None
    if user_id:
        user_doc = users_collection.document(user_id).get()

    if not user_doc and email:
        query = users_collection.where("email", "==", email).limit(1).stream()
        user_doc = next(query, None)

    if not user_doc:
        raise credentials_exception

    if hasattr(user_doc, "exists") and not user_doc.exists:
        raise credentials_exception

    data = user_doc.to_dict() if hasattr(user_doc, "to_dict") else {}
    created_at = data.get("created_at")
    if hasattr(created_at, "to_datetime"):
        created_at = created_at.to_datetime()

    return {
        "_id": user_doc.id if hasattr(user_doc, "id") else user_id,
        "name": data.get("name"),
        "email": data.get("email"),
        "created_at": created_at,
    }

