import { TimeSlot } from '../types/WorkDay'

export const calculateWorkHours = (slots: TimeSlot[]): number => {
  return slots.reduce((total, slot) => {
    if (!slot.start || !slot.end) return total
    
    const start = new Date(`2000-01-01T${slot.start}:00`)
    const end = new Date(`2000-01-01T${slot.end}:00`)
    
    // Handle overnight shifts
    if (end < start) {
      end.setDate(end.getDate() + 1)
    }
    
    const diffMs = end.getTime() - start.getTime()
    const diffHours = diffMs / (1000 * 60 * 60)
    
    return total + diffHours
  }, 0)
}

export const calculateTotalHours = (workDay: any): number => {
  const workHours = calculateWorkHours(workDay.workSlots)
  const onCallHours = calculateWorkHours(workDay.onCallSlots)
  return workHours + onCallHours
}

export const formatTime = (hours: number): string => {
  const wholeHours = Math.floor(hours)
  const minutes = Math.round((hours - wholeHours) * 60)
  
  if (minutes === 0) {
    return `${wholeHours}h`
  }
  
  return `${wholeHours}h ${minutes}m`
}

export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

export const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
}