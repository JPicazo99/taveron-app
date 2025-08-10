# app/schemas.py
from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional

class ContactBase(BaseModel):
    nombre: str
    telefono: str = Field(..., pattern=r"^\d{10,}$")
    email: EmailStr

class ContactCreate(ContactBase): pass

class Contact(ContactBase):
    id: int
    class Config: orm_mode = True

class UserBase(BaseModel):
    nombre: str
    email: EmailStr
    photo_url: Optional[str] = None   

class UserCreate(UserBase): pass

class User(UserBase):
    id: int
    contactos: List[Contact] = []
    class Config: orm_mode = True
