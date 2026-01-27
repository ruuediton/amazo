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
        return Math.max(0, Math.min(100, Math.round((elapsed / total) * 100)));
    }, []);

    const formatDate = React.useCallback((dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-AO', { day: '2-digit', month: 'short', year: 'numeric' });
    }, []);

    const formatPrice = (price: number) => {
        const [inteiro, centavos] = price.toFixed(2).split('.');
        return { inteiro, centavos };
    };

    const generateCertificate = (inv: Investment) => {
        const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a5' });
        doc.setFillColor(255, 255, 255);
        doc.rect(0, 0, 210, 148, 'F');
        doc.setLineWidth(1);
        doc.setDrawColor(255, 216, 20);
        doc.rect(5, 5, 200, 138);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(22);
        doc.setTextColor(15, 17, 17);
        doc.text('CERTIFICADO DE INVESTIMENTO', 105, 25, { align: 'center' });
        doc.setFontSize(10);
        doc.setTextColor(86, 89, 89);
        doc.text('BP Wealth MANAGEMENT', 105, 32, { align: 'center' });
        doc.setDrawColor(230, 230, 230);
        doc.line(40, 38, 170, 38);
        doc.setFontSize(12);
        doc.setTextColor(86, 89, 89);
        doc.text('Certificamos a aplicação bem-sucedida no fundo BP.', 105, 50, { align: 'center' });
        doc.setFillColor(243, 243, 243);
        doc.roundedRect(40, 60, 130, 50, 3, 3, 'F');
        doc.setFontSize(14);
        doc.setTextColor(15, 17, 17);
        doc.text(inv.fund?.nome_fundo || 'fundo BP', 105, 75, { align: 'center' });
        doc.setFontSize(30);
        doc.setTextColor(0, 118, 0);
        doc.text(`Kz ${Number(inv.valor_aplicado).toLocaleString('pt-AO')}`, 105, 90, { align: 'center' });
        doc.setFontSize(10);
        doc.setTextColor(86, 89, 89);
        doc.text(`Início: ${formatDate(inv.data_inicio)}`, 105, 102, { align: 'center' });
        doc.setFontSize(8);
        doc.text(`Contrato: ${inv.id_usuario_fundo}`, 105, 130, { align: 'center' });
        doc.save(`Certificado_BP_${inv.id_usuario_fundo.slice(0, 8)}.pdf`);
        showToast?.('Certificado gerado com sucesso!', 'success');
    };

    return (
        <div className="bg-white min-h-screen text-[#0F1111] font-sans selection:bg-amber-100 pb-32">
            <header className="sticky top-0 z-50 flex items-center bg-white border-b border-gray-100 px-4 py-4">
                <button
                    onClick={() => onNavigate('investimentos-fundo')}
                    className="size-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all active:scale-90"
                >
                    <span className="material-symbols-outlined text-[24px] text-[#0F1111]">arrow_back</span>
                </button>
                <h2 className="text-[#0F1111] text-[16px] font-bold flex-1 text-center pr-10">
                    Meus fundos
                </h2>
            </header>

            <main className="max-w-md mx-auto">
                <div className="p-6 bg-[#FFD814] border-b border-[#FCD200]">
                    <div className="space-y-1">
                        <p className="text-[11px] text-[#0F1111]/60 font-bold uppercase tracking-widest">Patrimônio em Fundo</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold">Kz</span>
                            <h1 className="text-3xl font-black tracking-tighter">
                                {stats.totalApplied.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
                            </h1>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="bg-white/30 px-2 py-0.5 rounded text-[11px] font-bold text-green-800">Lucros: +Kz {stats.totalProfit.toLocaleString('pt-AO')}</div>
                            <span className="text-[11px] text-[#0F1111]/50 font-medium">{investments.length} Contratos ativos</span>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-4">
                        <SpokeSpinner size="w-10 h-10" color="text-[#FFD814]" />
                    </div>
                ) : (
                    <div className="flex flex-col divide-y divide-gray-100 px-2">
                        {investments.length > 0 ? (
                            investments.map((inv) => {
                                const progress = calculateProgress(inv.data_inicio, inv.data_termino);
                                const isFinalized = !inv.estado_ativo;
                                const { inteiro, centavos } = formatPrice(Number(inv.valor_aplicado));

                                return (
                                    <div key={inv.id_usuario_fundo} className="flex gap-4 p-4 items-start active:bg-gray-50 transition-colors bg-white rounded-xl my-1 border border-transparent">
                                        <div className="relative w-28 h-28 bg-gray-50 rounded-xl overflow-hidden shrink-0 flex items-center justify-center border border-gray-100">
                                            {inv.fund?.url_imagem ? (
                                                <img src={inv.fund.url_imagem} alt={inv.fund.nome_fundo} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="flex flex-col items-center">
                                                    <span className={`material-symbols-outlined text-3xl ${isFinalized ? 'text-green-600' : 'text-amber-500'}`}>
                                                        {isFinalized ? 'verified' : 'analytics'}
                                                    </span>
                                                </div>
                                            )}
                                            {isFinalized && (
                                                <div className="absolute inset-0 bg-black/5 flex items-center justify-center backdrop-blur-[1px]">
                                                    <div className="bg-[#007600] text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase">Liquidado</div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0 flex flex-col gap-1">
                                            <div className="flex justify-between items-start">
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Iníc. {formatDate(inv.data_inicio)}</p>
                                                {inv.estado_ativo && <span className="text-[#e77600] font-black px-2 py-0.5 bg-amber-50 rounded text-[9px] uppercase tracking-tighter">Operando</span>}
                                            </div>

                                            <h3 className="text-[14px] font-black leading-tight line-clamp-1 text-[#0F1111] uppercase tracking-tighter mt-1">
                                                {inv.fund?.nome_fundo || 'fundo BP'}
                                            </h3>

                                            <div className="flex items-center gap-1.5">
                                                <span className="text-[10px] text-gray-400 font-medium">Contrato: #AMZ-{inv.id_usuario_fundo.toString().slice(0, 6)}</span>
                                            </div>

                                            <div className="flex items-baseline mt-1">
                                                <span className="text-[13px] font-bold text-[#0F1111] mr-1">Kz</span>
                                                <span className="text-[22px] font-black text-[#0F1111] leading-none">{inteiro}</span>
                                                <span className="text-[11px] font-bold text-[#0F1111] ml-0.5 uppercase">{centavos}</span>
                                            </div>

                                            <div className="mt-2 p-2 rounded-lg bg-gray-50/50 border border-gray-100 flex flex-col gap-0.5">
                                                <div className="flex justify-between items-center text-[10px]">
                                                    <span className="text-gray-400 font-bold uppercase tracking-tighter">Retorno Estimado:</span>
                                                    <span className="text-green-700 font-black tracking-tighter">Kz {Number(inv.retorno_calculado).toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-[10px]">
                                                    <span className="text-gray-400 font-bold uppercase tracking-tighter">Vencimento:</span>
                                                    <span className="text-[#0F1111] font-bold tracking-tighter">{formatDate(inv.data_termino)}</span>
                                                </div>
                                            </div>

                                            {isFinalized && (
                                                <button
                                                    onClick={() => generateCertificate(inv)}
                                                    className="mt-3 py-2 bg-white border border-gray-200 rounded-lg text-[11px] font-bold text-[#0F1111] hover:bg-gray-50 transition-all flex items-center justify-center gap-2 shadow-sm"
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">overview</span>
                                                    Baixar Recibo
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center px-10">
                                <span className="material-symbols-outlined text-gray-200 text-6xl mb-4">folder_open</span>
                                <h3 className="text-[#0F1111] font-bold text-lg mb-1">Nenhum contrato</h3>
                                <p className="text-[#565959] text-sm mb-8">Você ainda não possui aplicações em fundos de investimento.</p>
                                <button
                                    onClick={() => onNavigate('investimentos-fundo')}
                                    className="w-full py-3 bg-[#FFD814] hover:bg-[#F7CA00] rounded-full font-medium text-[14px] border border-[#FCD200]"
                                >
                                    Explorar Fundos
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default HistoricoFundos;

