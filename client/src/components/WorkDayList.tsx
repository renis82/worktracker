import React, { useState } from 'react'
import { WorkDay } from '../types/WorkDay'
import WorkDayForm from './WorkDayForm'
import { calculateWorkHours, calculateTotalHours, formatTime } from '../utils/timeCalculations'

interface WorkDayListProps {
  workDays: WorkDay[]
  onUpdate: (id: string, workDay: WorkDay) => void
  onDelete: (id: string) => void
}

const WorkDayList: React.FC<WorkDayListProps> = ({ workDays, onUpdate, onDelete }) => {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'date' | 'hours'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const sortedWorkDays = [...workDays].sort((a, b) => {
    if (sortBy === 'date') {
      const comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
      return sortOrder === 'asc' ? comparison : -comparison
    } else {
      const hoursA = calculateWorkHours(a.workSlots)
      const hoursB = calculateWorkHours(b.workSlots)
      const comparison = hoursA - hoursB
      return sortOrder === 'asc' ? comparison : -comparison
    }
  })

  const handleEdit = (workDay: WorkDay) => {
    onUpdate(workDay.id!, workDay)
    setEditingId(null)
  }

  if (editingId) {
    const workDay = workDays.find(day => day.id === editingId)
    if (workDay) {
      return (
        <div>
          <div className="mb-4">
            <button
              onClick={() => setEditingId(null)}
              className="btn-secondary"
            >
              ← Torna alla Lista
            </button>
          </div>
          <WorkDayForm
            onSubmit={handleEdit}
            initialData={workDay}
          />
        </div>
      )
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Storico Giornate Lavorative
        </h2>
        <div className="flex items-center space-x-4">
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-')
              setSortBy(field as 'date' | 'hours')
              setSortOrder(order as 'asc' | 'desc')
            }}
            className="input-field"
          >
            <option value="date-desc">Data (più recente)</option>
            <option value="date-asc">Data (più vecchia)</option>
            <option value="hours-desc">Ore lavorate (più)</option>
            <option value="hours-asc">Ore lavorate (meno)</option>
          </select>
        </div>
      </div>

      {sortedWorkDays.length === 0 ? (
        <div className="card text-center">
          <p className="text-gray-500 dark:text-gray-400">
            Nessuna giornata lavorativa registrata ancora.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedWorkDays.map((workDay) => (
            <div key={workDay.id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {new Date(workDay.date).toLocaleDateString('it-IT', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Ore totali: {formatTime(calculateTotalHours(workDay))}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingId(workDay.id!)}
                    className="btn-secondary text-sm"
                  >
                    Modifica
                  </button>
                  <button
                    onClick={() => onDelete(workDay.id!)}
                    className="btn-danger text-sm"
                    onClick={(e) => {
                      if (window.confirm('Sei sicuro di voler eliminare questa giornata?')) {
                        onDelete(workDay.id!)
                      }
                    }}
                  >
                    Elimina
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Viaggio</h4>
                  <p>Partenza: {workDay.departureTime}</p>
                  <p>Arrivo: {workDay.arrivalTime}</p>
                  <p>Rientro: {workDay.returnDepartureTime}</p>
                  <p>Arrivo casa: {workDay.returnArrivalTime}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Lavoro</h4>
                  {workDay.workSlots.map((slot, index) => (
                    <p key={index}>
                      Sessione {index + 1}: {slot.start} - {slot.end}
                    </p>
                  ))}
                  <p className="font-medium">
                    Totale: {formatTime(calculateWorkHours(workDay.workSlots))}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Compensi</h4>
                  {workDay.lunchReimbursement > 0 && (
                    <p>Pranzo: €{workDay.lunchReimbursement.toFixed(2)}</p>
                  )}
                  {workDay.dinnerReimbursement > 0 && (
                    <p>Cena: €{workDay.dinnerReimbursement.toFixed(2)}</p>
                  )}
                  {workDay.travelContribution > 0 && (
                    <p>Trasferta: €{workDay.travelContribution.toFixed(2)}</p>
                  )}
                </div>
              </div>

              {workDay.onCallSlots.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Reperibilità</h4>
                  <div className="text-sm">
                    {workDay.onCallSlots.map((slot, index) => (
                      <p key={index}>
                        Intervento {index + 1}: {slot.start} - {slot.end}
                      </p>
                    ))}
                    <p className="font-medium">
                      Totale: {formatTime(calculateWorkHours(workDay.onCallSlots))}
                    </p>
                  </div>
                </div>
              )}

              {workDay.notes && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Note</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{workDay.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default WorkDayList