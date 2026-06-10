from sqlmodel import SQLModel, create_engine, Session
from sqlalchemy.orm import sessionmaker
import os

DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///database.db")

engine = create_engine(DATABASE_URL, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, class_=Session)


def get_session():
    """Dependency that yields a SQLModel Session for FastAPI routes."""
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


def init_db():
    SQLModel.metadata.create_all(engine)
