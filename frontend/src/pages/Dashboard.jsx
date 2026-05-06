import { useEffect, useState } from 'react'
import { useAuth } from '../App'
import BudgetOverview from '../components/BudgetOverview'
import AddTransaction from '../components/AddTransaction'
import SpendingProgress from '../components/SpendingProgress'

const API_URL = import.meta.env.VITE_API_URL || ''

function Dashboard() {
  const { token, logout } = useAuth()
  const [dashboard, setDashboard] = useState(null)
  const [income, setIncome] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchDashboard = async () => {
    try {
      const res = await fetch(`${API_URL}/budget/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setDashboard(data)
      } else if (res.status === 404) {
        setDashboard(null)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [token])

  const handleSetBudget = async (e) => {
    e.preventDefault()
    const val = parseFloat(income)
    if (!val || val <= 0) return
    await fetch(`${API_URL}/budget`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ monthly_income: val }),
    })
    setIncome('')
    fetchDashboard()
  }

  if (loading) return (
    <div className="container">
      <div className="empty-state">
        <p>Loading your budget...</p>
      </div>
    </div>
  )

  return (
    <div className="container">
      <header className="app-header">
        <h1>Budget Tracker</h1>
        <button onClick={logout} className="btn-secondary">Logout</button>
      </header>

      {!dashboard && (
        <section className="card">
          <div className="auth-header" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
            <h2 style={{ margin: 0 }}>Set Up Your Budget</h2>
            <p style={{ margin: '0.25rem 0 0 0' }}>Enter your monthly post-tax income to get started</p>
          </div>
          <form onSubmit={handleSetBudget} className="transaction-form" style={{ maxWidth: '400px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <input
                type="number"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                placeholder="e.g. 5000"
                required
              />
            </div>
            <button type="submit" className="btn-primary">Create Budget</button>
          </form>
        </section>
      )}

      {dashboard && (
        <>
          <BudgetOverview dashboard={dashboard} />
          <SpendingProgress dashboard={dashboard} />
          <AddTransaction onAdded={fetchDashboard} />

          <section className="card">
            <h3>Transaction History</h3>
            {dashboard.transactions.length === 0 ? (
              <div className="empty-state">
                <p>No transactions yet. Add your first one above!</p>
              </div>
            ) : (
              <ul className="transaction-list">
                {dashboard.transactions.map((tx) => (
                  <li key={tx.id}>
                    <div className="transaction-info">
                      <span className={`badge ${tx.category}`}>{tx.category}</span>
                      <span className="transaction-desc">{tx.description || 'No description'}</span>
                    </div>
                    <span className="transaction-amount">${tx.amount.toFixed(2)}</span>
                    <button
                      className="btn-danger"
                      onClick={async () => {
                        await fetch(`${API_URL}/budget/transactions/${tx.id}`, {
                          method: 'DELETE',
                          headers: { Authorization: `Bearer ${token}` },
                        })
                        fetchDashboard()
                      }}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  )
}

export default Dashboard
