from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    budget = relationship("Budget", back_populates="user", uselist=False)


class Budget(Base):
    __tablename__ = "budgets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    monthly_income = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="budget")
    transactions = relationship("Transaction", back_populates="budget", cascade="all, delete-orphan")


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    budget_id = Column(Integer, ForeignKey("budgets.id"), nullable=False)
    category = Column(String, nullable=False)  # needs, wants, savings
    amount = Column(Float, nullable=False)
    description = Column(String)
    date = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

    budget = relationship("Budget", back_populates="transactions")
