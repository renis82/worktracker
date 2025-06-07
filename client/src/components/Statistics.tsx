import React, { useMemo } from 'react'
import { WorkDay } from '../types/WorkDay'
import { calculateWorkHours, calculateTotalHours, formatTime } from '../utils/timeCalculations'

interface StatisticsProps {
  workDays: WorkDay[]
}

const Statistics: React.FC<StatisticsProps> = ({ workDays }) => {
  const stats = useMemo(() => {
    if (workDays.length === 0) {
      return {
        totalDays: 0,
        totalWorkHours: 0,
        totalOnCallHours: 0,
        totalReimbursements: 0,
        averageWorkHours: 0,
        monthlyStats: []
      }
    }

    const totalWorkHours = workDays.reduce((sum, day) => sum + calculateWorkHours(day.workSlots), 0)
    const totalOnCallHours = workDays.reduce((sum, day) => sum + calculateWorkHours(day.onCallSlots), 0)
    const totalReimbursements = workDays.reduce((sum, day) => 
      sum + day.lunchReimbursement + day.dinnerReimbursement + day.travelContribution, 0
    )

    // Statistiche mensili
    const monthlyData = workDays.reduce((acc, day) => {
      const monthKey = day.date.substring(0, 7) // YYYY-MM
      if (!acc[monthKey]) {
        acc[monthKey] = {
          month: monthKey,
          days: 0,
          workHours: 0,
          onCallHours: 0,
          reimbursements: 0
        }
      }
      
      acc[monthKey].days++
      acc[monthKey].workHours += calculateWorkHours(day.workSlots)
      acc[monthKey].onCallHours += calculateWorkHours(day.onCallSlots)
      acc[monthKey].reimbursements += day.lunchReimbursement + day.dinnerReimbursement + day.travelContribution
      
      return acc
    }, {} as Record<string, any>)

    const monthlyStats = Object.values(monthlyData).sort((a: any, b: any) => b.month.localeCompare(a.month))

    return {
      totalDays: workDays.length,
      totalWorkHours,
      totalOnCallHours,
      totalReimbursements,
      averageWorkHours: totalWorkHours / workDays.length,
      monthlyStats
    }
  }, [workDays])

  if (workDays.length === 0) {
    return (
      <div className="card text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Statistiche</h2>
        <p className="text-gray-500 dark:text-gray-400">
          Nessun dato disponibile. Inizia registrando le tue giornate lavorative.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Statistiche</h2>
      
      {/* Statistiche Generali */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Giorni Totali
          </h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {stats.totalDays}
          </p>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Ore Lavorate
          </h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            {formatTime(stats.totalWorkHours)}
          </p>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Ore Reperibilità
          </h3>
          <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
            {formatTime(stats.totalOnCallHours)}
          </p>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Rimborsi Totali
          </h3>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            €{stats.totalReimbursements.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Media Giornaliera */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Medie Giornaliere
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Ore Lavoro</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {formatTime(stats.averageWorkHours)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Ore Reperibilità</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {formatTime(stats.totalOnCallHours / stats.totalDays)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Rimborsi</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              €{(stats.totalReimbursements / stats.totalDays).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Statistiche Mensili */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Statistiche Mensili
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Mese
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Giorni
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ore Lavoro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ore Reperibilità
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Rimborsi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {stats.monthlyStats.map((month: any) => (
                <tr key={month.month}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {new Date(month.month + '-01').toLocaleDateString('it-IT', { 
                      year: 'numeric', 
                      month: 'long' 
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {month.days}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatTime(month.workHours)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatTime(month.onCallHours)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    €{month.reimbursements.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Statistics