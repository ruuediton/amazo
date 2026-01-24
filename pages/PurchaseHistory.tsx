
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
        .select('name, image_url, category');

      if (productError) throw productError;

      const imageMap: Record<string, { url: string, cat: string }> = {};
      productData?.forEach(p => {
        imageMap[p.name.trim().toLowerCase()] = { url: p.image_url, cat: p.category };
      });

      const purchasesWithImages = purchaseData?.map(p => ({
        ...p,
        image_url: imageMap[p.nome_produto.trim().toLowerCase()]?.url || null,
        category: imageMap[p.nome_produto.trim().toLowerCase()]?.cat || 'Eletrônicos'
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
    'pendente': { label: 'Pendente', color: 'text-amber-600' },
    'confirmado': { label: 'Ativo', color: 'text-green-600' },
    'cancelado': { label: 'Cancelado', color: 'text-red-600' }
  };

  const formatPrice = (price: number) => {
    const [inteiro, centavos] = (price || 0).toFixed(2).split('.');
    return { inteiro, centavos };
  };

  return (
    <div className="bg-white min-h-screen text-[#0F1111] font-sans selection:bg-amber-100 pb-32">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center bg-white border-b border-gray-100 px-4 py-4">
        <button
          onClick={() => onNavigate('profile')}
          className="size-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all active:scale-90"
        >
          <span className="material-symbols-outlined text-[24px] text-[#0F1111]">arrow_back</span>
        </button>
        <h2 className="text-[#0F1111] text-[16px] font-bold flex-1 text-center pr-10">
          Meus Pedidos
        </h2>
      </header>

      <main className="max-w-md mx-auto bg-white">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <SpokeSpinner size="w-10 h-10" color="text-amber-500" />
          </div>
        ) : purchases.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-10 animate-in fade-in zoom-in duration-700">
            <div className="size-20 rounded-full bg-gray-50 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-gray-300 text-4xl">receipt_long</span>
            </div>
            <h3 className="text-[#0F1111] font-bold text-lg mb-2">Nenhum pedido</h3>
            <p className="text-[#565959] text-sm leading-relaxed mb-8">
              Você ainda não realizou nenhuma compra em nossa loja.
            </p>
            <button
              onClick={() => onNavigate('shop')}
              className="w-full py-3 bg-[#FFD814] hover:bg-[#F7CA00] rounded-full font-medium text-[14px] shadow-sm border border-[#FCD200]"
            >
              Começar a comprar
            </button>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-gray-100">
            {purchases.map((purchase, index) => {
              const { inteiro, centavos } = formatPrice(Number(purchase.preco) || 0);
              const status = statusMap[purchase.status] || statusMap['confirmado'];

              return (
                <div key={purchase.id} className="flex gap-4 p-4 items-start active:bg-gray-50 transition-colors animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 50}ms` }}>
                  {/* Left Side: Image */}
                  <div className="relative w-36 h-36 bg-gray-50 rounded-lg overflow-hidden shrink-0 flex items-center justify-center p-2 border border-gray-100">
                    <img
                      src={purchase.image_url || "/placeholder_product.png"}
                      alt={purchase.nome_produto}
                      className="max-w-full max-h-full object-contain"
                    />
                    <div className="absolute top-0 right-0 bg-[#0F1111]/10 px-2 py-0.5 rounded-bl-sm">
                      <span className="text-[9px] font-bold text-[#0F1111]">PID: {purchase.id.toString().slice(-4)}</span>
                    </div>
                  </div>

                  {/* Right Side: Info */}
                  <div className="flex-1 min-w-0 flex flex-col gap-1 pb-1">
                    <p className="text-[12px] text-[#565959] font-medium mb-0.5">
                      Comprado em: {new Date(purchase.data_compra).toLocaleDateString('pt-PT', { day: '2-digit', month: 'long' })}
                    </p>

                    <h3 className="text-[15px] font-medium leading-tight line-clamp-2 text-[#0F1111]">
                      {purchase.nome_produto}
                    </h3>

                    {/* Status Badge Style Amazon */}
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`text-[12px] font-bold ${status.color}`}>Pedido {status.label}</span>
                      <span className="size-1 bg-[#565959]/30 rounded-full"></span>
                      <span className="text-[12px] text-[#565959] font-medium">Ref: #AMZ-{purchase.id.toString().slice(0, 5)}</span>
                    </div>

                    {/* Price Section */}
                    <div className="flex items-start mt-1">
                      <span className="text-[13px] font-medium mt-1 pr-0.5 text-[#0F1111]">Kz</span>
                      <span className="text-[24px] font-bold leading-none text-[#0F1111]">{inteiro}</span>
                      <span className="text-[13px] font-medium mt-1 text-[#0F1111]">{centavos}</span>
                    </div>

                    {/* Yield Info Box */}
                    <div className="mt-2 p-2.5 rounded-lg bg-gray-50 border border-gray-100 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] text-[#565959] font-medium">Rendimento Diário:</span>
                        <span className="text-[11px] text-green-700 font-bold">+ Kz {Number(purchase.rendimento_diario || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] text-[#565959] font-medium">Vencimento:</span>
                        <span className="text-[11px] text-[#0F1111] font-bold">{new Date(purchase.data_expiracao).toLocaleDateString('pt-PT')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {purchases.length > 0 && (
          <div className="p-8 text-center bg-gray-50 border-t border-gray-100">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="material-symbols-outlined text-green-700 text-xl">shield</span>
              <p className="text-[12px] font-bold text-green-800">Pagamento Protegido Amazon</p>
            </div>
            <p className="text-[11px] text-[#565959] leading-relaxed">
              Suas informações de compra estão seguras. Se tiver problemas com o rendimento, entre em contato com o suporte.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default PurchaseHistory;
