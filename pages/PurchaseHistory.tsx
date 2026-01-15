
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import SpokeSpinner from '../components/SpokeSpinner';

interface PurchaseHistoryProps {
  onNavigate: (page: any) => void;
  showToast?: (message: string, type: any) => void;
}

const PurchaseHistory: React.FC<PurchaseHistoryProps> = ({ onNavigate, showToast }) => {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let subscription: any;

    const setupRealtime = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      subscription = supabase
        .channel(`purchases-realtime-${user.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'historico_compra',
            filter: `uid_user=eq.${user.id}`
          },
          () => {
            fetchPurchases(false);
          }
        )
        .subscribe();
    };

    fetchPurchases(true);
    setupRealtime();

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const fetchPurchases = async (isInitial = false) => {
    if (isInitial) setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      onNavigate('login');
      return;
    }

    const { data, error } = await supabase
      .from('historico_compra')
      .select('*')
      .eq('uid_user', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      showToast?.("Erro ao carregar histórico", "error");
    } else {
      setPurchases(data || []);
    }
    setLoading(false);
  };

  const statusMap: any = {
    'pendente': { icon: 'schedule', color: 'text-yellow-500', bg: 'bg-yellow-500/10', label: 'Em Verificação' },
    'confirmado': { icon: 'check_circle', color: 'text-green-500', bg: 'bg-green-500/10', label: 'Confirmado' },
    'cancelado': { icon: 'cancel', color: 'text-red-500', bg: 'bg-red-500/10', label: 'Cancelado' }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-dark font-display text-black antialiased">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center bg-background-dark/95 backdrop-blur-md p-4 pb-2 border-b border-gray-200">
        <button
          onClick={() => onNavigate('profile')}
          className="text-yellow-500 flex size-12 shrink-0 items-center justify-start hover:bg-white/5 rounded-full transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>
        <h2 className="text-black text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-12">
          Histórico de Compras
        </h2>
      </header>

      <main className="flex-1 flex flex-col px-4 pt-4 pb-32">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <SpokeSpinner size="w-10 h-10" />
            <p className="text-gray-600 font-medium">Carregando...</p>
          </div>
        ) : purchases.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-10">
            <div className="size-24 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-gray-200">
              <span className="material-symbols-outlined text-gray-700 text-5xl">shopping_basket</span>
            </div>
            <h3 className="text-black font-bold text-lg mb-2">Nenhuma compra encontrada</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              Você ainda não realizou nenhuma compra em nossa loja de produtos eletrónicos.
            </p>
            <button
              onClick={() => onNavigate('shop')}
              className="px-8 h-12 bg-primary text-black font-bold rounded-xl hover:bg-primary-hover active:scale-95 transition-all"
            >
              Ir para a Loja
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {purchases.map(purchase => {
              const status = statusMap[purchase.status] || statusMap['pendente'];
              return (
                <div key={purchase.id} className="bg-surface-dark rounded-2xl p-4 border border-gray-200 hover:border-white/10 transition-all shadow-lg">
                  <div className="flex gap-4">
                    {purchase.url_produtos ? (
                      <img
                        src={purchase.url_produtos}
                        alt={purchase.nome}
                        className="size-16 shrink-0 rounded-xl object-cover border border-white/10 shadow-lg"
                      />
                    ) : (
                      <div className="size-16 shrink-0 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 text-primary">
                        <span className="material-symbols-outlined text-3xl">memory</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0 flex flex-col items-start text-left">
                      <div className="flex justify-between items-start w-full mb-0.5">
                        <h3 className="text-black text-sm font-bold truncate pr-2">{purchase.nome}</h3>
                        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${status.bg} border border-${status.color}/20`}>
                          <span className={`material-symbols-outlined text-[12px] ${status.color}`}>{status.icon}</span>
                          <span className={`${status.color} text-[9px] font-bold uppercase tracking-wider`}>{status.label}</span>
                        </div>
                      </div>
                      <p className="text-gray-500 text-[10px] font-medium mb-2 uppercase tracking-tight">Qtd: {purchase.quantidade} • IDs: {purchase.id.slice(0, 8)}</p>

                      <div className="grid grid-cols-2 w-full gap-4 mt-2">
                        <div className="flex flex-col">
                          <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Investido</span>
                          <span className="text-sm text-black font-black">{(purchase.preco_unitario * purchase.quantidade).toLocaleString()} Kz</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Lucro Total</span>
                          <span className="text-sm text-green-400 font-black">{purchase.lucro_total.toLocaleString()} Kz</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between">
                    <div className="flex flex-col items-start">
                      <span className="text-[9px] text-gray-500 uppercase font-bold">Data da Compra</span>
                      <span className="text-[11px] text-gray-700 font-bold">
                        {new Date(purchase.created_at).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <button className="h-8 px-4 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-wider hover:bg-white/10 transition-all active:scale-95">
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {purchases.length > 0 && (
          <div className="mt-12 text-center pb-10">
            <p className="text-gray-600 text-[11px] font-medium uppercase tracking-[0.2em]">Fim dos registros</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default PurchaseHistory;
