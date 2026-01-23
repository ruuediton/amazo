
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import SpokeSpinner from '../components/SpokeSpinner';

interface Subordinate {
  id: string;
  phone: string;
  created_at: string;
  invested: number;
}

interface Props {
  onNavigate: (page: any) => void;
}

const SubordinateList: React.FC<Props> = ({ onNavigate }) => {
  const [activeLevel, setActiveLevel] = useState<'L1' | 'L2' | 'L3'>('L1');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Record<string, Subordinate[]>>({ L1: [], L2: [], L3: [] });

  const fetchNetwork = async () => {
    setLoading(true);
    try {
      // Validação de Sessão
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Busca dados mascarados e seguros do backend para o nível ativo
      const { data, error } = await supabase.rpc('get_user_network', {
        p_level: activeLevel
      });

      if (error) throw error;

      if (data.success && data.data) {
        // Mapeia resposta do RPC
        const mappedData = data.data.map((item: any) => ({
          id: 'hidden', // ID oculto no frontend
          phone: item.masked_phone, // Telefone já vem mascarado
          created_at: item.created_at,
          invested: item.invested || 0
        }));

        setData(prev => ({ ...prev, [activeLevel]: mappedData }));
      }
    } catch (err) {
      console.error("Erro ao carregar rede:", err);
      // Opcional: showToast("Erro ao carregar equipe")
    } finally {
      setLoading(false);
    }
  };

  // Efeito reage à mudança de aba
  useEffect(() => {
    fetchNetwork();
  }, [activeLevel]);

  const currentData = data[activeLevel] || [];
  const totalInvested = currentData.reduce((acc, item) => acc + item.invested, 0);

  return (
    <div className="bg-background-dark font-display text-black antialiased min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center bg-background-dark/95 p-4 pb-2 justify-between border-b border-gray-200 backdrop-blur-md">
        <button
          onClick={() => onNavigate('invite')}
          className="text-primary flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
        >
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>
        <h2 className="text-black text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">Equipe de Convidados</h2>
      </header>

      {/* Level Selector Tabs */}
      <div className="bg-background-dark sticky top-[61px] z-40 py-4 px-4 border-b border-gray-200">
        <div className="flex bg-surface-dark p-1 rounded-xl gap-1">
          {(['L1', 'L2', 'L3'] as const).map((level) => (
            <button
              key={level}
              onClick={() => setActiveLevel(level)}
              className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${activeLevel === level
                ? 'bg-primary text-black shadow-lg shadow-primary/10'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Nível {level}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 overflow-y-auto px-4 pt-4 pb-32 no-scrollbar">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <SpokeSpinner size="w-12 h-12" />
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Mapeando sua rede...</p>
          </div>
        ) : (
          <>
            {/* Summary Card */}
            <div className="bg-gradient-to-br from-surface-dark to-white p-5 rounded-2xl border border-gray-200 mb-6 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-black uppercase tracking-widest text-primary">Estatísticas {activeLevel}</span>
                <span className="material-symbols-outlined text-primary">groups</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Membros</p>
                  <p className="text-2xl font-black">{currentData.length}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Total Equipe</p>
                  <p className="text-2xl font-black text-primary">{currentData.length}</p>
                </div>
              </div>
            </div>

            {/* List */}
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest px-1 mb-2">Membros da Rede</h3>

              {currentData.length > 0 ? (
                currentData.map((sub) => (
                  <div key={sub.id} className="bg-surface-dark p-4 rounded-2xl border border-gray-200 flex items-center gap-4 transition-transform active:scale-[0.98] shadow-sm">
                    <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                      <span className="material-symbols-outlined">person</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-black font-bold text-base truncate">{sub.phone}</p>
                      <p className="text-gray-500 text-[10px] font-medium mt-0.5">
                        Registado em {new Date(sub.created_at).toLocaleDateString('pt-PT')}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
                        <span className="text-[10px] text-green-600 font-black uppercase">Ativo</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 opacity-30">
                  <span className="material-symbols-outlined text-6xl mb-2">person_search</span>
                  <p className="font-bold">Nenhum subordinado neste nível</p>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Info Note */}
      <div className="fixed bottom-0 max-w-md w-full p-4 bg-background-dark/95 backdrop-blur-md border-t border-gray-200 text-center z-50">
        <p className="text-[10px] text-gray-600 leading-relaxed italic">
          Os ganhos de comissão são processados automaticamente com base na atividade da sua rede em 3 níveis.
        </p>
      </div>
    </div>
  );
};

export default SubordinateList;
