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
 * Receipt Card Component with Tilt Effect, Random Rotation, and Drag Functionality
 * No flip functionality, no ink texture, but same shadow effects
 */
export function ReceiptCard({ content, breakpoint = 'default', ...props }) {
    const [isHovered, setIsHovered] = useState(false);
    const [randomRotation, setRandomRotation] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [shouldReset, setShouldReset] = useState(false);
    const [isMobileDevice, setIsMobileDevice] = useState(false);
    const ref = useRef(null);

    const isMobile = breakpoint === 'xs';
    
    // Calculate dimensions based on breakpoint
    const cardDimensions = isMobile ? {
        width: "min(320px, 85vw)",
        height: "min(220px, calc(85vw * 9/13))",
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
    const rotateAmplitude = (isMobile || isMobileDevice) ? 2 : 8;
    const scaleOnHover = (isMobile || isMobileDevice) ? 1.005 : 1.02;

    // Handle touch events for mobile
    const handleTouchStart = (e) => {
        if (isMobile || isMobileDevice) {
            console.log('Touch start on mobile');
        }
    };

    function handleMouse(e) {
        if (!ref.current || !isHovered || isDragging || (isMobile || isMobileDevice)) return;

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
            rotateX.set(0);
            rotateY.set(0);
            setRandomRotation(Math.random() * 8 - 4);
        }
    }

    const handleDragStart = () => {
        setIsDragging(true);
        setIsHovered(false);
        setShouldReset(false);
        scale.set((isMobile || isMobileDevice) ? 1.01 : 1.05);
    };

    const handleDragEnd = () => {
        setIsDragging(false);
        scale.set(1);
        setShouldReset(true);
        x.set(0);
        y.set(0);
        rotateX.set(0);
        rotateY.set(0);
        setRandomRotation(Math.random() * 8 - 4);
        
        setTimeout(() => {
            setShouldReset(false);
        }, 1000);
    };

    // Simplified initial animation for mobile
    const initialAnimation = (isMobile || isMobileDevice) ? {
        y: -200,
        opacity: 0,
        scale: 0.9,
        rotateY: 0
    } : {
        y: -1000,
        opacity: 0,
        scale: 0.8,
        rotateY: -2
    };

    // Simplified animate for mobile
    const animateProps = (isMobile || isMobileDevice) ? {
        y: 0,
        opacity: 1,
        scale: 1,
        rotateY: 0
    } : {
        y: 0,
        opacity: 1,
        scale: 1,
        rotateY: [2, -2, 2, -2, 0],
        rotate: isHovered && !isDragging ? 0 : randomRotation 
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouse}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            drag
            dragConstraints={(isMobile || isMobileDevice) ? 
                { left: -50, right: 50, top: -40, bottom: 40 } :
                { left: -200, right: 200, top: -150, bottom: 150 }
            }
            dragElastic={0}
            dragMomentum={false}
            dragSnapToOrigin={true}
            dragTransition={{ 
                bounceStiffness: (isMobile || isMobileDevice) ? 600 : 400,
                bounceDamping: (isMobile || isMobileDevice) ? 60 : 40,
                power: (isMobile || isMobileDevice) ? 0.9 : 0.8,
                timeConstant: (isMobile || isMobileDevice) ? 150 : 200
            }}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            style={{
                perspective: (isMobile || isMobileDevice) ? "none" : "1100px",
                transformStyle: (isMobile || isMobileDevice) ? "flat" : "preserve-3d",
                width: cardDimensions.width,
                height: cardDimensions.height,
                maxWidth: cardDimensions.maxWidth,
                maxHeight: cardDimensions.maxHeight,
                cursor: isDragging ? "grabbing" : "pointer",
                filter: (isMobile || isMobileDevice) ? "none" : "drop-shadow(0 15px 30px rgba(0, 0, 0, 0.08))",
                padding: cardDimensions.padding,
                overflow: "visible",
            }}
            initial={initialAnimation}
            animate={animateProps}
            transition={{
                y: {
                    ease: [0.785, 0.135, 0.15, 0.86],
                    duration: (isMobile || isMobileDevice) ? 0.8 : 1.2
                },
                x: {
                    type: "spring",
                    damping: (isMobile || isMobileDevice) ? 35 : 30,
                    stiffness: (isMobile || isMobileDevice) ? 180 : 150,
                    mass: (isMobile || isMobileDevice) ? 0.8 : 1
                },
                rotateY: {
                    duration: (isMobile || isMobileDevice) ? 0.8 : 1.2,
                    times: (isMobile || isMobileDevice) ? [0, 1] : [0, 0.25, 0.5, 0.75, 1],
                    ease: "easeInOut"
                },
                opacity: {
                    duration: (isMobile || isMobileDevice) ? 0.4 : 0.6,
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
                    perspective: (isMobile || isMobileDevice) ? "none" : "1200px",
                    transformStyle: (isMobile || isMobileDevice) ? "flat" : "preserve-3d",
                    width: "100%",
                    height: "100%",
                    position: "relative",
                    rotateX: (isMobile || isMobileDevice) ? 0 : rotateX,
                    rotateY: (isMobile || isMobileDevice) ? 0 : rotateY,
                    scale: (isMobile || isMobileDevice) ? 1 : scale,
                }}
            >
                {/* Single content - no flip */}
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        position: "relative",
                        transform: "none",
                        transition: "none",
                        opacity: 1,
                    }}
                >
                    {content}
                </div>
            </motion.div>
        </motion.div>
    );
}
