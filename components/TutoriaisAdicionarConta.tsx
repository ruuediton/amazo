import React, { useState, useEffect, useRef } from 'react';

interface Props {
    onNavigate: (page: string) => void;
}

const TutoriaisAdicionarConta: React.FC<Props> = ({ onNavigate }) => {
    const [isAtBottom, setIsAtBottom] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
            const nearBottom = scrollTop + clientHeight >= scrollHeight - 50;
            setIsAtBottom(nearBottom);
        }
    };

    useEffect(() => {
        const current = scrollRef.current;
        if (current) {
            current.addEventListener('scroll', handleScroll);
            handleScroll();
        }
        return () => current?.removeEventListener('scroll', handleScroll);
    }, []);

    const steps = [
        {
            title: 'Selecione seu Banco',
            description: 'Escolha seu banco na lista de parceiros suportados para garantir o processamento correto.',
            icon: 'account_balance'
        },
        {
            title: 'Preencha os Dados',
            description: 'Insira o número da conta e o nome do titular. Os dados devem ser idênticos aos do seu registo bancário.',
            icon: 'edit_square'
        },
        {
            title: 'Revise e Guarde',
            description: 'Confirme todas as informações. Dados incorretos podem atrasar a liquidação do seu saldo.',
            icon: 'verified'
        }
    ];

    return (
        <div className="fixed inset-0 z-[9999] bg-white font-sans text-black flex flex-col">
            <header className="sticky top-0 z-50 bg-white p-4 border-b border-gray-100 flex items-center justify-between">
                <button
                    onClick={() => onNavigate('tutorials')}
                    className="flex size-10 items-center justify-center rounded-full text-[#00C853] hover:bg-gray-50 transition-colors"
                >
                    <span className="material-symbols-outlined text-[28px]">chevron_left</span>
                </button>
                <h1 className="text-base font-bold text-center flex-1 tracking-tight">Vincular Conta</h1>
                <div className="size-10"></div>
            </header>

            <main
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 pb-32 no-scrollbar"
            >
                <div className="max-w-md mx-auto space-y-8">
                    <div className="flex items-center gap-4 bg-gray-50 p-5 rounded-[32px] border border-gray-100">
                        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white text-[#00C853] shadow-sm shrink-0 border border-gray-100">
                            <span className="material-symbols-outlined text-[28px]">credit_card</span>
                        </div>
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Configuração</span>
                            <h2 className="text-lg font-black leading-tight text-[#111] mt-0.5">
                                Dados Bancários
                            </h2>
                        </div>
                    </div>

                    <div className="relative pl-6 space-y-10">
                        <div className="absolute left-[7px] top-4 bottom-4 w-0.5 bg-gray-100"></div>

                        {steps.map((step, idx) => (
                            <div key={idx} className="relative">
                                <div className="absolute -left-[24px] top-0 flex size-4 items-center justify-center rounded-full bg-white border-2 border-[#00C853] z-10 shadow-sm"></div>
                                <div className="pb-2">
                                    <h3 className="text-base font-black text-[#111] mb-1">{step.title}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed font-medium">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-gray-50 p-6 rounded-[32px] border border-gray-100 flex gap-3">
                        <span className="material-symbols-outlined text-[#00C853] text-[20px] shrink-0">shield_lock</span>
                        <p className="text-[12px] text-gray-400 font-medium leading-relaxed italic">
                            Suas informações bancárias são protegidas por criptografia e utilizadas apenas para o processamento de saques na BP Angola.
                        </p>
                    </div>
                </div>
            </main>

            <div className={`fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 z-50 transition-all duration-500 ${isAtBottom ? 'translate-y-0 opacity-100 visible' : 'translate-y-12 opacity-0 invisible'}`}>
                <button
                    onClick={() => onNavigate('add-bank')}
                    className="w-full h-12 bg-[#00C853] text-black font-black rounded-xl shadow-xl shadow-green-500/10 active:scale-[0.98] transition-all text-[14px] flex items-center justify-center gap-2"
                >
                    <span className="material-symbols-outlined text-[20px]">add_circle</span>
                    <span>Vincular Agora</span>
                </button>
            </div>
        </div>
    );
};

export default TutoriaisAdicionarConta;
