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
  const { withLoading } = useLoading();
  const [applying, setApplying] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState<string>('');
  const [autoReinvest, setAutoReinvest] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

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

  useEffect(() => {
    const init = async () => {
      await fetchData(true); // silent fetch for initial
      setInitialLoading(false);
    };
    init();
  }, []);

  const fetchData = async (silent = false) => {
    const fetch = async () => {
      const { data, error } = await supabase
        .from('fundos')
        .select('*')
        .eq('estado', true)
        .order('data_disponivel', { ascending: false });

      if (error) throw error;
      setFunds(data || []);
    };

    if (silent) {
      await fetch();
    } else {
      await withLoading(fetch);
    }
  };

  const handleApply = async () => {
    if (!selectedFund || !investmentAmount) return;
    const amountNum = Number(investmentAmount);

    if (isNaN(amountNum) || amountNum < 200) {
      if (showToast) showToast('Valor mínimo de fundo 200 Kz.', 'warning');
      return;
    }

    setApplying(true);
    try {
      await withLoading(async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          onNavigate('login');
          throw new Error("Sessão expirada. Entre novamente.");
        }

        if (amountNum > Number(selectedFund.total_fundos_disponivel)) {
          throw new Error(`?? O valor disponível é de ${Number(selectedFund.total_fundos_disponivel).toLocaleString('pt-AO')} Kz.`);
        }

        const { data, error } = await supabase.rpc('purchase_fund', {
          p_fund_id: selectedFund.id_fundo,
          p_amount: amountNum,
          p_auto_reinvest: autoReinvest
        });

        if (error) throw new Error("Operação não sucedida");

        if (data && !data.success) {
          throw new Error(data.message || "Não foi possível realizar o investimento.");
        }

        return data.message;
      }, "Aplicação realizada com sucesso!");

      setSelectedFund(null);
      setInvestmentAmount('');
      setAutoReinvest(false);
      fetchData(true);
    } catch (err: any) {
      // Handled by withLoading
    } finally {
      setApplying(false);
    }
  };

  if (initialLoading) return (
    <div className="flex justify-center items-center h-screen bg-white">
      <SpokeSpinner size="w-10 h-10" color="text-[#00C853]" />
    </div>
  );

  return (
    <div className="bg-white min-h-screen font-sans text-[#0F1111] pb-20 selection:bg-amber-100 antialiased">
      {/* Header Area: BP Style */}
      <div className="relative h-[220px] w-full overflow-hidden bg-[#232F3E]">
        <div className="absolute inset-0 bg-[#232F3E]/80 mix-blend-multiply transition-opacity" />
        <img loading="lazy" decoding="async"
          src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=1000"
          alt="BP Wealth Header"
          className="absolute inset-0 w-full h-full object-cover contrast-[1.05] brightness-[1.02] saturate-[1.05] opacity-30 grayscale"
        />

        <div className="absolute top-6 left-5 right-5 z-10 flex items-center justify-between">
          <button
            onClick={() => onNavigate('home')}
            className="size-10 flex items-center justify-center rounded-full bg-white/10 text-white active:scale-90 transition-all hover:bg-white/20"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="bg-[#00C853] text-[#0F1111] px-2 py-0.5 rounded text-[10px] font-black uppercase">Wealth</span>
          </div>
        </div>

        <div className="absolute bottom-10 left-8 z-10 flex flex-col gap-1">
          <p className="text-white/60 text-[11px] font-bold uppercase tracking-wider">Liquidez Global</p>
          <h1 className="text-white text-4xl font-black tabular-nums tracking-tighter">
            <span className="text-[#febd69] text-xl mr-1">Kz</span>
            {totalGlobalAvailable.toLocaleString('pt-AO')}
          </h1>
        </div>
      </div>

      {/* Profile/Wallet Card - BP Flat Style */}
      <div className="px-5 -mt-8 mb-4 relative z-20">
        <div className="bg-white border border-gray-200 p-4 rounded-xl flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-[#00C853] rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-[#0F1111]">account_balance_wallet</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] text-gray-500 font-bold uppercase">Meus Investimentos</span>
              <span className="text-[#0F1111] font-black text-[13px]">Consulte sua rentabilidade</span>
            </div>
          </div>
          <button
            onClick={() => onNavigate('historico-fundos')}
            className="bg-[#232F3E] text-white px-4 py-2.5 rounded-lg font-bold text-[11px] uppercase tracking-wide hover:bg-[#131921] active:scale-95 transition-all"
          >
            Ver Carteira
          </button>
        </div>
      </div>

      <div className="px-5 pt-4 space-y-2">
        <h2 className="text-[18px] font-extrabold text-[#0F1111]">Oportunidades do Dia</h2>
        <p className="text-[12px] text-gray-500 font-medium">Selecione um fundo de investimento para começar a renderizar lucros.</p>
      </div>

      {/* Funds Carousel */}
      <section className="overflow-x-auto snap-x snap-mandatory flex no-scrollbar mt-4 px-5 pb-8">
        <div className="flex gap-4">
          {funds.length > 0 ? (
            funds.map((fund) => {
              const isExhausted = Number(fund.total_fundos_disponivel) <= 0;
              return (
                <div
                  key={fund.id_fundo}
                  className="snap-center flex-none w-[220px] flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div
                    className="w-full aspect-video bg-cover bg-center relative"
                    style={{ backgroundImage: `url("${fund.url_imagem}")` }}
                  >
                    {isExhausted && (
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-bold">ESGOTADO</span>
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2 bg-[#00C853] text-[#0F1111] px-2 py-1 rounded font-black text-[12px]">
                      +{fund.taxa_retorno}%
                    </div>
                  </div>

                  <div className="p-4 flex flex-col flex-1 space-y-3">
                    <div>
                      <h3 className="text-[#0F1111] text-[15px] font-black leading-tight truncate">{fund.nome_fundo}</h3>
                      <p className="text-gray-400 text-[10px] font-medium leading-tight mt-1">{fund.duration_days} dias de ciclo</p>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedFund(fund);
                        setInvestmentAmount('');
                        setAutoReinvest(false);
                      }}
                      disabled={isExhausted}
                      className={`w-full h-11 rounded-lg font-bold text-[12px] transition-all active:scale-95 ${isExhausted
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-[#00C853] border border-[#00C853] text-[#0F1111] hover:bg-[#00C853]'
                        }`}
                    >
                      {isExhausted ? 'Indisponível' : 'Aplicar Agora'}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="w-[85vw] py-16 flex flex-col items-center justify-center text-gray-300 border-2 border-dashed border-gray-100 rounded-2xl">
              <span className="material-symbols-outlined text-4xl mb-2">cloud_off</span>
              <p className="font-bold text-[11px] uppercase">Nenhum investimento disponível</p>
            </div>
          )}
        </div>
      </section>

      {/* Investment Sheet */}
      {selectedFund && (
        <section className="px-5 pb-20 animate-in slide-in-from-bottom-10 duration-500">
          <div className="bg-[#f3f3f3] rounded-3xl p-6 border border-gray-200 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-xl bg-[#0F1111] flex items-center justify-center text-[#00C853]">
                  <span className="material-symbols-outlined text-2xl">rocket_launch</span>
                </div>
                <div>
                  <h3 className="text-[17px] font-black text-[#0F1111]">{selectedFund.nome_fundo}</h3>
                  <p className="text-green-600 text-[11px] font-bold">Rendimento Diário Otimizado</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedFund(null)}
                className="size-10 rounded-full hover:bg-white transition-colors text-gray-400"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col items-center">
                <span className="text-[9px] font-bold text-gray-400 uppercase">Lucro</span>
                <span className="text-[20px] font-black text-green-600">{selectedFund.taxa_retorno}%</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col items-center">
                <span className="text-[9px] font-bold text-gray-400 uppercase">Duração</span>
                <span className="text-[20px] font-black text-[#0F1111]">{selectedFund.duration_days} <span className="text-[12px]">Dias</span></span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[12px] font-bold text-[#0F1111]">Valor do Aporte (Kz)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-xl text-gray-300">KZ</span>
                <input
                  autoFocus
                  type="number"
                  min="100"
                  placeholder="0.00"
                  className="w-full h-14 bg-white border border-gray-200 focus:border-[#e77600] rounded-xl pl-12 pr-4 text-2xl font-black text-[#0F1111] outline-none transition-all shadow-sm"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                />
              </div>
              <div className="bg-white p-4 rounded-xl border border-dashed border-gray-300 flex justify-between items-center">
                <span className="text-[11px] font-bold text-gray-400 uppercase">Retorno Previsto</span>
                <span className="text-[18px] font-black text-green-600 tabular-nums">Kz {expectedReturn.toLocaleString('pt-AO')}</span>
              </div>
            </div>

            <label className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 cursor-pointer active:scale-[0.98] transition-all">
              <input
                type="checkbox"
                className="size-5 rounded border-gray-300 text-[#00C853] focus:ring-[#00C853]"
                checked={autoReinvest}
                onChange={() => setAutoReinvest(!autoReinvest)}
              />
              <div className="flex-1">
                <p className="text-[12px] font-bold text-[#0F1111]">Reinvestimento Automático</p>
                <p className="text-[10px] text-gray-400">Ative para maximizar seus lucros mensais.</p>
              </div>
            </label>

            <button
              onClick={handleApply}
              disabled={applying || !investmentAmount || Number(investmentAmount) <= 0}
              className={`w-full h-14 rounded-xl font-black text-[14px] uppercase shadow-lg transition-all flex items-center justify-center gap-3 ${applying || !investmentAmount || Number(investmentAmount) <= 0
                ? 'bg-gray-200 text-gray-400'
                : 'bg-[#00C853] border border-[#00C853] text-[#0F1111] hover:bg-[#00C853] active:scale-[0.98]'
                }`}
            >
              {applying ? <SpokeSpinner size="w-6 h-6" color="text-[#0F1111]" /> : 'Confirmar Aplicação'}
            </button>
          </div>
        </section>
      )}

      {!selectedFund && (
        <section className="px-5 mt-4">
          <div className="bg-[#fdf8f3] border border-[#f3ebdf] p-8 rounded-3xl flex flex-col items-center text-center space-y-4">
            <div className="size-14 rounded-full bg-white flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-[#e47911] text-2xl">verified_user</span>
            </div>
            <div className="space-y-1">
              <p className="text-[#0F1111] font-black text-[16px]">Segurança Grantida</p>
              <p className="text-gray-500 text-[11px] max-w-[200px] font-medium leading-relaxed italic">Seus investimentos são protegidos por fundos de reserva BP Wealth.</p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default InvestimentosFundo;

