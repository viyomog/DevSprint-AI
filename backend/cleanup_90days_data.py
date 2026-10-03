import os
from datetime import datetime, timedelta
import sqlalchemy
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./devsprint.db")

# Fix SQLAlchemy 2.0 postgres:// compatibility
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

def cleanup_old_data(days_threshold=90):
    """Delete resumes, interview sessions, and QNA records older than N days."""
    print(f"Connecting to database to purge records older than {days_threshold} days...")
    
    # Create engine for PostgreSQL or SQLite
    if DATABASE_URL.startswith("sqlite"):
        engine = sqlalchemy.create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
        cutoff_date = (datetime.utcnow() - timedelta(days=days_threshold)).strftime("%Y-%m-%d %H:%M:%S")
        time_clause = f"'{cutoff_date}'"
    else:
        engine = sqlalchemy.create_engine(DATABASE_URL, pool_pre_ping=True)
        time_clause = f"NOW() - INTERVAL '{days_threshold} days'"

    with engine.connect() as conn:
        trans = conn.begin()
        try:
            # 1. Delete QNAs linked to old interviews
            qna_stmt = sqlalchemy.text(f"""
                DELETE FROM interview_qnas 
                WHERE interview_id IN (
                    SELECT id FROM interviews WHERE created_at < {time_clause}
                );
            """)
            res_qna = conn.execute(qna_stmt)
            print(f"Deleted {res_qna.rowcount} QNA entries older than {days_threshold} days.")

            # 2. Delete old interview sessions
            interview_stmt = sqlalchemy.text(f"""
                DELETE FROM interviews WHERE created_at < {time_clause};
            """)
            res_interview = conn.execute(interview_stmt)
            print(f"Deleted {res_interview.rowcount} interview sessions older than {days_threshold} days.")

            # 3. Delete old uploaded resumes
            resume_stmt = sqlalchemy.text(f"""
                DELETE FROM resumes WHERE uploaded_at < {time_clause};
            """)
            res_resume = conn.execute(resume_stmt)
            print(f"Deleted {res_resume.rowcount} resume profiles older than {days_threshold} days.")

            trans.commit()
            print(f"\nCleanup complete! All records older than {days_threshold} days were purged successfully.")

        except Exception as err:
            trans.rollback()
            print(f"Error during cleanup: {err}")

if __name__ == "__main__":
    cleanup_old_data(90)
