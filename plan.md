# Budget Tracker App — 50/30/20 Rule
## Overview
A full-stack web application that helps users manage their money using the 50/30/20 budgeting rule. Users sign up, enter their monthly post-tax income, and the app calculates recommended allocations:
- **Needs**: 50% of income
- **Wants**: 30% of income
- **Savings**: 20% of income

Users can track spending against each category and see if they're on target.
## Tech Stack
- **Frontend**: React (JavaScript, functional components + hooks)
- **Backend**: Python with FastAPI
- **Database**: SQLite (persistent file-based storage)
- **Auth**: JWT tokens with bcrypt password hashing
- **Containerization**: Custom Dockerfile (multi-stage build)

## Requirements Checklist
- [ ] Real backend API (FastAPI)
- [ ] Persistent storage (SQLite database)
- [ ] Not a static site
- [ ] Custom Dockerfile to build and run the app
- [ ] App runs locally via Docker

## Features
1. **Authentication**: Sign up / Log in
2. **Budget Setup**: Enter monthly post-tax income
3. **50/30/20 Dashboard**: See target amounts for Needs, Wants, Savings
4. **Spending Tracking**: Add transactions categorized by type
5. **Progress Visualization**: Visual bars showing spent vs. target
6. **Transaction History**: View and delete past transactions

## Project Structure
bootcamp/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI entry point
│   │   ├── routers/
│   │   │   ├── auth.py          # Login/register endpoints
│   │   │   └── budget.py        # Budget & transactions endpoints
│   │   ├── models.py            # SQLAlchemy database tables
│   │   ├── schemas.py           # Pydantic request/response shapes
│   │   └── database.py          # SQLite connection setup
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.js               # Router + auth context
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   └── Dashboard.js     # Budget view + spending tracker
│   │   └── components/
│   │       ├── BudgetOverview.js
│   │       ├── AddTransaction.js
│   │       └── SpendingProgress.js
│   ├── package.json
│   └── Dockerfile
└── docker-compose.yml           # Orchestrates backend + frontend

## Database Schema
- `users` (id, username, password_hash, created_at)
- `budgets` (id, user_id, monthly_income, created_at)
- `transactions` (id, budget_id, category, amount, description, date, created_at)

## API Endpoints (Planned)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/register | Create new user |
| POST | /auth/login | Login, receive JWT |
| GET | /budget | Get current user's budget |
| POST | /budget | Create/update budget |
| GET | /budget/transactions | List transactions |
| POST | /budget/transactions | Add new transaction |
| DELETE | /budget/transactions/{id} | Delete transaction |

## Next Steps
1. Set up backend scaffolding (FastAPI + SQLite)
2. Implement auth system
3. Build budget & transaction APIs
4. Create React frontend
5. Connect frontend to backend
6. Write custom Dockerfile
7. Test locally with Docker
