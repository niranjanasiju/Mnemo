//import { useState } from 'react'
import './App.css'
import MemoryMatch from './components/MemoryMatch/MemoryMatch'
import LoginPage from './pages/LoginPage';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FamiliarFaces from './components/FamiliarFaces/FamiliarFaces';
import FormPage from './pages/FormPage'
function App() {
  

  return (
    <>
    
    
    <Router>
        <div className="min-h-screen bg-gray-100">
          {/* Common header or navigation bar can go here */}
          <Routes>
            {/* Define your routes */}
            <Route path="/" element={<LoginPage />} />
            <Route path="game1" element={<MemoryMatch/>}/>
            <Route path="/form" element={<FormPage />} />
            <Route path="/game4" element={<FamiliarFaces />} />
          </Routes>
        </div>
      </Router>
    </> 
    
      
  )
}

export default App