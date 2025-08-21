import React, { useState } from 'react'
import { Card3D } from './components/Card3D'
import { BusinessCard } from './components/BusinessCard'
import './App.css'

function App() {
  const [isFlipped, setIsFlipped] = useState(false);
  const { frontContent, backContent } = BusinessCard({ isFlipped })

  return (
    <div className="app">
      <div className="floating-card-container">
        <Card3D 
          frontContent={frontContent}
          backContent={backContent}
          onFlipChange={setIsFlipped}
        />
      </div>
      {/* <div className="instructions">
        <p>Click to flip • Drag to move</p>
      </div> */}
    </div>
  )
}

export default App
