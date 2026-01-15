import React from 'react';

interface Investment {
    id: string;
    name: string;
    appliedValue: string;
    expectedReturn?: string;
    totalReturn?: string;
    endDate: string;
    status: 'Ativo' | 'Finalizado';
    progress: number;
    stateLabel: string;
    resumedDate?: string;
}

interface Props {
    onNavigate: (page: any) => void;
}

const HistoricoFundos: React.FC<Props> = ({ onNavigate }) => {
    const investments: Investment[] = [
        {
            id: '1',
            name: 'Alpha Fund',
            appliedValue: 'Kz 450.000,00',
            expectedReturn: 'Kz 33.300,00',
            endDate: '12 Jan 2025',
            status: 'Ativo',
            progress: 50,
            stateLabel: 'Em curso'
        },
        {
            id: '2',
            name: 'Secure Liquidity',
            appliedValue: 'Kz 250.000,00',
            expectedReturn: 'Kz 10.500,00',
            endDate: '28 Out 2024',
            status: 'Ativo',
            progress: 85,
            stateLabel: 'Quase concluído'
        },
        {
            id: '3',
            name: 'ESG Growth',
            appliedValue: 'Kz 145.200,00',
            totalReturn: 'Kz 12.800,00',
            endDate: '15 Set 2024',
            status: 'Finalizado',
            progress: 100,
            stateLabel: 'Concluído',
            resumedDate: 'Resgatado em 16 Set 2024'
        }
    ];

    return (
        <div className="bg-white text-gray-900 pb-32 font-display min-h-screen">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
                <div className="flex items-center p-4 pb-2 justify-between">
                    <button
                        onClick={() => onNavigate('investimentos-fundo')}
                        className="text-gray-900 flex size-12 shrink-0 items-center justify-start cursor-pointer hover:opacity-70 transition-opacity"
                    >
                        <span className="material-symbols-outlined text-[24px]">arrow_back</span>
                    </button>
                    <h2 className="text-gray-900 text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-4">
                        Histórico de Fundos
                    </h2>
                    <div className="flex w-12 items-center justify-end">
                        <button className="flex size-12 cursor-pointer items-center justify-center rounded-lg bg-transparent text-gray-900 hover:bg-gray-100 transition-colors">
                            <span className="material-symbols-outlined text-2xl">download</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero Card */}
            <div className="p-4">
                <div className="flex flex-col items-stretch justify-start rounded-2xl bg-gray-50 border border-gray-100 p-6 relative overflow-hidden">
                    <div className="flex flex-col gap-1 z-10">
                        <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Património em Fundos</p>
                        <h1 className="text-black text-3xl font-extrabold leading-tight py-1">Kz 845.200,00</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-sm font-bold">
                                <span className="material-symbols-outlined text-sm mr-1">trending_up</span>
                                +5,2% total
                            </div>
                            <p className="text-gray-400 text-xs font-semibold">Rendimentos: Kz 41.600,00</p>
                        </div>
                    </div>
                    <div className="absolute right-[-10px] bottom-[-10px] opacity-10 pointer-events-none">
                        <span className="material-symbols-outlined text-[120px] text-primary">analytics</span>
                    </div>
                </div>
            </div>

            <section className="px-4">
                <div className="flex items-center justify-between py-2">
                    <h2 className="text-gray-900 text-[18px] font-bold leading-tight tracking-[-0.015em]">Investimentos Ativos</h2>
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                        <span className="material-symbols-outlined text-xl">tune</span>
                    </button>
                </div>

                <div className="flex flex-col gap-4 mt-2">
                    {investments.map((inv) => (
                        <div key={inv.id} className="flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="p-4 flex gap-4">
                                <div className="flex-shrink-0">
                                    <div
                                        className={`size-14 rounded-full flex items-center justify-center relative`}
                                        style={{
                                            background: `radial-gradient(closest-side, white 79%, transparent 80% 100%), conic-gradient(${inv.status === 'Finalizado' ? '#10b981' : '#f4c025'} ${inv.progress}%, #f3f4f6 0)`
                                        }}
                                    >
                                        {inv.status === 'Finalizado' ? (
                                            <span className="material-symbols-outlined text-green-600 text-2xl">check_circle</span>
                                        ) : (
                                            <span className="text-[12px] font-extrabold text-gray-900">{inv.progress}%</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1 flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-black font-bold text-base">{inv.name}</h4>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${inv.status === 'Finalizado' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                                            }`}>
                                            {inv.status}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                                        <div>
                                            <p className="text-gray-400 text-[9px] uppercase font-bold tracking-wider">Valor Aplicado</p>
                                            <p className="text-gray-900 font-extrabold text-xs">{inv.appliedValue}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-gray-400 text-[9px] uppercase font-bold tracking-wider">
                                                {inv.status === 'Finalizado' ? 'Rend. Total' : 'Rend. Esperado'}
                                            </p>
                                            <p className="text-green-600 font-extrabold text-xs">{inv.totalReturn || inv.expectedReturn}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-[9px] uppercase font-bold tracking-wider">Data de Término</p>
                                            <p className="text-gray-900 font-medium text-xs">{inv.endDate}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-gray-400 text-[9px] uppercase font-bold tracking-wider">Estado</p>
                                            <p className={`${inv.status === 'Finalizado' ? 'text-green-600' : 'text-gray-900'} font-bold text-xs`}>
                                                {inv.stateLabel}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={`flex ${inv.resumedDate ? 'justify-between' : 'justify-end'} items-center p-2 bg-gray-50 border-t border-gray-100`}>
                                {inv.resumedDate && (
                                    <span className="text-gray-400 text-[10px] px-2 font-medium">{inv.resumedDate}</span>
                                )}
                                <button className={`px-6 py-1.5 rounded-lg text-xs font-bold shadow-sm active:scale-95 transition-all ${inv.status === 'Finalizado' ? 'bg-gray-200 text-gray-700' : 'bg-primary text-black'
                                    }`}>
                                    {inv.status === 'Finalizado' ? 'Recibo' : 'Gerir'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 mb-6 p-8 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
                    <span className="material-symbols-outlined text-gray-300 text-5xl mb-3">add_circle</span>
                    <p className="text-gray-500 text-sm font-semibold">Deseja diversificar mais?</p>
                    <button
                        onClick={() => onNavigate('investimentos-fundo')}
                        className="mt-2 text-primary font-bold text-sm hover:underline"
                    >
                        Explorar novos fundos
                    </button>
                </div>
            </section>


        </div>
    );
};

export default HistoricoFundos;
