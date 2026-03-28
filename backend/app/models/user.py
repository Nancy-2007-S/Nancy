from datetime import datetime, timezone

from pydantic import BaseModel, EmailStr, Field


class UserModel(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    password: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
