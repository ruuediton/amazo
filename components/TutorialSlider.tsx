import React, { useState } from 'react';

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

  return (
    <div className="flex flex-col w-full max-w-md mx-auto">
      <div className="flex justify-center gap-1.5 mb-6">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full transition-all duration-300 ${currentStep === i ? 'w-6 bg-[#00C853]' : 'w-1 bg-gray-200'
              }`}
          />
        ))}
      </div>

      <div className="relative overflow-hidden w-full min-h-[280px]">
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${currentStep * 100}%)` }}
        >
          {steps.map((step, index) => (
            <div key={index} className="w-full shrink-0 px-2">
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center size-14 rounded-2xl bg-gray-50 mb-5 border border-gray-100">
                  <span className="material-symbols-outlined text-[#00C853] text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {step.icon}
                  </span>
                </div>
                <h3 className="text-[17px] font-black text-[#111] mb-2 tracking-tight">
                  {index + 1}. {step.title}
                </h3>
                <p className="text-gray-400 text-[13px] leading-relaxed mb-6 px-2">
                  {step.description}
                </p>
                {step.content && (
                  <div className="w-full">
                    {step.content}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        {currentStep > 0 && (
          <button
            onClick={prevStep}
            className="flex-1 h-11 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-100 text-gray-400 font-bold text-sm active:scale-95 transition-all"
          >
            Anterior
          </button>
        )}
        <button
          onClick={nextStep}
          className="flex-1 h-11 flex items-center justify-center rounded-xl bg-[#00C853] text-black font-black text-sm shadow-lg shadow-green-500/5 active:scale-95 transition-all"
        >
          {currentStep === steps.length - 1 ? finishText : 'Próximo'}
        </button>
      </div>
    </div>
  );
};

export default TutorialSlider;
