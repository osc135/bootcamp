import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base, get_db
from app.main import app

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


@pytest.fixture(scope="function", autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


def test_register():
    response = client.post("/auth/register", json={"username": "testuser", "password": "testpass"})
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "testuser"


def test_register_duplicate():
    client.post("/auth/register", json={"username": "testuser", "password": "testpass"})
    response = client.post("/auth/register", json={"username": "testuser", "password": "testpass"})
    assert response.status_code == 400


def test_login():
    client.post("/auth/register", json={"username": "testuser", "password": "testpass"})
    response = client.post("/auth/login", data={"username": "testuser", "password": "testpass"})
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data


def test_login_invalid():
    response = client.post("/auth/login", data={"username": "nouser", "password": "wrong"})
    assert response.status_code == 401


def test_create_budget():
    client.post("/auth/register", json={"username": "testuser", "password": "testpass"})
    login = client.post("/auth/login", data={"username": "testuser", "password": "testpass"})
    token = login.json()["access_token"]
    response = client.post("/budget", json={"monthly_income": 5000}, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.json()
    assert data["monthly_income"] == 5000


def test_get_budget():
    client.post("/auth/register", json={"username": "testuser", "password": "testpass"})
    login = client.post("/auth/login", data={"username": "testuser", "password": "testpass"})
    token = login.json()["access_token"]
    client.post("/budget", json={"monthly_income": 5000}, headers={"Authorization": f"Bearer {token}"})
    response = client.get("/budget", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json()["monthly_income"] == 5000


def test_add_transaction():
    client.post("/auth/register", json={"username": "testuser", "password": "testpass"})
    login = client.post("/auth/login", data={"username": "testuser", "password": "testpass"})
    token = login.json()["access_token"]
    client.post("/budget", json={"monthly_income": 5000}, headers={"Authorization": f"Bearer {token}"})
    response = client.post("/budget/transactions", json={"category": "needs", "amount": 200, "description": "Groceries"}, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.json()
    assert data["category"] == "needs"
    assert data["amount"] == 200


def test_get_transactions():
    client.post("/auth/register", json={"username": "testuser", "password": "testpass"})
    login = client.post("/auth/login", data={"username": "testuser", "password": "testpass"})
    token = login.json()["access_token"]
    client.post("/budget", json={"monthly_income": 5000}, headers={"Authorization": f"Bearer {token}"})
    client.post("/budget/transactions", json={"category": "needs", "amount": 200}, headers={"Authorization": f"Bearer {token}"})
    response = client.get("/budget/transactions", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_delete_transaction():
    client.post("/auth/register", json={"username": "testuser", "password": "testpass"})
    login = client.post("/auth/login", data={"username": "testuser", "password": "testpass"})
    token = login.json()["access_token"]
    client.post("/budget", json={"monthly_income": 5000}, headers={"Authorization": f"Bearer {token}"})
    tx = client.post("/budget/transactions", json={"category": "needs", "amount": 200}, headers={"Authorization": f"Bearer {token}"})
    tx_id = tx.json()["id"]
    response = client.delete(f"/budget/transactions/{tx_id}", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    response = client.get("/budget/transactions", headers={"Authorization": f"Bearer {token}"})
    assert len(response.json()) == 0


def test_dashboard():
    client.post("/auth/register", json={"username": "testuser", "password": "testpass"})
    login = client.post("/auth/login", data={"username": "testuser", "password": "testpass"})
    token = login.json()["access_token"]
    client.post("/budget", json={"monthly_income": 5000}, headers={"Authorization": f"Bearer {token}"})
    client.post("/budget/transactions", json={"category": "needs", "amount": 2000}, headers={"Authorization": f"Bearer {token}"})
    client.post("/budget/transactions", json={"category": "wants", "amount": 1000}, headers={"Authorization": f"Bearer {token}"})
    response = client.get("/budget/dashboard", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.json()
    assert data["monthly_income"] == 5000
    assert data["needs_target"] == 2500
    assert data["needs_spent"] == 2000
    assert data["wants_spent"] == 1000
    assert len(data["transactions"]) == 2
