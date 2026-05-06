function BudgetOverview({ dashboard }) {
  return (
    <section className="card">
      <h2>Your 50/30/20 Budget</h2>
      <p>Monthly Income: <strong>${dashboard.monthly_income.toFixed(2)}</strong></p>
      <div className="budget-grid">
        <div className="budget-box needs">
          <h3>Needs (50%)</h3>
          <p>Target: ${dashboard.needs_target.toFixed(2)}</p>
          <p>Spent: ${dashboard.needs_spent.toFixed(2)}</p>
        </div>
        <div className="budget-box wants">
          <h3>Wants (30%)</h3>
          <p>Target: ${dashboard.wants_target.toFixed(2)}</p>
          <p>Spent: ${dashboard.wants_spent.toFixed(2)}</p>
        </div>
        <div className="budget-box savings">
          <h3>Savings (20%)</h3>
          <p>Target: ${dashboard.savings_target.toFixed(2)}</p>
          <p>Spent: ${dashboard.savings_spent.toFixed(2)}</p>
        </div>
      </div>
    </section>
  )
}

export default BudgetOverview
