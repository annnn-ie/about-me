import React, { useState, useEffect } from 'react'
import { Card3D } from './components/Card3D'
import { BusinessCard } from './components/BusinessCard'
import { ExperienceTicket } from './components/ExperienceTicket'
import './App.css'

function App() {
  const [isFlipped, setIsFlipped] = useState(true); // Start with backside
  const [breakpoint, setBreakpoint] = useState('default');
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'ticket'
  
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
  const ticketContent = <ExperienceTicket isFlipped={isFlipped} />

  // Flip to front side when component mounts (after card enters screen)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFlipped(false);
    }, 1600); // Wait for card to slide into view and settle before flipping

    return () => clearTimeout(timer);
  }, []);

  const toggleViewMode = () => {
    setViewMode(prevMode => prevMode === 'card' ? 'ticket' : 'card');
    // Reset flip state when switching views
    setIsFlipped(false);
  };

  const getCurrentContent = () => {
    if (viewMode === 'ticket') {
      return {
        frontContent: ticketContent,
        backContent: ticketContent // Ticket doesn't have a back side
      };
    }
    return { frontContent, backContent };
  };

  const { frontContent: currentFront, backContent: currentBack } = getCurrentContent();

  return (
    <div className="app">
      <div className="view-toggle">
        <button 
          onClick={toggleViewMode}
          className={`toggle-btn ${viewMode === 'card' ? 'active' : ''}`}
        >
          Business Card
        </button>
        <button 
          onClick={toggleViewMode}
          className={`toggle-btn ${viewMode === 'ticket' ? 'active' : ''}`}
        >
          Experience Ticket
        </button>
      </div>
      
      <div className="floating-card-container">
        <Card3D 
          frontContent={currentFront}
          backContent={currentBack}
          onFlipChange={setIsFlipped}
          isFlipped={isFlipped}
          breakpoint={breakpoint}
        />
      </div>
    </div>
  )
}

export default App
