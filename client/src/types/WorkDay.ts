export interface TimeSlot {
  start: string
  end: string
}

export interface WorkDay {
  id?: string
  date: string
  departureTime: string
  arrivalTime: string
  workSlots: TimeSlot[]
  returnDepartureTime: string
  returnArrivalTime: string
  lunchReimbursement: number
  dinnerReimbursement: number
  travelContribution: number
  onCallSlots: TimeSlot[]
  notes?: string
}