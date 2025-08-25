import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const springValues = {
  damping: 30,
  stiffness: 100,
  mass: 2,
};

const resetSpringValues = {
  damping: 25,
  stiffness: 150,
  mass: 1,
};

/**
 * 3D Flip Card Component with Tilt Effect, Random Rotation, and Drag Functionality
 */
export function Card3D({ frontContent, backContent, onFlipChange, isFlipped: externalIsFlipped, breakpoint = 'default', ...props }) {
    const [isHovered, setIsHovered] = useState(false);
    const [randomRotation, setRandomRotation] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [shouldReset, setShouldReset] = useState(false);
    const [isMobileDevice, setIsMobileDevice] = useState(false);
    const ref = useRef(null);

    const isMobile = breakpoint === 'xs';
    
    // Calculate dimensions based on breakpoint
    const cardDimensions = isMobile ? {
        width: "min(320px, 85vw)", // Better mobile width - not too small
        height: "min(220px, calc(85vw * 9/13))", // Better mobile height
        maxWidth: "320px",
        maxHeight: "220px",
        padding: "clamp(10px, 2vw, 19.731px)"
    } : {
        width: "min(520px, 90vw)",
        height: "min(360px, calc(90vw * 9/13))",
        maxWidth: "520px",
        maxHeight: "360px",
        padding: "clamp(20px, 4vw, 40px)"
    };
    
    // Detect if we're on a mobile device
    useEffect(() => {
        const checkMobileDevice = () => {
            const userAgent = navigator.userAgent || navigator.vendor || window.opera;
            const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
            setIsMobileDevice(isMobileDevice);
        };
        
        checkMobileDevice();
    }, []);
    
    // Debug logging
    useEffect(() => {
        console.log('Card3D render state:', { 
            breakpoint, 
            isMobile, 
            isMobileDevice, 
            cardDimensions
        });
        
        // Log DOM element after render
        setTimeout(() => {
            if (ref.current) {
                const rect = ref.current.getBoundingClientRect();
                console.log('Card3D DOM element:', {
                    element: ref.current,
                    rect: rect,
                    offsetWidth: ref.current.offsetWidth,
                    offsetHeight: ref.current.offsetHeight,
                    computedStyle: window.getComputedStyle(ref.current)
                });
            } else {
                console.log('Card3D ref is null');
            }
        }, 100);
    }, [breakpoint, isMobile, isMobileDevice, cardDimensions]);
    
    console.log(`Card3D render - breakpoint: ${breakpoint}, isMobile: ${isMobile}, isMobileDevice: ${isMobileDevice}`);

    // Generate random rotation on component mount
    useEffect(() => {
        setRandomRotation(Math.random() * 8 - 4); // Random value between -4 and +4 degrees
    }, []);

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useSpring(0, springValues);
    const rotateY = useSpring(0, springValues);
    const scale = useSpring(1, springValues);

    // Simplify effects for mobile devices
    const rotateAmplitude = (isMobile || isMobileDevice) ? 3 : 14; // Much smaller rotation on mobile
    const scaleOnHover = (isMobile || isMobileDevice) ? 1.005 : 1.02; // Minimal hover scale on mobile

    const handleClick = (e) => {
        // Check if the click target is a link or is inside a link
        const isLink = e.target.closest('a');
        
        if (!isDragging && !isLink) {
            const newFlipState = !externalIsFlipped;
            console.log('Card clicked, flipping from', externalIsFlipped, 'to', newFlipState);
            onFlipChange?.(newFlipState);
        }
    };

    // Handle touch events for mobile
    const handleTouchStart = (e) => {
        if (isMobile || isMobileDevice) {
            console.log('Touch start on mobile');
        }
    };

    const handleTouchEnd = (e) => {
        if ((isMobile || isMobileDevice) && !isDragging) {
            console.log('Touch end on mobile, triggering flip');
            const newFlipState = !externalIsFlipped;
            onFlipChange?.(newFlipState);
        }
    };

    function handleMouse(e) {
        if (!ref.current || !isHovered || isDragging || (isMobile || isMobileDevice)) return; // Don't process mouse movement on mobile

        const rect = ref.current.getBoundingClientRect();
        const offsetX = e.clientX - rect.left - rect.width / 2;
        const offsetY = e.clientY - rect.top - rect.height / 2;

        const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
        const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

        rotateX.set(rotationX);
        rotateY.set(rotationY);
    }

    function handleMouseEnter() {
        if (!isDragging && !(isMobile || isMobileDevice)) {
            setIsHovered(true);
            scale.set(scaleOnHover);
        }
    }

    function handleMouseLeave() {
        if (!isDragging && !(isMobile || isMobileDevice)) {
            setIsHovered(false);
            scale.set(1);
            rotateX.set(0); // Reset tilt
            rotateY.set(0); // Reset tilt
            // Generate new random rotation when mouse leaves
            setRandomRotation(Math.random() * 8 - 4);
        }
    }

    const handleDragStart = () => {
        setIsDragging(true);
        setIsHovered(false);
        setShouldReset(false);
        scale.set((isMobile || isMobileDevice) ? 1.01 : 1.05); // Smaller scale while dragging on mobile
    };

    const handleDragEnd = () => {
        setIsDragging(false);
        scale.set(1);
        setShouldReset(true);
        // Reset position to center
        x.set(0);
        y.set(0);
        // Reset tilt
        rotateX.set(0);
        rotateY.set(0);
        // Generate new random rotation
        setRandomRotation(Math.random() * 8 - 4);
        
        // Reset the reset flag after animation
        setTimeout(() => {
            setShouldReset(false);
        }, 1000);
    };

    // Simplified initial animation for mobile
    const initialAnimation = (isMobile || isMobileDevice) ? {
        y: -200, // Start closer on mobile
        opacity: 0,
        scale: 0.9,
        rotateY: 0 // No rotation on mobile
    } : {
        y: -1000, // Start from above the screen
        opacity: 0,
        scale: 0.8,
        rotateY: -2 // Start with a slight left tilt
    };

    // Simplified animate for mobile
    const animateProps = (isMobile || isMobileDevice) ? {
        y: 0, // Slide to center position
        opacity: 1,
        scale: 1,
        rotateY: 0 // No wiggle on mobile
    } : {
        y: 0, // Slide to center position
        opacity: 1,
        scale: 1,
        rotateY: [2, -2, 2, -2, 0], // Wiggle effect during slide, then settle to 0
        rotate: isHovered && !isDragging ? 0 : randomRotation 
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouse}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            drag
            dragConstraints={(isMobile || isMobileDevice) ? 
                { left: -50, right: 50, top: -40, bottom: 40 } : // Much smaller drag area on mobile
                { left: -200, right: 200, top: -150, bottom: 150 }
            }
            dragElastic={0}
            dragMomentum={false}
            dragSnapToOrigin={true}
            dragTransition={{ 
                bounceStiffness: (isMobile || isMobileDevice) ? 600 : 400, // Stiffer on mobile
                bounceDamping: (isMobile || isMobileDevice) ? 60 : 40, // More damping on mobile
                power: (isMobile || isMobileDevice) ? 0.9 : 0.8,
                timeConstant: (isMobile || isMobileDevice) ? 150 : 200
            }}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            style={{
                perspective: (isMobile || isMobileDevice) ? "none" : "1100px", // Disable perspective on mobile
                transformStyle: (isMobile || isMobileDevice) ? "flat" : "preserve-3d", // Flat transforms on mobile
                width: cardDimensions.width,
                height: cardDimensions.height,
                maxWidth: cardDimensions.maxWidth,
                maxHeight: cardDimensions.maxHeight,
                cursor: isDragging ? "grabbing" : "pointer",
                filter: (isMobile || isMobileDevice) ? "none" : "drop-shadow(0 15px 30px rgba(0, 0, 0, 0.08))", // No filter on mobile
                padding: cardDimensions.padding,
                overflow: "visible",
            }}
            initial={initialAnimation}
            animate={animateProps}
            transition={{
                y: {
                    type: "spring",
                    damping: (isMobile || isMobileDevice) ? 30 : 25,
                    stiffness: (isMobile || isMobileDevice) ? 120 : 100,
                    mass: (isMobile || isMobileDevice) ? 1 : 1.2
                },
                x: {
                    type: "spring",
                    damping: (isMobile || isMobileDevice) ? 35 : 30,
                    stiffness: (isMobile || isMobileDevice) ? 180 : 150,
                    mass: (isMobile || isMobileDevice) ? 0.8 : 1
                },
                rotateY: {
                    duration: (isMobile || isMobileDevice) ? 0.8 : 1.2, // Faster on mobile
                    times: (isMobile || isMobileDevice) ? [0, 1] : [0, 0.25, 0.5, 0.75, 1], // No wiggle on mobile
                    ease: "easeInOut"
                },
                opacity: {
                    duration: (isMobile || isMobileDevice) ? 0.4 : 0.6, // Faster on mobile
                    ease: "easeOut"
                },
                scale: {
                    type: "spring",
                    damping: (isMobile || isMobileDevice) ? 25 : 20,
                    stiffness: (isMobile || isMobileDevice) ? 150 : 120,
                    mass: (isMobile || isMobileDevice) ? 0.8 : 1
                },
                ...resetSpringValues
            }}
            {...props}
        >
            <motion.div
                style={{
                    perspective: (isMobile || isMobileDevice) ? "none" : "1200px", // Disable perspective on mobile
                    transformStyle: (isMobile || isMobileDevice) ? "flat" : "preserve-3d", // Flat transforms on mobile
                    width: "100%",
                    height: "100%",
                    position: "relative",
                    rotateX: (isMobile || isMobileDevice) ? 0 : rotateX, // No rotation on mobile
                    rotateY: (isMobile || isMobileDevice) ? 0 : rotateY, // No rotation on mobile
                    scale: (isMobile || isMobileDevice) ? 1 : scale, // No scale on mobile
                }}
            >
                {/* Front side */}
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        zIndex: externalIsFlipped ? 0 : 1,
                        backfaceVisibility: "hidden", // Always hidden to prevent flash during breakpoint changes
                        position: "absolute",
                        transform: (isMobile || isMobileDevice) ? 
                            `translateX(${externalIsFlipped ? -100 : 0}%)` : // Simple slide on mobile
                            `rotateY(${externalIsFlipped ? -180 : 0}deg)`, // 3D flip on desktop
                        transition: "transform 0.6s ease-in-out",
                        opacity: (isMobile || isMobileDevice) ? (externalIsFlipped ? 0 : 1) : 1, // Fade on mobile
                    }}
                >
                    {frontContent}
                </div>
                
                {/* Back side */}
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        zIndex: externalIsFlipped ? 1 : 0,
                        backfaceVisibility: "hidden", // Always hidden to prevent flash during breakpoint changes
                        position: "absolute",
                        transform: (isMobile || isMobileDevice) ? 
                            `translateX(${externalIsFlipped ? 0 : 100}%)` : // Simple slide on mobile
                            `rotateY(${externalIsFlipped ? 0 : 180}deg)`, // 3D flip on desktop
                        transition: "transform 0.6s ease-in-out",
                        opacity: (isMobile || isMobileDevice) ? (externalIsFlipped ? 1 : 0) : 1, // Fade on mobile
                    }}
                >
                    {backContent}
                </div>
            </motion.div>
        </motion.div>
    );
}
