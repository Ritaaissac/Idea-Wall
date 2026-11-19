import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent / ".env.example")

SECRET_KEY = os.getenv("SECRET_KEY")
DATABASE_URL = os.getenv("DATABASE_URL")

if not SECRET_KEY:
    raise RuntimeError("Configure SECRET_KEY no arquivo backend/.env")
if not DATABASE_URL:
    raise RuntimeError("Configure DATABASE_URL no arquivo backend/.env")
