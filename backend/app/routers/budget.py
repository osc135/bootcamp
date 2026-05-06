from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Budget, Transaction
from app.schemas import BudgetCreate, BudgetOut, TransactionCreate, TransactionOut, DashboardData
from app.routers.auth import get_current_user
from app.models import User

router = APIRouter(prefix="/budget", tags=["budget"])


@router.get("", response_model=BudgetOut)
def get_budget(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    budget = db.query(Budget).filter(Budget.user_id == current_user.id).first()
    if not budget:
        raise HTTPException(status_code=404, detail="Budget not found")
    return budget


@router.post("", response_model=BudgetOut)
def create_or_update_budget(budget: BudgetCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    existing = db.query(Budget).filter(Budget.user_id == current_user.id).first()
    if existing:
        existing.monthly_income = budget.monthly_income
        db.commit()
        db.refresh(existing)
        return existing
    new_budget = Budget(user_id=current_user.id, monthly_income=budget.monthly_income)
    db.add(new_budget)
    db.commit()
    db.refresh(new_budget)
    return new_budget


@router.get("/transactions", response_model=list[TransactionOut])
def get_transactions(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    budget = db.query(Budget).filter(Budget.user_id == current_user.id).first()
    if not budget:
        return []
    transactions = db.query(Transaction).filter(Transaction.budget_id == budget.id).all()
    return transactions


@router.post("/transactions", response_model=TransactionOut)
def add_transaction(transaction: TransactionCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    budget = db.query(Budget).filter(Budget.user_id == current_user.id).first()
    if not budget:
        raise HTTPException(status_code=404, detail="Budget not found. Please set up your budget first.")
    new_transaction = Transaction(
        budget_id=budget.id,
        category=transaction.category,
        amount=transaction.amount,
        description=transaction.description
    )
    db.add(new_transaction)
    db.commit()
    db.refresh(new_transaction)
    return new_transaction


@router.delete("/transactions/{transaction_id}")
def delete_transaction(transaction_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    budget = db.query(Budget).filter(Budget.user_id == current_user.id).first()
    if not budget:
        raise HTTPException(status_code=404, detail="Budget not found")
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id, Transaction.budget_id == budget.id).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    db.delete(transaction)
    db.commit()
    return {"message": "Transaction deleted"}


@router.get("/dashboard", response_model=DashboardData)
def get_dashboard(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    budget = db.query(Budget).filter(Budget.user_id == current_user.id).first()
    if not budget:
        raise HTTPException(status_code=404, detail="Budget not found")
    
    transactions = db.query(Transaction).filter(Transaction.budget_id == budget.id).all()
    
    needs_spent = sum(t.amount for t in transactions if t.category == "needs")
    wants_spent = sum(t.amount for t in transactions if t.category == "wants")
    savings_spent = sum(t.amount for t in transactions if t.category == "savings")
    
    return DashboardData(
        monthly_income=budget.monthly_income,
        needs_target=budget.monthly_income * 0.5,
        wants_target=budget.monthly_income * 0.3,
        savings_target=budget.monthly_income * 0.2,
        needs_spent=needs_spent,
        wants_spent=wants_spent,
        savings_spent=savings_spent,
        transactions=transactions
    )
