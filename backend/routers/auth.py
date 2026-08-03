from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
import auth_utils

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=schemas.TokenResponse)
def register(user_data: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if email is already registered
    existing_user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email is already registered")

    # Create new user
    hashed_pwd = auth_utils.hash_password(user_data.password)
    new_user = models.User(
        full_name=user_data.full_name,
        email=user_data.email,
        hashed_password=hashed_pwd,
        target_role=user_data.target_role or "Software Engineer"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Generate JWT token
    access_token = auth_utils.create_access_token({"sub": new_user.id})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": new_user
    }

@router.post("/login", response_model=schemas.TokenResponse)
def login(login_data: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == login_data.email).first()
    if not user or not auth_utils.verify_password(login_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = auth_utils.create_access_token({"sub": user.id})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=schemas.UserResponse)
def get_me(current_user: models.User = Depends(auth_utils.get_current_user)):
    return current_user
