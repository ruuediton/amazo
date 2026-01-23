import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import SpokeSpinner from '../components/SpokeSpinner';

interface WithdrawalRecord {
  id: string;
  user_id: string;
  nome_completo: string;
  valor_solicitado: number;
  taxa_12_porcento: number;
  data_da_retirada: string;
  hora_da_retirada: string;
  iban: string;
  nome_do_banco: string;
  estado_da_retirada: string;
  data_de_criacao: string;
}

interface Props {
  onNavigate: (page: any) => void;
}

const WithdrawalHistory: React.FC<Props> = ({ onNavigate }) => {
  const [records, setRecords] = useState<WithdrawalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchRecords();
    const timer = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('retirada_clientes')
        .select('*')
        .eq('user_id', user.id)
        .order('data_de_criacao', { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (err) {
      console.error('Error fetching withdrawal history:', err);
    } finally {
      setLoading(false);
    }
  };

  const getProgress = (createdAt: string) => {
    const start = new Date(createdAt).getTime();
    const now = currentTime.getTime();
    const duration = 24 * 60 * 60 * 1000;
    const elapsed = now - start;
    return Math.min(Math.max((elapsed / duration) * 100, 0), 100);
  };

  const getDisplayStatus = (record: WithdrawalRecord) => {
    const progress = getProgress(record.data_de_criacao);
    if (record.estado_da_retirada === 'pendente' && progress >= 100) {
      return 'processado';
    }
    return record.estado_da_retirada;
  };

  return (
    <div className="bg-[#0a0a0b] font-display text-white antialiased min-h-screen flex flex-col">
      {/* Premium Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between bg-[#0a0a0b]/80 px-6 py-4 backdrop-blur-xl border-b border-white/5">
        <button
          onClick={() => onNavigate('withdrawal')}
          className="group flex items-center justify-center w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 active:scale-90 transition-all border border-white/10"
        >
          <span className="material-symbols-outlined text-amber-500 text-[22px] group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
        </button>
        <h1 className="text-[15px] font-black flex-1 text-center pr-10 tracking-[0.1em] uppercase">Registros</h1>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-10 animate-in fade-in duration-700">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <SpokeSpinner size="w-10 h-10" className="text-amber-500" />
          </div>
        ) : records.length > 0 ? (
          <div className="p-6 space-y-4">
            {records.map((record) => {
              const progress = getProgress(record.data_de_criacao);
              const status = getDisplayStatus(record);
              const amountNet = record.valor_solicitado - (record.taxa_12_porcento || (record.valor_solicitado * 0.12));

              const isSuccess = status === 'aprovado' || status === 'processado' || status === 'completado';
              const isPending = status === 'pendente';

              return (
                <div key={record.id} className="bg-white/[0.03] backdrop-blur-md rounded-3xl p-5 border border-white/5 shadow-2xl space-y-4 hover:bg-white/[0.05] transition-all group">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className={`size-10 rounded-2xl flex items-center justify-center border ${isSuccess ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                          isPending ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                            'bg-red-500/10 border-red-500/20 text-red-400'
                        }`}>
                        <span className="material-symbols-outlined text-[20px]">
                          {isPending ? 'schedule' : status === 'cancelado' ? 'block' : 'account_balance_wallet'}
                        </span>
                      </div>
                      <div>
                        <p className="text-[14px] font-black text-white">{record.nome_do_banco}</p>
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{record.data_da_retirada}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[16px] font-black text-white">Kz {record.valor_solicitado.toLocaleString()}</p>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-lg border ${isSuccess ? 'bg-green-500/5 border-green-500/20 text-green-400' :
                          isPending ? 'bg-amber-500/5 border-amber-500/20 text-amber-400' :
                            'bg-red-500/5 border-red-500/20 text-red-400'
                        }`}>
                        {status}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-gray-500 font-black uppercase tracking-tighter mb-0.5">Líquido a receber</span>
                      <span className="text-[13px] font-black text-amber-500">Kz {amountNet.toLocaleString()}</span>
                    </div>
                    <div className="text-right min-w-0 flex-1 ml-4 overflow-hidden">
                      <span className="text-[9px] text-gray-500 font-black uppercase tracking-tighter mb-0.5 block">IBAN de Destino</span>
                      <span className="text-[10px] text-gray-400 font-mono truncate block">{record.iban}</span>
                    </div>
                  </div>

                  {isPending && (
                    <div className="pt-2">
                      <div className="flex justify-between items-center mb-1.5 px-0.5">
                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Protocolo de Verificação</span>
                        <span className="text-[10px] font-black text-amber-500">{progress.toFixed(0)}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <div
                          className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-40 px-10 text-center opacity-10">
            <span className="material-symbols-outlined text-7xl mb-6">history_toggle_off</span>
            <p className="font-black uppercase tracking-[0.3em] text-[12px]">Sem Movimentações</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default WithdrawalHistory;
