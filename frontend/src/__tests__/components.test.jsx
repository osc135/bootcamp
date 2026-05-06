import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import BudgetOverview from '../components/BudgetOverview'
import SpendingProgress from '../components/SpendingProgress'

describe('BudgetOverview', () => {
  const dashboard = {
    monthly_income: 4000,
    needs_target: 2000,
    needs_spent: 1500,
    wants_target: 1200,
    wants_spent: 800,
    savings_target: 800,
    savings_spent: 200,
  }

  it('renders income and budget targets', () => {
    render(<BudgetOverview dashboard={dashboard} />)
    expect(screen.getByText(/Monthly Income/i)).toBeInTheDocument()
    expect(screen.getByText(/\$4000\.00/)).toBeInTheDocument()
    expect(screen.getByText(/Needs/i)).toBeInTheDocument()
    expect(screen.getByText(/Wants/i)).toBeInTheDocument()
    expect(screen.getByText(/Savings/i)).toBeInTheDocument()
  })
})

describe('SpendingProgress', () => {
  const dashboard = {
    needs_target: 2000,
    needs_spent: 1500,
    wants_target: 1200,
    wants_spent: 1400,
    savings_target: 800,
    savings_spent: 200,
  }

  it('renders progress bars', () => {
    render(<SpendingProgress dashboard={dashboard} />)
    expect(screen.getByText(/Needs/)).toBeInTheDocument()
    expect(screen.getByText(/Wants/)).toBeInTheDocument()
    expect(screen.getByText(/Savings/)).toBeInTheDocument()
  })

  it('shows over-budget styling for wants', () => {
    render(<SpendingProgress dashboard={dashboard} />)
    const wantsText = screen.getByText(/\$1400\.00/)
    expect(wantsText).toHaveClass('over-budget')
  })
})
