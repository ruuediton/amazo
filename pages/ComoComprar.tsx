
import React from 'react';

interface Props {
  onNavigate: (page: any) => void;
}

const ComoComprar: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col min-h-screen bg-background-dark font-display text-black pb-32">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background-dark/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => onNavigate('tutorials')}
            className="flex size-10 items-center justify-center rounded-full text-primary hover:bg-white/10 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-black text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-2">Como Comprar</h1>
          <div className="flex items-center justify-end bg-white/10 px-3 py-1.5 rounded-full border border-gray-200">
            <span className="material-symbols-outlined text-primary text-[18px] mr-2">account_balance_wallet</span>
            <p className="text-black text-sm font-bold tracking-wide">125.000 Kz</p>
          </div>
        </div>
      </header>

      <main className="flex flex-col px-4 py-6 max-w-lg mx-auto w-full">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-black mb-2">Guia RÃ¡pido</h2>
          <p className="text-gray-600 text-sm">Siga os passos abaixo para realizar suas compras com seguranÃ§a e praticidade.</p>
        </div>

        {/* Steps Timeline */}
        <div className="space-y-4">
          {/* Step 1 */}
          <div className="flex gap-4 relative pb-4">
            <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-white/10 rounded-full"></div>
            <div className="flex flex-col items-center shrink-0">
              <div className="flex size-10 items-center justify-center rounded-full bg-surface-dark border-2 border-primary text-primary font-bold text-lg shadow-lg shadow-primary/10 z-10">1</div>
            </div>
            <div className="flex-1 flex flex-col gap-3 pt-1">
              <div className="bg-surface-dark border border-gray-200 rounded-2xl p-5 shadow-sm group hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <span className="material-symbols-outlined">account_balance_wallet</span>
                  </div>
                  <h3 className="text-black font-bold text-lg">FaÃ§a um DepÃ³sito</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Garanta que tem saldo suficiente. VÃ¡ atÃ© a aba <strong>Banco</strong> e selecione <strong>Depositar</strong> via Multicaixa ou TransferÃªncia.
                </p>
                <div className="bg-background-dark/50 rounded-xl p-4 flex items-center justify-center border border-gray-200 h-20">
                  <div className="flex items-center gap-3 opacity-80">
                    <span className="material-symbols-outlined text-3xl text-black/20">wallet</span>
                    <span className="material-symbols-outlined text-2xl text-primary animate-pulse">arrow_right_alt</span>
                    <span className="material-symbols-outlined text-3xl text-green-600">add_card</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4 relative pb-4">
            <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-white/10 rounded-full"></div>
            <div className="flex flex-col items-center shrink-0">
              <div className="flex size-10 items-center justify-center rounded-full bg-surface-dark border-2 border-primary text-primary font-bold text-lg shadow-lg shadow-primary/10 z-10">2</div>
            </div>
            <div className="flex-1 flex flex-col gap-3 pt-1">
              <div className="bg-surface-dark border border-gray-200 rounded-2xl p-5 shadow-sm group hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <span className="material-symbols-outlined">storefront</span>
                  </div>
                  <h3 className="text-black font-bold text-lg">Acesse a Loja</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Toque no Ã­cone da <strong>Loja</strong> no menu inferior para explorar categorias como eletrÃ´nicos, livros e casa inteligente.
                </p>
                <div className="bg-background-dark/50 rounded-xl p-4 flex items-center justify-center border border-gray-200 h-20">
                  <div className="flex gap-3 items-end">
                    <div className="w-8 h-8 bg-white/5 rounded-md flex items-center justify-center"><div className="w-4 h-4 rounded-full border-2 border-white/10"></div></div>
                    <div className="w-10 h-10 bg-primary/10 rounded-md border border-primary/50 flex items-center justify-center shadow-[0_0_15px_rgba(244,209,37,0.1)] relative -top-1">
                      <span className="material-symbols-outlined text-primary text-sm">storefront</span>
                    </div>
                    <div className="w-8 h-8 bg-white/5 rounded-md flex items-center justify-center"><div className="w-4 h-4 rounded-full border-2 border-white/10"></div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4 relative pb-4">
            <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-white/10 rounded-full"></div>
            <div className="flex flex-col items-center shrink-0">
              <div className="flex size-10 items-center justify-center rounded-full bg-surface-dark border-2 border-primary text-primary font-bold text-lg shadow-lg shadow-primary/10 z-10">3</div>
            </div>
            <div className="flex-1 flex flex-col gap-3 pt-1">
              <div className="bg-surface-dark border border-gray-200 rounded-2xl p-5 shadow-sm group hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <span className="material-symbols-outlined">shopping_cart</span>
                  </div>
                  <h3 className="text-black font-bold text-lg">Selecione e Compre</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Escolha seu produto, veja os benefÃ­cios e toque no botÃ£o <strong>Comprar</strong>. O valor serÃ¡ descontado instantaneamente.
                </p>
                <div className="bg-background-dark/50 rounded-xl p-4 flex flex-col items-center justify-center border border-gray-200 gap-2 h-20">
                  <div className="w-24 h-2 bg-white/10 rounded-full"></div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="px-5 py-2 bg-primary text-background-dark text-xs font-bold rounded-lg shadow-sm">Comprar</div>
                    <span className="material-symbols-outlined text-black/20 text-lg">touch_app</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-4 relative">
            <div className="flex flex-col items-center shrink-0">
              <div className="flex size-10 items-center justify-center rounded-full bg-surface-dark border-2 border-primary text-primary font-bold text-lg shadow-lg shadow-primary/10 z-10">4</div>
            </div>
            <div className="flex-1 flex flex-col gap-3 pt-1">
              <div className="bg-surface-dark border border-gray-200 rounded-2xl p-5 shadow-sm group hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <span className="material-symbols-outlined">receipt_long</span>
                  </div>
                  <h3 className="text-black font-bold text-lg">HistÃ³rico de Compras</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Visualize suas compras recentes e acompanhe o status de entrega na aba <strong>Conta</strong> &gt; <strong>HistÃ³rico de Compras</strong>.
                </p>
                <div className="bg-background-dark/50 rounded-xl p-4 flex flex-col gap-3 border border-gray-200 w-full justify-center h-20">
                  <div className="flex items-center gap-3 px-2">
                    <span className="material-symbols-outlined text-gray-500 text-lg">local_shipping</span>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-green-400"></div>
                    </div>
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-600 px-2 font-medium">
                    <span>Enviado</span>
                    <span className="text-green-600">Em trÃ¢nsito</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 mb-4">
          <button
            onClick={() => onNavigate('shop')}
            className="w-full bg-primary hover:bg-primary-hover text-background-dark font-bold text-base py-4 rounded-xl shadow-lg shadow-yellow-500/10 active:scale-95 transition-all flex items-center justify-center gap-2 group"
          >
            <span className="material-symbols-outlined">shopping_bag</span>
            ComeÃ§ar a Comprar Agora
          </button>
        </div>
      </main>
    </div>
  );
};

export default ComoComprar;

