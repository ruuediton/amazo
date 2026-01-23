
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
            table: 'historico_compras',
            filter: `user_id=eq.${user.id}`
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

    try {
      const { data: purchaseData, error: purchaseError } = await supabase
        .from('historico_compras')
        .select('*')
        .eq('user_id', user.id)
        .order('data_compra', { ascending: false });

      if (purchaseError) throw purchaseError;

      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('name, image_url');

      if (productError) throw productError;

      const imageMap: Record<string, string> = {};
      productData?.forEach(p => {
        imageMap[p.name.trim().toLowerCase()] = p.image_url;
      });

      const purchasesWithImages = purchaseData?.map(p => ({
        ...p,
        image_url: imageMap[p.nome_produto.trim().toLowerCase()] || null
      }));

      setPurchases(purchasesWithImages || []);
    } catch (error: any) {
      console.error(error);
      showToast?.("Erro ao carregar histórico", "error");
    } finally {
      setLoading(false);
    }
  };

  const statusMap: any = {
    'pendente': { icon: 'history', color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100', label: 'Pendente' },
    'confirmado': { icon: 'verified', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100', label: 'Ativo' },
    'cancelado': { icon: 'cancel', color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-100', label: 'Cancelado' }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] font-sans text-slate-900 antialiased">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center bg-white/80 backdrop-blur-xl p-4 border-b border-slate-100">
        <button
          onClick={() => onNavigate('profile')}
          className="size-10 flex items-center justify-center bg-slate-50 rounded-full hover:bg-slate-100 transition-all active:scale-90"
        >
          <span className="material-symbols-outlined text-[20px] text-slate-600">arrow_back</span>
        </button>
        <h2 className="text-slate-900 text-base font-black uppercase tracking-widest flex-1 text-center pr-10">
          Meus Investimentos
        </h2>
      </header>

      <main className="flex-1 flex flex-col px-4 pt-6 pb-32 max-w-md mx-auto w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <SpokeSpinner size="w-10 h-10" />
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest animate-pulse">Sincronizando...</p>
          </div>
        ) : purchases.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-10 animate-in fade-in zoom-in duration-700">
            <div className="size-20 rounded-[32px] bg-white flex items-center justify-center mb-6 shadow-xl border border-slate-50">
              <span className="material-symbols-outlined text-slate-300 text-4xl">inventory</span>
            </div>
            <h3 className="text-slate-900 font-black text-lg mb-2 uppercase tracking-tight">Sem Ativos</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-8 font-medium">
              Você ainda não possui investimentos ativos em sua carteira.
            </p>
            <button
              onClick={() => onNavigate('shop')}
              className="w-full h-14 bg-blue-600 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-100"
            >
              Explorar Loja
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {purchases.map((purchase, index) => {
              const status = statusMap[purchase.status] || statusMap['pendente'];
              return (
                <div
                  key={purchase.id}
                  className="bg-white rounded-[32px] p-5 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] border border-slate-100 animate-in slide-in-from-bottom-10 fade-in duration-500"
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
                >
                  <div className="flex gap-5">
                    {/* Image Box */}
                    <div className="size-20 shrink-0 rounded-2xl bg-[#F8FAFC] flex items-center justify-center border border-slate-50 overflow-hidden shadow-inner group">
                      {purchase.image_url ? (
                        <img
                          src={purchase.image_url}
                          alt={purchase.nome_produto}
                          className="w-4/5 h-4/5 object-contain scale-110 group-hover:scale-125 transition-transform"
                        />
                      ) : (
                        <span className="material-symbols-outlined text-3xl text-slate-200">devices</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div className="flex justify-between items-start w-full mb-1">
                        <h3 className="text-slate-900 text-[13px] font-black uppercase tracking-tight truncate pr-2">{purchase.nome_produto}</h3>
                        <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${status.bg} border ${status.border}`}>
                          <span className={`material-symbols-outlined text-[14px] ${status.color}`}>{status.icon}</span>
                          <span className={`${status.color} text-[9px] font-black uppercase tracking-widest`}>{status.label}</span>
                        </div>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Valor Investido</span>
                        <span className="text-lg font-black text-slate-900 tracking-tighter">
                          {(Number(purchase.preco) || 0).toLocaleString()} <span className="text-xs">Kz</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-4">
                    <div className="bg-[#F8FAFC] rounded-2xl p-3 border border-slate-50">
                      <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest block mb-0.5">Retorno Diário</span>
                      <span className="text-sm text-green-600 font-extrabold">
                        +{(Number(purchase.rendimento_diario) || 0).toLocaleString()} Kz
                      </span>
                    </div>
                    <div className="bg-[#F8FAFC] rounded-2xl p-3 border border-slate-50">
                      <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest block mb-0.5">Expiração</span>
                      <span className="text-sm text-slate-900 font-extrabold">
                        {new Date(purchase.data_expiracao).toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between px-1">
                    <span className="text-[10px] text-slate-300 font-bold">Ref: #AMZ-{purchase.id}</span>
                    <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">event</span>
                      {new Date(purchase.data_compra).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {purchases.length > 0 && (
          <div className="mt-12 text-center pb-10">
            <span className="text-slate-300 text-[9px] font-black uppercase tracking-[0.3em]">Cofre Digital Criptografado</span>
          </div>
        )}
      </main>
    </div>
  );
};

export default PurchaseHistory;
