from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class UserCreate(BaseModel):
    username: str
    password: str


class UserOut(BaseModel):
    id: int
    username: str
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class BudgetCreate(BaseModel):
    monthly_income: float


class BudgetOut(BaseModel):
    id: int
    user_id: int
    monthly_income: float
    created_at: datetime

    class Config:
        from_attributes = True


class TransactionCreate(BaseModel):
    category: str
    amount: float
    description: Optional[str] = None


class TransactionOut(BaseModel):
    id: int
    budget_id: int
    category: str
    amount: float
    description: Optional[str]
    date: datetime
    created_at: datetime

    class Config:
        from_attributes = True


class DashboardData(BaseModel):
    monthly_income: float
    needs_target: float
    wants_target: float
    savings_target: float
    needs_spent: float
    wants_spent: float
    savings_spent: float
    transactions: list[TransactionOut]
