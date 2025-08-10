# app/database.py
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

raw_url = os.getenv("DATABASE_URL", "sqlite:///./taveron.db")

# Normaliza postgres:// -> postgresql+psycopg2://
if raw_url.startswith("postgres://"):
    raw_url = raw_url.replace("postgres://", "postgresql+psycopg2://", 1)
elif raw_url.startswith("postgresql://") and "+psycopg2" not in raw_url:
    raw_url = raw_url.replace("postgresql://", "postgresql+psycopg2://", 1)

# Añade sslmode=require si es Postgres y no viene ya
if raw_url.startswith("postgresql+psycopg2://") and "sslmode=" not in raw_url:
    raw_url += ("?sslmode=require" if "?" not in raw_url else "&sslmode=require")

# connect_args solo para SQLite
connect_args = {"check_same_thread": False} if raw_url.startswith("sqlite") else {}

engine = create_engine(raw_url, connect_args=connect_args, pool_pre_ping=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
