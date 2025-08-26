import React, { useState, useEffect } from 'react'
import { Card3D } from './components/Card3D'
import { ReceiptCard } from './components/ReceiptCard'
import { BusinessCard } from './components/BusinessCard'
import { Receipt } from './components/Receipt'
import './App.css'

function App() {
  const [isFlipped, setIsFlipped] = useState(true); // Start with backside
  const [breakpoint, setBreakpoint] = useState('default');
  const [showReceipt, setShowReceipt] = useState(false); // Toggle between card and receipt
  
  // Detect mobile breakpoint
  useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth;
      if (width <= 480) {
        setBreakpoint('xs');
      } else {
        setBreakpoint('default');
      }
    };
    
    // Check on mount
    checkBreakpoint();
    
    // Check on resize
    window.addEventListener('resize', checkBreakpoint);
    
    return () => window.removeEventListener('resize', checkBreakpoint);
  }, []);
  
  const { frontContent, backContent } = BusinessCard({ isFlipped, breakpoint })

  // Flip to front side when component mounts (after card enters screen)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFlipped(false);
    }, 1600); // Wait for card to slide into view and settle before flipping

    return () => clearTimeout(timer);
  }, []);

  const handleToggleView = () => {
    setShowReceipt(!showReceipt);
    // Reset flip state when switching views
    if (!showReceipt) {
      setIsFlipped(false);
    }
  };

  return (
    <div className="app">
      <div className="floating-card-container">
        {showReceipt ? (
          <ReceiptCard 
            content={<Receipt />}
            breakpoint={breakpoint}
          />
        ) : (
          <Card3D 
            frontContent={frontContent}
            backContent={backContent}
            onFlipChange={setIsFlipped}
            isFlipped={isFlipped}
            breakpoint={breakpoint}
          />
        )}
      </div>
      
      <div className="toggle-button-container">
        <button 
          className="toggle-button"
          onClick={handleToggleView}
          aria-label={showReceipt ? "Switch to Business Card" : "Switch to Receipt"}
        >
          {showReceipt ? "View Card" : "View Receipt"}
        </button>
      </div>
      
      {/* <div className="instructions">
        <p>Click to flip • Drag to move</p>
      </div> */}
    </div>
  )
}

export default App
