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
  const [loading, setLoading] = useState(true);
  const [subordinates, setSubordinates] = useState<Subordinate[]>([]);

  const fetchNetwork = async () => {
    setLoading(true);
    try {
      // 1. Validar Sessão
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        onNavigate('login');
        return;
      }

      // 2. Buscar perfil para pegar o invite_code do usuário logado
      const { data: profile } = await supabase
        .from('profiles')
        .select('invite_code')
        .eq('id', user.id)
        .single();

      if (!profile) throw new Error("Perfil não encontrado");

      // 3. Buscar na tabela my_equipe com as colunas corretas
      // Corrigido: usando codigo_convite e telefone_subordinado
      const { data, error } = await supabase
        .from('my_equipe')
        .select('*')
        .eq('uuid_dono', user.id)
        .eq('codigo_convite', profile.invite_code)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const mappedData = data.map((item: any) => ({
          id: item.id.toString(),
          phone: item.telefone_subordinado,
          created_at: item.created_at,
          invested: 0
        }));
        setSubordinates(mappedData);
      }
    } catch (err) {
      console.error("Erro ao carregar equipe:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNetwork();
  }, []);

  return (
    <div className="bg-background-dark font-display text-black antialiased min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center bg-background-dark/95 p-4 pb-2 justify-between border-b border-gray-100 backdrop-blur-md">
        <button
          onClick={() => onNavigate('invite')}
          className="text-[#0F1111] flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>
        <h2 className="text-[#0F1111] text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">Minha Equipe</h2>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pt-6 pb-32 no-scrollbar">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <SpokeSpinner size="w-10 h-10" color="text-amber-500" />
            <p className="text-[#565959] font-bold uppercase tracking-widest text-[10px]">Carregando seus convidados...</p>
          </div>
        ) : (
          <>
            {/* Summary Card */}
            <div className="bg-white p-6 rounded-[28px] border border-gray-100 mb-8 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <span className="material-symbols-outlined text-[28px]">groups</span>
                </div>
                <div className="px-3 py-1 bg-green-50 text-green-700 rounded-full border border-green-100 text-[10px] font-black uppercase tracking-widest">Equipe Ativa</div>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] text-[#565959] font-bold uppercase tracking-widest">Total de Membros</p>
                <p className="text-4xl font-black text-[#0F1111]">{subordinates.length}</p>
              </div>
            </div>

            {/* List */}
            <div className="flex flex-col gap-4">
              <h3 className="text-[11px] font-black text-[#565959] uppercase tracking-[0.2em] px-2 mb-2">Convidados Diretos</h3>

              {subordinates.length > 0 ? (
                subordinates.map((sub) => (
                  <div key={sub.id} className="bg-white p-4 rounded-[24px] border border-gray-100 flex items-center gap-4 shadow-sm active:scale-[0.98] transition-transform">
                    <div className="size-12 rounded-full bg-[#F7F8F8] flex items-center justify-center text-[#565959] border border-gray-100">
                      <span className="material-symbols-outlined">person</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-[#0F1111] font-bold text-base tracking-tight">{sub.phone}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[#565959] text-[10px] font-bold">Registado em {new Date(sub.created_at).toLocaleDateString('pt-PT')}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-black text-primary px-2 py-1 bg-primary/5 rounded-md border border-primary/10">NIVEL 1</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-[30px] border border-dashed border-gray-200">
                  <div className="size-16 rounded-full bg-white flex items-center justify-center mb-4 shadow-inner">
                    <span className="material-symbols-outlined text-gray-300 text-4xl">person_search</span>
                  </div>
                  <p className="font-bold text-[#565959] text-sm">Nenhum convidado encontrado</p>
                  <p className="text-[11px] text-[#565959] opacity-70 mt-1 italic">Comece a convidar para ver sua lista crescer.</p>
                </div>
              )}
            </div>
          </>
        )}
      </main>

    </div>
  );
};

export default SubordinateList;
