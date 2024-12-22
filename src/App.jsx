//import { useState } from 'react'
import './App.css'

import { BrowserRouter , Route , Routes } from 'react-router-dom'
import GameNavigation from './pages/GameNavigation'
import Home from './components/Home/Home'
import FamiliarFaces from './components/FamiliarFaces/FamiliarFaces'
import MemoryMatch from './components/MemoryMatch/MemoryMatch'
import FormPage from "./pages/FormPage"
import Sequence from './components/Sequence recall/Sequence'
import StoryCompletion from './components/StoryCompletion/StoryCompletion';
import LifeSummary from './components/LifeSummary/lifesummary';
function App() {
  

  return (
  
    <BrowserRouter>
      
      <Routes>
      <Route path='/' element={<Home/>} />
        <Route path='/menue' element={<GameNavigation/>}/>
        <Route path='/form' element={<FormPage/>}/>
        <Route path='/familiarfaces' element={<FamiliarFaces />} />
<<<<<<< HEAD
        <Route path='/MemoryMatch' element={<MemoryMatch />} />
=======
        <Route path='/memorymatch' element={<MemoryMatch />} />
        <Route path='/sequence' element={<Sequence/>}/>
>>>>>>> d624602976de86d87500e21c6ef1ebe192a9db66
        <Route path="/life" element={<LifeSummary />} />
        <Route path="/game5" element={<StoryCompletion />} />
      </Routes> 
     </BrowserRouter> 
  )
}

export default App