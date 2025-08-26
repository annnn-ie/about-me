import React from "react";

export function ExperienceTicket() {
  return (
    <div className="bg-gradient-to-b from-neutral-200 to-neutral-300 relative w-full h-full flex items-center justify-center">
      <div className="bg-neutral-50 px-4 py-8 md:px-6 md:py-16 flex flex-col gap-4 md:gap-6 items-center justify-center w-full md:w-[372px] max-w-[90%] box-border font-mono text-sm md:text-base leading-none uppercase tracking-[-0.32px] text-neutral-900">
        <div className="text-center w-full">
          <p className="mb-0">Previous Experience</p>
          <p>& Education</p>
        </div>
        
        <div className="text-center w-full">
          <p className="leading-none">________________________________</p>
        </div>
        
        <div className="flex gap-2 items-start justify-center w-full leading-none">
          <div className="flex-1 text-left">
            <p>
              User Interface Designer
              <br />
              — @ Idea Couture Inc.
            </p>
            <p>/Cognizant</p>
          </div>
          <div className="text-right w-[60px] md:w-[72px] flex-shrink-0">
            <p>2021</p>
            <p>— 2017</p>
          </div>
        </div>
        
        <div className="flex gap-2 items-start justify-center w-full leading-none">
          <div className="flex-1 text-left">
            <p>Service Designer</p>
            <p>— @ CAPPA Global</p>
            <p>/Tamayo Capital</p>
          </div>
          <div className="text-right w-[60px] md:w-[72px] flex-shrink-0">
            <p>2021</p>
          </div>
        </div>
        
        <div className="flex gap-2 items-start justify-center w-full leading-none">
          <div className="flex-1 text-left">
            <p>Graphic Designer</p>
            <p>/Art Director</p>
            <p>— @ WRKR®</p>
          </div>
          <div className="text-right w-[60px] md:w-[72px] flex-shrink-0">
            <p>2021</p>
            <p>-2017</p>
          </div>
        </div>
        
        <div className="flex gap-2 items-start justify-center w-full leading-none">
          <div className="flex-1 text-left">
            <p>
              Graphic Designer
              <br />
              — @ Vinoteca méxico
            </p>
          </div>
          <div className="text-right w-[60px] md:w-[72px] flex-shrink-0">
            <p>2021</p>
            <p>-2017</p>
          </div>
        </div>
        
        <div className="text-center w-full">
          <p className="leading-none">*******</p>
        </div>
        
        <div className="flex gap-2 items-start justify-center w-full leading-none">
          <div className="flex-1 text-left">
            <p>Bachelor's Degree in Industrial and Product Design</p>
            <p>— @ Universidad Autónoma de Nuevo León</p>
          </div>
        </div>
        
        <div className="flex gap-2 items-start justify-center w-full leading-none">
          <div className="flex-1 text-left">
            <p>Master in Design Thinking and</p>
            <p>UX/UI Design</p>
            <p>— @ Barreira Arte + Diseño</p>
          </div>
        </div>
        
        <div className="text-center w-full">
          <p className="leading-none">*******</p>
        </div>
      </div>
    </div>
  );
}
