import React from "react";
import "./ExperienceTicket.css";

export function ExperienceTicket({ isFlipped }) {
    return (
        <div className="experience-ticket">
            <div className="ticket-content">
                <div className="title">
                    <p>Previous Experience</p>
                    <p>& Education</p>
                </div>
                
                <div className="divider">
                    <p>_______________________________</p>
                </div>
                
                <div className="metadata">
                    <div className="job-info">
                        <p>User Interface Designer</p>
                        <p>— @ Idea Couture Inc.</p>
                        <p>/Cognizant</p>
                    </div>
                    <div className="year-info">
                        <p>2021</p>
                        <p>— 2017</p>
                    </div>
                </div>
                
                <div className="metadata">
                    <div className="job-info">
                        <p>Service Designer</p>
                        <p>— @ CAPPA Global</p>
                        <p>/Tamayo Capital</p>
                    </div>
                    <div className="year-info">
                        <p>2021</p>
                    </div>
                </div>
                
                <div className="metadata">
                    <div className="job-info">
                        <p>Graphic Designer</p>
                        <p>/Art Director</p>
                        <p>— @ WRKR®</p>
                    </div>
                    <div className="year-info">
                        <p>2021</p>
                        <p>-2017</p>
                    </div>
                </div>
                
                <div className="metadata">
                    <div className="job-info">
                        <p>Graphic Designer</p>
                        <p>— @ Vinoteca méxico</p>
                    </div>
                    <div className="year-info">
                        <p>2021</p>
                        <p>-2017</p>
                    </div>
                </div>
                
                <div className="divider">
                    <p>*******</p>
                </div>
                
                <div className="metadata">
                    <div className="job-info">
                        <p>Bachelor's Degree in Industrial and Product Design</p>
                        <p>— @ Universidad Autónoma de Nuevo León</p>
                    </div>
                </div>
                
                <div className="metadata">
                    <div className="job-info">
                        <p>Master in Design Thinking and</p>
                        <p>UX/UI Design</p>
                        <p>— @ Barreira Arte + Diseño</p>
                    </div>
                </div>
                
                <div className="divider">
                    <p>*******</p>
                </div>
            </div>
        </div>
    );
}
