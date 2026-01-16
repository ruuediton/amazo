
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import SpokeSpinner from '../components/SpokeSpinner';

interface ShopProps {
  onNavigate: (page: any) => void;
  showToast?: (message: string, type: any) => void;
  balance: number;
}

const Shop: React.FC<ShopProps> = ({ onNavigate, showToast, balance }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [userPurchasedCount, setUserPurchasedCount] = useState(0);
  const [isBuying, setIsBuying] = useState(false);

  useEffect(() => {
    fetchProducts();

    // Inscrição em tempo real para a tabela de produtos
    const productsSubscription = supabase
      .channel('products-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'produtos' },
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
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .eq('status', 'ativo')
      .order('preco', { ascending: true });

    if (error) {
      showToast?.("Erro ao carregar produtos", "error");
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  const handleOpenModal = async (product: any) => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      showToast?.("Sessão expirada. Faça login novamente.", "error");
      onNavigate('login');
      return;
    }

    // Buscar total já comprado pelo usuário para este produto (contagem de registros) na tabela historico_compra
    const { count, error } = await supabase
      .from('historico_compra')
      .select('*', { count: 'exact', head: true })
      .eq('uid_user', user.id)
      .eq('id_produto', product.id);

    if (error) {
      showToast?.("Erro ao verificar limite de compra", "error");
      setLoading(false);
      return;
    }

    const bought = count || 0;
    const available = product.stock - bought;

    if (available <= 0) {
      showToast?.(`Limite de compra atingido (${product.stock} unidades).`, "warning");
      setLoading(false);
      return;
    }

    setUserPurchasedCount(bought);
    setSelectedProduct(product);
    setQuantity(1);
    setLoading(false);
  };

  const handlePurchase = async () => {
    if (!selectedProduct) return;

    // Validação final de limite (já comprado + selecionado agora)
    const available = selectedProduct.stock - userPurchasedCount;
    if (quantity > available) {
      showToast?.("Você ultrapassou o limite máximo de compra permitido.", "error");
      return;
    }

    const totalCost = selectedProduct.preco * quantity;
    if (balance < totalCost) {
      showToast?.("Saldo insuficiente para esta compra", "error");
      return;
    }

    setIsBuying(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      onNavigate('login');
      return;
    }

    const lucroTotalPorUnidade = selectedProduct.renda_diaria * selectedProduct.duracao_dias;

    // Cada unidade gera um registro próprio na tabela historico_compra
    const purchases = Array.from({ length: quantity }).map(() => ({
      uid_user: user.id,
      id_produto: selectedProduct.id,
      nome: selectedProduct.nome,
      descricao: selectedProduct.descricao,
      preco_unitario: selectedProduct.preco,
      renda_diaria: selectedProduct.renda_diaria,
      duracao_dias: selectedProduct.duracao_dias,
      quantidade: 1, // Sempre 1 por registro
      lucro_total: lucroTotalPorUnidade,
      status: 'confirmado',
      url_produtos: selectedProduct.url_produto
    }));

    const { error: insertError } = await supabase.from('historico_compra').insert(purchases);

    if (insertError) {
      showToast?.("Erro ao registrar compra: " + insertError.message, "error");
    } else {
      // Debitar saldo do usuário na tabela public.profiles
      // Usamos .eq('user_id', user.id) para coincidir com a política RLS e estrutura da tabela
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ balance: balance - totalCost })
        .eq('user_id', user.id);

      if (updateError) {
        showToast?.("Compra registrada, mas houve um erro ao atualizar saldo.", "warning");
      } else {
        showToast?.(`Compra realizada! ${quantity} unidade(s) debitada(s) com sucesso.`, "success");
      }

      setSelectedProduct(null);
      onNavigate('purchase-history');
    }
    setIsBuying(false);
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-slate-900 font-sans antialiased pb-28">
      {/* Header */}
      <header className="sticky top-0 z-[60] bg-white border-b border-slate-100 px-4 py-3">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <h1 className="text-xl font-bold tracking-tight">Produtos</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => showToast?.("Funcionalidade de busca em breve", "info")}
              className="material-symbols-outlined text-slate-500 hover:text-slate-900 transition-colors"
            >
              search
            </button>
            <button
              onClick={() => onNavigate('purchase-history')}
              className="material-symbols-outlined text-slate-500 hover:text-slate-900 transition-colors"
            >
              notifications
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto p-3 space-y-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <SpokeSpinner size="w-12 h-12" />
            <p className="text-slate-500 font-medium">Carregando produtos...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="material-symbols-outlined text-slate-300 text-6xl mb-4">inventory_2</span>
            <p className="text-slate-500">Nenhum produto disponível no momento.</p>
          </div>
        ) : (
          products.map(product => (
            <div
              key={product.id}
              className={`bg-white rounded-xl p-3 border border-slate-100 relative shadow-sm transition-all hover:shadow-md ${product.stock <= 0 ? 'grayscale opacity-70' : ''}`}
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
            >
              {product.stock <= 0 && (
                <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-tr-xl rounded-bl-xl z-20 uppercase">
                  Esgotado
                </div>
              )}
              <div className="flex gap-3">
                <div className="w-24 h-24 bg-slate-50 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden border border-slate-50">
                  {product.url_produto ? (
                    <img
                      alt={product.nome}
                      className="object-contain w-full h-full"
                      src={product.url_produto}
                    />
                  ) : (
                    <span className="material-symbols-outlined text-4xl text-slate-200">devices</span>
                  )}
                </div>
                <div className="flex-grow min-w-0">
                  <h3 className="font-bold text-[15px] text-slate-900 truncate uppercase mt-0.5">{product.nome}</h3>
                  <p className="text-[11px] text-slate-500 mt-1 leading-tight whitespace-pre-line">
                    {product.descricao}
                  </p>
                  <div className="mt-2.5 space-y-0.5">
                    <div className="flex items-baseline gap-1">
                      <span className="text-[12px] font-medium text-slate-600">Kz:</span>
                      <span className="text-[#CC0000] font-extrabold text-[15px]">{product.preco.toLocaleString()}</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-[12px] font-medium text-slate-600">renda diária:</span>
                      <span className="text-[#CC0000] font-extrabold text-[15px]">{product.renda_diaria.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleOpenModal(product)}
                disabled={product.stock <= 0}
                className={`absolute bottom-3 right-3 py-1.5 px-6 rounded-md text-xs font-bold transition-all shadow-sm active:scale-95 ${product.stock > 0
                  ? 'bg-[#FFD814] hover:bg-[#FFA41C] text-slate-900'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
              >
                Comprar
              </button>
            </div>
          ))
        )}
      </main>

      {/* Navigation from snippet adapted with onNavigate */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-100 px-2 pt-2 pb-[env(safe-area-inset-bottom,8px)] z-50">
        <div className="flex items-center justify-around max-w-md mx-auto h-14">
          <button
            onClick={() => onNavigate('home')}
            className="flex flex-col items-center justify-center space-y-1 group w-1/4"
          >
            <span className="material-symbols-outlined text-slate-400 group-hover:text-[#FFD814] transition-colors">home</span>
            <span className="text-[10px] font-medium text-slate-500">Página Inicial</span>
          </button>
          <button
            onClick={() => onNavigate('shop')}
            className="flex flex-col items-center justify-center space-y-1 group w-1/4"
          >
            <span className="material-symbols-outlined text-[#FFA41C]">shopping_cart</span>
            <span className="text-[10px] font-bold text-slate-900">Produtos</span>
          </button>
          <button
            onClick={() => onNavigate('team')}
            className="flex flex-col items-center justify-center space-y-1 group w-1/4"
          >
            <span className="material-symbols-outlined text-slate-400 group-hover:text-[#FFD814] transition-colors">group</span>
            <span className="text-[10px] font-medium text-slate-500">Equipe</span>
          </button>
          <button
            onClick={() => onNavigate('profile')}
            className="flex flex-col items-center justify-center space-y-1 group w-1/4"
          >
            <span className="material-symbols-outlined text-slate-400 group-hover:text-[#FFD814] transition-colors">person</span>
            <span className="text-[10px] font-medium text-slate-500">Meu</span>
          </button>
        </div>
      </nav>

      {/* Purchase Modal (Refactored for Light Mode) */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-5">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 flex flex-col shadow-2xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-start mb-5">
              <h3 className="text-xl font-bold text-slate-900">Confirmar Compra</h3>
              <button
                onClick={() => setSelectedProduct(null)}
                className="size-9 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-slate-900 transition-colors"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-5 text-left">
              <p className="text-[#FFA41C] text-[10px] font-bold uppercase tracking-widest mb-1">{selectedProduct.nome}</p>
              <h4 className="text-slate-900 font-extrabold text-xl mb-1">{selectedProduct.preco.toLocaleString()} Kz</h4>
              <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">{selectedProduct.descricao}</p>
            </div>

            <div className="flex flex-col gap-4 mb-6">
              <div className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-slate-100 shadow-sm">
                <span className="text-sm font-semibold text-slate-700">Quantidade</span>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="size-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors text-slate-600"
                  >
                    <span className="material-symbols-outlined text-lg">remove</span>
                  </button>
                  <span className="text-lg font-bold w-4 text-center text-slate-900">{quantity}</span>
                  <button
                    disabled={quantity >= (selectedProduct.stock - userPurchasedCount)}
                    onClick={() => setQuantity(quantity + 1)}
                    className={`size-8 rounded-lg flex items-center justify-center transition-all shadow-sm ${quantity >= (selectedProduct.stock - userPurchasedCount)
                      ? 'bg-slate-50 text-slate-300 cursor-not-allowed'
                      : 'bg-[#FFD814] text-slate-900 hover:bg-[#FFA41C]'
                      }`}
                  >
                    <span className="material-symbols-outlined text-lg">add</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-left">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">Custo Total</span>
                  <p className="text-slate-900 font-bold">{(selectedProduct.preco * quantity).toLocaleString()} Kz</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-left">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">Lucro Final</span>
                  <p className="text-green-600 font-bold">{(selectedProduct.renda_diaria * selectedProduct.duracao_dias * quantity).toLocaleString()} Kz</p>
                </div>
              </div>
            </div>

            <button
              disabled={isBuying || balance < (selectedProduct.preco * quantity)}
              onClick={handlePurchase}
              className={`w-full h-14 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-[0.97] shadow-lg ${balance >= (selectedProduct.preco * quantity)
                ? 'bg-[#FFD814] text-slate-900 shadow-[#FFD814]/20'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-80'
                }`}
            >
              {isBuying ? (
                <SpokeSpinner size="w-6 h-6" className="text-slate-900" />
              ) : (
                <>
                  <span className="material-symbols-outlined">payments</span>
                  {balance < (selectedProduct.preco * quantity) ? 'Saldo Insuficiente' : 'Confirmar Pagamento'}
                </>
              )}
            </button>
            <p className="text-center text-[10px] text-slate-400 mt-4 font-semibold uppercase tracking-widest">Transação Segura</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
