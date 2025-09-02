import React from "react";
import "./Receipt.css";

export function Receipt() {
  return (
    <div className="receipt">
      <div className="receipt-content">
        <div className="receipt-title">
          <p>Previous Experience</p>
          <p>& Education</p>
        </div>
        
        <div className="receipt-divider">
          <p>_____________________________</p>
        </div>
        
        <div className="receipt-section">
          <div className="receipt-info">
            <p>User Interface Designer</p>
            <p>— @ Idea Couture Inc. / Cognizant</p>
          </div>
          <div className="receipt-date">
            <p>2021</p>
            <p>— 2017</p>
          </div>
        </div>
        
        <div className="receipt-section">
          <div className="receipt-info">
            <p>Service Designer</p>
            <p>— @ CAPPA Global</p>
            <p>/Tamayo Capital</p>
          </div>
          <div className="receipt-date">
            <p>2021</p>
          </div>
        </div>
        
        <div className="receipt-section">
          <div className="receipt-info">
            <p>Graphic Designer</p>
            <p>/Art Director</p>
            <p>— @ WRKR®</p>
          </div>
          <div className="receipt-date">
            <p>2021</p>
            <p>-2017</p>
          </div>
        </div>
        
        <div className="receipt-section">
          <div className="receipt-info">
            <p>Graphic Designer</p>
            <p>— @ Vinoteca méxico</p>
          </div>
          <div className="receipt-date">
            <p>2021</p>
            <p>-2017</p>
          </div>
        </div>
        
        <div className="receipt-divider">
          <p>*******</p>
        </div>
        
        <div className="receipt-section">
          <div className="receipt-info">
            <p>Bachelor's Degree in Industrial and Product Design</p>
            <p>— @ Universidad Autónoma de Nuevo León</p>
          </div>
        </div>
        
        <div className="receipt-section">
          <div className="receipt-info">
            <p>Master in Design Thinking and UX/UI Design</p>
            <p>— @ Barreira Arte + Diseño</p>
          </div>
        </div>
        
        <div className="receipt-divider">
          <p>*******</p>
        </div>
        <div className="receipt-section">
          <div className="receipt-info">
            <p>THANK YOU FOR YOUR VISIT :-)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
