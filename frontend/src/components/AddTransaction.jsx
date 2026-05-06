import { useState } from 'react'
import { useAuth } from '../App'

const API_URL = import.meta.env.VITE_API_URL || ''

function AddTransaction({ onAdded }) {
  const { token } = useAuth()
  const [category, setCategory] = useState('needs')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const val = parseFloat(amount)
    if (!val || val <= 0) return
    await fetch(`${API_URL}/budget/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ category, amount: val, description }),
    })
    setAmount('')
    setDescription('')
    onAdded()
  }

  return (
    <section className="card">
      <h3>Add Transaction</h3>
      <form onSubmit={handleSubmit} className="transaction-form">
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="needs">Needs</option>
            <option value="wants">Wants</option>
            <option value="savings">Savings</option>
          </select>
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Amount ($)</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required placeholder="0.00" />
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Description</label>
          <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What was this for?" />
        </div>
        <button type="submit" className="btn-primary">Add</button>
      </form>
    </section>
  )
}

export default AddTransaction
