import React, { useState, useEffect, useRef } from 'react';

interface Props {
    onNavigate: (page: any) => void;
    onOpenSupport?: () => void;
}

const ComoEnviarComprovante: React.FC<Props> = ({ onNavigate, onOpenSupport }) => {
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
            <header className="sticky top-0 z-50 bg-white p-4 items-center justify-between border-b border-gray-100 flex">
                <button
                    onClick={() => onNavigate('tutorials')}
                    className="flex size-10 items-center justify-center rounded-full text-[#00C853] hover:bg-gray-50 transition-colors"
                >
                    <span className="material-symbols-outlined text-[28px]">chevron_left</span>
                </button>
                <h1 className="text-base font-bold text-center flex-1 tracking-tight">Comprovante</h1>
                <div className="size-10"></div>
            </header>

            <main
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 pb-32 no-scrollbar"
            >
                <div className="space-y-8 max-w-md mx-auto">
                    <div className="flex items-center gap-4 bg-gray-50 p-5 rounded-[32px] border border-gray-100">
                        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white text-[#00C853] shadow-sm shrink-0 border border-gray-100">
                            <span className="material-symbols-outlined text-[28px]">receipt_long</span>
                        </div>
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Suporte BP</span>
                            <h2 className="text-lg font-black leading-tight text-[#111] mt-0.5">
                                Validar Recarga
                            </h2>
                        </div>
                    </div>

                    <div className="relative pl-6 space-y-10">
                        <div className="absolute left-[7px] top-4 bottom-4 w-0.5 bg-gray-100"></div>

                        <div className="relative">
                            <div className="absolute -left-[24px] top-0 flex size-4 items-center justify-center rounded-full bg-white border-2 border-[#00C853] z-10 shadow-sm"></div>
                            <div className="pb-2">
                                <h3 className="text-base font-black text-[#111] mb-1">Localizar Comprovativo</h3>
                                <p className="text-sm text-gray-500 leading-relaxed font-medium">
                                    Encontre a recarga realizada no app do seu banco e guarde o registo.
                                </p>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute -left-[24px] top-0 flex size-4 items-center justify-center rounded-full bg-white border-2 border-gray-200 z-10 shadow-sm"></div>
                            <div className="pb-2">
                                <h3 className="text-base font-black text-[#111] mb-1">Falar com Gerente</h3>
                                <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100 my-3">
                                    <div className="size-10 rounded-full bg-gray-200 overflow-hidden shrink-0 border-2 border-white shadow-sm">
                                        <img loading="lazy" decoding="async" alt="Manager" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcwFydBne7VizYPMGVotVwmDnOqYyQInyepZHmPXZPjiw4XCv2h3bYr70mLhgayqZml3KW8F4P0aIIIBA1o28WZortjn2-KETMm8PLPc75cpgwtE_QjNJ1mQ5R9aVZ2_ul2NE1zQ0lLCZ71b-twNpfHlvUzNgTVAwg8S_DDA6STerWujt8veb1rO8Xt01i6r6cqps22WAmrEnrKVoTbsPvzUKPGArA91sxFSjef8eo52D-fXowfUdcNY-bjbvXiD54x1nuZlPSp6hO" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-[#111] flex items-center gap-1">BP Gerente <span className="material-symbols-outlined text-[#00C853] text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span></p>
                                        <p className="text-[10px] font-bold text-[#00C853] uppercase tracking-wider">Atendimento Online</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute -left-[24px] top-0 flex size-4 items-center justify-center rounded-full bg-white border-2 border-gray-200 z-10 shadow-sm"></div>
                            <div className="pb-2">
                                <h3 className="text-base font-black text-[#111] mb-1">Enviar Registo</h3>
                                <p className="text-sm text-gray-500 leading-relaxed font-medium">
                                    Encaminhe a imagem no chat oficial para que o saldo seja creditado na BP Angola.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <div className={`fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 z-50 transition-all duration-500 ${isAtBottom ? 'translate-y-0 opacity-100 visible' : 'translate-y-12 opacity-0 invisible'}`}>
                <button
                    onClick={() => onOpenSupport?.()}
                    className="w-full flex h-12 cursor-pointer items-center justify-center rounded-xl bg-[#00C853] text-black gap-2 text-[14px] font-black shadow-xl shadow-green-500/10 hover:brightness-105 active:scale-[0.98] transition-all"
                >
                    <span className="material-symbols-outlined text-[20px]">chat</span>
                    <span>Validar Agora</span>
                </button>
            </div>
        </div>
    );
};

export default ComoEnviarComprovante;
