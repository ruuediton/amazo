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
                            <div className="w-4/5 h-auto aspect-[1.6/1] bg-white dark:bg-[#1a180e] rounded-xl border border-slate-100 dark:border-white/10 p-4 flex flex-col gap-3 relative z-10 transform translate-y-2">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-xs opacity-50">search</span>
                                    </div>
                                    <div className="h-2 w-24 bg-slate-100 dark:bg-white/10 rounded-full"></div>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="aspect-square rounded bg-slate-50 dark:bg-white/5 border border-dashed border-slate-200 dark:border-white/10 flex items-center justify-center">
                                        <div className="w-4 h-4 rounded-full bg-red-400 opacity-80"></div>
                                    </div>
                                    <div className="aspect-square rounded bg-primary/10 border border-primary border-solid flex items-center justify-center relative">
                                        <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[8px] text-black font-bold">check</span>
                                        </div>
                                    </div>
                                    <div className="aspect-square rounded bg-slate-50 dark:bg-white/5 border border-dashed border-slate-200 dark:border-white/10 flex items-center justify-center">
                                        <div className="w-4 h-4 rounded-full bg-green-500 opacity-80"></div>
                                    </div>
                                </div>
                            </div>
                            {/* Floating Element */}
                            <div className="absolute -right-2 top-10 bg-primary text-black text-xs font-bold px-3 py-1.5 rounded-full z-20 animate-bounce border border-black/10">
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
                            <div className="w-4/5 bg-white dark:bg-[#1a180e] rounded-xl border border-slate-100 dark:border-white/10 p-5 flex flex-col gap-4 relative z-10">
                                <div className="space-y-2">
                                    <div className="h-2 w-1/3 bg-slate-200 dark:bg-white/10 rounded-full"></div>
                                    <div className="h-8 w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-lg"></div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-2 w-1/4 bg-slate-200 dark:bg-white/10 rounded-full"></div>
                                    <div className="h-8 w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-lg flex items-center px-2">
                                        <div className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -left-4 bottom-12 bg-surface-dark text-black text-xs font-bold px-3 py-1.5 rounded-full z-20 border border-white/10">
                                <span className="material-symbols-outlined text-sm align-middle mr-1 text-primary">edit</span>
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
                            <div className="w-64 h-40 bg-white dark:bg-[#1a180e] rounded-xl border border-slate-100 dark:border-white/10 flex flex-col items-center justify-center gap-3 relative z-10">
                                <div className="size-16 rounded-full bg-green-500/10 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-3xl text-green-500">check_circle</span>
                                </div>
                                <div className="h-2 w-32 bg-slate-100 dark:bg-white/10 rounded-full"></div>
                            </div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center pointer-events-none">
                                <span className="absolute top-10 right-10 text-xl">âœ¨</span>
                                <span className="absolute bottom-10 left-10 text-xl">ðŸš€</span>
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
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-black transition-colors duration-200 min-h-screen flex flex-col">
            {/* Main Container */}
            <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto bg-background-light dark:bg-background-dark">
                {/* Header */}
                <header className="flex items-center px-4 py-4 justify-between bg-transparent z-10">
                    <button
                        onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : onNavigate('tutorials')}
                        className="flex size-10 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                    >
                        <span className="material-symbols-outlined text-primary" style={{ fontSize: '24px' }}>arrow_back</span>
                    </button>
                    <h2 className="text-slate-900 dark:text-black text-lg font-bold leading-tight tracking-[-0.015em] text-center">Adicionar Conta</h2>
                    <button onClick={() => onNavigate('add-bank')} className="flex items-center justify-end px-2">
                        <span className="text-text-secondary text-sm font-bold leading-normal tracking-[0.015em] hover:text-primary transition-colors">Pular</span>
                    </button>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 flex flex-col items-center justify-start px-6 pt-4 pb-8">
                    {/* Progress Indicator */}
                    <div className="flex w-full flex-row items-center justify-center gap-2 mb-8">
                        {[1, 2, 3].map((step) => (
                            <div
                                key={step}
                                className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${step <= currentStep ? 'bg-primary' : 'bg-slate-200 dark:bg-surface-dark'
                                    }`}
                            ></div>
                        ))}
                    </div>

                    {/* Visual Content Card */}
                    <div className="w-full relative aspect-[4/3] mb-8 rounded-2xl overflow-hidden bg-white dark:bg-surface-dark border border-slate-100 dark:border-gray-200 group transition-all duration-500">
                        {/* Decorative Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-50"></div>

                        {/* Illustration Placeholder */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in duration-300" key={currentStep}>
                            {content.visual}
                        </div>
                    </div>

                    {/* Text Content */}
                    <div className="w-full flex flex-col items-center text-center gap-4 mb-auto animate-in slide-in-from-bottom-4 duration-300" key={`text-${currentStep}`}>
                        <h1 className="text-slate-900 dark:text-black tracking-tight text-[28px] font-extrabold leading-tight">
                            {content.title}
                        </h1>
                        <p className="text-slate-600 dark:text-text-secondary text-base font-normal leading-relaxed max-w-[320px]">
                            {content.description}
                        </p>
                    </div>

                    {/* Security Badge */}
                    <div className="flex items-center justify-center gap-1.5 py-6 opacity-70">
                        <span className="material-symbols-outlined text-green-500 text-sm">lock</span>
                        <span className="text-xs font-medium text-slate-500 dark:text-text-secondary">Criptografia de ponta a ponta</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="w-full flex flex-col gap-3 mt-4">
                        <button
                            onClick={handleNext}
                            className="w-full h-12 bg-primary hover:bg-primary-dark text-background-dark font-bold text-base rounded-xl flex items-center justify-center transition-all active:scale-[0.98]"
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

