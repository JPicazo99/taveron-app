# app/schemas.py
from pydantic import BaseModel, EmailStr, Field, constr
from typing import List, Optional

# ---------- CONTACTOS ----------
class ContactBase(BaseModel):
    nombre: constr(min_length=1)
    telefono: str = Field(..., pattern=r"^\d{10,}$")
    email: EmailStr

class ContactCreate(ContactBase):
    pass

class Contact(ContactBase):
    id: int
    class Config:
        orm_mode = True

# ---------- USUARIOS ----------
class UserBase(BaseModel):
    nombre: constr(min_length=1)
    email: EmailStr
    photo_url: Optional[str] = None

class UserCreate(UserBase):
    pass

# Puedes reutilizar UserCreate para update, o dejar UserBase
class User(UserBase):
    id: int
    contactos: List[Contact] = []
    class Config:
        orm_mode = True
