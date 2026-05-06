function SpendingProgress({ dashboard }) {
  const categories = [
    { key: 'needs', label: 'Needs', target: dashboard.needs_target, spent: dashboard.needs_spent, color: '#4a90d9' },
    { key: 'wants', label: 'Wants', target: dashboard.wants_target, spent: dashboard.wants_spent, color: '#f5a623' },
    { key: 'savings', label: 'Savings', target: dashboard.savings_target, spent: dashboard.savings_spent, color: '#7ed321' },
  ]

  return (
    <section className="card">
      <h3>Spending Progress</h3>
      <div className="progress-list">
        {categories.map((cat) => {
          const pct = cat.target > 0 ? Math.min((cat.spent / cat.target) * 100, 100) : 0
          const over = cat.spent > cat.target
          return (
            <div key={cat.key} className="progress-item">
              <div className="progress-header">
                <span>{cat.label}</span>
                <span className={over ? 'over-budget' : ''}>
                  ${cat.spent.toFixed(2)} / ${cat.target.toFixed(2)}
                </span>
              </div>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${pct}%`, backgroundColor: over ? '#d0021b' : cat.color }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default SpendingProgress
