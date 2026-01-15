import React, { useState, useRef, useEffect } from 'react';

interface Step {
  title: string;
  description: string;
  icon: string;
  content?: React.ReactNode;
}

interface TutorialSliderProps {
  steps: Step[];
  onFinish?: () => void;
  finishText?: string;
}

const TutorialSlider: React.FC<TutorialSliderProps> = ({ steps, onFinish, finishText = "Concluir" }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const goToStep = (index: number) => {
    if (index >= 0 && index < steps.length) {
      setCurrentStep(index);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else if (onFinish) {
      onFinish();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Touch handling
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      nextStep();
    }
    if (touchStartX.current - touchEndX.current < -50) {
      prevStep();
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Progress Dots */}
      <div className="flex justify-center gap-2 mb-8">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              currentStep === i ? 'w-8 bg-primary' : 'w-1.5 bg-white/20'
            }`}
          />
        ))}
      </div>

      {/* Slider Content */}
      <div 
        ref={containerRef}
        className="relative overflow-hidden w-full min-h-[320px]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentStep * 100}%)` }}
        >
          {steps.map((step, index) => (
            <div key={index} className="w-full shrink-0 px-1">
              <div className="flex flex-col items-center text-center animate-fade-in">
                <div className="flex items-center justify-center size-16 rounded-3xl bg-primary/10 mb-6 border border-primary/20">
                  <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {step.icon}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-black mb-3 tracking-tight italic">
                  {index + 1}. {step.title}
                </h3>
                <p className="text-[#bab59c] text-sm leading-relaxed mb-6 px-4">
                  {step.description}
                </p>
                {step.content && (
                  <div className="w-full mt-2">
                    {step.content}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4 mt-8">
        {currentStep > 0 ? (
          <button
            onClick={prevStep}
            className="flex-1 flex h-12 items-center justify-center rounded-xl bg-surface-dark border border-gray-200 text-black font-bold transition-all active:scale-95"
          >
            Anterior
          </button>
        ) : (
          <div className="flex-1" />
        )}
        <button
          onClick={nextStep}
          className="flex-1 flex h-12 items-center justify-center rounded-xl bg-primary text-black font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
        >
          {currentStep === steps.length - 1 ? finishText : 'Próximo'}
        </button>
      </div>
    </div>
  );
};

export default TutorialSlider;
