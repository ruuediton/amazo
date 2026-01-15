import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabase';

interface Fundo {
    id_fundo: string;
    nome_fundo: string;
    descricao_fundo: string;
    taxa_retorno: number;
    beneficio: string;
    url_imagem: string;
    estado: boolean;
    data_disponivel: string;
    total_fundos_disponivel: number;
    duration_days: number;
}

interface Props {
    onNavigate: (page: any) => void;
    showToast?: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

const InvestimentosFundo: React.FC<Props> = ({ onNavigate, showToast }) => {
    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFund, setSelectedFund] = useState<Fundo | null>(null);
    const [funds, setFunds] = useState<Fundo[]>([]);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [investmentAmount, setInvestmentAmount] = useState<string>('');

    // Total of all active funds available
    const totalGlobalAvailable = useMemo(() => {
        return funds.reduce((acc, fund) => acc + (Number(fund.total_fundos_disponivel) || 0), 0);
    }, [funds]);

    // Real-time calculation
    const expectedReturn = useMemo(() => {
        if (!selectedFund || !investmentAmount || isNaN(Number(investmentAmount))) return 0;
        const amount = Number(investmentAmount);
        return amount + (amount * selectedFund.taxa_retorno / 100);
    }, [selectedFund, investmentAmount]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('fundos')
                .select('*')
                .eq('estado', true)
                .order('data_disponivel', { ascending: false });

            if (error) throw error;
            setFunds(data || []);
        } catch (err: any) {
            console.error('Error fetching funds:', err);
            if (showToast) showToast('Erro ao carregar dados dos fundos.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async () => {
        if (!selectedFund || !investmentAmount) return;
        const amountNum = Number(investmentAmount);

        if (isNaN(amountNum) || amountNum <= 0) {
            if (showToast) showToast('Por favor, insira um valor válido.', 'warning');
            return;
        }

        try {
            setApplying(true);

            const { data, error } = await supabase.rpc('invest_in_fund', {
                p_fund_id: selectedFund.id_fundo,
                p_amount: amountNum
            });

            if (error) throw error;

            if (data.success) {
                if (showToast) showToast(data.message, 'success');
                fetchData();
                setSelectedFund(null);
                setInvestmentAmount('');
                setTimeout(() => onNavigate('historico-fundos'), 2500);
            } else {
                if (showToast) showToast(data.message, 'warning');
            }
        } catch (err: any) {
            console.error('Error investing:', err);
            if (showToast) showToast('Falha na operação financeira. Tente novamente.', 'error');
        } finally {
            setApplying(false);
        }
    };

    const filteredFunds = funds.filter(fund =>
        fund.nome_fundo.toLowerCase().includes(searchQuery.toLowerCase()) &&
        fund.id_fundo !== selectedFund?.id_fundo
    );

    return (
        <div className="bg-white text-gray-900 pb-32 font-display min-h-screen">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
                <div className="flex items-center p-4 pb-2 justify-between">
                    {!isSearching ? (
                        <>
                            <button
                                onClick={() => onNavigate('profile')}
                                className="text-yellow-500 flex size-12 shrink-0 items-center justify-start cursor-pointer hover:opacity-70 transition-opacity"
                            >
                                <span className="material-symbols-outlined text-[24px]">arrow_back</span>
                            </button>
                            <h2 className="text-gray-900 text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-4">
                                Investimento em Fundos
                            </h2>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center gap-2 mr-2">
                            <button
                                onClick={() => {
                                    setIsSearching(false);
                                    setSearchQuery('');
                                }}
                                className="text-gray-500 flex items-center justify-center p-2"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                            <input
                                autoFocus
                                type="text"
                                placeholder="Pesquisar fundos..."
                                className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    )}
                    <div className="flex w-12 items-center justify-end">
                        <button
                            onClick={() => setIsSearching(!isSearching)}
                            className={`flex size-12 cursor-pointer items-center justify-center rounded-lg bg-transparent transition-colors ${isSearching ? 'text-primary' : 'text-gray-900'} hover:bg-gray-100`}
                        >
                            <span className="material-symbols-outlined text-2xl">search</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero Card: TOTAL DISPONÍVEL (Corrected to Global Funds Available) */}
            <div className="p-4">
                <div className="flex flex-col items-stretch justify-start rounded-2xl shadow-sm bg-gray-50 border border-gray-100 p-6 relative overflow-hidden">
                    <div className="flex flex-col gap-1 z-10">
                        <p className="text-gray-400 text-[11px] font-black uppercase tracking-[0.1em]">Total de fundos disponível aplicável</p>
                        <h1 className="text-black text-3xl font-black italic tabular-nums py-1">
                            Kz {totalGlobalAvailable.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                                <span className="material-symbols-outlined text-sm mr-1">campaign</span>
                                Oportunidade Ativa
                            </div>
                        </div>
                    </div>
                    <div className="absolute right-[-15px] bottom-[-15px] opacity-10 pointer-events-none">
                        <span className="material-symbols-outlined text-[130px] text-primary">pie_chart</span>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">Sincronizando Mercado...</p>
                </div>
            ) : (
                <>
                    {/* Featured Funds */}
                    <section>
                        <div className="flex items-center justify-between px-4 pb-1 pt-4">
                            <h2 className="text-gray-900 text-[20px] font-black tracking-tight underline decoration-primary decoration-4 underline-offset-4">Destaques da Semana</h2>
                        </div>
                        <div className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar pb-6 mt-4">
                            <div className="flex items-stretch px-4 gap-4">
                                {filteredFunds.length > 0 ? (
                                    filteredFunds.map((fund) => {
                                        const isExhausted = Number(fund.total_fundos_disponivel) <= 0;
                                        return (
                                            <div
                                                key={fund.id_fundo}
                                                className="snap-start flex-none flex h-full flex-col gap-3 rounded-2xl bg-white border border-gray-100 shadow-xl w-[280px] overflow-hidden transition-all duration-300 hover:border-primary/50"
                                            >
                                                <div
                                                    className="w-full bg-center bg-no-repeat aspect-[16/9] bg-cover relative"
                                                    style={{ backgroundImage: `url("${fund.url_imagem}")` }}
                                                >
                                                    {isExhausted && (
                                                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
                                                            <span className="bg-red-600 text-white px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl">ESGOTADO</span>
                                                        </div>
                                                    )}
                                                    <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur px-2 py-1 rounded-lg shadow-sm border border-gray-100">
                                                        <p className="text-[10px] font-black text-green-600">+{fund.taxa_retorno}%</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col flex-1 justify-between p-4 pt-0 gap-4">
                                                    <div className="mt-3">
                                                        <h3 className="text-black text-[17px] font-black leading-tight mb-1">{fund.nome_fundo}</h3>
                                                        <div className="flex flex-col gap-1.5 mt-2">
                                                            <p className="text-gray-400 text-[10px] font-bold uppercase flex items-center gap-1">
                                                                <span className="material-symbols-outlined text-[14px] text-primary">verified</span>
                                                                {fund.beneficio}
                                                            </p>
                                                            <div className="h-1 w-full bg-gray-100 rounded-full mt-1 overflow-hidden">
                                                                <div
                                                                    className="h-full bg-primary transition-all duration-1000"
                                                                    style={{ width: `${Math.min(100, (Number(fund.total_fundos_disponivel) / 1000000) * 100)}%` }}
                                                                ></div>
                                                            </div>
                                                            <p className="text-gray-500 text-[10px] font-bold mt-1">Disponível: <span className="text-black">Kz {Number(fund.total_fundos_disponivel).toLocaleString('pt-AO')}</span></p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedFund(fund);
                                                            setInvestmentAmount('');
                                                        }}
                                                        disabled={isExhausted}
                                                        className={`flex w-full cursor-pointer items-center justify-center rounded-xl h-12 px-4 shadow-md transition-all font-black text-xs uppercase tracking-widest ${isExhausted
                                                                ? 'bg-gray-50 text-gray-300 border border-gray-100'
                                                                : 'bg-primary text-black hover:bg-yellow-500 hover:shadow-primary/20 active:scale-95'
                                                            }`}
                                                    >
                                                        <span>{isExhausted ? 'Indisponível' : 'Aplicar Fundos'}</span>
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="w-[300px] h-48 flex flex-col items-center justify-center text-gray-300 border-2 border-dashed border-gray-100 rounded-3xl">
                                        <span className="material-symbols-outlined text-4xl mb-2">hourglass_empty</span>
                                        <p className="font-black text-[10px] uppercase tracking-widest">Sem fundos no momento</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Detailed Investment Area */}
                    {selectedFund && (
                        <section className="mt-6 px-4 animate-in fade-in slide-in-from-bottom-5 duration-500">
                            <div className="bg-white rounded-[32px] border border-gray-100 shadow-2xl p-6 overflow-hidden relative">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                                            <span className="material-symbols-outlined text-primary text-3xl">account_balance</span>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-black leading-tight">{selectedFund.nome_fundo}</h3>
                                            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-0.5">Painel de Aplicação</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedFund(null)}
                                        className="size-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-black transition-colors"
                                    >
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                </div>

                                {/* Info Grid */}
                                <div className="grid grid-cols-2 gap-3 mb-8">
                                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                        <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest mb-1.5 text-center">Taxa de Retorno</p>
                                        <p className="text-green-600 text-2xl font-black text-center">{selectedFund.taxa_retorno}%</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                        <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest mb-1.5 text-center">Liquidez do Fundo</p>
                                        <p className="text-black text-[13px] font-black text-center truncate italic">Kz {Number(selectedFund.total_fundos_disponivel).toLocaleString('pt-AO')}</p>
                                    </div>
                                </div>

                                {/* Investment Input Area */}
                                <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10 mb-8">
                                    <label className="text-black text-[11px] font-black uppercase tracking-widest mb-3 block text-center">Quanto deseja aplicar?</label>
                                    <div className="relative mt-2">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40 font-black text-lg">Kz</span>
                                        <input
                                            autoFocus
                                            type="number"
                                            placeholder="0.00"
                                            className="w-full h-16 bg-white border-2 border-transparent focus:border-primary rounded-2xl pl-12 pr-4 text-2xl font-black text-black outline-none transition-all shadow-inner"
                                            value={investmentAmount}
                                            onChange={(e) => setInvestmentAmount(e.target.value)}
                                        />
                                    </div>

                                    {/* Real-time Result */}
                                    <div className="mt-6 flex flex-col items-center">
                                        <span className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Retorno Esperado Após {selectedFund.duration_days} dias:</span>
                                        <p className="text-green-600 text-3xl font-black tabular-nums">
                                            Kz {expectedReturn.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-gray-50 p-4 rounded-2xl">
                                        <h4 className="text-[11px] font-black text-black mb-2 flex items-center gap-2 uppercase tracking-widest">
                                            <span className="material-symbols-outlined text-primary text-lg">description</span>
                                            Sobre a Operação
                                        </h4>
                                        <p className="text-gray-500 text-xs leading-relaxed font-medium">
                                            {selectedFund.descricao_fundo}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={handleApply}
                                    disabled={applying || !investmentAmount || Number(investmentAmount) <= 0}
                                    className="mt-8 w-full bg-black text-white rounded-2xl h-16 font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.02] active:scale-95 disabled:opacity-30 disabled:scale-100 transition-all flex items-center justify-center gap-3"
                                >
                                    {applying ? (
                                        <div className="size-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined">bolt</span>
                                            CONFIRMAR APLICAÇÃO
                                        </>
                                    )}
                                </button>

                                <p className="text-center text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-6 italic">
                                    O CAPITAL SERÁ RETORNADO AUTOMATICAMENTE AO SEU SALDO NO FINAL DO PERÍODO.
                                </p>
                            </div>
                        </section>
                    )}
                </>
            )}

            {/* Access History */}
            {!selectedFund && (
                <div className="fixed bottom-24 left-4 right-4 z-40">
                    <button
                        onClick={() => onNavigate('historico-fundos')}
                        className="w-full bg-white/80 backdrop-blur-md border border-gray-100 text-gray-600 rounded-2xl h-14 font-black text-[11px] uppercase tracking-widest hover:bg-gray-50 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-3"
                    >
                        <span className="material-symbols-outlined text-lg">history</span>
                        Ver meus Fundos ativos
                    </button>
                </div>
            )}

            {/* Bottom Nav Spacer */}
            <div className="h-40"></div>
        </div>
    );
};

export default InvestimentosFundo;
