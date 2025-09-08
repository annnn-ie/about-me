import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card3D } from './components/Card3D'
import { ReceiptCard } from './components/ReceiptCard'
import { BusinessCard } from './components/BusinessCard'
import { Receipt } from './components/Receipt'
import { Tabs } from './components/application/tabs/tabs'
import './App.css'

function App() {
  const [isFlipped, setIsFlipped] = useState(true); // Start with back side visible

  const [selectedTab, setSelectedTab] = useState('about'); // 'about' or 'resume'
  const [hasSwitchedViews, setHasSwitchedViews] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true); // Track if this is the first load
  const [tabsEnabled, setTabsEnabled] = useState(false); // Control when tabs become available
  
  const tabs = [
    { id: "about", label: "About" },
    { id: "resume", label: "Resume" },
  ];
  


  // Handle first load animation
  useEffect(() => {
    if (isFirstLoad) {
      // First, let the entrance animation complete (1.2s), then start flip sequence
      const entranceTimer = setTimeout(() => {
        // After entrance animation completes, start flip sequence
        const flipTimer = setTimeout(() => {
          setIsFlipped(false);
          setIsFirstLoad(false);
          
          // Enable tabs after flip animation completes (0.6s flip duration)
          const tabsTimer = setTimeout(() => {
            setTabsEnabled(true);
          }, 600);
          
          return () => clearTimeout(tabsTimer);
        }, 800); // Reduced from 1600ms to 800ms
        
        return () => clearTimeout(flipTimer);
      }, 1200); // Wait for entrance animation to complete
      
      return () => clearTimeout(entranceTimer);
    }
  }, [isFirstLoad]);
  
  const { frontContent, backContent } = useMemo(() => 
    BusinessCard({ isFlipped }), 
    [isFlipped]
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
      x: window.innerWidth <= 480 ? 360 : 1100, // Shorter distance on mobile
      opacity: 1,
    },
    center: {
      x: 0,
      opacity: 1,
    },
    exit: {
      x: window.innerWidth <= 480 ? -360 : -1100, // Shorter distance on mobile
      opacity: 1,
    },
  };

  // Animation variants for first load (top-to-center)
  const firstLoadVariants = {
    enter: {
      y: window.innerWidth <= 480 ? -400 : -1100, // Shorter distance on mobile
      opacity: 0,
    },
    center: {
      y: 0,
      opacity: 1,
    },
    exit: {
      y: window.innerWidth <= 480 ? -400 : -1100, // Shorter distance on mobile
      opacity: 0,
    },
  };

  // Choose animation variants based on whether it's first load or view switching
  const getAnimationVariants = () => {
    if (isFirstLoad && selectedTab === 'about') {
      return firstLoadVariants;
    }
    return slideVariants;
  };

  // Choose animation transition based on whether it's first load or view switching
  const getAnimationTransition = () => {
    if (isFirstLoad && selectedTab === 'about') {
      return {
        y: { 
          type: "tween",
          ease: [0.77, 0, 0.175, 1],
          duration: 1.2
        },
        opacity: {
          type: "tween",
          ease: [0.77, 0, 0.175, 1],
          duration: 1.2
        }
      };
    }
    return {
      x: { 
        type: "tween",
        ease: [0.77, 0, 0.175, 1],
        duration: 0.8
      }
    };
  };

  return (
    <div className="app">
      <div className="floating-card-container">
        <AnimatePresence mode="wait">
          {selectedTab === 'resume' ? (
            <motion.div
              key="receipt"
              variants={getAnimationVariants()}
              initial="enter"
              animate="center"
              exit="exit"
              transition={getAnimationTransition()}
            >
              <ReceiptCard 
                content={<Receipt />}
              />
            </motion.div>
          ) : (
            <motion.div
              key="card"
              variants={getAnimationVariants()}
              initial="enter"
              animate="center"
              exit="exit"
              transition={getAnimationTransition()}
            >
              <Card3D 
                frontContent={frontContent}
                backContent={backContent}
                onFlipChange={setIsFlipped}
                isFlipped={isFlipped}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <AnimatePresence>
        {tabsEnabled && (
          <motion.div 
            className="tab-container"
            style={{
              position: 'fixed',
              top: '2rem',
              left: '50%',
              zIndex: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            initial={{ opacity: 0, y: 20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            transition={{
              type: "tween",
              ease: [0.77, 0, 0.175, 1],
              duration: 0.6
            }}
          >
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
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* <div className="instructions">
        <p>Click to flip • Drag to move</p>
      </div> */}
    </div>
  )
}

export default App
