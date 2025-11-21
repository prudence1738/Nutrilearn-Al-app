import React from 'react'
import { format } from 'date-fns'

export default function WeeklyMealPlan({ plan, onGiveFeedback }) {
  if (!plan) return <div className="text-gray-600">No plan yet — click "Generate Plan"</div>;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-green-900">Your Meal Plan</h3>
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {plan.days.map((day, i) => (
          <div key={i} className="bg-white rounded-2xl p-3 shadow-sm border">
            <div className="text-sm text-gray-500">{format(new Date(day.date), 'EEE dd')}</div>
            <ul className="mt-2 space-y-2">
              {day.meals.map((m, idx) => (
                <li key={idx}>
                  <div className="font-medium text-green-700">{m.name}</div>
                  <div className="text-xs text-gray-600">{m.calories} kcal • {m.proteinG}g P</div>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex gap-2">
              <button onClick={() => onGiveFeedback(i, 5)} className="px-2 py-1 rounded bg-green-500 text-white text-sm">Loved it</button>
              <button onClick={() => onGiveFeedback(i, 2)} className="px-2 py-1 rounded border text-sm">Didn't like</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
