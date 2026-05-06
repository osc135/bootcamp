import { useEffect, useState } from 'react'
import { useAuth } from '../App'
import BudgetOverview from '../components/BudgetOverview'
import AddTransaction from '../components/AddTransaction'
import SpendingProgress from '../components/SpendingProgress'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function Dashboard() {
  const { token, logout } = useAuth()
  const [dashboard, setDashboard] = useState(null)
  const [budget, setBudget] = useState(null)
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

  const fetchBudget = async () => {
    try {
      const res = await fetch(`${API_URL}/budget`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setBudget(data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchDashboard()
    fetchBudget()
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
    fetchBudget()
  }

  if (loading) return <div className="container">Loading...</div>

  return (
    <div className="container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Budget Tracker</h1>
        <button onClick={logout}>Logout</button>
      </header>

      {!dashboard && (
        <section className="card">
          <h2>Set Up Your Budget</h2>
          <form onSubmit={handleSetBudget}>
            <label>Monthly Post-Tax Income ($)</label>
            <input
              type="number"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              placeholder="e.g. 5000"
              required
            />
            <button type="submit">Create Budget</button>
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
              <p>No transactions yet.</p>
            ) : (
              <ul className="transaction-list">
                {dashboard.transactions.map((tx) => (
                  <li key={tx.id}>
                    <span className={`badge ${tx.category}`}>{tx.category}</span>
                    <span>${tx.amount.toFixed(2)}</span>
                    <span>{tx.description || '-'}</span>
                    <button
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
