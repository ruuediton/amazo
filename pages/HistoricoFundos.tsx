import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';

interface Investment {
    id: string;
    fund_id: string;
    applied_value: number;
    total_return: number;
    start_date: string;
    end_date: string;
    status: 'ativo' | 'concluído';
    created_at: string;
    fund?: {
        name: string;
        icon: string;
        profitability_pct: number;
    };
}

interface Props {
    onNavigate: (page: any) => void;
    showToast?: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

const HistoricoFundos: React.FC<Props> = ({ onNavigate, showToast }) => {
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ totalApplied: 0, totalProfit: 0 });

    useEffect(() => {
        const initialize = async () => {
            await finalizeMaturedFunds();
            await fetchInvestments();
        };
        initialize();
    }, []);

    const finalizeMaturedFunds = async () => {
        try {
            await supabase.rpc('check_and_finalize_funds');
        } catch (err) {
            console.error('Error finalizing funds:', err);
        }
    };

    const fetchInvestments = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('user_funds')
                .select('*, fund:funds(name, icon, profitability_pct)')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const typedData = (data || []) as any[];
            setInvestments(typedData);

            // Calculate stats
            const applied = typedData.reduce((acc, curr) => acc + curr.applied_value, 0);
            const profit = typedData.reduce((acc, curr) => acc + (curr.total_return - curr.applied_value), 0);
            setStats({ totalApplied: applied, totalProfit: profit });

        } catch (err: any) {
            console.error('Error fetching investments:', err);
            if (showToast) showToast('Erro ao carregar seu histórico.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const calculateProgress = (startDate: string, endDate: string) => {
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();
        const now = new Date().getTime();
        
        if (now >= end) return 100;
        const total = end - start;
        const elapsed = now - start;
        const progress = Math.round((elapsed / total) * 100);
        return Math.max(0, Math.min(100, progress));
    };

    const getStateLabel = (status: string, progress: number) => {
        if (status === 'concluído') return 'Concluído';
        if (progress >= 100) return 'Processando retorno...';
        if (progress >= 80) return 'Quase concluído';
        return 'Em curso';
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-AO', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

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
                        <h1 className="text-black text-3xl font-extrabold leading-tight py-1">
                            Kz {stats.totalApplied.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-sm font-bold">
                                <span className="material-symbols-outlined text-sm mr-1">trending_up</span>
                                +{((stats.totalProfit / (stats.totalApplied || 1)) * 100).toFixed(1)}% total
                            </div>
                            <p className="text-gray-400 text-xs font-semibold">Rendimentos: Kz {stats.totalProfit.toLocaleString('pt-AO')}</p>
                        </div>
                    </div>
                    <div className="absolute right-[-10px] bottom-[-10px] opacity-10 pointer-events-none">
                        <span className="material-symbols-outlined text-[120px] text-primary">analytics</span>
                    </div>
                </div>
            </div>

            <section className="px-4">
                <div className="flex items-center justify-between py-2">
                    <h2 className="text-gray-900 text-[18px] font-bold leading-tight tracking-[-0.015em]">Seus Investimentos</h2>
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                        <span className="material-symbols-outlined text-xl">tune</span>
                    </button>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="size-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 mt-2">
                        {investments.length > 0 ? (
                            investments.map((inv) => {
                                const progress = calculateProgress(inv.start_date, inv.end_date);
                                const isFinalized = inv.status === 'concluído';
                                
                                return (
                                    <div key={inv.id} className="flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                        <div className="p-4 flex gap-4">
                                            <div className="flex-shrink-0">
                                                <div
                                                    className={`size-14 rounded-full flex items-center justify-center relative`}
                                                    style={{
                                                        background: `radial-gradient(closest-side, white 79%, transparent 80% 100%), conic-gradient(${isFinalized ? '#10b981' : '#f4c025'} ${progress}%, #f3f4f6 0)`
                                                    }}
                                                >
                                                    {isFinalized ? (
                                                        <span className="material-symbols-outlined text-green-600 text-2xl">check_circle</span>
                                                    ) : (
                                                        <span className="text-[12px] font-extrabold text-gray-900">{progress}%</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex-1 flex flex-col gap-3">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-black font-bold text-base">{inv.fund?.name || 'Fundo Amazon'}</h4>
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${isFinalized ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                                                        }`}>
                                                        {isFinalized ? 'Finalizado' : 'Ativo'}
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                                                    <div>
                                                        <p className="text-gray-400 text-[9px] uppercase font-bold tracking-wider">Valor Aplicado</p>
                                                        <p className="text-gray-900 font-extrabold text-xs">Kz {inv.applied_value.toLocaleString('pt-AO')}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-gray-400 text-[9px] uppercase font-bold tracking-wider">
                                                            {isFinalized ? 'Lucro Obtido' : 'Rend. Esperado'}
                                                        </p>
                                                        <p className="text-green-600 font-extrabold text-xs">Kz {(inv.total_return - inv.applied_value).toLocaleString('pt-AO')}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-400 text-[9px] uppercase font-bold tracking-wider">Data de Término</p>
                                                        <p className="text-gray-900 font-medium text-xs">{formatDate(inv.end_date)}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-gray-400 text-[9px] uppercase font-bold tracking-wider">Estado</p>
                                                        <p className={`${isFinalized ? 'text-green-600' : 'text-gray-900'} font-bold text-xs`}>
                                                            {getStateLabel(inv.status, progress)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`flex ${isFinalized ? 'justify-between' : 'justify-end'} items-center p-2 bg-gray-50 border-t border-gray-100`}>
                                            {isFinalized && (
                                                <span className="text-gray-400 text-[10px] px-2 font-medium">Resgatado em {formatDate(inv.end_date)}</span>
                                            )}
                                            <button 
                                                onClick={() => showToast ? showToast(isFinalized ? 'Recibo gerado com sucesso!' : 'Gerenciamento do fundo em breve...', 'info') : null}
                                                className={`px-6 py-1.5 rounded-lg text-xs font-bold shadow-sm active:scale-95 transition-all ${isFinalized ? 'bg-gray-200 text-gray-700' : 'bg-primary text-black'
                                                }`}>
                                                {isFinalized ? 'Recibo' : 'Gerir'}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-10">
                                <p className="text-gray-400">Nenhum investimento encontrado.</p>
                            </div>
                        )}
                    </div>
                )}

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
