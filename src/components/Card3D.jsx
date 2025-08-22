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
export function Card3D({ frontContent, backContent, onFlipChange, isFlipped: externalIsFlipped, ...props }) {
    const [isHovered, setIsHovered] = useState(false);
    const [randomRotation, setRandomRotation] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [shouldReset, setShouldReset] = useState(false);
    const ref = useRef(null);

    // Generate random rotation on component mount
    useEffect(() => {
        setRandomRotation(Math.random() * 8 - 4); // Random value between -4 and +4 degrees
    }, []);

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useSpring(0, springValues);
    const rotateY = useSpring(0, springValues);
    const scale = useSpring(1, springValues);

    const rotateAmplitude = 14;
    const scaleOnHover = 1.02;

    const handleClick = (e) => {
        // Check if the click target is a link or is inside a link
        const isLink = e.target.closest('a');
        
        if (!isDragging && !isLink) {
            const newFlipState = !externalIsFlipped;
            onFlipChange?.(newFlipState);
        }
    };

    function handleMouse(e) {
        if (!ref.current || !isHovered || isDragging) return; // Don't process mouse movement when dragging

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
            // Generate new random rotation when mouse leaves
            setRandomRotation(Math.random() * 8 - 4);
        }
    }

    const handleDragStart = () => {
        setIsDragging(true);
        setIsHovered(false);
        setShouldReset(false);
        scale.set(1.05); // Slightly larger scale while dragging
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

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouse}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
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
                width: "min(520px, 90vw)",
                height: "min(360px, calc(90vw * 9/13))",
                maxWidth: "520px",
                maxHeight: "360px",
                cursor: isDragging ? "grabbing" : "pointer",
                filter: "drop-shadow(0 15px 30px rgba(0, 0, 0, 0.08))",
                padding: "clamp(20px, 4vw, 40px)",
                overflow: "visible",
            }}
            initial={{ 
                y: -1000, // Start from above the screen
                opacity: 0,
                scale: 0.8,
                rotateY: -2 // Start with a slight left tilt
            }}
            animate={{ 
                y: 0, // Slide to center position
                opacity: 1,
                scale: 1,
                rotateY: [2, -2, 2, -2, 0], // Wiggle effect during slide, then settle to 0
                rotate: isHovered && !isDragging ? 0 : randomRotation 
            }}
            transition={{
                y: {
                    type: "spring",
                    damping: 25,
                    stiffness: 100,
                    mass: 1.2
                },
                x: {
                    type: "spring",
                    damping: 30,
                    stiffness: 150,
                    mass: 1
                },
                rotateY: {
                    duration: 1.2, // Match the slide duration
                    times: [0, 0.25, 0.5, 0.75, 1], // Wiggle timing
                    ease: "easeInOut"
                },
                opacity: {
                    duration: 0.6,
                    ease: "easeOut"
                },
                scale: {
                    type: "spring",
                    damping: 20,
                    stiffness: 120,
                    mass: 1
                },
                ...resetSpringValues
            }}
            {...props}
        >
            <motion.div
                style={{
                    perspective: "1200px",
                    transformStyle: "preserve-3d",
                    width: "100%",
                    height: "100%",
                    position: "relative",
                    rotateX,
                    rotateY,
                    scale,
                }}
            >
                {/* Front side */}
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        zIndex: externalIsFlipped ? 0 : 1,
                        backfaceVisibility: "hidden",
                        position: "absolute",
                        transform: `rotateY(${externalIsFlipped ? -180 : 0}deg)`,
                        transition: "transform 0.6s ease-in-out",
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
                        backfaceVisibility: "hidden",
                        position: "absolute",
                        transform: `rotateY(${externalIsFlipped ? 0 : 180}deg)`,
                        transition: "transform 0.6s ease-in-out",
                    }}
                >
                    {backContent}
                </div>
            </motion.div>
        </motion.div>
    );
}
