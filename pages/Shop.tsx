
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
    <div className="bg-background-dark font-display text-black antialiased min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background-dark/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">

          <h1 className="text-black text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-2">Loja de Eletrônicos</h1>
          <button
            onClick={() => onNavigate('purchase-history')}
            className="flex items-center justify-center size-10 rounded-full bg-white/10 border border-gray-200 hover:bg-white/20 active:scale-95 transition-all text-primary"
          >
            <span className="material-symbols-outlined text-[24px]">receipt_long</span>
          </button>
        </div>
      </header>

      <main className="flex flex-col gap-5 px-4 pb-4 pt-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <SpokeSpinner size="w-12 h-12" />
            <p className="text-gray-600 font-medium">Carregando produtos...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="material-symbols-outlined text-gray-700 text-6xl mb-4">inventory_2</span>
            <p className="text-gray-600">Nenhum produto disponível no momento.</p>
          </div>
        ) : (
          products.map(product => (
            <article key={product.id} className={`flex flex-col bg-surface-dark rounded-xl overflow-hidden shadow-lg border border-gray-200 relative ${product.stock <= 0 ? 'grayscale opacity-70' : ''}`}>
              {product.stock <= 0 && (
                <div className="absolute top-0 right-0 bg-red-500 text-black text-[10px] font-bold px-3 py-1 rounded-bl-xl z-20 shadow-sm uppercase">
                  Esgotado
                </div>
              )}
              <div className="p-4">
                <div className="flex gap-4 mb-4">
                  {product.url_produto ? (
                    <img
                      src={product.url_produto}
                      alt={product.nome}
                      className="size-20 shrink-0 rounded-lg object-cover border border-white/10 shadow-inner"
                    />
                  ) : (
                    <div className="size-20 shrink-0 rounded-lg bg-white/10 flex items-center justify-center text-primary border border-white/10">
                      <span className="material-symbols-outlined text-4xl">devices</span>
                    </div>
                  )}
                  <div className="flex flex-col flex-1 min-w-0 text-left">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Eletrónico</span>
                      <div className="flex text-primary text-[10px] gap-0.5">
                        <span className="material-symbols-outlined text-[14px]">inventory</span>
                        <span className="text-gray-600 ml-1 font-medium">{product.stock} em estoque</span>
                      </div>
                    </div>
                    <h3 className="text-black text-base font-bold leading-tight truncate mb-1">{product.nome}</h3>
                    <p className="text-gray-600 text-xs line-clamp-2 leading-relaxed">{product.descricao}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 bg-white/5 rounded-lg p-3 border border-gray-200 mb-4">
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wide">Preço</span>
                    <span className="text-black font-bold text-sm tracking-tight">{product.preco.toLocaleString()} Kz</span>
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wide">Renda Diária</span>
                    <span className="text-primary font-bold text-sm tracking-tight">{product.renda_diaria.toLocaleString()} Kz</span>
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wide">Duração</span>
                    <span className="text-black font-bold text-sm tracking-tight">{product.duracao_dias} Dias</span>
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wide">Lucro Total</span>
                    <span className="text-green-600 font-bold text-sm tracking-tight">{(product.renda_diaria * product.duracao_dias).toLocaleString()} Kz</span>
                  </div>
                </div>
                <button
                  onClick={() => handleOpenModal(product)}
                  disabled={product.stock <= 0}
                  className={`w-full h-11 rounded-lg flex items-center justify-center gap-2 font-bold text-sm transition-all active:scale-95 ${product.stock > 0 ? 'bg-primary hover:bg-primary-hover text-background-dark shadow-md shadow-yellow-500/10' : 'bg-white/5 text-gray-500 cursor-not-allowed'}`}
                >
                  <span className="material-symbols-outlined text-[20px]">{product.stock > 0 ? 'shopping_cart' : 'block'}</span>
                  {product.stock > 0 ? 'Comprar' : 'Indisponível'}
                </button>
              </div>
            </article>
          ))
        )}
      </main>

      {/* Purchase Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
          <div className="w-full max-w-sm bg-surface-dark border border-white/10 rounded-3xl p-6 flex flex-col shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold">Confirmar Compra</h3>
              <button
                onClick={() => setSelectedProduct(null)}
                className="size-10 flex items-center justify-center rounded-full bg-white/5 text-black/60 hover:text-black"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="bg-white/5 rounded-2xl p-4 border border-gray-200 mb-6">
              <p className="text-primary text-[10px] font-bold uppercase tracking-widest mb-1">{selectedProduct.nome}</p>
              <h4 className="text-black font-bold text-lg mb-2">{selectedProduct.preco.toLocaleString()} Kz</h4>
              <p className="text-gray-600 text-xs leading-relaxed">{selectedProduct.descricao}</p>
            </div>

            <div className="flex flex-col gap-4 mb-8">
              <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-gray-200">
                <span className="text-sm font-medium text-gray-700">Quantidade</span>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="size-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">remove</span>
                  </button>
                  <span className="text-lg font-bold w-4 text-center">{quantity}</span>
                  <button
                    disabled={quantity >= (selectedProduct.stock - userPurchasedCount)}
                    onClick={() => setQuantity(quantity + 1)}
                    className={`size-8 rounded-lg flex items-center justify-center transition-all shadow-lg ${quantity >= (selectedProduct.stock - userPurchasedCount) ? 'bg-gray-700 text-gray-500 cursor-not-allowed shadow-none' : 'bg-primary text-black hover:bg-primary-hover shadow-yellow-500/20'}`}
                  >
                    <span className="material-symbols-outlined text-lg">add</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 p-3 rounded-xl border border-gray-200">
                  <span className="text-[10px] text-gray-500 uppercase font-bold tracking-tight">Custo Total</span>
                  <p className="text-black font-bold">{(selectedProduct.preco * quantity).toLocaleString()} Kz</p>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-gray-200">
                  <span className="text-[10px] text-gray-500 uppercase font-bold tracking-tight">Lucro Final</span>
                  <p className="text-green-600 font-bold">{(selectedProduct.renda_diaria * selectedProduct.duracao_dias * quantity).toLocaleString()} Kz</p>
                </div>
              </div>
            </div>

            <button
              disabled={isBuying || balance < (selectedProduct.preco * quantity)}
              onClick={handlePurchase}
              className={`w-full h-14 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-[0.95] ${balance >= (selectedProduct.preco * quantity) ? 'bg-primary text-background-dark shadow-xl shadow-yellow-500/10' : 'bg-white/5 text-gray-500 cursor-not-allowed border border-gray-200'}`}
            >
              {isBuying ? (
                <SpokeSpinner size="w-5 h-5" className="text-background-dark" />
              ) : (
                <>
                  <span className="material-symbols-outlined">payments</span>
                  {balance < (selectedProduct.preco * quantity) ? 'Saldo Insuficiente' : 'Confirmar Pagamento'}
                </>
              )}
            </button>
            <p className="text-center text-[10px] text-gray-500 mt-4 font-medium uppercase tracking-widest">Transação Segura</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
