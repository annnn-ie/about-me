import React, { useState, useEffect } from 'react'
import { Card3D } from './components/Card3D'
import { BusinessCard } from './components/BusinessCard'
import './App.css'

function App() {
  const [isFlipped, setIsFlipped] = useState(true); // Start with backside
  const { frontContent, backContent } = BusinessCard({ isFlipped })

  // Flip to front side when component mounts (after card enters screen)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFlipped(false);
    }, 1600); // Wait for card to slide into view and settle before flipping

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="app">
      <div className="floating-card-container">
        <Card3D 
          frontContent={frontContent}
          backContent={backContent}
          onFlipChange={setIsFlipped}
          isFlipped={isFlipped}
        />
      </div>
      {/* <div className="instructions">
        <p>Click to flip • Drag to move</p>
      </div> */}
    </div>
  )
}

export default App
