
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import SpokeSpinner from '../components/SpokeSpinner';
import { useLoading } from '../contexts/LoadingContext';

interface ShopProps {
  onNavigate: (page: any) => void;
  showToast?: (message: string, type: any) => void;
  balance: number;
}

const Shop: React.FC<ShopProps> = ({ onNavigate, showToast, balance }) => {
  const { withLoading } = useLoading();
  const [products, setProducts] = useState<any[]>([]);
  const [purchasedIds, setPurchasedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isBuying, setIsBuying] = useState(false);

  useEffect(() => {
    fetchInitialData();

    const productsSubscription = supabase
      .channel('shop-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => fetchProducts())
      .subscribe();

    return () => {
      productsSubscription.unsubscribe();
    };
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    await Promise.all([fetchProducts(), fetchUserPurchases()]);
    setLoading(false);
  };

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'active')
      .order('price', { ascending: true });

    if (data) setProducts(data);
  };

  const fetchUserPurchases = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('historico_compras')
      .select('product_id')
      .eq('user_id', user.id);

    if (data) setPurchasedIds(data.map(p => p.product_id));
  };

  const handleOpenModal = React.useCallback((product: any) => {
    if (purchasedIds.includes(product.id)) {
      showToast?.("Limite excedido, compre outro!", "warning");
      return;
    }
    setSelectedProduct(product);
  }, [purchasedIds, showToast]);

  const handlePurchase = async () => {
    if (!selectedProduct) return;

    setIsBuying(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Sessão expirada");

      if (balance < selectedProduct.price) {
        throw new Error("Balance insuficiente");
      }

      const { data, error } = await supabase.rpc('purchase_product', {
        p_product_id: selectedProduct.id,
        p_user_id: user.id
      });

      if (error) throw error;
      if (data?.success === false) throw new Error(data.message);

      setSelectedProduct(null);
      showToast?.(data?.message || `Compra sucedida!`, "success");
      setPurchasedIds(prev => [...prev, selectedProduct.id]);

      setTimeout(() => onNavigate('purchase-history'), 1000);
    } catch (error: any) {
      showToast?.(error.message || "Falha na transação", "error");
    } finally {
      setIsBuying(false);
    }
  };

  const formatPrice = React.useCallback((price: number) => {
    const [inteiro, centavos] = price.toFixed(2).split('.');
    return { inteiro, centavos };
  }, []);

  return (
    <div className="bg-white min-h-screen text-[#0F1111] font-sans selection:bg-amber-100 pb-32">
      {/* Header fake similar a BP opcional se necessário */}

      <main className="max-w-md mx-auto bg-white">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <SpokeSpinner size="w-10 h-10" color="text-[#00C853]" />
          </div>
        ) : (
          <div className="flex flex-col gap-6 py-4">
            {products.map((product) => {
              const { inteiro, centavos } = formatPrice(product.price);
              const isPurchased = purchasedIds.includes(product.id);

              return (
                <div key={product.id} className="flex gap-4 p-4 mx-4 items-start active:bg-gray-50 transition-colors bg-white rounded-2xl shadow-sm border border-gray-50">
                  {/* Left Side: Image Container */}
                  <div className="relative w-32 h-32 bg-gray-50 rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-2">
                    <img loading="lazy" decoding="async"
                      src={product.image_url || "/placeholder_product.png"}
                      alt={product.name}
                      className="max-w-full max-h-full object-contain"
                    />
                    <div className={`absolute bottom-1.5 left-1.5 size-7 rounded-md flex items-center justify-center border shadow-sm ${product.status === 'active' ? 'bg-green-50/90 border-green-100 text-[#00C853]' : 'bg-red-50/90 border-red-100 text-red-500'}`}>
                      <span className="material-symbols-outlined text-[18px]">
                        {product.status === 'active' ? 'verified' : 'unpublished'}
                      </span>
                    </div>

                    {/* Badge */}
                    {product.price < 5000 && (
                      <div className="absolute top-0 left-0 bg-[#CC0C39] text-white text-[9px] font-black px-2 py-0.5 rounded-br-lg uppercase tracking-wider">TOP</div>
                    )}
                  </div>

                  {/* Right Side: Info */}
                  <div className="flex-1 min-w-0 flex flex-col">
                    <h3 className="text-[16px] font-bold leading-tight text-[#0F1111] mb-1">
                      {product.name}
                    </h3>

                    <div className="flex flex-col gap-0.5 mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[12px] font-bold text-[#00C853]">Renda:</span>
                        <span className="text-[12px] font-black text-black">Kz {product.daily_income?.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[12px] font-bold text-[#00C853]">Duração:</span>
                        <span className="text-[12px] font-black text-black">{product.duration_days} dias</span>
                      </div>
                      <p className="text-[11px] text-gray-400 line-clamp-1 mt-1 font-medium">
                        {product.description || 'Produto oficial BP ENERGY.'}
                      </p>
                    </div>

                    {/* Price & Status Section */}
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-start">
                        <span className="text-[11px] font-bold mt-1 pr-0.5">Kz</span>
                        <span className="text-[20px] font-black leading-none">{inteiro}</span>
                        <span className="text-[11px] font-bold mt-1">{centavos}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[#00C853] text-[14px]">verified</span>
                        <span className="text-[10px] text-[#00C853] font-black uppercase">Luanda</span>
                      </div>
                    </div>

                    {/* Action Button - COMPACTED */}
                    <div className="mt-3">
                      <button
                        onClick={() => handleOpenModal(product)}
                        disabled={isPurchased}
                        className={`w-full h-10 rounded-xl text-[13px] font-black transition-all active:scale-[0.98] shadow-sm ${isPurchased
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                          : 'bg-[#00C853] hover:brightness-105 text-black'
                          }`}
                      >
                        {isPurchased ? 'Adquirido' : 'Comprar'}
                      </button>

                      {isPurchased && (
                        <p className="text-[9px] text-red-500 font-black mt-1 text-center uppercase tracking-tighter">Limite Atingido</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Confirmation Modal - Simplified */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-6">
          <div
            className="absolute inset-0"
            onClick={() => !isBuying && setSelectedProduct(null)}
          />
          <div className="relative w-full max-w-sm bg-white rounded-2xl p-6 border border-gray-100 animate-in zoom-in-95 duration-300">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Confirmar Compra</h3>
            <p className="text-gray-600 text-[14px] leading-relaxed mb-6">
              Deseja adquirir o item <span className="font-bold">"{selectedProduct.name}"</span> pelo valor de <span className="font-bold text-black">Kz {selectedProduct.price.toLocaleString()}</span>?
              Esta operação não pode ser desfeita.
            </p>

            <div className="flex flex-col gap-2">
              <button
                disabled={isBuying}
                onClick={handlePurchase}
                className="w-full h-12 bg-[#00C853] hover:bg-[#00C853] rounded-full font-bold text-[14px] transition-all active:scale-95 flex items-center justify-center font-black"
              >
                {isBuying ? <SpokeSpinner size="w-5 h-5" color="text-black" /> : 'Confirmar'}
              </button>
              <button
                disabled={isBuying}
                onClick={() => setSelectedProduct(null)}
                className="w-full h-12 bg-white hover:bg-gray-50 border border-gray-300 rounded-full font-bold text-[14px] transition-colors"
              >
                Cancelar
              </button>
            </div>
            <p className="text-[10px] text-center text-gray-400 mt-4 uppercase tracking-widest font-bold">Compra Segura BP</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;

