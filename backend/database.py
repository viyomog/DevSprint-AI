import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()

# Get database URL from environment variable or fallback to local SQLite
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./hiremind.db")

# Fix SQLAlchemy 2.0 postgres:// compatibility (Render / Heroku format)
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Create engine for SQLite or PostgreSQL/MySQL
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DATABASE_URL, pool_pre_ping=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Helper dependency to get DB session per API request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
