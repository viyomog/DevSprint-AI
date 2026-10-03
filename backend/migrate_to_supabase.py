import os
import sqlite3
import sqlalchemy
from dotenv import load_dotenv

load_dotenv()

def migrate():
    db_file = "devsprint.db" if os.path.exists("devsprint.db") else "hiremind.db"
    print(f"Connecting to local {db_file}...")
    sqlite_conn = sqlite3.connect(db_file)
    sqlite_conn.row_factory = sqlite3.Row
    s_cursor = sqlite_conn.cursor()

    pg_url = os.getenv("DATABASE_URL")
    if not pg_url or "sqlite" in pg_url:
        print("Error: DATABASE_URL environment variable is not set to a PostgreSQL database connection string.")
        return

    # Fix SQLAlchemy 2.0 postgres:// compatibility
    if pg_url.startswith("postgres://"):
        pg_url = pg_url.replace("postgres://", "postgresql://", 1)

    print("Connecting to Supabase PostgreSQL...")
    pg_engine = sqlalchemy.create_engine(pg_url)

    tables = ["users", "resumes", "interviews", "interview_qnas"]

    with pg_engine.connect() as pg_conn:
        for table in tables:
            try:
                s_cursor.execute(f"SELECT * FROM {table};")
                rows = s_cursor.fetchall()
                print(f"Migrating {len(rows)} records from '{table}'...")
                
                for row in rows:
                    col_names = row.keys()
                    row_dict = dict(row)
                    
                    cols = ", ".join([f'"{c}"' for c in col_names])
                    vals = ", ".join([f":{c}" for c in col_names])
                    
                    stmt = sqlalchemy.text(f"INSERT INTO {table} ({cols}) VALUES ({vals}) ON CONFLICT DO NOTHING;")
                    pg_conn.execute(stmt, row_dict)
                    
                pg_conn.commit()
                print(f"Table '{table}' migrated successfully!")
            except Exception as e:
                print(f"Error migrating {table}: {e}")

    # Reset sequences for primary keys in Postgres
    with pg_engine.connect() as pg_conn:
        for table in tables:
            try:
                pg_conn.execute(sqlalchemy.text(f"SELECT setval(pg_get_serial_sequence('{table}', 'id'), COALESCE((SELECT MAX(id) FROM {table}) + 1, 1), false);"))
            except Exception:
                pass
        pg_conn.commit()

    print("\nAll local data has been successfully migrated to Supabase PostgreSQL!")

if __name__ == "__main__":
    migrate()
