
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
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [isBuying, setIsBuying] = useState(false);

  useEffect(() => {
    fetchProducts();

    const productsSubscription = supabase
      .channel('products-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        () => {
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      productsSubscription.unsubscribe();
    };
  }, []);

  const fetchProducts = async (isInitial = false) => {
    if (isInitial) setLoading(true);
    await withLoading(async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .order('price', { ascending: true });

      if (error) {
        showToast?.("Tente novamente", "error");
      } else {
        setProducts(data || []);
      }
    });
    setLoading(false);
  };

  const handleOpenModal = (product: any) => {
    setSelectedProduct(product);
    setQuantity(1);
  };

  const handlePurchase = async () => {
    if (!selectedProduct) return;

    await withLoading(async () => {
      setIsBuying(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          showToast?.("Sessão expirada. Faça login novamente.", "error");
          onNavigate('login');
          return;
        }

        // Realizar validação de limite aqui dentro do processo de compra
        const { count, error: countError } = await supabase
          .from('historico_compras')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('nome_produto', selectedProduct.name);

        if (countError) throw countError;

        const bought = count || 0;
        const available = selectedProduct.purchase_limit - bought;

        if (quantity > available) {
          showToast?.(`Limite atingido (${selectedProduct.purchase_limit} unidades).`, "error");
          return;
        }

        const totalCost = selectedProduct.price * quantity;
        if (balance < totalCost) {
          showToast?.("Saldo insuficiente", "error");
          return;
        }

        // Usar a RPC purchase_product do banco de dados para segurança
        for (let i = 0; i < quantity; i++) {
          const { data, error } = await supabase.rpc('purchase_product', {
            p_product_id: selectedProduct.id,
            p_user_id: user.id
          });

          if (error) throw error;
          if (data && data.success === false) {
            throw new Error(data.message);
          }
        }

        showToast?.(`Compra realizada com sucesso!`, "success");
        setSelectedProduct(null);
        onNavigate('purchase-history');
      } catch (error: any) {
        showToast?.(error.message || "Tente novamente", "error");
      } finally {
        setIsBuying(false);
      }
    });
  };

  return (
    <div className="bg-white min-h-screen text-slate-900 font-sans antialiased pb-32">
      <main className="max-w-md mx-auto p-4 space-y-5 pt-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <SpokeSpinner size="w-12 h-12" />
            <p className="text-slate-400 font-medium animate-pulse text-sm">Preparando loja...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-700">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-slate-300 text-4xl">inventory_2</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Loja Vazia</h3>
            <p className="text-slate-400 text-sm">Nenhum produto disponível no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="group relative bg-white rounded-3xl p-4 border border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] transition-all active:scale-[0.98] animate-in slide-in-from-bottom-8 fade-in"
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
              >
                {product.purchase_limit <= 0 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full z-20 uppercase tracking-widest shadow-lg">
                    Esgotado
                  </div>
                )}

                <div className="flex flex-col gap-4">
                  {/* Image Container with Zoom Effect */}
                  <div className="w-full aspect-square bg-[#F8FAFC] rounded-2xl flex items-center justify-center overflow-hidden border border-slate-50 relative group-hover:shadow-inner">
                    {product.image_url ? (
                      <img
                        alt={product.name}
                        className="object-contain w-3/4 h-3/4 scale-110 group-hover:scale-125 transition-transform duration-700 ease-out"
                        src={product.image_url}
                      />
                    ) : (
                      <span className="material-symbols-outlined text-6xl text-slate-200">devices</span>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <div className="flex flex-col flex-1 px-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-extrabold text-lg text-slate-900 leading-tight uppercase tracking-tight">{product.name}</h3>
                      <div className="bg-primary/10 px-2 py-0.5 rounded-lg">
                        <span className="text-primary font-black text-xs">NOVO</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Preço:</span>
                        <span className="text-2xl font-black text-[#CC0000] tracking-tighter">
                          {product.price.toLocaleString()} <span className="text-sm">Kz</span>
                        </span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Renda/Dia:</span>
                        <span className="text-lg font-black text-green-600 tracking-tighter">
                          +{product.daily_income.toLocaleString()} <span className="text-xs">Kz</span>
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenModal(product)}
                      disabled={product.purchase_limit <= 0}
                      className={`w-full mt-5 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 ${product.purchase_limit > 0
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                        }`}
                    >
                      Comprar Agora
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Purchase Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0" onClick={() => !isBuying && setSelectedProduct(null)}></div>
          <div className="relative w-full max-w-[320px] bg-white rounded-[40px] p-8 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 border border-slate-100 flex flex-col items-center">

            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6 border border-slate-100 overflow-hidden">
              {selectedProduct.image_url ? (
                <img src={selectedProduct.image_url} alt={selectedProduct.name} className="w-3/4 h-3/4 object-contain" />
              ) : (
                <span className="material-symbols-outlined text-4xl text-slate-200">shopping_bag</span>
              )}
            </div>

            <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight text-center">{selectedProduct.name}</h3>

            <p className="text-sm text-slate-400 font-medium mb-8 px-2 text-center">
              Confirme a quantidade que deseja adquirir para iniciar seus rendimentos.
            </p>

            <div className="flex items-center justify-center gap-8 mb-8 w-full">
              <button
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                className="size-12 rounded-2xl border-2 border-slate-100 flex items-center justify-center text-slate-900 hover:bg-slate-50 active:scale-90 transition-all font-bold text-xl"
              >
                <span className="material-symbols-outlined text-[24px]">remove</span>
              </button>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-black text-slate-900 leading-none">{quantity}</span>
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-2">unid</span>
              </div>
              <button
                onClick={() => setQuantity(prev => {
                  const available = selectedProduct.purchase_limit - (selectedProduct.bought_count || 0);
                  return prev < available ? prev + 1 : prev;
                })}
                className="size-12 rounded-2xl border-2 border-slate-100 flex items-center justify-center text-slate-900 hover:bg-slate-50 active:scale-90 transition-all font-bold text-xl bg-slate-50"
              >
                <span className="material-symbols-outlined text-[24px]">add</span>
              </button>
            </div>

            <div className="bg-[#F8FAFC] rounded-3xl p-5 border border-slate-100 mb-8 w-full flex justify-between items-center shadow-inner">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total do Investimento:</span>
              <span className="text-xl font-black text-blue-600">{(selectedProduct.price * quantity).toLocaleString()} <span className="text-xs">Kz</span></span>
            </div>

            <div className="flex flex-col w-full gap-3">
              <button
                disabled={isBuying || balance < selectedProduct.price * quantity}
                onClick={handlePurchase}
                className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 shadow-lg ${balance >= selectedProduct.price * quantity
                  ? 'bg-blue-600 text-white shadow-blue-200'
                  : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                  }`}
              >
                {isBuying ? (
                  <div className="flex items-center justify-center gap-2">
                    <SpokeSpinner size="w-4 h-4" />
                    <span>Processando...</span>
                  </div>
                ) : balance < selectedProduct.price * quantity ? 'Saldo Insuficiente' : 'Confirmar Compra'}
              </button>
              <button
                disabled={isBuying}
                onClick={() => setSelectedProduct(null)}
                className="w-full py-3 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-600 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
