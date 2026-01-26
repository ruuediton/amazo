
import React from 'react';

interface Props {
  onNavigate: (page: any) => void;
}

const Campaigns: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="bg-background-dark font-display text-black antialiased min-h-screen pb-24">
      {/* Top App Bar */}
      <header className="flex items-center justify-between px-4 py-3 bg-background-dark/95 sticky top-0 z-20 backdrop-blur-md border-b border-gray-200">
        <button
          onClick={() => onNavigate('home')}
          className="flex size-10 items-center justify-center rounded-full text-primary hover:bg-white/10 transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold leading-tight flex-1 text-center pr-10">Campanhas</h1>
      </header>

      {/* Filter Chips */}
      <div className="sticky top-[60px] z-10 bg-background-dark py-3">
        <div className="flex gap-3 px-4 overflow-x-auto no-scrollbar">
          <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary pl-3 pr-4 shadow-sm hover:opacity-90 transition-opacity">
            <span className="material-symbols-outlined text-[20px] text-[text-black] fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            <p className="text-[text-black] text-sm font-bold leading-normal">Todas</p>
          </button>
        </div>
      </div>

      <section className="mt-4">
        <div className="px-4 pb-3">
          <h2 className="text-xl font-bold leading-tight">Todas as Ofertas</h2>
        </div>

        <div className="flex flex-col gap-4 px-4">
          {/* Campaign Item 1 - Cashback */}
          <div className="group overflow-hidden rounded-2xl bg-surface-dark shadow-sm border border-gray-200 transition-all">
            <div className="relative h-44 w-full overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAuaMKWwB27fbDL4YsiUmp-eRFktZ4FvM8_3IJr1dbn4C9r-tmoaliKVaepZXoBM0U4y5Gf3f_G_Nh9flSyAxfKeaoZL4oVHL1Jq2Mxq6t2J2LezS-oJo7yJh6pfA2Pqodkx-x07yYcnNG_uZmTm31ZI94xE1rOVBmpMUZ2JsPbEBH51OY6V8V0SVc3UaZIJiUh-P0GsHX07Iw9Uxv906Tw3IcghwZxTHOOAjeZ_qvx7-FzQPI8Y49FDOec85zCD27WiZ8MSWqMzj2X")' }}
              ></div>
              <div className="absolute top-3 right-3">
                <span className="px-2 py-1 bg-black/60 backdrop-blur-md text-primary text-[10px] font-bold rounded flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">timer</span> 2 dias
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold text-black">Cashback SmartBuy</h3>
              <p className="mt-1 text-sm text-gray-600 font-medium leading-relaxed line-clamp-2">5% de volta em eletrônicos e acessórios comprados pelo app.</p>
              <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Recompensa</span>
                  <span className="text-primary font-bold">Até 10.000 Kz</span>
                </div>
                <button
                  onClick={() => onNavigate('gift-chest')}
                  className="rounded-lg bg-primary hover:bg-yellow-400 text-black px-5 py-2.5 text-xs font-bold transition-all active:scale-[0.98]"
                >
                  Ativar Oferta
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Campaigns;
