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
    <div className="bg-background-dark font-display text-black antialiased min-h-screen flex flex-col">
      {/* Header - Padronizado 14px */}
      <header className="sticky top-0 z-50 flex items-center justify-between bg-white px-4 py-2 border-b border-gray-100 backdrop-blur-md">
        <button
          onClick={() => onNavigate('withdrawal')}
          className="size-8 flex items-center justify-center rounded-full active:scale-90 transition-transform text-primary"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>
        <h1 className="text-[14px] font-bold flex-1 text-center pr-8 tracking-tight uppercase">Histórico</h1>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-10 animate-in fade-in duration-500">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <SpokeSpinner size="w-8 h-8" />
          </div>
        ) : records.length > 0 ? (
          <div className="p-4 space-y-3">
            {records.map((record) => {
              const progress = getProgress(record.data_de_criacao);
              const status = getDisplayStatus(record);
              const amountNet = record.valor_solicitado - (record.taxa_12_porcento || (record.valor_solicitado * 0.12));

              return (
                <div key={record.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3 active:scale-[0.99] transition-all">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className={`size-8 rounded-full flex items-center justify-center ${status === 'aprovado' || status === 'processado' || status === 'completado' ? 'bg-green-50 text-green-500' :
                          status === 'pendente' ? 'bg-orange-50 text-orange-500' : 'bg-red-50 text-red-500'
                        }`}>
                        <span className="material-symbols-outlined text-[18px]">
                          {status === 'pendente' ? 'pending' : status === 'cancelado' ? 'error' : 'check_circle'}
                        </span>
                      </div>
                      <div>
                        <p className="text-[12px] font-bold text-black">{record.nome_do_banco}</p>
                        <p className="text-[10px] text-gray-400 font-medium uppercase">{record.data_da_retirada}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[13px] font-black text-black">Kz {record.valor_solicitado.toLocaleString()}</p>
                      <p className="text-[10px] text-primary font-bold">Kz {amountNet.toLocaleString()} liq.</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                    <span className="text-[10px] text-gray-300 font-mono truncate mr-4">IBAN: {record.iban}</span>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${status === 'aprovado' || status === 'processado' || status === 'completado' ? 'bg-green-100 text-green-600' :
                        status === 'pendente' ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'
                      }`}>
                      {status}
                    </span>
                  </div>

                  {status === 'pendente' && (
                    <div className="pt-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Verificação em curso</span>
                        <span className="text-[9px] font-bold text-primary">{progress.toFixed(0)}%</span>
                      </div>
                      <div className="w-full h-1 bg-gray-50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-1000 ease-out"
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
          <div className="flex flex-col items-center justify-center py-32 px-10 text-center opacity-20">
            <span className="material-symbols-outlined text-5xl mb-4">history_toggle_off</span>
            <p className="font-bold uppercase tracking-widest text-[11px]">Sem movimentações</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default WithdrawalHistory;
