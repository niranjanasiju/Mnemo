//import { useState } from 'react'
import './App.css'

import { BrowserRouter , Route , Routes } from 'react-router-dom'
import FamiliarFaces from './components/FamiliarFaces/FamiliarFaces';
import FormPage from './pages/FormPage'
import Home from './components/Home/Home';
import GameNavigation from './pages/GameNavigation'
import NavBar from './components/NavBar/NavBar'
import LoginPage from './pages/LoginPage'
import MemoryMatch from './components/MemoryMatch/MemoryMatch'
import StoryCompletion from './components/StoryCompletion/StoryCompletion'
function App() {
  

  return (
    <>
 
  <BrowserRouter>
    
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/menue' element={<GameNavigation/>}/>
      <Route path='form' element={<FormPage/>}/>
      <Route path='/familiarfaces' element={<FamiliarFaces />} />
      <Route path='/memorymatch' element={<MemoryMatch />} />
      <Route path='/storycompletion' element={<StoryCompletion/>}/>
    
    
    </Routes> 
   </BrowserRouter> 


    </> 
    
      
  )
}

export default App