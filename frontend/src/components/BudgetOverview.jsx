function BudgetOverview({ dashboard }) {
  return (
    <section className="card">
      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Monthly Income
        </p>
        <p className="income-display">${dashboard.monthly_income.toFixed(2)}</p>
      </div>
      <div className="budget-grid">
        <div className="budget-box needs">
          <h3>Needs</h3>
          <p>Target</p>
          <p><strong>${dashboard.needs_target.toFixed(2)}</strong></p>
          <p style={{ marginTop: '0.5rem' }}>Spent: ${dashboard.needs_spent.toFixed(2)}</p>
        </div>
        <div className="budget-box wants">
          <h3>Wants</h3>
          <p>Target</p>
          <p><strong>${dashboard.wants_target.toFixed(2)}</strong></p>
          <p style={{ marginTop: '0.5rem' }}>Spent: ${dashboard.wants_spent.toFixed(2)}</p>
        </div>
        <div className="budget-box savings">
          <h3>Savings</h3>
          <p>Target</p>
          <p><strong>${dashboard.savings_target.toFixed(2)}</strong></p>
          <p style={{ marginTop: '0.5rem' }}>Spent: ${dashboard.savings_spent.toFixed(2)}</p>
        </div>
      </div>
    </section>
  )
}

export default BudgetOverview
