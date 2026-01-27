
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

  const handleOpenModal = (product: any) => {
    if (purchasedIds.includes(product.id)) {
      showToast?.("Limite excedido, compre outro!", "warning");
      return;
    }
    setSelectedProduct(product);
  };

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

  const formatPrice = (price: number) => {
    const [inteiro, centavos] = price.toFixed(2).split('.');
    return { inteiro, centavos };
  };

  return (
    <div className="bg-white min-h-screen text-[#0F1111] font-sans selection:bg-amber-100 pb-32">
      {/* Header fake similar a BP opcional se necessário */}

      <main className="max-w-md mx-auto bg-white">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <SpokeSpinner size="w-10 h-10" color="text-[#00C853]" />
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-gray-100">
            {products.map((product) => {
              const { inteiro, centavos } = formatPrice(product.price);
              const isPurchased = purchasedIds.includes(product.id);

              return (
                <div key={product.id} className="flex gap-4 p-4 items-start active:bg-gray-50 transition-colors">
                  {/* Left Side: Image Container */}
                  <div className="relative w-36 h-36 bg-gray-50 rounded-lg overflow-hidden shrink-0 flex items-center justify-center p-2">
                    <img
                      src={product.image_url || "/placeholder_product.png"}
                      alt={product.name}
                      className="max-w-full max-h-full object-contain"
                    />
                    <button className="absolute bottom-2 left-2 size-8 bg-white/90 backdrop-blur rounded shadow-sm flex items-center justify-center border border-gray-100">
                      <span className="material-symbols-outlined text-[20px] text-gray-400">add_to_photos</span>
                    </button>

                    {/* Badge */}
                    {product.price < 5000 && (
                      <div className="absolute top-0 left-0 bg-[#CC0C39] text-white text-[10px] font-bold px-2 py-0.5 rounded-br-sm uppercase">Mais Vendido</div>
                    )}
                  </div>

                  {/* Right Side: Info */}
                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    <p className="text-[12px] text-gray-500 font-medium mb-1">
                      {product.category || 'Escolha geral'}
                      <span className="material-symbols-outlined text-[14px] align-middle ml-1">info</span>
                    </p>

                    <h3 className="text-[15px] font-medium leading-tight line-clamp-3 text-[#0F1111]">
                      {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-[14px] font-bold text-[#565959] leading-none">4,7</span>
                      <div className="flex text-[#00C853]">
                        {Array(5).fill(0).map((_, i) => (
                          <span key={i} className="material-symbols-filled text-[14px]">star</span>
                        ))}
                      </div>
                      <span className="text-[14px] text-[#007185] font-medium">(3,5 mil)</span>
                    </div>

                    <p className="text-[13px] text-[#565959] font-medium">Mais de 50 compras no mês passado</p>

                    {/* Price Section */}
                    <div className="flex items-start mt-1">
                      <span className="text-[13px] font-medium mt-1 pr-0.5">Kz</span>
                      <span className="text-[28px] font-bold leading-none">{inteiro}</span>
                      <span className="text-[13px] font-medium mt-1">{centavos}</span>
                    </div>

                    <div className="space-y-0.5 mt-1">
                      <p className="text-[13px] text-[#0F1111]">Entrega <span className="font-bold">GRÁTIS: Amanhã</span></p>
                      <p className="text-[13px] text-[#565959]">Envia para Angola</p>
                    </div>

                    <div className="flex items-center gap-1.5 mt-2 mb-3">
                      <span className="material-symbols-outlined text-green-700 text-[18px]">recycling</span>
                      <span className="text-[12px] text-green-800 font-bold border-b border-green-800 leading-none">1 certificação de sustentabilidade</span>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleOpenModal(product)}
                      disabled={isPurchased}
                      className={`w-full py-2.5 rounded-full text-[13px] font-medium shadow-sm transition-all active:scale-[0.98] ${isPurchased
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                        : 'bg-[#00C853] hover:bg-[#00C853] text-black border border-[#00C853]'
                        }`}
                    >
                      {isPurchased ? 'Já adquirido' : 'Adicionar ao carrinho'}
                    </button>

                    {isPurchased && (
                      <p className="text-[11px] text-red-600 font-bold mt-1 animate-pulse">Apenas 1 unidade por cliente</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Confirmation Modal - Simplified */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-6">
          <div
            className="absolute inset-0"
            onClick={() => !isBuying && setSelectedProduct(null)}
          />
          <div className="relative w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-300">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Confirmar Compra</h3>
            <p className="text-gray-600 text-[14px] leading-relaxed mb-6">
              Deseja adquirir o item <span className="font-bold">"{selectedProduct.name}"</span> pelo valor de <span className="font-bold text-black">Kz {selectedProduct.price.toLocaleString()}</span>?
              Esta operação não pode ser desfeita.
            </p>

            <div className="flex flex-col gap-2">
              <button
                disabled={isBuying}
                onClick={handlePurchase}
                className="w-full h-12 bg-[#00C853] hover:bg-[#00C853] rounded-full font-bold text-[14px] shadow-sm transition-all active:scale-95 flex items-center justify-center"
              >
                {isBuying ? <SpokeSpinner size="w-5 h-5" color="text-black" /> : 'Confirmar e Pagar'}
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

