//import { useState } from 'react'
import './App.css'
import MemoryMatch from './components/MemoryMatch/MemoryMatch'
import { BrowserRouter , Route , Routes } from 'react-router-dom'
import StoryCompletion from './components/StoryCompletion/StoryCompletion'
import NavBar from './components/NavBar/NavBar'
import Home from './components/Home/Home'
import LoginPage from './pages/LoginPage'
function App() {
  

  return (
  
    <BrowserRouter>
      <NavBar/>
      <Routes>
      <Route path='/' element={<Home/>} />
        <Route path='/login' element={<LoginPage />} />
        
      
      
      </Routes> 
     </BrowserRouter> 
  )
}

export default App
