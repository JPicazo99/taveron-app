# app/main.py
from fastapi import FastAPI, HTTPException, Depends, UploadFile, File
from sqlalchemy.orm import Session
from . import models, schemas, crud, database
from fastapi.middleware.cors import CORSMiddleware
import cloudinary
import cloudinary.uploader
import os

# Crear tablas (si no existen) 
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="API Directorio de Contactos")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://taveron-app.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Config Cloudinary (usa CLOUDINARY_URL)
CLOUDINARY_URL = os.getenv("CLOUDINARY_URL")
if CLOUDINARY_URL:
    cloudinary.config(cloudinary_url=CLOUDINARY_URL)

# Dependency de DB
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ---------- Healthcheck ----------
@app.get("/health")
def health():
    return {"status": "ok"}

# ------------------ USUARIOS ------------------
@app.post("/usuarios/", response_model=schemas.User)
def crear_usuario(usuario: schemas.UserCreate, db: Session = Depends(get_db)):
    return crud.crear_usuario(db, usuario)

@app.get("/usuarios/", response_model=list[schemas.User])
def leer_usuarios(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return crud.obtener_usuarios(db, skip, limit)

@app.get("/usuarios/{user_id}", response_model=schemas.User)
def leer_usuario(user_id: int, db: Session = Depends(get_db)):
    usuario = crud.obtener_usuario(db, user_id)
    if usuario is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return usuario

@app.delete("/usuarios/{user_id}", response_model=schemas.User)
def eliminar_usuario(user_id: int, db: Session = Depends(get_db)):
    usuario = crud.eliminar_usuario(db, user_id)
    if usuario is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return usuario

# ------------------ CONTACTOS ------------------
@app.post("/usuarios/{user_id}/contactos/", response_model=schemas.Contact)
def crear_contacto_para_usuario(user_id: int, contacto: schemas.ContactCreate, db: Session = Depends(get_db)):
    return crud.crear_contacto(db, contacto, user_id)

@app.get("/usuarios/{user_id}/contactos/", response_model=list[schemas.Contact])
def obtener_contactos_de_usuario(user_id: int, db: Session = Depends(get_db)):
    return crud.obtener_contactos(db, user_id)

@app.put("/contactos/{contacto_id}", response_model=schemas.Contact)
def actualizar_contacto(contacto_id: int, contacto: schemas.ContactCreate, db: Session = Depends(get_db)):
    actualizado = crud.actualizar_contacto(db, contacto_id, contacto)
    if actualizado is None:
        raise HTTPException(status_code=404, detail="Contacto no encontrado")
    return actualizado

@app.delete("/contactos/{contacto_id}", response_model=schemas.Contact)
def eliminar_contacto(contacto_id: int, db: Session = Depends(get_db)):
    eliminado = crud.eliminar_contacto(db, contacto_id)
    if eliminado is None:
        raise HTTPException(status_code=404, detail="Contacto no encontrado")
    return eliminado

# ---------- FOTO DE USUARIO ----------
@app.post("/usuarios/{user_id}/foto", response_model=schemas.User)
def subir_foto_usuario(user_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not CLOUDINARY_URL:
        raise HTTPException(status_code=500, detail="CLOUDINARY_URL no configurada")

    # Validaciones básicas
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="El archivo debe ser una imagen")

    usuario = crud.obtener_usuario(db, user_id)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # Subir a Cloudinary
    result = cloudinary.uploader.upload(
        file.file,
        folder="taveron/users",
        public_id=f"user_{user_id}",
        overwrite=True,
        resource_type="image",
    )
    usuario.photo_url = result.get("secure_url")
    db.commit()
    db.refresh(usuario)
    return usuario

@app.delete("/usuarios/{user_id}/foto", response_model=schemas.User)
def borrar_foto_usuario(user_id: int, db: Session = Depends(get_db)):
    if not CLOUDINARY_URL:
        raise HTTPException(status_code=500, detail="CLOUDINARY_URL no configurada")

    usuario = crud.obtener_usuario(db, user_id)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    usuario.photo_url = None
    db.commit()
    db.refresh(usuario)
    return usuario
