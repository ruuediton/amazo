import React from 'react';

interface Props {
    onNavigate: (page: any) => void;
    onOpenSupport?: () => void;
}

const ComoRetirarFundos: React.FC<Props> = ({ onNavigate, onOpenSupport }) => {
    const steps = [
        {
            step: 1,
            title: "Acesse a Carteira",
            description: "Vá para o saldo da sua conta no painel principal e toque no botão de retirada.",
            icon: "account_balance_wallet"
        },
        {
            step: 2,
            title: "Escolha o Método",
            description: "Escolha Transferência Bancária para bancos locais ou Saque com Agente.",
            icon: "payments"
        },
        {
            step: 3,
            title: "Confirme",
            description: "Insira seu PIN de segurança para autorizar a transação e finalizar o saque.",
            icon: "verified_user"
        }
    ];

    return (
        <div className="fixed inset-0 z-[9999] bg-white font-sans text-black overflow-y-auto">
            <div className="flex flex-col min-h-screen max-w-md mx-auto">
                {/* Header */}
                <header className="sticky top-0 z-10 bg-white p-4 border-b border-gray-100 flex items-center justify-between">
                    <button
                        onClick={() => onNavigate('tutorials')}
                        className="flex size-10 items-center justify-center rounded-full text-[#00C853] hover:bg-gray-50 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[28px]">chevron_left</span>
                    </button>
                    <h2 className="text-base font-bold">Como Retirar Fundos</h2>
                    <button
                        onClick={() => onOpenSupport?.()}
                        className="flex size-10 items-center justify-center rounded-full text-gray-400 hover:bg-gray-50 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[20px]">help</span>
                    </button>
                </header>

                {/* Content */}
                <div className="flex-1 p-6 pb-32 space-y-8">
                    <div className="text-center mb-8">
                        <div className="inline-flex mb-4 p-4 rounded-full bg-green-50 text-[#00C853]">
                            <span className="material-symbols-outlined text-[32px]">savings</span>
                        </div>
                        <h1 className="text-2xl font-black text-[#0F1111] mb-2 leading-tight">
                            Retire seus Kz em <span className="text-[#00C853]">3 passos</span>
                        </h1>
                        <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-[280px] mx-auto">
                            Siga este guia rápido para transferir seu dinheiro em segurança.
                        </p>
                    </div>

                    <div className="space-y-6 relative ml-4">
                        <div className="absolute left-[19px] top-6 bottom-6 w-0.5 bg-gray-100 -z-10"></div>

                        {steps.map((item, index) => (
                            <div key={index} className="flex gap-5 group">
                                <div className="shrink-0 size-10 rounded-full bg-white border-2 border-[#00C853] flex items-center justify-center text-[#00C853] font-bold text-sm shadow-sm group-hover:scale-110 transition-transform bg-white z-10">
                                    {item.step}
                                </div>
                                <div className="flex-1 pt-1 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                                    <h3 className="text-lg font-bold text-[#0F1111] mb-1">{item.title}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed font-medium">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pro Tip */}
                    <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100 flex gap-4 mt-8">
                        <div className="bg-orange-100 text-orange-600 p-2 rounded-xl h-fit">
                            <span className="material-symbols-outlined text-[20px]">lightbulb</span>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-orange-800 uppercase tracking-wide mb-1">Dica Profissional</p>
                            <p className="text-xs text-orange-700 leading-relaxed font-medium">
                                Verifique os limites diários de retirada em Kz para evitar atrasos na sua transferência.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white border-t border-gray-100 z-20">
                    <button
                        onClick={() => onNavigate('retirada')}
                        className="w-full flex items-center justify-center gap-2 h-14 bg-[#00C853] hover:brightness-110 active:scale-[0.98] text-white font-bold rounded-2xl shadow-lg shadow-green-200 transition-all text-base"
                    >
                        <span>Iniciar Retirada</span>
                        <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ComoRetirarFundos;
