import React from 'react';

interface Props {
    onNavigate: (page: any) => void;
}

const ComoComprar: React.FC<Props> = ({ onNavigate }) => {
    return (
        <div className="fixed inset-0 z-[9999] bg-white font-sans text-black overflow-y-auto">
            <div className="flex flex-col min-h-screen max-w-md mx-auto">
                <header className="sticky top-0 z-10 bg-white p-4 border-b border-gray-100 flex items-center justify-between">
                    <button
                        onClick={() => onNavigate('tutorials')}
                        className="flex size-10 items-center justify-center rounded-full text-[#00C853] hover:bg-gray-50 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[28px]">chevron_left</span>
                    </button>
                    <h1 className="text-base font-bold text-center flex-1">Como Comprar</h1>
                    <div className="size-10"></div>
                </header>

                <div className="flex-1 p-6 pb-24 space-y-8">
                    <div className="flex items-center gap-4 bg-orange-50 p-5 rounded-3xl border border-orange-100">
                        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white text-orange-500 shadow-sm shrink-0">
                            <span className="material-symbols-outlined text-[28px]">shopping_cart</span>
                        </div>
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600">Compras</span>
                            <h2 className="text-lg font-black leading-tight text-gray-900 mt-0.5">
                                Guia Rápido de Compras
                            </h2>
                        </div>
                    </div>

                    <div className="relative pl-4 border-l-2 border-gray-100 space-y-8 ml-3">
                        {/* Step 1 */}
                        <div className="relative group">
                            <div className="absolute -left-[23px] top-0 flex size-8 items-center justify-center rounded-full bg-white border-2 border-orange-500 text-orange-500 font-bold text-xs ring-4 ring-white shadow-sm z-10">
                                1
                            </div>
                            <div className="pl-4 pb-2">
                                <h3 className="text-base font-bold text-gray-900 mb-1">Faça um Depósito</h3>
                                <p className="text-sm text-gray-500 leading-relaxed font-medium">
                                    Garanta que tem saldo suficiente. Vá até a aba <strong>Banco</strong> e selecione <strong>Depositar</strong> via Multicaixa ou Transferência.
                                </p>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="relative group">
                            <div className="absolute -left-[23px] top-0 flex size-8 items-center justify-center rounded-full bg-white border-2 border-gray-200 text-gray-400 font-bold text-xs ring-4 ring-white z-10 group-hover:border-orange-500 group-hover:text-orange-500 transition-colors">
                                2
                            </div>
                            <div className="pl-4 pb-2">
                                <h3 className="text-base font-bold text-gray-900 mb-1">Acesse a Loja</h3>
                                <p className="text-sm text-gray-500 leading-relaxed font-medium">
                                    Toque no ícone da <strong>Loja</strong> no menu inferior para explorar categorias como eletrônicos e casa.
                                </p>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="relative group">
                            <div className="absolute -left-[23px] top-0 flex size-8 items-center justify-center rounded-full bg-white border-2 border-gray-200 text-gray-400 font-bold text-xs ring-4 ring-white z-10 group-hover:border-orange-500 group-hover:text-orange-500 transition-colors">
                                3
                            </div>
                            <div className="pl-4 pb-2">
                                <h3 className="text-base font-bold text-gray-900 mb-1">Selecione e Compre</h3>
                                <p className="text-sm text-gray-500 leading-relaxed font-medium">
                                    Escolha seu produto e toque em <strong>Comprar</strong>. O valor será descontado instantaneamente.
                                </p>
                            </div>
                        </div>

                        {/* Step 4 */}
                        <div className="relative group">
                            <div className="absolute -left-[23px] top-0 flex size-8 items-center justify-center rounded-full bg-white border-2 border-gray-200 text-gray-400 font-bold text-xs ring-4 ring-white z-10 group-hover:border-orange-500 group-hover:text-orange-500 transition-colors">
                                4
                            </div>
                            <div className="pl-4 pb-2">
                                <h3 className="text-base font-bold text-gray-900 mb-1">Histórico</h3>
                                <p className="text-sm text-gray-500 leading-relaxed font-medium">
                                    Acompanhe suas compras na aba <strong>Conta</strong> &gt; <strong>Histórico de Compras</strong>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer CTA */}
                <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white border-t border-gray-100 z-20">
                    <button
                        onClick={() => onNavigate('shop')}
                        className="w-full h-14 bg-[#00C853] hover:brightness-110 active:scale-[0.98] text-white font-bold rounded-2xl shadow-lg shadow-green-200 transition-all text-base flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                        <span>Ir para Loja</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ComoComprar;
