import React, { useState } from 'react';

interface Props {
    onNavigate: (page: string) => void;
}

const TutoriaisAdicionarConta: React.FC<Props> = ({ onNavigate }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 3;

    const handleNext = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        } else {
            onNavigate('add-bank');
        }
    };

    const getStepContent = (step: number) => {
        switch (step) {
            case 1:
                return {
                    title: 'Selecione seu Banco',
                    description: 'Escolha seu banco na nossa lista de parceiros suportados em Angola para começar a integração segura.',
                    visual: (
                        <div className="relative w-full h-full flex items-center justify-center">
                            {/* Abstract Bank UI Representation */}
                            <div className="w-4/5 h-auto aspect-[1.6/1] bg-white rounded-xl border border-gray-100 p-4 flex flex-col gap-3 relative z-10 transform translate-y-2">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-xs opacity-50">search</span>
                                    </div>
                                    <div className="h-2 w-24 bg-gray-100 rounded-full"></div>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="aspect-square rounded bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center">
                                        <div className="w-4 h-4 rounded-full bg-red-400 opacity-80"></div>
                                    </div>
                                    <div className="aspect-square rounded bg-[#00C853]/10 border border-[#00C853] border-solid flex items-center justify-center relative">
                                        <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#00C853] rounded-full flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[8px] text-white font-bold">check</span>
                                        </div>
                                    </div>
                                    <div className="aspect-square rounded bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center">
                                        <div className="w-4 h-4 rounded-full bg-green-500 opacity-80"></div>
                                    </div>
                                </div>
                            </div>
                            {/* Floating Element */}
                            <div className="absolute -right-2 top-10 bg-[#00C853] text-white text-xs font-bold px-3 py-1.5 rounded-full z-20 animate-bounce">
                                Selecionar
                            </div>
                        </div>
                    )
                };
            case 2:
                return {
                    title: 'Preencha os Dados',
                    description: 'Insira o número da conta e o nome do titular com atenção. Os dados devem corresponder exatamente ao seu banco.',
                    visual: (
                        <div className="relative w-full h-full flex items-center justify-center">
                            <div className="w-4/5 bg-white rounded-xl border border-gray-100 p-5 flex flex-col gap-4 relative z-10">
                                <div className="space-y-2">
                                    <div className="h-2 w-1/3 bg-gray-200 rounded-full"></div>
                                    <div className="h-8 w-full bg-gray-50 border border-gray-100 rounded-lg"></div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-2 w-1/4 bg-gray-200 rounded-full"></div>
                                    <div className="h-8 w-full bg-gray-50 border border-gray-100 rounded-lg flex items-center px-2">
                                        <div className="w-full h-1.5 bg-gray-200 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -left-4 bottom-12 bg-gray-100 text-black text-xs font-bold px-3 py-1.5 rounded-full z-20 border border-gray-200">
                                <span className="material-symbols-outlined text-sm align-middle mr-1 text-[#00C853]">edit</span>
                                Editar
                            </div>
                        </div>
                    )
                };
            case 3:
                return {
                    title: 'Confirme e Salve',
                    description: 'Revise todas as informações. Se estiverem corretas, clique no botão abaixo para finalizar o vínculo.',
                    visual: (
                        <div className="relative w-full h-full flex items-center justify-center">
                            <div className="w-64 h-40 bg-white rounded-xl border border-gray-100 flex flex-col items-center justify-center gap-3 relative z-10">
                                <div className="size-16 rounded-full bg-green-500/10 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-3xl text-green-500">check_circle</span>
                                </div>
                                <div className="h-2 w-32 bg-gray-100 rounded-full"></div>
                            </div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center pointer-events-none">
                                <span className="absolute top-10 right-10 text-xl">✨</span>
                                <span className="absolute bottom-10 left-10 text-xl">🚀</span>
                            </div>
                        </div>
                    )
                };
            default:
                return { title: '', description: '', visual: null };
        }
    };

    const content = getStepContent(currentStep);

    return (
        <div className="fixed inset-0 z-[9999] bg-white font-sans text-black">
            {/* Main Container */}
            <div className="relative flex h-full min-h-screen w-full flex-col overflow-hidden max-w-md mx-auto bg-white">
                {/* Header */}
                <header className="flex items-center px-4 py-4 justify-between bg-white border-b border-gray-100 z-10">
                    <button
                        onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : onNavigate('tutorials')}
                        className="flex size-10 items-center justify-center rounded-full hover:bg-gray-50 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[#00C853]" style={{ fontSize: '28px' }}>chevron_left</span>
                    </button>
                    <h2 className="text-black text-lg font-bold leading-tight tracking-tight text-center">Adicionar Conta</h2>
                    <button onClick={() => onNavigate('add-bank')} className="flex items-center justify-end px-2">
                        <span className="text-gray-500 text-sm font-bold leading-normal tracking-[0.015em] hover:text-[#00C853] transition-colors">Pular</span>
                    </button>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 flex flex-col items-center justify-start px-6 pt-4 pb-8 overflow-y-auto">
                    {/* Progress Indicator */}
                    <div className="flex w-full flex-row items-center justify-center gap-2 mb-8">
                        {[1, 2, 3].map((step) => (
                            <div
                                key={step}
                                className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${step <= currentStep ? 'bg-[#00C853]' : 'bg-gray-200'
                                    }`}
                            ></div>
                        ))}
                    </div>

                    {/* Visual Content Card */}
                    <div className="w-full relative aspect-[4/3] mb-8 rounded-2xl overflow-hidden bg-white border border-gray-100 group transition-all duration-500">
                        {/* Decorative Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#00C853]/10 via-transparent to-transparent opacity-50"></div>

                        {/* Illustration Placeholder */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in duration-300" key={currentStep}>
                            {content.visual}
                        </div>
                    </div>

                    {/* Text Content */}
                    <div className="w-full flex flex-col items-center text-center gap-4 mb-auto animate-in slide-in-from-bottom-4 duration-300" key={`text-${currentStep}`}>
                        <h1 className="text-black tracking-tight text-[28px] font-black leading-tight">
                            {content.title}
                        </h1>
                        <p className="text-gray-600 text-base font-normal leading-relaxed max-w-[320px]">
                            {content.description}
                        </p>
                    </div>

                    {/* Security Badge */}
                    <div className="flex items-center justify-center gap-1.5 py-6 opacity-70">
                        <span className="material-symbols-outlined text-green-500 text-sm">lock</span>
                        <span className="text-xs font-medium text-gray-500">Criptografia de ponta a ponta</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="w-full flex flex-col gap-3 mt-4">
                        <button
                            onClick={handleNext}
                            className="w-full h-12 bg-[#00C853] hover:brightness-110 text-white font-bold text-base rounded-2xl flex items-center justify-center transition-all active:scale-[0.98]"
                        >
                            {currentStep === totalSteps ? 'Ir adicionar' : 'Próximo'}
                        </button>
                    </div>
                </main>

                {/* Bottom Safe Area Spacer */}
                <div className="h-6 w-full"></div>
            </div>
        </div>
    );
};

export default TutoriaisAdicionarConta;
