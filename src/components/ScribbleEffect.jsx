import React, { useState, useEffect } from 'react';
import './ScribbleEffect.css';

const ScribbleEffect = ({ children, isFlipped }) => {
    // Generate a unique ID for this component instance to track re-mounts
    const componentId = React.useMemo(() => Math.random().toString(36).substr(2, 9), []);
    
    const [selectedScribble, setSelectedScribble] = useState(null);
    const [svgContent, setSvgContent] = useState(null);
    const [isSmile, setIsSmile] = useState(false);
    const [isVisible, setIsVisible] = useState(true); // Control scribble visibility
    
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
        // Load initial scribble on component mount
        loadRandomScribble();
    }, [componentId]);

    // Debug: Log every render to see if component is re-rendering unnecessarily
    console.log('🔄 ScribbleEffect render, ID:', componentId, 'isFlipped:', isFlipped, 'selectedScribble:', selectedScribble);

    useEffect(() => {
        console.log('🔄 isFlipped changed to:', isFlipped);
        // Load a new scribble when the card flips back to front (isFlipped becomes false)
        // Don't reload when flipping to back (isFlipped becomes true)
        if (isFlipped === false) {
            console.log('✅ Flipping back to front, will fade out scribble and load new one in 100ms');
            // First fade out the current scribble
            setTimeout(() => {
                setIsVisible(false); // Fade out current scribble instantly
                // Then load new scribble immediately after fade out
                setTimeout(() => {
                    loadRandomScribble();
                    setIsVisible(true); // Show new scribble
                }, 0); // No delay - instant new scribble
            }, 100); // Reduced delay to 100ms
        } else {
            console.log('🔄 Flipping to back, keeping current scribble');
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
