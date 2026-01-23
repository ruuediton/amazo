
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useLoading } from '../contexts/LoadingContext';
import SpokeSpinner from '../components/SpokeSpinner';

interface Props {
  onNavigate: (page: any) => void;
  showToast?: (message: string, type: any) => void;
}

const GanhosTarefas: React.FC<Props> = ({ onNavigate, showToast }) => {
  const { withLoading, showError } = useLoading();
  const [purchases, setPurchases] = useState<any[]>([]);
  const [hasCollectedToday, setHasCollectedToday] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [potentialIncome, setPotentialIncome] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // 1. Validação de sessão
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        onNavigate('login');
        return;
      }

      // 2. Busca consolidada e segura via RPC
      // O backend calcula tudo, evitando manipulação de valores no frontend
      const { data, error } = await supabase.rpc('get_task_screen_data');

      if (error) throw error;

      if (data) {
        setPurchases(data.purchases || []);
        setPotentialIncome(data.potential_income || 0);
        setHasCollectedToday(data.has_collected_today || false);
      }
    } catch (err) {
      console.error(err);
      // Fail silently or show generic error
    }
  };

  const handleCheckIn = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      await withLoading(async () => {
        // Validação de sessão antes da ação crítica
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Sessão expirada.");

        // RPC Atômica para Coleta
        // O backend verifica validade, calcula valores e atualiza saldo numa única transação
        const { data, error } = await supabase.rpc('collect_daily_income'); // sem params, userId vem da sessão

        if (error) throw new Error("Erro de comunicação. Tente novamente.");

        if (!data.success) {
          throw new Error(data.message || "Erro ao coletar renda.");
        }

        // Sucesso Confirmado pelo Backend
        setHasCollectedToday(true);
        // Atualiza UI com valores confirmados se necessário

        return data.message;
      }, "Tarefa diária concluída!");

    } catch (error: any) {
      showError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-background-dark font-display text-black transition-colors duration-200 min-h-screen">
      <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sticky top-0 z-10 bg-background-dark/95 backdrop-blur-sm border-b border-gray-200">
          <div
            onClick={() => onNavigate('home')}
            className="flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-white/10 cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-primary">arrow_back</span>
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] text-center flex-1">Ganhos de Tarefas</h2>
          <div
            onClick={() => onNavigate('tutoriais-ganhos-tarefas')}
            className="flex size-12 items-center justify-center rounded-full hover:bg-white/10 cursor-pointer"
          >
            <span className="material-symbols-outlined text-black">help</span>
          </div>
        </div>

        {/* 6️⃣ Cálculo do rendimento - Exibição do Lucro Potencial */}
        <div className="flex flex-col items-center pt-6 pb-2 px-4">
          <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-full shadow-lg shadow-green-500/5">
            <span className="material-symbols-outlined text-green-600 text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
            <span className="text-sm font-extrabold text-green-600 uppercase tracking-wider">
              Hoje: {hasCollectedToday ? '+0,00' : `+${potentialIncome.toLocaleString()}`} Kz
            </span>
          </div>
        </div>

        {/* Power Controller (Botão de Ação) */}
        <div className="flex flex-col items-center justify-center py-8 relative">
          <div className="absolute w-48 h-48 rounded-full bg-primary/10 animate-pulse"></div>
          <div className="absolute w-40 h-40 rounded-full bg-primary/20"></div>
          <button
            onClick={handleCheckIn}
            disabled={hasCollectedToday || isProcessing}
            className="relative z-10 flex flex-col items-center justify-center w-28 h-28 rounded-full bg-primary shadow-[0_0_40px_-10px_rgba(244,209,37,0.6)] transition-transform active:scale-95 cursor-pointer group"
          >
            {isProcessing ? (
              <SpokeSpinner className="text-[text-black]" size="w-7 h-7" />
            ) : (
              <>
                <span className="material-symbols-outlined text-[text-black] text-[40px] mb-1 group-hover:scale-110 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {hasCollectedToday ? 'task_alt' : 'power_settings_new'}
                </span>
                <span className="text-[text-black] text-[9px] font-black uppercase tracking-tighter">
                  {hasCollectedToday ? 'Finalizado' : 'Check-in-Diario'}
                </span>
              </>
            )}
          </button>
          <p className="mt-6 text-sm font-medium text-primary uppercase tracking-widest animate-pulse">
            {hasCollectedToday ? 'Renda Coletada' : 'Sistema Online'}
          </p>
        </div>

        {/* Ticker / Log */}
        <div className="mx-4 my-4 p-3 rounded-lg bg-white border-none shadow-md flex items-center gap-3 overflow-hidden">
          <span className="material-symbols-outlined text-primary text-[20px] shrink-0">notifications_active</span>
          <div className="flex-1 overflow-hidden relative h-6">
            <div className="absolute whitespace-nowrap animate-marquee flex items-center text-sm text-black font-bold">
              <span className="mr-12">👉 As tarefas devem ser realizadas diariamente para receber os ganhos.</span>
              <span className="mr-12">👉 Verifique seus itens ativos para ver os ganhos prontos para coleta.</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 px-4 mb-6">
          <div className="bg-white p-4 rounded-xl border-none shadow-md">
            <div className="flex items-center gap-2 mb-2 text-text-secondary">
              <span className="material-symbols-outlined text-[20px] text-green-600">calendar_view_week</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Renda Semanal</span>
            </div>
            <p className="text-lg font-black text-black">
              Kz {(potentialIncome * 7).toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border-none shadow-md">
            <div className="flex items-center gap-2 mb-2 text-text-secondary">
              <span className="material-symbols-outlined text-[20px] text-primary">inventory_2</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total de Ativos</span>
            </div>
            <p className="text-lg font-black text-black">
              {purchases.filter(p => p.status === 'confirmado').length} Itens
            </p>
          </div>
        </div>

        {/* Active Items List */}
        <div className="flex flex-col px-4 pb-32">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold leading-tight">Itens Ativos ({purchases.length})</h3>
            <span
              onClick={() => onNavigate('purchase-history')}
              className="text-xs font-bold text-primary cursor-pointer hover:underline"
            >
              Ver Todos
            </span>
          </div>

          {purchases.length === 0 ? (
            <div className="bg-white p-6 rounded-xl border-none shadow-md text-center">
              <p className="text-gray-600 text-sm font-bold leading-relaxed mb-4">
                Por favor faça depósito para recarregar sua conta Amazon para comprar eletrónicos na Loja e começar a obter rendimentos.
              </p>
              <button
                onClick={() => onNavigate('deposit')}
                className="inline-flex items-center justify-center px-6 h-10 bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase rounded-lg active:scale-95 transition-all"
              >
                Depositar Agora
              </button>
            </div>
          ) : (
            purchases.map((purchase) => (
              <div key={purchase.id} className="group flex items-center gap-4 bg-white p-3 rounded-xl mb-3 border-none shadow-md transition-all">
                <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-white flex items-center justify-center p-1">
                  <div className={`absolute top-0 right-0 w-3 h-3 ${purchase.status === 'confirmado' ? 'bg-green-500' : (purchase.status === 'expirado' ? 'bg-red-500' : 'bg-primary')} rounded-full border-2 border-background-dark z-10 -mr-1 -mt-1`}></div>
                  {purchase.url_produtos ? (
                    <img alt={purchase.nome} className="object-contain w-full h-full" src={purchase.url_produtos} />
                  ) : (
                    <span className="material-symbols-outlined text-gray-600 text-[32px]">memory</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-bold text-black truncate">{purchase.nome}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-1.5 w-16 bg-gray-700 rounded-full overflow-hidden">
                      <div className={`h-full bg-primary rounded-full ${purchase.status === 'confirmado' ? 'w-[70%]' : 'w-0'}`}></div>
                    </div>
                    <span className="text-xs text-text-secondary">
                      {purchase.status === 'confirmado' ? 'Gerando...' : (purchase.status === 'expirado' ? 'Expirado' : 'Pendente')}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-black">+{purchase.renda_diaria.toLocaleString()} Kz</p>
                  <p className="text-xs text-text-secondary">/dia</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 12s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default GanhosTarefas;
