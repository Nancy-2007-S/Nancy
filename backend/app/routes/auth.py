from fastapi import APIRouter, Depends

from app.dependencies.auth import get_current_user
from app.schemas.auth import (
    GoogleLoginRequest,
    LoginRequest,
    MessageResponse,
    ProfileResponse,
    SignupRequest,
    TokenResponse,
)
from app.services.auth_service import (
    authenticate_google_user,
    authenticate_user,
    create_user,
)

router = APIRouter()


@router.post("/signup", response_model=MessageResponse)
async def signup(payload: SignupRequest):
    return await create_user(payload)


@router.post("/login", response_model=TokenResponse)
async def login(payload: LoginRequest):
    return await authenticate_user(payload)


@router.post("/google", response_model=TokenResponse)
async def google_login(payload: GoogleLoginRequest):
    return await authenticate_google_user(payload)


@router.get("/profile", response_model=ProfileResponse)
async def get_profile(current_user=Depends(get_current_user)):
    return ProfileResponse(
        id=str(current_user["_id"]),
        name=current_user["name"],
        email=current_user["email"],
        created_at=current_user["created_at"],
    )
