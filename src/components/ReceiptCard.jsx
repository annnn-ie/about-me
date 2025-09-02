import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const springValues = {
  damping: 20,
  stiffness: 80,
  mass: 1.5,
};

const resetSpringValues = {
  damping: 18,
  stiffness: 120,
  mass: 1,
};

/**
 * Receipt Card Component with Tilt Motion and Drag Functionality
 */
export function ReceiptCard({ content, breakpoint = 'default', ...props }) {
    const [isHovered, setIsHovered] = useState(false);
    const [randomRotation, setRandomRotation] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [shouldReset, setShouldReset] = useState(false);
    const [isMobileDevice, setIsMobileDevice] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);
    const ref = useRef(null);

    const isMobile = breakpoint === 'xs';

    // Calculate dimensions based on breakpoint with 9:16 aspect ratio
    const cardDimensions = isMobile ? {
        width: "min(210px, calc(85vw * 9/16))", // Scaled proportionally from desktop 340px
        height: "min(220px, calc(85vw * 9/13))", // Fixed height for tilt calculation
        minHeight: "min(220px, calc(85vw * 9/13))",
        maxWidth: "210px", // Scaled proportionally (340 * 0.618 ≈ 210)
        maxHeight: "220px",
        padding: "0"
    } : {
        width: "min(340px, calc(90vw * 9/16))", // 9:16 ratio, more narrow
        height: "min(360px, calc(90vw * 9/13))", // Fixed height for tilt calculation
        minHeight: "min(360px, calc(90vw * 9/13))",
        maxWidth: "340px", // Updated max width as requested
        maxHeight: "360px",
        padding: "0"
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

    // Generate random rotation on component mount with smoother transition
    useEffect(() => {
        setRandomRotation(Math.random() * 4 - 2); // Reduced range from ±4° to ±2° for subtler effect
        setHasMounted(true);
    }, []);

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useSpring(0, springValues);
    const rotateY = useSpring(0, springValues);
    const scale = useSpring(1, springValues);
    const rotation = useSpring(randomRotation, { 
        damping: 25, 
        stiffness: 100, 
        duration: 1.2 
    }); // Smooth rotation spring

    // Simplify effects for mobile devices
    const rotateAmplitude = (isMobile || isMobileDevice) ? 1 : 4; // Reduced from 2:6 to 1:4 for more subtle tilt
    const scaleOnHover = (isMobile || isMobileDevice) ? 1.005 : 1.015; // Reduced from 1.02 to 1.015 for subtler hover

    // Handle touch events for mobile
    const handleTouchStart = (e) => {
        if (isMobile || isMobileDevice) {
            console.log('Touch start on receipt');
        }
    };

    const handleTouchEnd = (e) => {
        if (isMobile || isMobileDevice) {
            console.log('Touch end on receipt');
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
            // Generate new random rotation when mouse leaves with smooth transition
            const newRotation = Math.random() * 4 - 2;
            setRandomRotation(newRotation);
            rotation.set(newRotation); // Smooth transition
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
        // Generate new random rotation with smooth transition
        const newRotation = Math.random() * 4 - 2;
        setRandomRotation(newRotation);
        rotation.set(newRotation); // Smooth transition
        
        // Reset the reset flag after animation
        setTimeout(() => {
            setShouldReset(false);
        }, 1000);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouse}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
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
                padding: cardDimensions.padding,
                cursor: isDragging ? "grabbing" : "pointer",
                filter: (isMobile || isMobileDevice) ? "none" : "drop-shadow(0 15px 30px rgba(0, 0, 0, 0.08))", // No filter on mobile
                overflow: "visible",
            }}
            {...props}
        >
            <motion.div
                style={{
                    perspective: (isMobile || isMobileDevice) ? "none" : "1200px", // Disable perspective on mobile
                    transformStyle: (isMobile || isMobileDevice) ? "flat" : "preserve-3d", // Flat transforms on mobile
                    width: "100%",
                    height: "100%", // Fixed height for proper tilt calculation
                    position: "relative",
                    rotateX: (isMobile || isMobileDevice) ? 0 : rotateX, // No rotation on mobile
                    rotateY: (isMobile || isMobileDevice) ? 0 : rotateY, // No rotation on mobile
                    scale: (isMobile || isMobileDevice) ? 1 : scale, // No scale on mobile
                    rotate: (isMobile || isMobileDevice) ? 0 : rotation, // Use smooth rotation spring instead of direct state
                }}
            >
                <div
                    style={{
                        width: "100%",
                        height: "100%", // Full height for proper tilt calculation
                        position: "relative",
                    }}
                >
                    {content}
                </div>
            </motion.div>
        </motion.div>
    );
}
