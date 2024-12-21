import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from './pages/LoginPage'
import FormPage from './pages/FormPage'
function App() {
  

  return (
    <Router>
      <div>
        {/* Common header or navigation bar can go here */}
        <Routes>
          {/* Define your routes */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/form" element={<FormPage/>} />
          
        </Routes>
      </div>
    </Router>
  )
}

export default App
