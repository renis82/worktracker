import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import WorkDayForm from './components/WorkDayForm'
import WorkDayList from './components/WorkDayList'
import Statistics from './components/Statistics'
import { WorkDay } from './types/WorkDay'

function App() {
  const [workDays, setWorkDays] = useState<WorkDay[]>([])
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const savedWorkDays = localStorage.getItem('worktracker-data')
    if (savedWorkDays) {
      setWorkDays(JSON.parse(savedWorkDays))
    }

    const savedDarkMode = localStorage.getItem('worktracker-darkmode')
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('worktracker-data', JSON.stringify(workDays))
  }, [workDays])

  useEffect(() => {
    localStorage.setItem('worktracker-darkmode', JSON.stringify(darkMode))
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const addWorkDay = (workDay: WorkDay) => {
    setWorkDays(prev => [...prev, { ...workDay, id: Date.now().toString() }])
  }

  const updateWorkDay = (id: string, updatedWorkDay: WorkDay) => {
    setWorkDays(prev => prev.map(day => day.id === id ? updatedWorkDay : day))
  }

  const deleteWorkDay = (id: string) => {
    setWorkDays(prev => prev.filter(day => day.id !== id))
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-8">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  WorkTracker
                </h1>
                <div className="flex space-x-4">
                  <Link 
                    to="/" 
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Nuovo Giorno
                  </Link>
                  <Link 
                    to="/list" 
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Storico
                  </Link>
                  <Link 
                    to="/stats" 
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Statistiche
                  </Link>
                </div>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route 
              path="/" 
              element={<WorkDayForm onSubmit={addWorkDay} />} 
            />
            <Route 
              path="/list" 
              element={
                <WorkDayList 
                  workDays={workDays} 
                  onUpdate={updateWorkDay}
                  onDelete={deleteWorkDay}
                />
              } 
            />
            <Route 
              path="/stats" 
              element={<Statistics workDays={workDays} />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App