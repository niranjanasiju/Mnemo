//import { useState } from 'react'
import './App.css'

import { BrowserRouter , Route , Routes } from 'react-router-dom'
import GameNavigation from './pages/GameNavigation'
import Home from './components/Home/Home'
import FamiliarFaces from './components/FamiliarFaces/FamiliarFaces'
import MemoryMatch from './components/MemoryMatch/MemoryMatch'
import FormPage from "./pages/FormPage"
import Sequence from './components/Sequence recall/Sequence'
function App() {
  

  return (
  
    <BrowserRouter>
      
      <Routes>
      <Route path='/' element={<Home/>} />
        <Route path='/menue' element={<GameNavigation/>}/>
        <Route path='/form' element={<FormPage/>}/>
        <Route path='/familiarfaces' element={<FamiliarFaces />} />

        <Route path='/MemoryMatch' element={<MemoryMatch />} />

       
        <Route path='/Sequencerecall' element={<Sequence/>}/>

      </Routes> 
     </BrowserRouter> 
  )
}

export default App