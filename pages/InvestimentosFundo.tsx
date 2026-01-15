
import React from 'react';

interface Props {
  onNavigate: (page: any) => void;
}

const InvestimentosFundo: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="bg-white text-gray-900 pb-24 font-display min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center p-4 pb-2 justify-between">
          <button 
            onClick={() => onNavigate('profile')}
            className="text-yellow-500 flex size-12 shrink-0 items-center justify-start cursor-pointer hover:opacity-70 transition-opacity"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
          <h2 className="text-gray-900 text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-4">
            Investimento em Fundos
          </h2>
          <div className="flex w-12 items-center justify-end">
            <button className="flex size-12 cursor-pointer items-center justify-center rounded-lg bg-transparent text-gray-900 hover:bg-gray-100 transition-colors">
              <span className="material-symbols-outlined text-2xl">search</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Card */}
      <div className="p-4">
        <div className="flex flex-col items-stretch justify-start rounded-2xl shadow-sm bg-gray-50 border border-gray-100 p-6 relative overflow-hidden">
          <div className="flex flex-col gap-1 z-10">
            <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Total Investido</p>
            <h1 className="text-black text-3xl font-extrabold leading-tight py-1">Kz 1.250.000,00</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-sm font-bold">
                <span className="material-symbols-outlined text-sm mr-1">trending_up</span>
                +4,2% este mês
              </div>
              <p className="text-gray-400 text-xs">Atualizado agora</p>
            </div>
          </div>
          <div className="absolute right-[-10px] bottom-[-10px] opacity-10 pointer-events-none">
            <span className="material-symbols-outlined text-[120px] text-primary">account_balance_wallet</span>
          </div>
        </div>
      </div>

      {/* Featured Funds */}
      <section>
        <div className="flex items-center justify-between px-4 pb-1 pt-4">
          <h2 className="text-gray-900 text-[22px] font-bold leading-tight tracking-[-0.015em]">Fundos em Destaque</h2>
          <button className="text-primary font-bold text-sm hover:underline transition-all">Ver todos</button>
        </div>
        <div className="flex overflow-x-auto snap-x scroll-smooth no-scrollbar">
          <div className="flex items-stretch p-4 gap-4">
            {/* Fund Card 1 */}
            <div className="snap-start flex h-full flex-1 flex-col gap-3 rounded-2xl bg-white border border-gray-100 shadow-lg min-w-[260px] overflow-hidden">
              <div 
                className="w-full bg-center bg-no-repeat aspect-[16/9] bg-cover" 
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD2Wc58gr1_5pNPMMjBTVkrCz8NNp_4BKWe52mo3VAnWiVw-U_I6rcgjtERnaqcZGgWr0GOwVOpA7tyhZEtACYX41LjpA7LiIboAEQOYlW6g8WIb2WvaieCiXHHpunVYD9joEADjqYviy4Qcj9yOxtSyOMFPblr6YZupBPPiHE8R7jaNKyngnw-9-9kafq1wM-o7HZsVxdEn6YAshJimAc2v75tC9d_8a9uOkmwceO0FIdOZm-7davI1gqI3gzAVjlwf1QJZAri6Cm7")' }}
              ></div>
              <div className="flex flex-col flex-1 justify-between p-4 pt-0 gap-4">
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-black text-base font-bold leading-normal">Amazon Alpha Fund</p>
                    <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded border border-red-100">ALTO</span>
                  </div>
                  <p className="text-gray-500 text-sm font-normal leading-normal">Rentabilidade: <span className="text-green-600 font-semibold">+12% aa</span></p>
                </div>
                <button className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-4 bg-primary text-black text-sm font-bold leading-normal shadow-md hover:bg-yellow-500 active:scale-95 transition-all">
                  <span>Investir</span>
                </button>
              </div>
            </div>

            {/* Fund Card 2 */}
            <div className="snap-start flex h-full flex-1 flex-col gap-3 rounded-2xl bg-white border border-gray-100 shadow-lg min-w-[260px] overflow-hidden">
              <div 
                className="w-full bg-center bg-no-repeat aspect-[16/9] bg-cover" 
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB1aI7SbTjJfslZ4tQrWQ-5E7o56T450V7mXHJccTV1mM9E5gDGA8jn9iuZK9H6NBhX7HnnqbpricgxTX6X_ZIHEgb-7sczfNcLpPDObqfbwozReHNFPjV4YPR0LaHBnmqF8K56ea2ZGW1icyWe6POq8Ak2O7frfGxmwmE0e2zhzOOYd8zspsLwwWCI07gLbuZbtLTo0Dda5BRzvqiP1XZN474YULyaeJHqEGFRwn25UgnvOR8m9P1YUYIcjfuduVw7_AmVrsFsjZ3b")' }}
              ></div>
              <div className="flex flex-col flex-1 justify-between p-4 pt-0 gap-4">
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-black text-base font-bold leading-normal">Amazon ESG Growth</p>
                    <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-100">BAIXO</span>
                  </div>
                  <p className="text-gray-500 text-sm font-normal leading-normal">Rentabilidade: <span className="text-green-600 font-semibold">+8% aa</span></p>
                </div>
                <button className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-4 bg-primary text-black text-sm font-bold leading-normal shadow-md hover:bg-yellow-500 active:scale-95 transition-all">
                  <span>Investir</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar">
        <button className="whitespace-nowrap bg-primary text-black px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
          <span className="material-symbols-outlined text-sm">filter_list</span> Filtrar
        </button>
        <button className="whitespace-nowrap bg-gray-50 border border-gray-100 text-gray-700 px-4 py-2 rounded-full text-xs font-medium hover:bg-gray-100 transition-colors">Rentabilidade</button>
        <button className="whitespace-nowrap bg-gray-50 border border-gray-100 text-gray-700 px-4 py-2 rounded-full text-xs font-medium hover:bg-gray-100 transition-colors">Risco</button>
        <button className="whitespace-nowrap bg-gray-50 border border-gray-100 text-gray-700 px-4 py-2 rounded-full text-xs font-medium hover:bg-gray-100 transition-colors">Investimento Mínimo</button>
      </div>

      {/* All Funds List */}
      <section className="mt-4 px-4">
        <h3 className="text-gray-900 text-lg font-bold leading-tight tracking-[-0.015em] pb-4">Todos os Fundos</h3>
        <div className="flex flex-col gap-3">
          {/* Fund List Item 1 */}
          <div className="flex flex-col p-4 bg-white border border-gray-100 rounded-2xl gap-3 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/5">
                  <span className="material-symbols-outlined text-primary text-[24px]">analytics</span>
                </div>
                <div>
                  <h4 className="text-black font-bold text-sm">Amazon Fixed Income</h4>
                  <p className="text-gray-500 text-[11px] font-medium uppercase tracking-tight">Mín: 5.000 Kz</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-green-600 text-sm font-black">+18% aa</p>
                <p className="text-orange-500 text-[9px] font-black uppercase tracking-widest mt-0.5">Risco Médio</p>
              </div>
            </div>
            <div className="flex justify-between items-center mt-2 pt-3 border-t border-gray-50">
              <button className="text-gray-500 text-xs font-bold hover:text-black transition-colors flex items-center gap-1">
                Ver Detalhes
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
              <button className="bg-primary text-black px-6 py-2 rounded-xl text-xs font-black shadow-lg shadow-primary/10 hover:bg-yellow-500 active:scale-95 transition-all">Investir</button>
            </div>
          </div>

          {/* Fund List Item 2 */}
          <div className="flex flex-col p-4 bg-white border border-gray-100 rounded-2xl gap-3 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100/50">
                  <span className="material-symbols-outlined text-blue-600 text-[24px]">shield</span>
                </div>
                <div>
                  <h4 className="text-black font-bold text-sm">Amazon Secure Liquidity</h4>
                  <p className="text-gray-500 text-[11px] font-medium uppercase tracking-tight">Mín: 1.000 Kz</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-green-600 text-sm font-black">+6.5% aa</p>
                <p className="text-blue-600 text-[9px] font-black uppercase tracking-widest mt-0.5">Risco Baixo</p>
              </div>
            </div>
            <div className="flex justify-between items-center mt-2 pt-3 border-t border-gray-50">
              <button className="text-gray-500 text-xs font-bold hover:text-black transition-colors flex items-center gap-1">
                Ver Detalhes
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
              <button className="bg-primary text-black px-6 py-2 rounded-xl text-xs font-black shadow-lg shadow-primary/10 hover:bg-yellow-500 active:scale-95 transition-all">Investir</button>
            </div>
          </div>

          {/* Fund List Item 3 */}
          <div className="flex flex-col p-4 bg-white border border-gray-100 rounded-2xl gap-3 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-xl bg-purple-50 flex items-center justify-center border border-purple-100/50">
                  <span className="material-symbols-outlined text-purple-600 text-[24px]">rocket_launch</span>
                </div>
                <div>
                  <h4 className="text-black font-bold text-sm">Amazon Crypto Index</h4>
                  <p className="text-gray-500 text-[11px] font-medium uppercase tracking-tight">Mín: 10.000 Kz</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-green-600 text-sm font-black">+42% aa</p>
                <p className="text-red-600 text-[9px] font-black uppercase tracking-widest mt-0.5">Risco Alto</p>
              </div>
            </div>
            <div className="flex justify-between items-center mt-2 pt-3 border-t border-gray-50">
              <button className="text-gray-500 text-xs font-bold hover:text-black transition-colors flex items-center gap-1">
                Ver Detalhes
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
              <button className="bg-primary text-black px-6 py-2 rounded-xl text-xs font-black shadow-lg shadow-primary/10 hover:bg-yellow-500 active:scale-95 transition-all">Investir</button>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Nav Spacer */}
      <div className="h-10"></div>
    </div>
  );
};

export default InvestimentosFundo;
