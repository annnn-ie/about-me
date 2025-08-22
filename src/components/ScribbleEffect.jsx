import React, { useState, useEffect } from 'react';
import './ScribbleEffect.css';

const ScribbleEffect = ({ children, cardFlipped }) => {
    const [selectedScribble, setSelectedScribble] = useState(null);
    const [svgContent, setSvgContent] = useState(null);
    const [isSmile, setIsSmile] = useState(false);
    
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
        // Load initial scribble on component mount
        loadRandomScribble();
    }, []);

    useEffect(() => {
        // When card flips back to front (cardFlipped becomes false), load a new scribble
        if (cardFlipped === false) {
            loadRandomScribble();
        }
    }, [cardFlipped]);

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
                    zIndex: 1
                }}
                dangerouslySetInnerHTML={{ __html: svgContent }}
            />
        </span>
    );
};

export default ScribbleEffect;
