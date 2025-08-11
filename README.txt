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


  








