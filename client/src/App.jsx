import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import MealPlan from './pages/MealPlan'

export default function App(){
  return (
    <div className="min-h-screen font-sans">
      <header className="p-4 bg-green-500 text-white">
        <div className="container mx-auto flex justify-between">
          <Link to="/" className="font-bold">Nutrilearn</Link>
          <nav className="space-x-4">
            <Link to="/mealplan" className="underline">Meal Plan</Link>
          </nav>
        </div>
      </header>
      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<div className="py-10 text-center"><h1 className="text-3xl text-green-900">Nutrilearn</h1><p className="mt-2">AI meal plans & education</p></div>} />
          <Route path="/mealplan" element={<MealPlan/>} />
        </Routes>
      </main>
    </div>
  )
}
