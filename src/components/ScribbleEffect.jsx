import React, { useState, useEffect, useCallback } from 'react';
import './ScribbleEffect.css';

const ScribbleEffect = ({ children, isFlipped }) => {
    // Generate a unique ID for this component instance to track re-mounts
    const componentId = React.useMemo(() => Math.random().toString(36).substr(2, 9), []);
    
    const [selectedScribble, setSelectedScribble] = useState(null);
    const [svgContent, setSvgContent] = useState(null);
    const [isSmile, setIsSmile] = useState(false);
    const [isVisible, setIsVisible] = useState(false); // Start hidden, will be controlled by isFlipped
    
    // Array of scribble SVG paths
    const scribblePaths = [
        '/scribbles/path-1.svg',
        '/scribbles/path-2.svg',
        '/scribbles/path-3.svg',
        '/scribbles/path-4.svg',
        '/scribbles/path-5.svg',
        '/scribbles/path-6.svg',
        '/scribbles/smile.svg'
    ];
    
    const loadRandomScribble = useCallback(() => {
        console.log('🔄 Loading new scribble at:', new Date().toISOString());
        // Randomly select a scribble
        const randomIndex = Math.floor(Math.random() * scribblePaths.length);
        const selectedPath = scribblePaths[randomIndex];
        setSelectedScribble(selectedPath);
        
        // Check if it's the smile
        const isSmileScribble = selectedPath.includes('smile.svg');
        setIsSmile(isSmileScribble);
        
        // Fetch and process the SVG content for animation
        fetch(selectedPath)
            .then(response => response.text())
            .then(svgText => {
                let processedSvg;
                
                if (isSmileScribble) {
                    // For smile.svg, ensure it has proper structure for animation
                    processedSvg = svgText
                        .replace(/<path /g, '<path class="animated-path" ')
                        .replace(/<circle /g, '<circle class="animated-path" ')
                        .replace(/<g /g, '<g class="scribble-group" ')
                        .replace(/<svg /, '<svg data-scribble="smile" ');
                } else {
                    // For regular scribbles, convert fill to stroke for animation
                    processedSvg = svgText
                        .replace(/fill="#1500FF"/g, 'fill="none" stroke="#1500FF" stroke-width="2"')
                        .replace(/<path /g, '<path class="animated-path" ')
                        .replace(/<g /g, '<g class="scribble-group" ');
                }
                
                setSvgContent(processedSvg);
            })
            .catch(error => {
                console.error('Error loading SVG:', error);
                setSvgContent(svgText);
            });
    }, []); // Remove isFlipped dependency to prevent double loading

    useEffect(() => {
        console.log('🚀 Component mounted, loading initial scribble, ID:', componentId);
        // Load initial scribble on component mount, but don't show it yet
        loadRandomScribble();
        // Ensure it starts hidden
        setIsVisible(false);
    }, [componentId, loadRandomScribble]);

    // Set initial visibility based on isFlipped state (only on mount)
    useEffect(() => {
        setIsVisible(!isFlipped);
    }, []);

    // Debug: Log every render to see if component is re-rendering unnecessarily
    console.log('🔄 ScribbleEffect render, ID:', componentId, 'isFlipped:', isFlipped, 'selectedScribble:', selectedScribble);

    useEffect(() => {
        console.log('🔄 isFlipped changed to:', isFlipped);
        
        if (isFlipped === true) {
            // When flipping to backside, hide scribble immediately
            console.log('🔄 Flipping to back, hiding scribble immediately');
            setIsVisible(false);
        } else if (isFlipped === false) {
            // When flipping back to front, load new scribble first, then show after delay
            console.log('✅ Flipping back to front, loading new scribble');
            // Load new scribble immediately but keep it hidden
            loadRandomScribble();
            // Wait for flip animation to complete, then show the new scribble
            setTimeout(() => {
                console.log('✅ Showing new scribble after flip completes');
                setIsVisible(true);
            }, 600); // Restore original delay for proper animation timing
        }
    }, [isFlipped, loadRandomScribble]);

    if (!selectedScribble || !svgContent) {
        return <span>{children}</span>;
    }

    return (
        <span style={{ position: 'relative', display: 'inline-block' }}>
            {children}
            <div
                className="scribble-container"
                style={{
                    position: 'absolute',
                    top: isSmile ? '-3px' : (window.innerWidth <= 480 ? '2px' : '-3px'), // Lowered by 2px
                    left: isSmile ? '-50px' : (window.innerWidth <= 480 ? '0px' : '-10px'), // Slightly right on mobile
                    width: '100%',
                    height: 'auto',
                    maxWidth: isSmile ? '56px' : '120px',
                    pointerEvents: 'none',
                    zIndex: 1,
                    opacity: isVisible ? 1 : 0
                }}
                dangerouslySetInnerHTML={{ __html: svgContent }}
            />
        </span>
    );
};

export default ScribbleEffect;
