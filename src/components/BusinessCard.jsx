import React from "react";
import "./BusinessCard.css";
import ScribbleEffect from "./ScribbleEffect";

export function BusinessCard({ isFlipped }) {
    const frontContent = (
        <div className="business-card business-card-front">
            <div className="card-top">
                <div className="name">
                    <ScribbleEffect cardFlipped={isFlipped}>Anairam</ScribbleEffect> (Annie) Isaías
                </div>
                <div className="title">Product Designer. Educator.</div>
                <div className="company">
                    <a 
                        href="https://dna.inc" 
                        className="company-link"
                        target="_blank" 
                        rel="noopener noreferrer"
                        title="Visit DNA.inc website"
                    >
                        @DNA.inc
                    </a>
                    <span> | </span>
                    <a 
                        href="https://barreira.edu.es" 
                        className="company-link"
                        target="_blank" 
                        rel="noopener noreferrer"
                        title="Visit Barreira A+D website"
                    >
                        Barreira a+D
                    </a>
                </div>
            </div>
            <div className="card-bottom">
                <div className="socials">
                    <a 
                        href="mailto:anairam.isaias@gmail.com" 
                        className="social-link"
                        target="_blank" 
                        rel="noopener noreferrer"
                        title="Send email to anairam.isaias@gmail.com"
                    >
                        email
                    </a>
                    <span>—</span>
                    <a 
                        href="https://linkedin.com/in/anairam-isaias" 
                        className="social-link"
                        target="_blank" 
                        rel="noopener noreferrer"
                        title="View LinkedIn profile"
                    >
                        linkedin
                    </a>
                </div>
                <div className="location">Valencia, ES</div>
            </div>
        </div>
    );

    const backContent = (
        <div className="business-card business-card-back">
            <div className="back-symbol">
                <img src="/☻ ✸.svg" alt="Symbol" className="symbol-svg" />
            </div>
            <div className="back-tagline">
                <p>Continuous Learner. </p>
                <p>Question maker and answer seeker. Problem solver. Driven by curiosity.</p>
            </div>
        </div>
    );

    return { frontContent, backContent };
}