import React from 'react';

interface Props {
    onNavigate: (page: any) => void;
}

const Campaigns: React.FC<Props> = ({ onNavigate }) => {
    return (
        <div className="fixed inset-0 z-[9999] bg-white font-sans text-black overflow-y-auto">
            <div className="flex flex-col min-h-screen max-w-md mx-auto">
                {/* Header */}
                <header className="sticky top-0 z-10 bg-white p-4 items-center justify-between border-b border-gray-100 flex">
                    <button
                        onClick={() => onNavigate('home')}
                        className="flex size-10 items-center justify-center rounded-full text-[#00C853] hover:bg-gray-50 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[28px]">chevron_left</span>
                    </button>
                    <h1 className="text-base font-bold text-center flex-1">Campanhas</h1>
                    <div className="size-10"></div>
                </header>

                {/* Content */}
                <div className="flex-1 p-6 pb-24 space-y-6">
                    <div className="text-center mb-6">
                        <h2 className="text-xl font-black text-[#0F1111] mb-2">Ofertas em Destaque</h2>
                        <p className="text-sm text-gray-500 font-medium">Maximize seus ganhos com nossas campanhas exclusivas.</p>
                    </div>

                    <div className="flex flex-col gap-6">
                        {/* Campaign Item 1 - Cashback */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-all">
                            <div className="relative h-48 w-full bg-gray-100">
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAuaMKWwB27fbDL4YsiUmp-eRFktZ4FvM8_3IJr1dbn4C9r-tmoaliKVaepZXoBM0U4y5Gf3f_G_Nh9flSyAxfKeaoZL4oVHL1Jq2Mxq6t2J2LezS-oJo7yJh6pfA2Pqodkx-x07yYcnNG_uZmTm31ZI94xE1rOVBmpMUZ2JsPbEBH51OY6V8V0SVc3UaZIJiUh-P0GsHX07Iw9Uxv906Tw3IcghwZxTHOOAjeZ_qvx7-FzQPI8Y49FDOec85zCD27WiZ8MSWqMzj2X")' }}
                                ></div>
                                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-[#00C853] text-[14px]">timer</span>
                                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">2 dias</span>
                                </div>
                            </div>

                            <div className="p-5">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-bold text-[#0F1111]">Cashback BP</h3>
                                    <div className="bg-green-50 px-2.5 py-1 rounded-lg">
                                        <span className="text-[10px] font-bold text-[#00C853] uppercase tracking-wider">Ativo</span>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-500 font-medium leading-relaxed mb-4">
                                    Receba 5% de volta em todas as transações de compra de eletrônicos realizadas através do aplicativo durante este fim de semana.
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Recompensa</span>
                                        <span className="text-base font-black text-[#00C853]">Até 10.000 Kz</span>
                                    </div>
                                    <button
                                        onClick={() => onNavigate('gift-chest')}
                                        className="h-10 px-6 bg-[#00C853] hover:bg-green-600 active:scale-[0.98] text-white font-bold rounded-xl transition-all text-xs shadow-lg shadow-green-100"
                                    >
                                        Resgatar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Campaigns;
