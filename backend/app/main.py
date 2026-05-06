from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import auth, budget

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Budget Tracker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(budget.router)

@app.get("/")
def read_root():
    return {"message": "Budget Tracker API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
