from pydantic import BaseModel, Field


class CareerProfilePayload(BaseModel):
    skills: list[str] = Field(default_factory=list)
    interests: list[str] = Field(default_factory=list)
    academic_background: str = ""
    projects: list[str] = Field(default_factory=list)
    experience: list[str] = Field(default_factory=list)
    career_goals: list[str] = Field(default_factory=list)


class CareerProfileResponse(BaseModel):
    message: str
