import React from 'react'
import { TimeSlot } from '../types/WorkDay'

interface TimeSlotInputProps {
  slots: TimeSlot[]
  onChange: (slots: TimeSlot[]) => void
  minSlots?: number
  placeholder?: string
}

const TimeSlotInput: React.FC<TimeSlotInputProps> = ({ 
  slots, 
  onChange, 
  minSlots = 0,
  placeholder = "Aggiungi fascia oraria"
}) => {
  const addSlot = () => {
    onChange([...slots, { start: '', end: '' }])
  }

  const removeSlot = (index: number) => {
    if (slots.length > minSlots) {
      onChange(slots.filter((_, i) => i !== index))
    }
  }

  const updateSlot = (index: number, field: 'start' | 'end', value: string) => {
    const updatedSlots = slots.map((slot, i) => 
      i === index ? { ...slot, [field]: value } : slot
    )
    onChange(updatedSlots)
  }

  return (
    <div className="space-y-3">
      {slots.map((slot, index) => (
        <div key={index} className="flex items-center space-x-3">
          <div className="flex-1">
            <input
              type="time"
              value={slot.start}
              onChange={(e) => updateSlot(index, 'start', e.target.value)}
              className="input-field"
              placeholder="Inizio"
              required={minSlots > 0 || slot.end !== ''}
            />
          </div>
          <span className="text-gray-500 dark:text-gray-400">-</span>
          <div className="flex-1">
            <input
              type="time"
              value={slot.end}
              onChange={(e) => updateSlot(index, 'end', e.target.value)}
              className="input-field"
              placeholder="Fine"
              required={minSlots > 0 || slot.start !== ''}
            />
          </div>
          {slots.length > minSlots && (
            <button
              type="button"
              onClick={() => removeSlot(index)}
              className="btn-danger text-sm px-3 py-1"
            >
              Rimuovi
            </button>
          )}
        </div>
      ))}
      
      <button
        type="button"
        onClick={addSlot}
        className="btn-secondary text-sm"
      >
        + {placeholder}
      </button>
    </div>
  )
}

export default TimeSlotInput