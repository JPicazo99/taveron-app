# app/crud.py
from sqlalchemy.orm import Session
from . import models, schemas

# --------------------------------- USERS ---------------------------------------------

def crear_usuario(db: Session, usuario: schemas.UserCreate):  # Create
    db_user = models.User(**usuario.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def obtener_usuario(db: Session, user_id: int):  # Read
    return db.query(models.User).filter(models.User.id == user_id).first()

def obtener_usuarios(db: Session, skip: int = 0, limit: int = 10):  # Read all
    return db.query(models.User).offset(skip).limit(limit).all()

def actualizar_usuario(db: Session, user_id: int, nuevos_datos: schemas.UserCreate):  # Update
    usuario = db.query(models.User).filter(models.User.id == user_id).first()
    if usuario:
        data = nuevos_datos.dict(exclude_unset=True)
        for attr, value in data.items():
            setattr(usuario, attr, value)
        db.commit()
        db.refresh(usuario)
    return usuario

def eliminar_usuario(db: Session, user_id: int):  # Delete
    usuario = db.query(models.User).filter(models.User.id == user_id).first()
    if usuario:
        db.delete(usuario)
        db.commit()
    return usuario

# --------------------------------- CONTACTS ---------------------------------------------

def crear_contacto(db: Session, contacto: schemas.ContactCreate, user_id: int):  # Create
    db_contact = models.Contact(**contacto.dict(), user_id=user_id)
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return db_contact

def obtener_contactos(db: Session, user_id: int):  # Read all for a user
    return db.query(models.Contact).filter(models.Contact.user_id == user_id).all()

def actualizar_contacto(db: Session, contacto_id: int, nuevos_datos: schemas.ContactCreate):  # Update
    contacto = db.query(models.Contact).filter(models.Contact.id == contacto_id).first()
    if contacto:
        for attr, value in nuevos_datos.dict().items():
            setattr(contacto, attr, value)
        db.commit()
        db.refresh(contacto)
    return contacto

def eliminar_contacto(db: Session, contacto_id: int):  # Delete
    contacto = db.query(models.Contact).filter(models.Contact.id == contacto_id).first()
    if contacto:
        db.delete(contacto)
        db.commit()
    return contacto
