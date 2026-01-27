
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import SpokeSpinner from '../components/SpokeSpinner';

interface DepositItem {
  id: string;
  title: string;
  date: string;
  amount: number;
  status: 'Concluído' | 'Pendente' | 'Rejeitado';
  icon: string;
  month: string;
  raw_date: string;
}

interface Props {
  onNavigate: (page: any) => void;
}

const DepositHistory: React.FC<Props> = ({ onNavigate }) => {
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [deposits, setDeposits] = useState<DepositItem[]>([]);
  const [loading, setLoading] = useState(true);

  const statusMap: Record<string, 'Concluído' | 'Pendente' | 'Rejeitado'> = {
    'completado': 'Concluído',
    'processando...': 'Pendente',
    'rejectado': 'Rejeitado'
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  const fetchDeposits = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('depositos_clientes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      const formatted = data.map(d => {
        const dateObj = new Date(d.created_at);
        const day = dateObj.getDate().toString().padStart(2, '0');
        const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
        const monthLabel = monthNames[dateObj.getMonth()];
        const year = dateObj.getFullYear();
        const hours = dateObj.getHours().toString().padStart(2, '0');
        const minutes = dateObj.getMinutes().toString().padStart(2, '0');

        return {
          id: d.id.toString(),
          title: d.nome_banco || 'Transferência Bancária',
          date: `${day} ${monthLabel}, ${hours}:${minutes}`,
          amount: d.valor_deposito,
          status: statusMap[d.estado_de_pagamento] || 'Pendente',
          icon: 'account_balance',
          month: `${dateObj.toLocaleString('pt-PT', { month: 'long' })} ${year}`,
          raw_date: d.created_at
        };
      });
      setDeposits(formatted as DepositItem[]);
    }
    setLoading(false);
  };

  const filters = ['Todos', 'Concluído', 'Pendente', 'Rejeitado'];
  const filteredDeposits = deposits.filter(d => activeFilter === 'Todos' || d.status === activeFilter);
  const months = Array.from(new Set(filteredDeposits.map(d => d.month)));

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    setIsFilterOpen(false);
  };

  return (
    <div className="bg-background-dark font-display text-black antialiased min-h-screen flex flex-col selection:bg-primary selection:text-black">
      <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto">

        <header className="sticky top-0 z-50 flex items-center justify-between bg-background-dark/95 p-4 pb-2 border-b border-gray-200">
          <button
            onClick={() => onNavigate('deposit')}
            className="text-primary flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
          <h2 className="text-black text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
            Histórico de Depósito
          </h2>
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex size-10 shrink-0 items-center justify-center rounded-full transition-colors ${isFilterOpen ? 'bg-primary text-black' : 'text-black hover:bg-white/10'}`}
            >
              <span className="material-symbols-outlined text-[24px]">filter_list</span>
            </button>

            {isFilterOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)}></div>
                <div className="absolute right-0 mt-2 w-48 bg-surface-dark border border-white/10 rounded-2xl z-20 py-2 overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
                  <p className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-gray-200 mb-1">Filtrar por Status</p>
                  {filters.map(filter => (
                    <button
                      key={filter}
                      onClick={() => handleFilterClick(filter)}
                      className={`flex w-full items-center justify-between px-4 py-3 text-sm font-bold transition-colors ${activeFilter === filter ? 'text-primary bg-primary/5' : 'text-gray-700 hover:bg-white/5'
                        }`}
                    >
                      <span>{filter}</span>
                      {activeFilter === filter && <span className="material-symbols-outlined text-[18px]">check</span>}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </header>

        <main className="flex-1 flex flex-col no-scrollbar pt-2">
          {activeFilter !== 'Todos' && (
            <div className="px-4 py-2">
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">Filtro: {activeFilter}</span>
                <button onClick={() => setActiveFilter('Todos')} className="flex items-center justify-center hover:text-black text-primary">
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-6 pb-24">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                <SpokeSpinner size="w-12 h-12" className="mb-4" />
                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Carregando histórico...</p>
              </div>
            ) : (
              months.map(month => (
                <div key={month} className="flex flex-col">
                  <div className="px-4 pb-2 pt-2">
                    <h3 className="text-black text-lg font-bold leading-tight tracking-[-0.015em] capitalize">{month}</h3>
                  </div>

                  <div className="flex flex-col">
                    {filteredDeposits.filter(d => d.month === month).map(item => (
                      <div key={item.id} className={`flex items-center gap-4 px-4 py-4 justify-between hover:bg-gray-50 transition-colors cursor-pointer group border-b border-gray-100 last:border-0 ${item.status === 'Rejeitado' ? 'opacity-60' : ''}`}>
                        <div className="flex items-center gap-4">
                          <div className={`flex items-center justify-center rounded-xl shrink-0 size-11 transition-transform group-active:scale-90 ${item.status === 'Concluído' ? 'bg-[#00C853] text-[#0F1111]' : 'bg-gray-100 border border-gray-200 text-gray-600'}`}>
                            <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
                          </div>
                          <div className="flex flex-col justify-center min-w-0">
                            <p className="text-[text-black] text-base font-bold leading-none truncate mb-1.5">{item.title}</p>
                            <p className="text-[#565959] text-xs font-medium leading-none">{item.date}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          <p className={`text-base font-black leading-none ${item.status === 'Rejeitado' ? 'text-gray-500 line-through' : 'text-black'}`}>
                            {item.status === 'Rejeitado' ? '' : '+ '}{item.amount.toLocaleString()} Kz
                          </p>
                          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${item.status === 'Concluído' ? 'bg-green-500/10 text-green-600' :
                            item.status === 'Pendente' ? 'bg-primary/10 text-primary' :
                              'bg-red-500/10 text-red-400'
                            }`}>
                            <span className="material-symbols-outlined text-[10px] font-bold">
                              {item.status === 'Concluído' ? 'check_circle' : item.status === 'Pendente' ? 'schedule' : 'error'}
                            </span>
                            <span className="text-[9px] font-black uppercase tracking-widest">{item.status}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}

            {!loading && filteredDeposits.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 opacity-30">
                <span className="material-symbols-outlined text-6xl mb-2">history</span>
                <p className="font-bold uppercase tracking-[0.2em] text-xs">Nenhum registro encontrado</p>
              </div>
            )}
          </div>
        </main>

      </div>
    </div>
  );
};

export default DepositHistory;


