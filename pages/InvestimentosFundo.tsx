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
  const [autoReinvest, setAutoReinvest] = useState(false);

  const totalGlobalAvailable = useMemo(() => {
    return funds.reduce((acc, fund) => acc + (Number(fund.total_fundos_disponivel) || 0), 0);
  }, [funds]);

  const expectedReturn = useMemo(() => {
    if (!selectedFund || !investmentAmount) return 0;
    const amount = Number(investmentAmount);
    if (isNaN(amount)) return 0;
    const rate = selectedFund.taxa_retorno / 100;
    return amount + (amount * rate);
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

    // Validação de UX apenas (Segurança real no backend)
    if (isNaN(amountNum) || amountNum < 100) {
      if (showToast) showToast('Valor mínimo de fundo 100 Kz.', 'warning');
      return;
    }

    setApplying(true);
    try {
      await withLoading(async () => {
        // Validação de Sessão
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          onNavigate('login');
          throw new Error("Sessão expirada. Entre novamente.");
        }

        // Validação de Liquidez no Frontend (Feedback rápido)
        if (amountNum > Number(selectedFund.total_fundos_disponivel)) {
          throw new Error(`⚠️ O valor disponível é de ${Number(selectedFund.total_fundos_disponivel).toLocaleString('pt-AO')} Kz.`);
        }

        // Chamada Segura RPC
        const { data, error } = await supabase.rpc('purchase_fund', {
          p_fund_id: selectedFund.id_fundo,
          p_amount: amountNum,
          p_auto_reinvest: autoReinvest
        });

        // Erro de rede ou sistema
        if (error) throw new Error("Erro de conexão.");

        // Erro de negócio retornado pelo backend
        if (data && !data.success) {
          throw new Error(data.message || "Não foi possível realizar o investimento.");
        }

        return data.message;
      }, "Aplicação realizada com sucesso!");

      // Reseta e atualiza após o sucesso
      setSelectedFund(null);
      setInvestmentAmount('');
      setAutoReinvest(false);
      fetchData(); // Recarrega disponibilidade atualizada
    } catch (err: any) {
      // feedback já tratado pelo withLoading/showError global ou exceções acima
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="bg-background-dark min-h-screen font-display antialiased">
      {/* Header Area: Modern & Slim */}
      <div className="relative h-[240px] w-full overflow-hidden rounded-b-[48px] shadow-2xl bg-[#0F1111]">
        <img
          src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=1000"
          alt="Amazon Wealth Header"
          className="absolute inset-0 w-full h-full object-cover opacity-60 scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F1111] via-transparent to-black/40" />

        <div className="absolute top-8 left-6 right-6 z-10 flex items-center justify-between">
          <button
            onClick={() => onNavigate('home')}
            className="size-10 flex items-center justify-center rounded-xl bg-white/10 backdrop-blur-md text-white border border-white/20 active:scale-90 transition-all"
          >
            <span className="material-symbols-outlined text-xl">arrow_back_ios_new</span>
          </button>
          <div className="flex flex-col items-end">
            <span className="text-primary text-[9px] font-black uppercase tracking-[0.2em]">Amazon Wealth</span>
            <div className="flex items-center gap-1.5 mt-1 px-2 py-0.5 bg-green-500/10 rounded-full border border-green-500/20">
              <span className="size-1.5 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-green-500 text-[8px] font-bold uppercase tracking-wider">Ao Vivo</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-8 z-10">
          <p className="text-white/50 text-[9px] font-black uppercase tracking-[0.3em] mb-2">Liquidez Total</p>
          <h1 className="text-white text-3xl font-black tabular-nums tracking-tighter">
            <span className="text-primary opacity-80 text-xl mr-1">Kz</span>
            {totalGlobalAvailable.toLocaleString('pt-AO')}
          </h1>
          <div className="flex items-center gap-2 mt-3">
            <div className="bg-primary/90 text-[#0F1111] px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">
              Oportunidades
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-4 mb-4 relative z-20">
        <div className="bg-white/80 backdrop-blur-xl border border-white p-1 rounded-2xl flex items-center gap-2 shadow-xl">
          <div className="flex-1 flex items-center gap-3 px-3 py-2">
            <span className="material-symbols-outlined text-primary text-xl">account_balance_wallet</span>
            <div className="flex flex-col">
              <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Saldo disponível</span>
              <span className="text-slate-900 font-black text-[10px]">Ver em Perfil</span>
            </div>
          </div>
          <button
            onClick={() => onNavigate('historico-fundos')}
            className="bg-[#0F1111] text-white px-4 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all"
          >
            Carteira
          </button>
        </div>
      </div>

      <section className="overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar mt-4">
        <div className="flex items-stretch px-6 gap-5 pb-8">
          {filteredFunds.length > 0 ? (
            filteredFunds.map((fund) => {
              const isExhausted = Number(fund.total_fundos_disponivel) <= 0;
              return (
                <div
                  key={fund.id_fundo}
                  className="snap-center flex-none flex flex-col bg-white border border-slate-100 rounded-[32px] shadow-lg hover:shadow-2xl transition-all duration-300 w-[210px] overflow-hidden"
                >
                  <div
                    className="w-full bg-center bg-no-repeat aspect-[4/3] bg-cover relative group overflow-hidden"
                    style={{ backgroundImage: `url("${fund.url_imagem}")` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                    {isExhausted && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
                        <span className="bg-red-600 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl">Esgotado</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-black/40 backdrop-blur-md border border-white/10">
                      <p className="text-[9px] font-black text-primary uppercase">Fundos</p>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-primary text-[#0F1111] px-2.5 py-1.5 rounded-xl shadow-xl border border-white/20 scale-100 group-hover:scale-110 transition-transform">
                      <p className="text-[12px] font-black">+{fund.taxa_retorno}%</p>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-slate-900 text-[15px] font-black leading-tight mb-1 line-clamp-1">{fund.nome_fundo}</h3>
                    <p className="text-slate-400 text-[9px] font-medium leading-tight mb-3">Aplique e tenha um retorno explosivo ao final do ciclo.</p>

                    <div className="flex flex-col gap-4 mt-auto">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 text-[8px] uppercase font-black tracking-widest">Termo</span>
                          <span className="text-slate-900 font-black text-[11px] tabular-nums">{fund.duration_days} Dias</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedFund(fund);
                          setInvestmentAmount('');
                          setAutoReinvest(false);
                        }}
                        disabled={isExhausted}
                        className={`flex w-full h-12 items-center justify-center rounded-2xl shadow-xl transition-all font-black text-[10px] uppercase tracking-[0.2em] active:scale-95 ${isExhausted
                          ? 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none'
                          : 'bg-primary text-[#0F1111] hover:brightness-105 shadow-primary/20'
                          }`}
                      >
                        {isExhausted ? 'Indisponível' : 'Aplicar'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="w-full py-16 flex flex-col items-center justify-center text-slate-300 bg-slate-50/50 rounded-[40px] border-2 border-dashed border-slate-100">
              <span className="material-symbols-outlined text-4xl mb-3 opacity-20">cloud_off</span>
              <p className="font-black text-[9px] uppercase tracking-[0.3em] opacity-40">Sem fundos disponíveis</p>
            </div>
          )}
        </div>
      </section>

      {/* Detailed Investment Area */}
      {selectedFund && (
        <section className="mt-4 px-6 mb-20 animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="bg-white rounded-[48px] border border-slate-100 shadow-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
              <span className="material-symbols-outlined text-[180px]">payments</span>
            </div>

            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className="flex items-center gap-4">
                <div className="size-14 rounded-2xl bg-[#0F1111] flex items-center justify-center shadow-lg shadow-black/20">
                  <span className="material-symbols-outlined text-primary text-2xl">account_balance</span>
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 leading-tight uppercase tracking-tight">{selectedFund.nome_fundo}</h3>
                  <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] mt-0.5">Configuração de aporte</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedFund(null)}
                className="size-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 hover:text-red-500 transition-colors"
                title="Fechar"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
              <div className="bg-slate-50/80 backdrop-blur-sm p-5 rounded-[28px] border border-slate-100 flex flex-col items-center">
                <p className="text-slate-400 text-[8px] font-black uppercase tracking-widest mb-1.5 opacity-60">Taxa de Retorno</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-green-600 text-2xl font-black">{selectedFund.taxa_retorno}%</span>
                  <span className="material-symbols-outlined text-green-500 text-sm">trending_up</span>
                </div>
              </div>
              <div className="bg-slate-50/80 backdrop-blur-sm p-5 rounded-[28px] border border-slate-100 flex flex-col items-center">
                <p className="text-slate-400 text-[8px] font-black uppercase tracking-widest mb-1.5 opacity-60">Termo do Ativo</p>
                <p className="text-slate-900 text-[14px] font-black tracking-tighter">
                  {selectedFund.duration_days} DIAS
                </p>
              </div>
            </div>

            <div className="bg-primary/5 rounded-[40px] p-8 border-2 border-dashed border-primary/20 mb-8 relative z-10">
              <label className="text-slate-900 text-[10px] font-black uppercase tracking-[0.3em] mb-5 block text-center opacity-40 italic">Inicie sua aplicação</label>

              <div className="relative group">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 font-black text-2xl group-focus-within:text-primary transition-colors">Kz</span>
                <input
                  autoFocus
                  type="number"
                  min="100"
                  placeholder="0.00"
                  className="w-full h-16 bg-white border-2 border-transparent focus:border-primary rounded-[24px] pl-16 pr-8 text-3xl font-black text-slate-900 outline-none transition-all shadow-xl shadow-black/5"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                />
              </div>

              <div className="mt-8 p-6 bg-white/60 backdrop-blur rounded-[28px] border border-white shadow-inner flex flex-col items-center">
                <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] mb-2">Retorno Total Previsto</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-green-600 text-3xl font-black tabular-nums tracking-tighter">
                    Kz {expectedReturn.toLocaleString('pt-AO')}
                  </span>
                </div>
              </div>
            </div>

            {/* Auto Reinvestment Toggle: Modernized */}
            <div
              onClick={() => setAutoReinvest(!autoReinvest)}
              className={`mb-10 p-5 rounded-[28px] border-2 cursor-pointer transition-all duration-500 flex items-center gap-5 ${autoReinvest ? 'bg-[#0F1111] border-primary shadow-xl shadow-black/20' : 'bg-slate-50/50 border-transparent hover:bg-slate-50'
                }`}
            >
              <div className={`size-8 rounded-xl flex items-center justify-center transition-all duration-500 ${autoReinvest ? 'bg-primary text-[#0F1111] rotate-[360deg]' : 'bg-slate-200 text-slate-400'
                }`}>
                <span className="material-symbols-outlined text-lg font-black">
                  {autoReinvest ? 'cached' : 'radio_button_unchecked'}
                </span>
              </div>
              <div className="flex-1">
                <p className={`text-[10px] font-black uppercase tracking-widest ${autoReinvest ? 'text-white' : 'text-slate-900'}`}>
                  Reaplicação Automática
                </p>
                <p className={`text-[9px] mt-1 leading-relaxed ${autoReinvest ? 'text-slate-400' : 'text-slate-400'}`}>
                  Maximizar lucros com juros compostos ao final do ciclo.
                </p>
              </div>
            </div>

            <button
              onClick={handleApply}
              disabled={applying || !investmentAmount || Number(investmentAmount) <= 0}
              className={`w-full h-14 rounded-[24px] font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl transition-all flex items-center justify-center gap-4 ${applying || !investmentAmount || Number(investmentAmount) <= 0
                ? 'bg-slate-100 text-slate-300'
                : 'bg-[#0F1111] text-white hover:brightness-125 active:scale-95 shadow-black/40'
                }`}
            >
              {applying ? <SpokeSpinner size="w-6 h-6" className="text-primary" /> : 'Liquidar Fundos'}
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
              className="bg-black text-white px-10 h-11 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:bg-gray-900 active:scale-95 transition-all"
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
