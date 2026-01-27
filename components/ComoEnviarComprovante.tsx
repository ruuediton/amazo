import React from 'react';

interface Props {
    onNavigate: (page: any) => void;
    onOpenSupport?: () => void;
}

const ComoEnviarComprovante: React.FC<Props> = ({ onNavigate, onOpenSupport }) => {
    return (
        <div className="fixed inset-0 z-[9999] bg-white font-sans text-black overflow-y-auto">
            <div className="flex flex-col min-h-screen max-w-md mx-auto">
                {/* Header */}
                <header className="sticky top-0 z-10 bg-white p-4 items-center justify-between border-b border-gray-100 flex">
                    <button
                        onClick={() => onNavigate('tutorials')}
                        className="flex size-10 items-center justify-center rounded-full text-[#00C853] hover:bg-gray-50 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[28px]">chevron_left</span>
                    </button>
                    <h1 className="text-base font-bold text-center flex-1">Enviar Comprovante</h1>
                    <button
                        onClick={() => onOpenSupport?.()}
                        className="flex size-10 items-center justify-center rounded-full text-gray-400 hover:bg-gray-50 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[20px]">help</span>
                    </button>
                </header>

                {/* Content */}
                <div className="flex-1 p-6 pb-24">
                    <div className="flex items-center gap-4 mb-8 bg-green-50 p-4 rounded-3xl border border-green-100">
                        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white text-[#00C853] shadow-sm shrink-0">
                            <span className="material-symbols-outlined text-[28px]">receipt_long</span>
                        </div>
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#00C853]">Tutorial Rápido</span>
                            <h2 className="text-lg font-black leading-tight text-gray-900 mt-0.5">
                                Envie seu comprovante via WhatsApp
                            </h2>
                        </div>
                    </div>

                    <div className="relative pl-4 border-l-2 border-gray-100 space-y-8 ml-3">
                        {/* Step 1 */}
                        <div className="relative group">
                            <div className="absolute -left-[23px] top-0 flex size-8 items-center justify-center rounded-full bg-white border-2 border-[#00C853] text-[#00C853] font-bold text-xs ring-4 ring-white shadow-sm z-10">
                                1
                            </div>
                            <div className="pl-4 pb-2">
                                <h3 className="text-base font-bold text-gray-900 mb-1">Localizar Comprovante</h3>
                                <p className="text-sm text-gray-500 leading-relaxed font-medium">
                                    Acesse seu histórico de transações no app, encontre o depósito recente e faça um print ou download.
                                </p>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="relative group">
                            <div className="absolute -left-[23px] top-0 flex size-8 items-center justify-center rounded-full bg-white border-2 border-gray-200 text-gray-400 font-bold text-xs ring-4 ring-white z-10 group-hover:border-[#00C853] group-hover:text-[#00C853] transition-colors">
                                2
                            </div>
                            <div className="pl-4 pb-2">
                                <h3 className="text-base font-bold text-gray-900 mb-1">Acessar WhatsApp</h3>
                                <p className="text-sm text-gray-500 leading-relaxed font-medium">
                                    Toque no botão abaixo para abrir o WhatsApp do suporte oficial.
                                </p>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="relative group">
                            <div className="absolute -left-[23px] top-0 flex size-8 items-center justify-center rounded-full bg-white border-2 border-gray-200 text-gray-400 font-bold text-xs ring-4 ring-white z-10 group-hover:border-[#00C853] group-hover:text-[#00C853] transition-colors">
                                3
                            </div>
                            <div className="pl-4 pb-2">
                                <h3 className="text-base font-bold text-gray-900 mb-1">Falar com Gerente</h3>
                                <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100 mt-2 mb-2">
                                    <div className="size-10 rounded-full bg-gray-200 overflow-hidden shrink-0 border border-white">
                                        <img loading="lazy" decoding="async" alt="Manager" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcwFydBne7VizYPMGVotVwmDnOqYyQInyepZHmPXZPjiw4XCv2h3bYr70mLhgayqZml3KW8F4P0aIIIBA1o28WZortjn2-KETMm8PLPc75cpgwtE_QjNJ1mQ5R9aVZ2_ul2NE1zQ0lLCZ71b-twNpfHlvUzNgTVAwg8S_DDA6STerWujt8veb1rO8Xt01i6r6cqps22WAmrEnrKVoTbsPvzUKPGArA91sxFSjef8eo52D-fXowfUdcNY-bjbvXiD54x1nuZlPSp6hO" />
                                    </div>
                                    <div>
                                        <span className="text-sm font-bold text-gray-900 flex items-center gap-1">
                                            Gerente BP
                                            <span className="material-symbols-outlined text-[#00C853] text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                                        </span>
                                        <span className="text-[10px] uppercase font-bold text-gray-400">Online agora</span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 leading-relaxed font-medium">
                                    Verifique sempre se o contato tem o selo de verificação verde.
                                </p>
                            </div>
                        </div>

                        {/* Step 4 */}
                        <div className="relative group">
                            <div className="absolute -left-[23px] top-0 flex size-8 items-center justify-center rounded-full bg-white border-2 border-gray-200 text-gray-400 font-bold text-xs ring-4 ring-white z-10 group-hover:border-[#00C853] group-hover:text-[#00C853] transition-colors">
                                4
                            </div>
                            <div className="pl-4 pb-2">
                                <h3 className="text-base font-bold text-gray-900 mb-1">Anexar e Enviar</h3>
                                <p className="text-sm text-gray-500 leading-relaxed font-medium">
                                    No chat, envie a imagem do comprovante e aguarde a confirmação.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <details className="group bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300">
                            <summary className="flex cursor-pointer items-center justify-between gap-4 p-4 list-none text-[#00C853] font-bold text-sm hover:bg-gray-100 transition-colors">
                                <span className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[20px]">help</span>
                                    Problemas ao enviar?
                                </span>
                                <span className="material-symbols-outlined text-gray-400 transition-transform group-open:rotate-180">expand_more</span>
                            </summary>
                            <div className="px-4 pb-4 pt-2 text-xs text-gray-500 leading-relaxed font-medium pl-10 border-t border-gray-100 mt-1">
                                Certifique-se de que a imagem esteja legível. Se o WhatsApp não abrir, verifique se o app está instalado.
                            </div>
                        </details>
                    </div>
                </div>

                {/* Footer */}
                <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white border-t border-gray-100 z-20">
                    <button
                        onClick={() => onOpenSupport?.()}
                        className="w-full flex items-center justify-center gap-2 h-14 bg-[#00C853] hover:brightness-110 active:scale-[0.98] text-white font-bold rounded-2xl shadow-lg shadow-green-200 transition-all text-base"
                    >
                        <span className="material-symbols-outlined text-[22px]">chat</span>
                        <span>Falar com Gerente Agora</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ComoEnviarComprovante;
