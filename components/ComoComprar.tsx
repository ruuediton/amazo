import React, { useState, useEffect, useRef } from 'react';

interface Props {
    onNavigate: (page: any) => void;
}

const ComoComprar: React.FC<Props> = ({ onNavigate }) => {
    const [isAtBottom, setIsAtBottom] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
            const nearBottom = scrollTop + clientHeight >= scrollHeight - 50;
            setIsAtBottom(nearBottom);
        }
    };

    useEffect(() => {
        const current = scrollRef.current;
        if (current) {
            current.addEventListener('scroll', handleScroll);
            handleScroll();
        }
        return () => current?.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="fixed inset-0 z-[9999] bg-white font-sans text-black flex flex-col">
            <header className="sticky top-0 z-50 bg-white p-4 border-b border-gray-100 flex items-center justify-between">
                <button
                    onClick={() => onNavigate('tutorials')}
                    className="flex size-10 items-center justify-center rounded-full text-[#00C853] hover:bg-gray-50 transition-colors"
                >
                    <span className="material-symbols-outlined text-[28px]">chevron_left</span>
                </button>
                <h1 className="text-base font-bold text-center flex-1">Como Comprar</h1>
                <div className="size-10"></div>
            </header>

            <main
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 pb-32 no-scrollbar"
            >
                <div className="space-y-8 max-w-md mx-auto">
                    <div className="flex items-center gap-4 bg-gray-50 p-5 rounded-[32px] border border-gray-100">
                        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white text-[#00C853] shadow-sm shrink-0 border border-gray-100">
                            <span className="material-symbols-outlined text-[28px]">shopping_cart</span>
                        </div>
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Guia de Compra</span>
                            <h2 className="text-lg font-black leading-tight text-[#111] mt-0.5">
                                Passo a Passo BP
                            </h2>
                        </div>
                    </div>

                    <div className="relative pl-6 space-y-10">
                        {/* Vertical line connector */}
                        <div className="absolute left-[7px] top-4 bottom-4 w-0.5 bg-gray-100"></div>

                        {/* Step 1 */}
                        <div className="relative">
                            <div className="absolute -left-[24px] top-0 flex size-4 items-center justify-center rounded-full bg-white border-2 border-[#00C853] z-10 shadow-sm"></div>
                            <div className="pb-2">
                                <h3 className="text-base font-black text-[#111] mb-1">Faça uma Recarga</h3>
                                <p className="text-sm text-gray-500 leading-relaxed font-medium">
                                    Garanta saldo suficiente. Vá até a aba <strong>Banco</strong> e selecione <strong>Recarga</strong>.
                                </p>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="relative">
                            <div className="absolute -left-[24px] top-0 flex size-4 items-center justify-center rounded-full bg-white border-2 border-gray-200 z-10 shadow-sm"></div>
                            <div className="pb-2">
                                <h3 className="text-base font-black text-[#111] mb-1">Acesse a Loja</h3>
                                <p className="text-sm text-gray-500 leading-relaxed font-medium">
                                    No menu inferior, toque em <strong>Loja</strong> para ver os produtos disponíveis.
                                </p>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="relative">
                            <div className="absolute -left-[24px] top-0 flex size-4 items-center justify-center rounded-full bg-white border-2 border-gray-200 z-10 shadow-sm"></div>
                            <div className="pb-2">
                                <h3 className="text-base font-black text-[#111] mb-1">Selecione e Confirme</h3>
                                <p className="text-sm text-gray-500 leading-relaxed font-medium">
                                    Escolha seu produto e confirme. O valor será descontado automaticamente.
                                </p>
                            </div>
                        </div>

                        {/* Step 4 */}
                        <div className="relative">
                            <div className="absolute -left-[24px] top-0 flex size-4 items-center justify-center rounded-full bg-white border-2 border-gray-200 z-10 shadow-sm"></div>
                            <div className="pb-2">
                                <h3 className="text-base font-black text-[#111] mb-1">Acompanhe</h3>
                                <p className="text-sm text-gray-500 leading-relaxed font-medium">
                                    Veja o status em <strong>Conta</strong> > <strong>Histórico</strong>.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-[32px] border border-gray-100 italic text-[12px] text-gray-400 font-medium">
                        Dica: Mantenha sempre saldo em sua conta para aproveitar ofertas exclusivas e flash sales na BP Angola.
                    </div>
                </div>
            </main>

            {/* Footer CTA - Hidden until bottom */}
            <div className={`fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 z-50 transition-all duration-500 ${isAtBottom ? 'translate-y-0 opacity-100 visible' : 'translate-y-12 opacity-0 invisible'}`}>
                <button
                    onClick={() => onNavigate('shop')}
                    className="w-full h-12 bg-[#00C853] text-black font-black rounded-xl shadow-xl shadow-green-500/10 active:scale-[0.98] transition-all text-sm flex items-center justify-center gap-2"
                >
                    <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                    <span>Ir para Loja</span>
                </button>
            </div>
        </div>
    );
};

export default ComoComprar;
