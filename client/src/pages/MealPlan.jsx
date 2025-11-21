import React, { useState } from 'react'
import WeeklyMealPlan from '../components/WeeklyMealPlan'

export default function MealPlan(){
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(false)

  async function generate() {
    setLoading(true)
    try {
      const res = await fetch('/api/mealplan/generate', {
        method: 'POST',
        headers: { 'Content-Type':'application/json', Authorization: `Bearer demo` },
        body: JSON.stringify({ weekStart: new Date().toISOString().split('T')[0] })
      })
      const data = await res.json()
      setPlan(data.plan || data)
    } catch (err) {
      alert('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex gap-2 items-center mb-4">
        <h2 className="text-2xl font-semibold text-green-900">Meal Plan</h2>
        <button onClick={generate} className="ml-4 px-3 py-1 rounded bg-green-500 text-white">{loading ? 'Generating...' : 'Generate Plan'}</button>
      </div>
      <WeeklyMealPlan plan={plan} onGiveFeedback={(d,r)=>alert(`Feedback ${r} for ${d}`)} />
    </div>
  )
}
