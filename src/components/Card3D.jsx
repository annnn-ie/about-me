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
export function Card3D({ frontContent, backContent, onFlipChange, ...props }) {
    const [isFlipped, setIsFlipped] = useState(false);
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
            const newFlipState = !isFlipped;
            setIsFlipped(newFlipState);
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

    function handleTouch(e) {
        if (!ref.current || isDragging) return;
        
        // Use the first touch point for tilt effect
        const touch = e.touches[0];
        if (!touch) return;

        const rect = ref.current.getBoundingClientRect();
        const offsetX = touch.clientX - rect.left - rect.width / 2;
        const offsetY = touch.clientY - rect.top - rect.height / 2;

        const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude * 0.5; // Reduced amplitude for touch
        const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude * 0.5;

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
            onTouchMove={handleTouch}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => {
                setIsHovered(false);
                rotateX.set(0);
                rotateY.set(0);
                setRandomRotation(Math.random() * 8 - 4);
            }}
            onClick={handleClick}
            drag
            dragConstraints={{ left: -100, right: 100, top: -75, bottom: 75 }}
            dragElastic={0.2}
            dragMomentum={false}
            dragTransition={{ 
                bounceStiffness: 300, 
                bounceDamping: 30,
                power: 0.6,
                timeConstant: 150
            }}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            style={{
                perspective: "1200px",
                transformStyle: "preserve-3d",
                width: "min(520px, calc(100vw - 40px))",
                height: "min(360px, calc((100vw - 40px) * 9/13))",
                maxWidth: "520px",
                maxHeight: "360px",
                cursor: isDragging ? "grabbing" : "pointer",
                filter: "drop-shadow(0 15px 30px rgba(0, 0, 0, 0.08))",
                padding: "clamp(15px, 3vw, 30px)",
                overflow: "visible",
            }}
            animate={{ 
                x: shouldReset ? 0 : undefined,
                y: shouldReset ? 0 : undefined,
                rotate: isHovered && !isDragging ? 0 : randomRotation 
            }}
            transition={resetSpringValues}
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
                        zIndex: isFlipped ? 0 : 1,
                        backfaceVisibility: "hidden",
                        position: "absolute",
                        transform: `rotateY(${isFlipped ? -180 : 0}deg)`,
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
                        zIndex: isFlipped ? 1 : 0,
                        backfaceVisibility: "hidden",
                        position: "absolute",
                        transform: `rotateY(${isFlipped ? 0 : 180}deg)`,
                        transition: "transform 0.6s ease-in-out",
                    }}
                >
                    {backContent}
                </div>
            </motion.div>
        </motion.div>
    );
}
