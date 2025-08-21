import React, { useState, useEffect } from 'react';
import './ScribbleEffect.css';

const ScribbleEffect = ({ children, cardFlipped }) => {
    const [selectedScribble, setSelectedScribble] = useState(null);
    const [svgContent, setSvgContent] = useState(null);
    
    // Array of scribble SVG paths
    const scribblePaths = [
        '/scribbles/path-1.svg',
        '/scribbles/path-2.svg',
        '/scribbles/path-3.svg',
        '/scribbles/path-4.svg',
        '/scribbles/path-5.svg',
        '/scribbles/path-6.svg'
    ];

    const loadRandomScribble = () => {
        // Randomly select a scribble
        const randomIndex = Math.floor(Math.random() * scribblePaths.length);
        const selectedPath = scribblePaths[randomIndex];
        setSelectedScribble(selectedPath);
        
        // Fetch and process the SVG content for animation
        fetch(selectedPath)
            .then(response => response.text())
            .then(svgText => {
                // Convert fill to stroke for animation and ensure proper structure
                const processedSvg = svgText
                    .replace(/fill="#1500FF"/g, 'fill="none" stroke="#1500FF" stroke-width="2"')
                    .replace(/<path /g, '<path class="animated-path" ')
                    .replace(/<g /g, '<g class="scribble-group" ');
                setSvgContent(processedSvg);
                
                // Calculate path length after the SVG is rendered
                setTimeout(() => {
                    const paths = document.querySelectorAll('.animated-path');
                    paths.forEach(path => {
                        const length = path.getTotalLength();
                        // Use a single dash that's the full length of the path
                        path.style.strokeDasharray = length;
                        path.style.strokeDashoffset = length;
                        // Ensure smooth line caps
                        path.style.strokeLinecap = 'round';
                        path.style.strokeLinejoin = 'round';
                    });
                }, 100);
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
                    top: '-2px',
                    left: '-10px',
                    width: '100%',
                    height: 'auto',
                    maxWidth: '120px',
                    pointerEvents: 'none',
                    zIndex: 1
                }}
                dangerouslySetInnerHTML={{ __html: svgContent }}
            />
        </span>
    );
};

export default ScribbleEffect;
