import { useCallback, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ActivityForm } from './components/ActivityForm'
import { Header } from './components/Header'
import { Modal } from './components/Modal'
import { ActivitiesPage } from './pages/ActivitiesPage'
import { DashboardPage } from './pages/DashboardPage'
import { useActivityStore } from './store/useActivityStore'
import type { Activity, ActivityInput } from './types'

export default function App() {
  const addActivity = useActivityStore((state) => state.addActivity)
  const updateActivity = useActivityStore((state) => state.updateActivity)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Activity | null>(null)

  const closeForm = useCallback(() => {
    setFormOpen(false)
  }, [])

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (activity: Activity) => {
    setEditing(activity)
    setFormOpen(true)
  }

  const saveActivity = (input: ActivityInput) => {
    if (editing) updateActivity(editing.id, input)
    else addActivity(input)
    closeForm()
  }

  return (
    <div className="min-h-screen bg-bg text-ink">
      <div inert={formOpen}>
        <Header onAdd={openCreate} />
        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <Routes>
            <Route path="/" element={<DashboardPage onEdit={openEdit} />} />
            <Route path="/activities" element={<ActivitiesPage onEdit={openEdit} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
      {formOpen ? (
        <Modal title={editing ? 'Edit activity' : 'Add activity'} onClose={closeForm}>
          <ActivityForm
            key={editing?.id ?? 'new'}
            initial={editing}
            submitLabel={editing ? 'Save changes' : 'Save activity'}
            onSubmit={saveActivity}
            onCancel={closeForm}
          />
        </Modal>
      ) : null}
    </div>
  )
}
