import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toISODate } from '../domain/dates'
import { activitySchema, type ActivityFormValues } from '../domain/schema'
import { fieldClassName } from '../styles'
import { CATEGORIES, CATEGORY_COLOR, type Activity, type ActivityInput } from '../types'
import { DateField } from './DateField'
import { SelectField } from './SelectField'

type ActivityFormProps = {
  initial?: Activity | null
  submitLabel: string
  onSubmit: (input: ActivityInput) => void
  onCancel: () => void
}

export function ActivityForm({ initial, submitLabel, onSubmit, onCancel }: ActivityFormProps) {
  const [today] = useState(() => toISODate(new Date()))
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ActivityFormValues>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      name: initial?.name ?? '',
      category: initial?.category ?? 'Work',
      date: initial?.date ?? today,
      durationMinutes: initial ? String(initial.durationMinutes) : '',
      notes: initial?.notes ?? '',
    },
  })

  const submit = (values: ActivityFormValues) => {
    onSubmit({
      name: values.name,
      category: values.category,
      date: values.date,
      durationMinutes: Number(values.durationMinutes),
      notes: values.notes,
    })
  }

  return (
    <form noValidate className="space-y-4" onSubmit={handleSubmit(submit)}>
      <div>
        <label htmlFor="activity-name" className="block text-sm text-muted">
          Activity name
        </label>
        <input
          id="activity-name"
          autoFocus
          autoComplete="off"
          className={fieldClassName}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? 'activity-name-error' : undefined}
          {...register('name')}
        />
        {errors.name ? (
          <p id="activity-name-error" role="alert" className="mt-1.5 text-sm text-danger">
            {errors.name.message}
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="activity-category" className="block text-sm text-muted">
            Category
          </label>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <SelectField
                id="activity-category"
                value={field.value}
                onChange={field.onChange}
                options={CATEGORIES.map((category) => ({
                  value: category,
                  label: category,
                  color: CATEGORY_COLOR[category],
                }))}
              />
            )}
          />
        </div>
        <div>
          <label htmlFor="activity-date" className="block text-sm text-muted">
            Date
          </label>
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <DateField
                id="activity-date"
                value={field.value}
                onChange={field.onChange}
                invalid={Boolean(errors.date)}
                describedBy={errors.date ? 'activity-date-error' : undefined}
              />
            )}
          />
          {errors.date ? (
            <p id="activity-date-error" role="alert" className="mt-1.5 text-sm text-danger">
              {errors.date.message}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor="activity-duration" className="block text-sm text-muted">
          Duration (minutes)
        </label>
        <input
          id="activity-duration"
          type="number"
          inputMode="numeric"
          min={1}
          max={1440}
          step={1}
          placeholder="90"
          className={fieldClassName}
          aria-invalid={errors.durationMinutes ? true : undefined}
          aria-describedby={errors.durationMinutes ? 'activity-duration-error' : undefined}
          {...register('durationMinutes')}
        />
        {errors.durationMinutes ? (
          <p id="activity-duration-error" role="alert" className="mt-1.5 text-sm text-danger">
            {errors.durationMinutes.message}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="activity-notes" className="block text-sm text-muted">
          Notes (optional)
        </label>
        <textarea
          id="activity-notes"
          rows={3}
          className={fieldClassName}
          aria-invalid={errors.notes ? true : undefined}
          aria-describedby={errors.notes ? 'activity-notes-error' : undefined}
          {...register('notes')}
        />
        {errors.notes ? (
          <p id="activity-notes-error" role="alert" className="mt-1.5 text-sm text-danger">
            {errors.notes.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-white/10 px-4 py-2 text-sm text-ink transition-colors hover:bg-white/5"
        >
          Cancel
        </button>
        <button type="submit" className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-bg">
          {submitLabel}
        </button>
      </div>
    </form>
  )
}
