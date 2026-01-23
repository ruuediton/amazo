import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import SpokeSpinner from '../components/SpokeSpinner';
import { jsPDF } from 'jspdf';


interface Investment {
    id_usuario_fundo: string;
    id_fundo: string;
    valor_aplicado: number;
    retorno_calculado: number;
    data_inicio: string;
    data_termino: string;
    estado_ativo: boolean;
    taxa_retorno: number;
    fund?: {
        nome_fundo: string;
        taxa_retorno: number;
        url_imagem?: string;
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
            setLoading(true);
            try {
                // Optimization: Parallel execution
                await Promise.all([
                    finalizeMaturedFunds(),
                    fetchInvestments()
                ]);
            } catch (err) {
                console.error("Initialization error:", err);
            } finally {
                setLoading(false);
            }
        };
        initialize();
    }, []);

    const finalizeMaturedFunds = async () => {
        try {
            await supabase.rpc('process_matured_investments');
        } catch (err) {
            console.error('Error finalizing funds:', err);
        }
    };

    const fetchInvestments = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('usuario_fundos')
                .select('*, fund:fundos(nome_fundo, taxa_retorno, url_imagem)')
                .eq('id_usuario', user.id)
                .order('data_inicio', { ascending: false });

            if (error) throw error;

            const typedData = (data || []) as any[];
            setInvestments(typedData);

            // Calculate stats
            const applied = typedData.reduce((acc, curr) => acc + Number(curr.valor_aplicado), 0);
            const profit = typedData.reduce((acc, curr) => {
                if (!curr.estado_ativo) {
                    return acc + (Number(curr.retorno_calculado) - Number(curr.valor_aplicado));
                }
                return acc;
            }, 0);

            setStats({ totalApplied: applied, totalProfit: profit });

        } catch (err: any) {
            console.error('Error fetching investments:', err);
            if (showToast) showToast('Erro ao carregar seu histórico.', 'error');
        }
    };

    const calculateProgress = React.useCallback((startDate: string, endDate: string) => {
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();
        const now = new Date().getTime();

        if (now >= end) return 100;
        const total = end - start;
        const elapsed = now - start;
        const progress = Math.round((elapsed / total) * 100);
        return Math.max(0, Math.min(100, progress));
    }, []);

    const getStateLabel = React.useCallback((isActive: boolean, progress: number) => {
        if (!isActive) return 'Finalizado';
        if (progress >= 100) return 'Aguardando Liquidação';
        if (progress >= 80) return 'Próximo do Término';
        return 'Em Crescimento';
    }, []);

    const formatDate = React.useCallback((dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-AO', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    }, []);


    const generateCertificate = (investment: Investment) => {
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a5'
        });

        // Background
        doc.setFillColor(255, 255, 255);
        doc.rect(0, 0, 210, 148, 'F');

        // Border
        doc.setLineWidth(1);
        doc.setDrawColor(244, 209, 37); // Primary Color
        doc.rect(5, 5, 200, 138);

        // Header
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(22);
        doc.setTextColor(20, 20, 20); // Black
        doc.text('CERTIFICADO DE INVESTIMENTO', 105, 25, { align: 'center' });

        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text('AMAZON WEALTH MANAGEMENT', 105, 32, { align: 'center' });

        // Decorative Line
        doc.setDrawColor(200, 200, 200);
        doc.line(40, 38, 170, 38);

        // Content
        doc.setFontSize(12);
        doc.setTextColor(60, 60, 60);
        doc.text('Certificamos que o investimento foi realizado com sucesso.', 105, 50, { align: 'center' });

        // Details Box
        doc.setFillColor(250, 250, 250);
        doc.roundedRect(40, 60, 130, 50, 3, 3, 'F');

        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text(investment.fund?.nome_fundo || 'Fundo de Investimento', 105, 75, { align: 'center' });

        doc.setFontSize(30);
        doc.setTextColor(34, 197, 94); // Green
        doc.text(`Kz ${Number(investment.valor_aplicado).toLocaleString('pt-AO')}`, 105, 90, { align: 'center' });

        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Data de Aplicação: ${formatDate(investment.data_inicio)}`, 105, 102, { align: 'center' });

        // Footer
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`ID do Contrato: ${investment.id_usuario_fundo}`, 105, 130, { align: 'center' });
        doc.text('Este documento é um comprovante digital válido.', 105, 135, { align: 'center' });

        // Save
        doc.save(`Certificado_Amazon_${investment.id_usuario_fundo.slice(0, 8)}.pdf`);
        if (showToast) showToast('Certificado baixado com sucesso!', 'success');
    };

    return (
        <div className="bg-white text-gray-900 pb-32 font-display min-h-screen">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
                <div className="flex items-center p-4 pb-2 justify-between">
                    <button
                        onClick={() => onNavigate('investimentos-fundo')}
                        className="text-primary flex size-12 shrink-0 items-center justify-start cursor-pointer hover:opacity-70 transition-opacity"
                    >
                        <span className="material-symbols-outlined text-[24px]">arrow_back</span>
                    </button>
                    <h2 className="text-gray-900 text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-4">
                        Meus Contratos
                    </h2>
                    <div className="flex w-12 items-center justify-end">
                        <button className="flex size-12 cursor-pointer items-center justify-center rounded-lg bg-transparent text-gray-900 hover:bg-gray-100 transition-colors">
                            <span className="material-symbols-outlined text-2xl">analytics</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Stats Card */}
            <div className="p-4">
                <div className="flex flex-col items-stretch justify-start rounded-3xl bg-black border border-gray-800 p-6 relative overflow-hidden shadow-2xl">
                    <div className="flex flex-col gap-1 z-10">
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Volume Total Aplicado</p>
                        <h1 className="text-white text-3xl font-black italic tabular-nums py-1">
                            Kz {stats.totalApplied.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
                        </h1>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center bg-primary text-black px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">
                                <span className="material-symbols-outlined text-xs mr-1">trending_up</span>
                                Lucros Realizados: Kz {stats.totalProfit.toLocaleString('pt-AO')}
                            </div>
                        </div>
                    </div>
                    <div className="absolute right-[-20px] bottom-[-20px] opacity-20 pointer-events-none">
                        <span className="material-symbols-outlined text-[140px] text-primary">currency_exchange</span>
                    </div>
                </div>
            </div>

            <section className="px-4">
                <div className="flex items-center justify-between py-4">
                    <h2 className="text-black text-[18px] font-black tracking-tight">Ativos em Carteira</h2>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full">{investments.length} Ativos</span>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <SpokeSpinner size="w-10 h-10" />
                    </div>
                ) : (
                    <div className="flex flex-col gap-5 mt-2">
                        {investments.length > 0 ? (
                            investments.map((inv) => {
                                const progress = calculateProgress(inv.data_inicio, inv.data_termino);
                                const isFinalized = !inv.estado_ativo;

                                return (
                                    <div key={inv.id_usuario_fundo} className="flex flex-col bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                                        <div className="p-5 flex gap-5">
                                            <div className="flex-shrink-0">
                                                <div
                                                    className={`size-16 rounded-full flex items-center justify-center relative shadow-inner`}
                                                    style={{
                                                        background: `radial-gradient(closest-side, white 82%, transparent 83% 100%), conic-gradient(${isFinalized ? '#10b981' : '#f4c025'} ${progress}%, #f8fafc 0)`
                                                    }}
                                                >
                                                    {inv.fund?.url_imagem ? (
                                                        <img
                                                            src={inv.fund.url_imagem}
                                                            alt={inv.fund.nome_fundo}
                                                            className="w-full h-full object-cover rounded-full"
                                                        />
                                                    ) : isFinalized ? (
                                                        <span className="material-symbols-outlined text-green-600 text-3xl">task_alt</span>
                                                    ) : (
                                                        <span className="text-[13px] font-black text-black">{progress}%</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex-1 flex flex-col gap-4">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-black font-black text-base leading-tight">{inv.fund?.nome_fundo || 'Ativo Amazon'}</h4>
                                                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${isFinalized ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        <span className="size-1.5 rounded-full bg-current animate-pulse"></span>
                                                        {isFinalized ? 'Resgatado' : 'Operando'}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-y-4 gap-x-4">
                                                    <div>
                                                        <p className="text-gray-400 text-[8px] uppercase font-black tracking-[0.15em] mb-1">Capital Aplicado</p>
                                                        <p className="text-black font-black text-sm tabular-nums">Kz {Number(inv.valor_aplicado).toLocaleString('pt-AO')}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-gray-400 text-[8px] uppercase font-black tracking-[0.15em] mb-1">
                                                            Retorno {isFinalized ? 'Final' : 'Estimado'}
                                                        </p>
                                                        <p className="text-green-600 font-black text-sm tabular-nums">Kz {Number(inv.retorno_calculado).toLocaleString('pt-AO')}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-400 text-[8px] uppercase font-black tracking-[0.15em] mb-1">Data de Vencimento</p>
                                                        <p className="text-black font-bold text-xs">{formatDate(inv.data_termino)}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-gray-400 text-[8px] uppercase font-black tracking-[0.15em] mb-1">Status da Operação</p>
                                                        <p className={`${isFinalized ? 'text-green-600' : 'text-primary'} font-black text-[10px] uppercase tracking-tighter`}>
                                                            {getStateLabel(inv.estado_ativo, progress)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`flex ${isFinalized ? 'justify-between' : 'justify-end'} items-center p-3 px-5 bg-gray-50/50 border-t border-gray-100`}>
                                            {isFinalized && (
                                                <div className="flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-green-600 text-lg">check_circle</span>
                                                    <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Liquidado</span>
                                                </div>
                                            )}
                                            <button
                                                onClick={() => {
                                                    if (isFinalized) {
                                                        generateCertificate(inv);
                                                    } else {
                                                        showToast ? showToast('Contrato em custódia até o vencimento.', 'info') : null;
                                                    }
                                                }}
                                                className={`px-8 h-9 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] shadow-sm active:scale-95 transition-all ${isFinalized ? 'bg-gray-200 text-gray-700' : 'bg-primary text-black'
                                                    }`}>
                                                {isFinalized ? 'Recibo / Certificado' : 'Gerenciar'}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                                <span className="material-symbols-outlined text-6xl mb-4">inventory_2</span>
                                <p className="font-black text-xs uppercase tracking-widest">Nenhuma operação ativa</p>
                            </div>
                        )}
                    </div>
                )}

                <div className="mt-12 mb-10 p-10 rounded-[40px] bg-primary/5 border-2 border-dashed border-primary/20 flex flex-col items-center justify-center text-center">
                    <div className="size-16 rounded-full bg-white flex items-center justify-center shadow-lg mb-4">
                        <span className="material-symbols-outlined text-primary text-3xl">add</span>
                    </div>
                    <p className="text-black font-black text-sm uppercase tracking-widest mb-2">Novo Contrato</p>
                    <p className="text-gray-500 text-[11px] font-medium max-w-[200px] mb-6">Explore novos ativos e maximize seus rendimentos mensais.</p>
                    <button
                        onClick={() => onNavigate('investimentos-fundo')}
                        className="bg-black text-white px-8 h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-gray-900 transition-all"
                    >
                        EXPLORAR MERCADO
                    </button>
                </div>
            </section>
        </div>
    );
};

export default HistoricoFundos;
