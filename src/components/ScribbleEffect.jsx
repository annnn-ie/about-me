import React, { useState, useEffect } from 'react';
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
    
    const loadRandomScribble = () => {
        console.log('🔄 Loading new scribble, isFlipped:', isFlipped, 'at:', new Date().toISOString());
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
                        .replace(/<g /g, '<g class="scribble-group" ');
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
    };

    useEffect(() => {
        console.log('🚀 Component mounted, loading initial scribble, ID:', componentId);
        // Load initial scribble on component mount, but don't show it yet
        loadRandomScribble();
    }, [componentId]);

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
            // When flipping back to front, show new scribble after flip completes
            console.log('✅ Flipping back to front, will show new scribble after flip completes');
            // Wait for flip animation to complete, then show new scribble
            setTimeout(() => {
                loadRandomScribble();
                setIsVisible(true);
            }, 300); // Reduced delay for faster new scribble
        }
    }, [isFlipped]);

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
                    top: isSmile ? '-15px' : '-2px',
                    left: isSmile ? '-75px' : '-10px',
                    width: '100%',
                    height: 'auto',
                    maxWidth: isSmile ? '80px' : '120px',
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
