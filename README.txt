# Directorio de Contactos

Aplicación **Full Stack** para gestionar usuarios y contactos, con soporte para subida de fotos, validaciones y edición en línea.  
El sistema incluye un backend en "FastAPI" y un frontend en "React", desplegado en "Vercel".

---

## Características

- Gestión de usuarios**: crear, listar, editar y eliminar usuarios.
- Gestión de contactos**: agregar, editar y eliminar contactos asociados a cada usuario.
- Subida de fotos** con integración a **Cloudinary**.
- Validaciones** en frontend y backend para nombres, correos y teléfonos.
- Modo oscuro / claro** con persistencia en `localStorage`.
- Búsqueda** de usuarios por nombre o correo.
- Diseño responsivo** con **Material UI**.
- API REST - documentada automáticamente con Swagger UI.

---

## Tecnologías utilizadas

( FastAPI, SQLAlchemy, Cloudinary, React, Vercel, Railway, Material UI, Axios, JavaScript, HTML, CSS, Python )

---

## Estructura del proyecto
.
├── backend/
│   ├── app/
│   │   ├── main.py         # Puntos de entrada de la API
│   │   ├── models.py       # Modelos SQLAlchemy
│   │   ├── schemas.py      # Esquemas Pydantic
│   │   ├── crud.py         # Operaciones de base de datos
│   │   ├── database.py     # Configuración de la base de datos
│   └── requirements.txt    # Dependencias backend
│
├── frontend/
│   ├── src/
│   │   ├── App.js          # App principal
│   │   ├── api.js          # Configuración Axios
│   │   ├── components/     # Componentes UI
│   └── package.json        # Dependencias frontend
└── README.md

---

## Instalación y ejecución

  - Backend (FastAPI)

    cd backend
    python -m venv venv
    source venv/bin/activate  
    pip install -r requirements.txt
    uvicorn app.main:app --reload

- Frontend (React)

    cd frontend
    npm install
    npm start

---

## Variables de entorno

DATABASE_URL=postgresql://usuario:password@host:puerto/base
CLOUDINARY_URL=cloudinary://<API_KEY>:<API_SECRET>@<CLOUD_NAME>

---

## Modelo del schema:  

El sistema modela un directorio de contactos donde cada usuario administra sus propios contactos. 
Se eligió un esquema relacional sencillo y normalizado por claridad, integridad referencial y facilidad de reporte.

---

## Entidades y relaciones

- users: información principal del usuario (id, nombre, email, photo_url).

- contacts: contactos pertenecientes a un usuario (id, nombre, telefono, email, user_id).

Relación 1:N: Un usuario puede tener muchos contactos; cada contacto pertenece a un usuario 
(FK contacts.user_id → users.id, con ON DELETE CASCADE para limpiar contactos al eliminar al usuario).

CREATE TABLE users (
  id         INTEGER PRIMARY KEY,
  nombre     VARCHAR,
  email      VARCHAR UNIQUE,
  photo_url  VARCHAR
);

CREATE TABLE contacts (
  id        INTEGER PRIMARY KEY,
  nombre    VARCHAR,
  telefono  VARCHAR,
  email     VARCHAR,
  user_id   INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


  









