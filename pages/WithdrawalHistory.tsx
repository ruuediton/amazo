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
    const timer = setInterval(() => setCurrentTime(new Date()), 10000); // Update progress every 10s
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
    const duration = 24 * 60 * 60 * 1000; // 24 hours
    const elapsed = now - start;
    const progress = Math.min(Math.max((elapsed / duration) * 100, 0), 100);
    return progress;
  };

  const getDisplayStatus = (record: WithdrawalRecord) => {
    const progress = getProgress(record.data_de_criacao);
    if (record.estado_da_retirada === 'pendente' && progress >= 100) {
      return 'aprovado';
    }
    return record.estado_da_retirada;
  };

  return (
    <div className="bg-background-dark font-display text-black antialiased min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center p-4 justify-between bg-white sticky top-0 z-40 border-b border-gray-100 backdrop-blur-md bg-opacity-90">
        <button onClick={() => onNavigate('retirada')} className="size-10 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors text-primary">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold flex-1 text-center pr-10 tracking-tight">Registro de Retiradas</h2>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-10">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <SpokeSpinner size="w-8 h-8" />
          </div>
        ) : records.length > 0 ? (
          <div className="p-4 space-y-4">
            {records.map((record) => {
              const progress = getProgress(record.data_de_criacao);
              const status = getDisplayStatus(record);
              const amountToReceive = record.valor_solicitado - (record.taxa_12_porcento || (record.valor_solicitado * 0.12));

              return (
                <div key={record.id} className="bg-white rounded-[24px] p-5 border border-gray-100 shadow-sm space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Beneficiário</p>
                      <p className="font-bold text-sm">{record.nome_completo}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Estado</p>
                      <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${status === 'aprovado' || status === 'completado' ? 'bg-green-100 text-green-600' :
                        status === 'pendente' ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'
                        }`}>
                        {status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-2 border-y border-gray-50">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Valor Sacado</p>
                      <p className="font-bold text-sm">Kz {record.valor_solicitado.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">A Receber (-12%)</p>
                      <p className="font-bold text-sm text-primary">Kz {amountToReceive.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-gray-400 font-bold uppercase tracking-wider">Banco: {record.nome_do_banco}</span>
                      <span className="text-gray-500 font-bold">{record.data_da_retirada} {record.hora_da_retirada}</span>
                    </div>
                    <p className="text-[11px] text-gray-400 font-medium break-all">IBAN: {record.iban}</p>
                  </div>

                  {status === 'pendente' && (
                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                        <span className="text-primary">Processando Verificação</span>
                        <span className="text-gray-400">{progress.toFixed(1)}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-1000"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <p className="text-[9px] text-gray-400 italic">Previsão de conclusão em 24h</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 px-10 text-center opacity-30">
            <div className="size-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-4xl">history</span>
            </div>
            <p className="font-black uppercase tracking-[0.2em] text-[12px]">Nenhuma retirada encontrada</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default WithdrawalHistory;
