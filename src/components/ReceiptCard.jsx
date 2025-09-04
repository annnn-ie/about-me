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
export function ReceiptCard({ content, ...props }) {
    const [isHovered, setIsHovered] = useState(false);
    const [randomRotation, setRandomRotation] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [shouldReset, setShouldReset] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);
    const ref = useRef(null);

    // Calculate dimensions with 9:16 aspect ratio
    const cardDimensions = {
        width: "min(340px, calc(90vw * 9/16))", // 9:16 ratio, more narrow
        height: "min(360px, calc(90vw * 9/13))", // Fixed height for tilt calculation
        minHeight: "min(360px, calc(90vw * 9/13))",
        maxWidth: "340px", // Updated max width as requested
        maxHeight: "360px",
        padding: "0"
    };

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

    // Effects configuration
    const rotateAmplitude = 4; // Tilt amplitude
    const scaleOnHover = 1.015; // Scale on hover

    function handleMouse(e) {
        if (!ref.current || !isHovered || isDragging) return;

        const rect = ref.current.getBoundingClientRect();
        const offsetX = e.clientX - rect.left - rect.width / 2;
        const offsetY = e.clientY - rect.top - rect.height / 2;

        const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
        const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

        rotateX.set(rotationX);
        rotateY.set(rotationY);
    }

    function handleMouseEnter() {
        if (!isDragging) {
            setIsHovered(true);
            scale.set(scaleOnHover);
        }
    }

    function handleMouseLeave() {
        if (!isDragging) {
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
        scale.set(1.05); // Scale while dragging
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
            drag
            dragConstraints={{ left: -200, right: 200, top: -150, bottom: 150 }}
            dragElastic={0}
            dragMomentum={false}
            dragSnapToOrigin={true}
            dragTransition={{ 
                bounceStiffness: 400,
                bounceDamping: 40,
                power: 0.8,
                timeConstant: 200
            }}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            style={{
                perspective: "1100px",
                transformStyle: "preserve-3d",
                width: cardDimensions.width,
                height: cardDimensions.height,
                maxWidth: cardDimensions.maxWidth,
                maxHeight: cardDimensions.maxHeight,
                padding: cardDimensions.padding,
                cursor: isDragging ? "grabbing" : "pointer",
                filter: "drop-shadow(0 15px 30px rgba(0, 0, 0, 0.08))",
                overflow: "visible",
            }}
            {...props}
        >
            <motion.div
                style={{
                    perspective: "1200px",
                    transformStyle: "preserve-3d",
                    width: "100%",
                    height: "100%", // Fixed height for proper tilt calculation
                    position: "relative",
                    rotateX: rotateX,
                    rotateY: rotateY,
                    scale: scale,
                    rotate: rotation, // Use smooth rotation spring instead of direct state
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
