import React, { useState } from 'react'
import { WorkDay, TimeSlot } from '../types/WorkDay'
import TimeSlotInput from './TimeSlotInput'

interface WorkDayFormProps {
  onSubmit: (workDay: WorkDay) => void
  initialData?: WorkDay
}

const WorkDayForm: React.FC<WorkDayFormProps> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState<WorkDay>({
    date: initialData?.date || new Date().toISOString().split('T')[0],
    departureTime: initialData?.departureTime || '',
    arrivalTime: initialData?.arrivalTime || '',
    workSlots: initialData?.workSlots || [{ start: '', end: '' }],
    returnDepartureTime: initialData?.returnDepartureTime || '',
    returnArrivalTime: initialData?.returnArrivalTime || '',
    lunchReimbursement: initialData?.lunchReimbursement || 0,
    dinnerReimbursement: initialData?.dinnerReimbursement || 0,
    travelContribution: initialData?.travelContribution || 0,
    onCallSlots: initialData?.onCallSlots || [],
    notes: initialData?.notes || ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    if (!initialData) {
      // Reset form only if it's a new entry
      setFormData({
        date: new Date().toISOString().split('T')[0],
        departureTime: '',
        arrivalTime: '',
        workSlots: [{ start: '', end: '' }],
        returnDepartureTime: '',
        returnArrivalTime: '',
        lunchReimbursement: 0,
        dinnerReimbursement: 0,
        travelContribution: 0,
        onCallSlots: [],
        notes: ''
      })
    }
  }

  const updateWorkSlots = (slots: TimeSlot[]) => {
    setFormData(prev => ({ ...prev, workSlots: slots }))
  }

  const updateOnCallSlots = (slots: TimeSlot[]) => {
    setFormData(prev => ({ ...prev, onCallSlots: slots }))
  }

  return (
    <div className="card max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {initialData ? 'Modifica Giornata Lavorativa' : 'Registra Nuova Giornata Lavorativa'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Data */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Data
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            className="input-field"
            required
          />
        </div>

        {/* Orari di Viaggio */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ora Partenza
            </label>
            <input
              type="time"
              value={formData.departureTime}
              onChange={(e) => setFormData(prev => ({ ...prev, departureTime: e.target.value }))}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ora Arrivo
            </label>
            <input
              type="time"
              value={formData.arrivalTime}
              onChange={(e) => setFormData(prev => ({ ...prev, arrivalTime: e.target.value }))}
              className="input-field"
              required
            />
          </div>
        </div>

        {/* Orari di Lavoro */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Orari di Lavoro
          </label>
          <TimeSlotInput
            slots={formData.workSlots}
            onChange={updateWorkSlots}
            minSlots={1}
          />
        </div>

        {/* Orari di Rientro */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ora Partenza Rientro
            </label>
            <input
              type="time"
              value={formData.returnDepartureTime}
              onChange={(e) => setFormData(prev => ({ ...prev, returnDepartureTime: e.target.value }))}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ora Arrivo a Casa
            </label>
            <input
              type="time"
              value={formData.returnArrivalTime}
              onChange={(e) => setFormData(prev => ({ ...prev, returnArrivalTime: e.target.value }))}
              className="input-field"
              required
            />
          </div>
        </div>

        {/* Rimborsi e Contributi */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rimborso Pranzo (€)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.lunchReimbursement}
              onChange={(e) => setFormData(prev => ({ ...prev, lunchReimbursement: parseFloat(e.target.value) || 0 }))}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rimborso Cena (€)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.dinnerReimbursement}
              onChange={(e) => setFormData(prev => ({ ...prev, dinnerReimbursement: parseFloat(e.target.value) || 0 }))}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Contributo Trasferta (€)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.travelContribution}
              onChange={(e) => setFormData(prev => ({ ...prev, travelContribution: parseFloat(e.target.value) || 0 }))}
              className="input-field"
            />
          </div>
        </div>

        {/* Reperibilità */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Interventi Reperibilità
          </label>
          <TimeSlotInput
            slots={formData.onCallSlots}
            onChange={updateOnCallSlots}
            minSlots={0}
            placeholder="Aggiungi intervento reperibilità"
          />
        </div>

        {/* Note */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Note
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            className="input-field"
            rows={3}
            placeholder="Note aggiuntive..."
          />
        </div>

        <div className="flex justify-end">
          <button type="submit" className="btn-primary">
            {initialData ? 'Aggiorna' : 'Salva'} Giornata
          </button>
        </div>
      </form>
    </div>
  )
}

export default WorkDayForm