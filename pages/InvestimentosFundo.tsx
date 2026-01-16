import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '../supabase';
import { useLoading } from '../contexts/LoadingContext';
import SpokeSpinner from '../components/SpokeSpinner';

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
  const [selectedFund, setSelectedFund] = useState<Fundo | null>(null);
  const [funds, setFunds] = useState<Fundo[]>([]);
  const { withLoading, showError } = useLoading();
  const [applying, setApplying] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState<string>('');

  const totalGlobalAvailable = useMemo(() => {
    return funds.reduce((acc, fund) => acc + (Number(fund.total_fundos_disponivel) || 0), 0);
  }, [funds]);

  const expectedReturn = useMemo(() => {
    if (!selectedFund || !investmentAmount) return 0;
    const amount = Number(investmentAmount);
    if (isNaN(amount)) return 0;
    const rate = selectedFund.taxa_retorno / 100;
    return amount * rate;
  }, [selectedFund, investmentAmount]);

  const filteredFunds = useMemo(() => {
    return funds; // Adicionar busca se necessário
  }, [funds]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await withLoading(async () => {
      const { data, error } = await supabase
        .from('fundos')
        .select('*')
        .eq('estado', true)
        .order('data_disponivel', { ascending: false });

      if (error) throw error;
      setFunds(data || []);
    });
  };

  const handleApply = async () => {
    if (!selectedFund || !investmentAmount) return;
    const amountNum = Number(investmentAmount);

    if (isNaN(amountNum) || amountNum < 100) {
      if (showToast) showToast('Valor mínimo de fundo 100 Kz.', 'warning');
      return;
    }

    setApplying(true);
    try {
      await withLoading(async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Não autenticado");

        // 1. Verificar saldo do usuário
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('balance')
          .eq('user_id', user.id)
          .single();

        if (profileError) throw profileError;

        if ((profile.balance || 0) < amountNum) {
          throw new Error("Saldo insuficiente, recarregue para aplica fundos.");
        }

        // 2. Criar registro de investimento
        const { error: investError } = await supabase
          .from('usuario_fundos')
          .insert({
            id_usuario: user.id,
            id_fundo: selectedFund.id_fundo,
            valor_aplicado: amountNum,
            taxa_retorno: selectedFund.taxa_retorno,
            retorno_calculado: amountNum + (amountNum * (selectedFund.taxa_retorno / 100)),
            data_termino: new Date(Date.now() + selectedFund.duration_days * 24 * 60 * 60 * 1000).toISOString(),
            estado_ativo: true
          });

        if (investError) throw investError;

        // 3. Deduzir do saldo
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ balance: (profile.balance || 0) - amountNum })
          .eq('user_id', user.id);

        if (updateError) throw updateError;
      }, "Fundos aplicado, sucesso!");

      // Reseta e atualiza após o sucesso
      setSelectedFund(null);
      setInvestmentAmount('');
      fetchData();
    } catch (err: any) {
      // feedback já tratado pelo withLoading/showError global
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="bg-background-dark min-h-screen font-display antialiased">
      {/* Header Area matching reference style */}
      <div className="relative h-[280px] w-full bg-amazon-dark overflow-hidden rounded-b-[60px] shadow-2xl">
        <div className="absolute top-10 left-6 z-10">
          <button
            onClick={() => onNavigate('home')}
            className="size-12 flex items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md text-white border border-white/20 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
        </div>

        <div className="absolute top-10 right-6 z-10 flex flex-col items-end">
          <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-1">Fundos Amazon</p>
          <div className="px-3 py-1 bg-green-500/20 rounded-full border border-green-500/30">
            <span className="text-green-400 text-[10px] font-bold">Mercado Aberto</span>
          </div>
        </div>

        <div className="absolute bottom-12 left-8 z-10">
          <h2 className="text-white/60 text-xs font-black uppercase tracking-[0.2em] mb-1">Capital Disponível</h2>
          <h1 className="text-white text-3xl font-black italic tabular-nums py-1">
            Kz {totalGlobalAvailable.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center bg-primary text-black px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider">
              <span className="material-symbols-outlined text-xs mr-1.5">trending_up</span>
              Oportunidades de Crescimento
            </div>
          </div>
        </div>
        <div className="absolute right-[-20px] bottom-[-20px] opacity-20 pointer-events-none">
          <span className="material-symbols-outlined text-[140px] text-primary">currency_exchange</span>
        </div>
      </div>

      <section className="overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar">
        <div className="flex items-stretch px-4 gap-4 pb-6 mt-6">
          {filteredFunds.length > 0 ? (
            filteredFunds.map((fund) => {
              const isExhausted = Number(fund.total_fundos_disponivel) <= 0;
              return (
                <div
                  key={fund.id_fundo}
                  className="snap-start flex-none flex h-full flex-col bg-white border border-gray-100 rounded-[32px] shadow-sm hover:shadow-xl transition-all duration-300 w-[285px] overflow-hidden"
                >
                  <div
                    className="w-full bg-center bg-no-repeat aspect-[16/9] bg-cover relative"
                    style={{ backgroundImage: `url("${fund.url_imagem}")` }}
                  >
                    {isExhausted && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
                        <span className="bg-red-600 text-white px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.2em]">ESGOTADO</span>
                      </div>
                    )}
                    <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur px-2.5 py-1.5 rounded-xl shadow-lg border border-gray-100">
                      <p className="text-[11px] font-black text-green-600">+{fund.taxa_retorno}%</p>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-black text-[16px] font-black leading-tight mb-3">{fund.nome_fundo}</h3>

                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <div className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
                          <span className="size-1 rounded-full bg-yellow-600"></span>
                          {fund.beneficio}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>
                          <p className="text-gray-400 text-[8px] uppercase font-black tracking-widest mb-0.5">Disponível</p>
                          <p className="text-black font-black text-[11px]">Kz {Number(fund.total_fundos_disponivel).toLocaleString('pt-AO')}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-400 text-[8px] uppercase font-black tracking-widest mb-0.5">Período</p>
                          <p className="text-black font-black text-[11px]">{fund.duration_days} DIAS</p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedFund(fund);
                          setInvestmentAmount('');
                        }}
                        disabled={isExhausted}
                        className={`mt-4 flex w-full h-11 items-center justify-center rounded-2xl shadow-sm transition-all font-black text-[10px] uppercase tracking-widest ${isExhausted
                          ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                          : 'bg-primary text-black hover:bg-primary active:scale-95'
                          }`}
                      >
                        <span>{isExhausted ? 'Indisponível' : 'Aplicar Fundos'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="w-full py-10 flex flex-col items-center justify-center text-gray-300 opacity-40">
              <span className="material-symbols-outlined text-5xl mb-2">inventory_2</span>
              <p className="font-black text-[10px] uppercase tracking-widest">Sem fundos no momento</p>
            </div>
          )}
        </div>
      </section>

      {/* Detailed Investment Area */}
      {selectedFund && (
        <section className="mt-8 px-4 animate-in fade-in slide-in-from-bottom-5 duration-500">
          <div className="bg-white rounded-[40px] border border-gray-100 shadow-2xl p-7 relative">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-black flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-2xl">account_balance</span>
                </div>
                <div>
                  <h3 className="text-lg font-black text-black leading-tight uppercase tracking-tight">{selectedFund.nome_fundo}</h3>
                  <p className="text-gray-400 text-[9px] font-black uppercase tracking-[0.2em] mt-0.5">Configuração de aporte</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedFund(null)}
                className="size-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-black transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="bg-gray-50/50 p-4 rounded-[20px] border border-gray-100 flex flex-col items-center">
                <p className="text-gray-400 text-[8px] font-black uppercase tracking-widest mb-1.5">TAXA ATUAL</p>
                <div className="flex items-center gap-1">
                  <span className="text-green-600 text-xl font-black">{selectedFund.taxa_retorno}%</span>
                  <span className="material-symbols-outlined text-green-600 text-sm">trending_up</span>
                </div>
              </div>
              <div className="bg-gray-50/50 p-4 rounded-[20px] border border-gray-100 flex flex-col items-center">
                <p className="text-gray-400 text-[8px] font-black uppercase tracking-widest mb-1.5">CAPACIDADE</p>
                <p className="text-black text-[12px] font-black truncate max-w-full">
                  Kz {Number(selectedFund.total_fundos_disponivel).toLocaleString('pt-AO')}
                </p>
              </div>
            </div>

            <div className="bg-primary/5 rounded-[32px] p-6 border-2 border-dashed border-primary/20 mb-8 relative">
              <label className="text-black text-[9px] font-black uppercase tracking-[0.2em] mb-4 block text-center opacity-60">Quanto deseja aplicar hoje?</label>

              <div className="relative group">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-black/20 font-black text-xl group-focus-within:text-black transition-colors">Kz</span>
                <input
                  autoFocus
                  type="number"
                  min="100"
                  placeholder="100.00"
                  className="w-full h-16 bg-white border-2 border-transparent focus:border-primary rounded-[20px] pl-14 pr-6 text-2xl font-black text-black outline-none transition-all shadow-xl shadow-black/5"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                />
              </div>

              <div className="mt-8 flex flex-col items-center p-4 bg-white/50 rounded-2xl border border-white">
                <p className="text-gray-400 text-[8px] font-black uppercase tracking-[0.2em] mb-1.5">Retorno esperado em {selectedFund.duration_days} dias:</p>
                <p className="text-green-600 text-3xl font-black tabular-nums tracking-tighter">
                  Kz {expectedReturn.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            <button
              onClick={handleApply}
              disabled={applying || !investmentAmount || Number(investmentAmount) <= 0}
              className="w-full bg-black text-white rounded-[20px] h-16 font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl hover:bg-gray-900 active:scale-95 disabled:opacity-30 transition-all flex items-center justify-center gap-4"
            >
              CONFIRMAR INVESTIMENTO
            </button>
          </div>
        </section>
      )}

      {!selectedFund && (
        <section className="px-4 mt-10 pb-32">
          <div className="p-10 rounded-[44px] bg-primary/5 border-2 border-dashed border-primary/20 flex flex-col items-center justify-center text-center">
            <div className="size-16 rounded-full bg-white flex items-center justify-center shadow-xl mb-5">
              <span className="material-symbols-outlined text-primary text-3xl">history</span>
            </div>
            <p className="text-black font-black text-[13px] uppercase tracking-[0.1em] mb-2">Minha Carteira</p>
            <p className="text-gray-500 text-[11px] font-medium max-w-[220px] mb-8 leading-relaxed">Gerencie todos os seus contratos ativos e acompanhe os rendimentos em tempo real.</p>
            <button
              onClick={() => onNavigate('historico-fundos')}
              className="bg-black text-white px-10 h-13 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:bg-gray-900 active:scale-95 transition-all"
            >
              VER MEUS CONTRATOS
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default InvestimentosFundo;
