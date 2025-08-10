# app/models.py
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    photo_url = Column(String, nullable=True)  

    contactos = relationship(
        "Contact",
        back_populates="dueño",
        cascade="all, delete-orphan"
    )

class Contact(Base):
    __tablename__ = "contacts"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, index=True)
    telefono = Column(String)
    email = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"))
    dueño = relationship("User", back_populates="contactos")
