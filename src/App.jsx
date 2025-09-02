import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card3D } from './components/Card3D'
import { ReceiptCard } from './components/ReceiptCard'
import { BusinessCard } from './components/BusinessCard'
import { Receipt } from './components/Receipt'
import { Tabs } from './components/application/tabs/tabs'
import './App.css'

function App() {
  const [isFlipped, setIsFlipped] = useState(false); // Start with front side
  const [breakpoint, setBreakpoint] = useState('default');
  const [selectedTab, setSelectedTab] = useState('about'); // 'about' or 'resume'
  const [hasSwitchedViews, setHasSwitchedViews] = useState(false);
  
  const tabs = [
    { id: "about", label: "About" },
    { id: "resume", label: "Resume" },
  ];
  
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
  
  const { frontContent, backContent } = useMemo(() => 
    BusinessCard({ isFlipped, breakpoint }), 
    [isFlipped, breakpoint]
  )



  const handleTabChange = (value) => {
    setHasSwitchedViews(true);
    setSelectedTab(value);
    // Reset flip state when switching to about tab
    if (value === 'about') {
      setIsFlipped(false);
    }
  };

  // Animation variants for slide transitions
  const slideVariants = {
    enter: {
      x: 1000,
      opacity: 1,
    },
    center: {
      x: 0,
      opacity: 1,
    },
    exit: {
      x: -1000,
      opacity: 1,
    },
  };

  return (
    <div className="app">
      <div className="floating-card-container">
        <AnimatePresence mode="wait">
          {selectedTab === 'resume' ? (
            <motion.div
              key="receipt"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { 
                  type: "tween",
                  ease: [0.77, 0, 0.175, 1],
                  duration: 0.8
                }
              }}
            >
              <ReceiptCard 
                content={<Receipt />}
                breakpoint={breakpoint}
              />
            </motion.div>
          ) : (
            <motion.div
              key="card"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { 
                  type: "tween",
                  ease: [0.77, 0, 0.175, 1],
                  duration: 0.8
                }
              }}
            >
              <Card3D 
                frontContent={frontContent}
                backContent={backContent}
                onFlipChange={setIsFlipped}
                isFlipped={isFlipped}
                breakpoint={breakpoint}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="tab-container">
        <Tabs selectedKey={selectedTab} onSelectionChange={handleTabChange} className="w-max">
          <Tabs.List type="underline" items={tabs}>
            {(tab) => (
              <Tabs.Item 
                key={tab.id}
                id={tab.id}
                label={tab.label}
                isSelected={selectedTab === tab.id}
                onPress={handleTabChange}
              />
            )}
          </Tabs.List>
        </Tabs>
      </div>
      
      {/* <div className="instructions">
        <p>Click to flip • Drag to move</p>
      </div> */}
    </div>
  )
}

export default App
