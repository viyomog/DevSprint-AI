import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()

# Default Supabase PostgreSQL Database URL
DEFAULT_SUPABASE_URL = "postgresql://postgres:Q0MOPnTL6Cq6Fmed@db.jpuluyhivdkvfzxmcgpq.supabase.co:5432/postgres"

# Get database URL from environment variable or use default Supabase
DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_SUPABASE_URL)

# Fix SQLAlchemy 2.0 postgres:// compatibility (Render / Heroku format)
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Create SQLAlchemy engine with resilient connection pooling
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,
        pool_recycle=300,
        connect_args={"connect_timeout": 10}
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def init_db():
    """Initialize database tables safely at app startup without crashing import."""
    try:
        Base.metadata.create_all(bind=engine)
        print("✓ Database tables initialized successfully!")
    except Exception as err:
        print(f"Warning: Database initialization deferred or encountered issue: {err}")

# Helper dependency to get DB session per API request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
