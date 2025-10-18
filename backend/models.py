from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

class PersonalInfo(BaseModel):
    fullName: str
    jobTitle: str
    email: str
    phone: str
    location: str
    summary: str

class Experience(BaseModel):
    id: int
    company: str
    position: str
    location: Optional[str] = ""
    startDate: str
    endDate: str
    current: bool = False
    description: str

class Education(BaseModel):
    id: int
    institution: str
    degree: str
    location: Optional[str] = ""
    startDate: str
    endDate: str
    gpa: Optional[str] = ""

class Skill(BaseModel):
    id: int
    name: str
    level: int = 50

class Language(BaseModel):
    id: int
    name: str
    level: str

class ResumeCreate(BaseModel):
    personalInfo: PersonalInfo
    experience: List[Experience]
    education: List[Education]
    skills: List[Skill]
    languages: List[Language]
    selectedTemplate: str = "classic"

class Resume(ResumeCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

class ResumeResponse(BaseModel):
    id: str
    message: str