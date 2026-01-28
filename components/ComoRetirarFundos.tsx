import React, { useState, useEffect, useRef } from 'react';

interface Props {
    onNavigate: (page: any) => void;
    onOpenSupport?: () => void;
}

const ComoRetirarFundos: React.FC<Props> = ({ onNavigate, onOpenSupport }) => {
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
            title: "Acesse a Carteira",
            description: "No painel principal, toque no resumo da conta e escolha a opção de retirada.",
            icon: "account_balance_wallet"
        },
        {
            title: "Dados Bancários",
            description: "Certifique-se de que a sua conta está vinculada corretamente para o processamento.",
            icon: "payments"
        },
        {
            title: "PIN de Segurança",
            description: "Insira seu código de segurança para autorizar e finalizar o pedido de saque.",
            icon: "verified_user"
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
                <h2 className="text-base font-bold text-center flex-1">Retirada BP</h2>
                <div className="size-10"></div>
            </header>

            <main
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 pb-32 no-scrollbar"
            >
                <div className="max-w-md mx-auto space-y-8">
                    <div className="text-center mb-8">
                        <div className="inline-flex mb-4 p-4 rounded-[24px] bg-gray-50 border border-gray-100 text-[#00C853]">
                            <span className="material-symbols-outlined text-[32px]">savings</span>
                        </div>
                        <h1 className="text-2xl font-black text-[#111] mb-2 leading-tight">
                            Saque em <span className="text-[#00C853]">3 Passos</span>
                        </h1>
                        <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-[280px] mx-auto">
                            Guia rápido para processar seu saldo com total segurança.
                        </p>
                    </div>

                    <div className="relative pl-6 space-y-10">
                        <div className="absolute left-[7px] top-4 bottom-4 w-0.5 bg-gray-100"></div>

                        {steps.map((item, index) => (
                            <div key={index} className="relative">
                                <div className="absolute -left-[24px] top-0 flex size-4 items-center justify-center rounded-full bg-white border-2 border-[#00C853] z-10 shadow-sm"></div>
                                <div className="pb-2">
                                    <h3 className="text-base font-black text-[#111] mb-1">{item.title}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed font-medium">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-gray-50 p-6 rounded-[32px] border border-gray-100 italic text-[12px] text-gray-400 font-medium">
                        Nota: Verifique os horários de processamento (10:00 - 16:00 Luanda) para garantir agilidade no seu pedido.
                    </div>
                </div>
            </main>

            <div className={`fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 z-50 transition-all duration-500 ${isAtBottom ? 'translate-y-0 opacity-100 visible' : 'translate-y-12 opacity-0 invisible'}`}>
                <button
                    onClick={() => onNavigate('retirada')}
                    className="w-full flex h-12 cursor-pointer items-center justify-center rounded-xl bg-[#00C853] text-black gap-2 text-[14px] font-black shadow-xl shadow-green-500/10 hover:brightness-105 active:scale-[0.98] transition-all"
                >
                    <span>Iniciar Saque</span>
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </button>
            </div>
        </div>
    );
};

export default ComoRetirarFundos;
