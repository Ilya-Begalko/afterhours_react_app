import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'
import { createSeedActivities } from './domain/seed'
import { useActivityStore } from './store/useActivityStore'
import type { Activity } from './types'

const fixtures: Activity[] = [
  { id: 'work', name: 'Deep work', category: 'Work', date: '2026-10-17', durationMinutes: 90, notes: 'Focus block' },
  { id: 'run', name: 'Evening run', category: 'Sport', date: '2026-10-16', durationMinutes: 40 },
]

function renderApp(path = '/activities') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

describe('AfterHours', () => {
  beforeEach(() => {
    localStorage.clear()
    useActivityStore.setState({ activities: [] })
  })

  it('validates the activity form', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(screen.getByRole('button', { name: 'Add activity' }))
    await user.click(screen.getByRole('button', { name: 'Save activity' }))

    expect(screen.getByText('Enter an activity name')).toBeInTheDocument()
    expect(screen.getByText('Enter duration in minutes')).toBeInTheDocument()
  })

  it('adds an activity and keeps it after the dialog closes', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(screen.getByRole('button', { name: 'Add activity' }))
    await user.type(screen.getByLabelText('Activity name'), 'Morning pages')
    await user.type(screen.getByLabelText('Duration (minutes)'), '35')
    await user.click(screen.getByRole('button', { name: 'Save activity' }))

    expect(screen.getByRole('heading', { name: 'Morning pages' })).toBeInTheDocument()
    expect(screen.getByText('35m')).toBeInTheDocument()
    expect(localStorage.getItem('afterhours-activities')).toContain('Morning pages')
  })

  it('edits and deletes an activity', async () => {
    const user = userEvent.setup()
    useActivityStore.setState({ activities: fixtures })
    renderApp()

    await user.click(screen.getByRole('button', { name: 'Edit Deep work' }))
    const name = screen.getByLabelText('Activity name')
    await user.clear(name)
    await user.type(name, 'Shallow work')
    await user.click(screen.getByRole('button', { name: 'Save changes' }))

    expect(screen.getByRole('heading', { name: 'Shallow work' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Delete Evening run' }))
    expect(screen.queryByRole('heading', { name: 'Evening run' })).not.toBeInTheDocument()
    expect(useActivityStore.getState().activities.map((activity) => activity.name)).toEqual(['Shallow work'])
  })

  it('filters the journal by name, category, and date', async () => {
    const user = userEvent.setup()
    useActivityStore.setState({ activities: fixtures })
    renderApp()

    await user.type(screen.getByLabelText('Search'), 'run')
    expect(screen.getByRole('heading', { name: 'Evening run' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Deep work' })).not.toBeInTheDocument()

    await user.clear(screen.getByLabelText('Search'))
    await user.click(screen.getByLabelText('Filter by category'))
    await user.click(screen.getByRole('option', { name: 'Sport' }))
    expect(screen.getByRole('heading', { name: 'Evening run' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Deep work' })).not.toBeInTheDocument()

    await user.click(screen.getByLabelText('Filter by category'))
    await user.click(screen.getByRole('option', { name: 'All' }))
    await user.click(screen.getByLabelText('Filter by date'))
    await user.click(screen.getByRole('button', { name: /October 17/ }))
    expect(screen.getByRole('heading', { name: 'Deep work' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Evening run' })).not.toBeInTheDocument()
  })

  it('sorts activities by date', async () => {
    const user = userEvent.setup()
    useActivityStore.setState({ activities: fixtures })
    renderApp()

    expect(screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent)).toEqual([
      'Deep work',
      'Evening run',
    ])

    await user.click(screen.getByLabelText('Sort by date'))
    await user.click(screen.getByRole('option', { name: 'Oldest' }))
    expect(screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent)).toEqual([
      'Evening run',
      'Deep work',
    ])
  })

  it('shows dashboard statistics calculated from saved activities', () => {
    useActivityStore.setState({ activities: createSeedActivities(new Date()) })
    renderApp('/')

    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
    expect(screen.getByText('23h 20m')).toBeInTheDocument()
    expect(screen.getByText('3h 20m')).toBeInTheDocument()
    expect(screen.getByText('+8% vs last week')).toBeInTheDocument()
    expect(screen.getByText('15h')).toBeInTheDocument()
  })
})
