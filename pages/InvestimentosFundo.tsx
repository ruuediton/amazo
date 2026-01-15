import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';

interface Fund {
  id: string;
  name: string;
  risk: 'ALTO' | 'MÉDIO' | 'BAIXO';
  profitability_pct: number;
  min_investment: number;
  duration_days: number;
  image: string;
  description: string;
  strategy: string;
  icon: string;
  status: string;
}

interface Props {
  onNavigate: (page: any) => void;
  showToast?: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

const InvestimentosFundo: React.FC<Props> = ({ onNavigate, showToast }) => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFund, setSelectedFund] = useState<Fund | null>(null);
  const [funds, setFunds] = useState<Fund[]>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [userBalance, setUserBalance] = useState<number>(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch active funds
      const { data: fundsData, error: fundsError } = await supabase
        .from('funds')
        .select('*')
        .eq('status', 'ativo')
        .order('created_at', { ascending: false });

      if (fundsError) throw fundsError;
      setFunds(fundsData || []);

      // Fetch user balance
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('balance')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        setUserBalance(profile?.balance || 0);
      }
    } catch (err: any) {
      console.error('Error fetching data:', err);
      if (showToast) showToast('Erro ao carregar dados dos fundos.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!selectedFund) return;

    try {
      setApplying(true);

      const { data, error } = await supabase.rpc('apply_for_fund', {
        p_fund_id: selectedFund.id
      });

      if (error) throw error;

      if (data.success) {
        if (showToast) showToast(data.message, 'success');
        // Refresh balance and storage
        fetchData();
        setSelectedFund(null);
        // Navigate to history after a short delay
        setTimeout(() => {
          onNavigate('historico-fundos');
        }, 3000);
      } else {
        if (showToast) showToast(data.message, 'warning');
      }
    } catch (err: any) {
      console.error('Error applying for fund:', err);
      if (showToast) showToast('Ocorreu um erro ao processar sua aplicação.', 'error');
    } finally {
      setApplying(false);
    }
  };

  const filteredFunds = funds.filter(fund =>
    fund.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    fund.id !== selectedFund?.id
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

      {/* Hero Card */}
      <div className="p-4">
        <div className="flex flex-col items-stretch justify-start rounded-2xl shadow-sm bg-gray-50 border border-gray-100 p-6 relative overflow-hidden">
          <div className="flex flex-col gap-1 z-10">
            <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Total de fundos disponível aplicado</p>
            <h1 className="text-black text-3xl font-extrabold leading-tight py-1">
              Kz {userBalance.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                <span className="material-symbols-outlined text-sm mr-1">trending_up</span>
                +4,2%
              </div>
            </div>
          </div>
          <div className="absolute right-[-10px] bottom-[-10px] opacity-10 pointer-events-none">
            <span className="material-symbols-outlined text-[120px] text-primary">account_balance_wallet</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-bold">Carregando mercados...</p>
        </div>
      ) : (
        <>
          {/* Featured Funds */}
          <section>
            <div className="flex items-center justify-between px-4 pb-1 pt-4">
              <h2 className="text-gray-900 text-[22px] font-bold leading-tight tracking-[-0.015em]">Total em destaque</h2>
            </div>
            <div className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar pb-6">
              <div className="flex items-stretch px-4 gap-4">
                {filteredFunds.length > 0 ? (
                  filteredFunds.map((fund) => (
                    <div
                      key={fund.id}
                      className="snap-start flex-none flex h-full flex-col gap-3 rounded-2xl bg-white border border-gray-100 shadow-lg w-[280px] overflow-hidden transition-all duration-300"
                    >
                      <div
                        className="w-full bg-center bg-no-repeat aspect-[16/9] bg-cover"
                        style={{ backgroundImage: `url("${fund.image}")` }}
                      ></div>
                      <div className="flex flex-col flex-1 justify-between p-4 pt-0 gap-4">
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <p className="text-black text-base font-bold leading-normal">{fund.name}</p>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${fund.risk === 'ALTO' ? 'bg-red-50 text-red-600 border-red-100' :
                              fund.risk === 'BAIXO' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                'bg-orange-50 text-orange-600 border-orange-100'
                              }`}>{fund.risk}</span>
                          </div>
                          <p className="text-gray-500 text-sm font-normal leading-normal">Rentabilidade: <span className="text-green-600 font-semibold">+{fund.profitability_pct}%</span></p>
                        </div>
                        <button
                          onClick={() => setSelectedFund(fund)}
                          className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-4 bg-primary text-black text-sm font-bold leading-normal shadow-md hover:bg-yellow-500 active:scale-95 transition-all"
                        >
                          <span>Aplicar Fundos</span>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="w-[300px] h-40 flex items-center justify-center text-gray-400">
                    Nenhum fundo disponível no momento.
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Selected Product Details */}
          {selectedFund && (
            <section className="mt-6 px-4 animate-in fade-in slide-in-from-bottom-5 duration-500">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl p-6 overflow-hidden relative">
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                      <span className="material-symbols-outlined text-primary text-3xl">{selectedFund.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-black">{selectedFund.name}</h3>
                      <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest">Detalhes do Fundo</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedFund(null)}
                    className="text-gray-400 hover:text-black transition-colors"
                    title="Fechar detalhes"
                  >
                    <span className="material-symbols-outlined">expand_less</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 col-span-2">
                    <p className="text-gray-400 text-[10px] font-bold uppercase mb-1">Taxa de retorno</p>
                    <p className="text-green-600 text-xl font-black">{selectedFund.profitability_pct}%</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <p className="text-gray-400 text-[10px] font-bold uppercase mb-1">Investimento mínimo</p>
                    <p className="text-black text-lg font-black">{selectedFund.min_investment.toLocaleString('pt-AO')} Kz</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <p className="text-gray-400 text-[10px] font-bold uppercase mb-1">Duração de dias</p>
                    <p className="text-black text-lg font-black">{selectedFund.duration_days} Dias</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-black mb-2 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-lg">info</span>
                      Sobre o Fundo
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {selectedFund.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-black mb-2 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-lg">psychology</span>
                      Estratégia de Investimento
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed italic">
                      "{selectedFund.strategy}"
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleApply}
                  disabled={applying}
                  className="mt-8 w-full bg-black text-white rounded-2xl h-14 font-bold text-lg shadow-xl hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all flex items-center justify-center gap-2"
                >
                  {applying ? (
                    <div className="size-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">bolt</span>
                      Confirmar Aplicação
                    </>
                  )}
                </button>

                <button
                  onClick={() => onNavigate('historico-fundos')}
                  className="mt-3 w-full bg-gray-100 text-gray-600 rounded-2xl h-14 font-bold text-sm hover:bg-gray-200 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">history</span>
                  Ver meus Fundos ativos
                </button>
              </div>
            </section>
          )}
        </>
      )}

      {/* Bottom Nav Spacer */}
      <div className="h-20"></div>
    </div>
  );
};

export default InvestimentosFundo;
