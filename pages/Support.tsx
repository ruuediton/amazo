
import React from 'react';

interface SupportProps {
  onNavigate: (page: any) => void;
}

const Support: React.FC<SupportProps> = ({ onNavigate }) => {
  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto bg-background-dark font-display text-black">
      {/* Header */}
      <div className="flex items-center px-4 py-4 justify-between sticky top-0 z-10 bg-background-dark/95 backdrop-blur-md border-b border-gray-200">
        <button
          onClick={() => onNavigate('home')}
          className="flex size-10 shrink-0 items-center justify-center rounded-full active:bg-white/10 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-primary" style={{ fontSize: '24px' }}>arrow_back</span>
        </button>
        <h2 className="text-black text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">Suporte</h2>
      </div>

      {/* Hero Text */}
      <div className="px-4 pt-4 pb-6">
        <h1 className="text-black tracking-tight text-[28px] font-extrabold leading-tight mb-2">Como podemos ajudar vocÃª hoje?</h1>
        <p className="text-gray-600 text-base font-medium leading-normal">Escolha um canal abaixo para falar com nosso time ou tire suas dÃºvidas.</p>
      </div>

      {/* Primary Action Cards */}
      <div className="px-4 flex flex-col gap-4">
        {/* Primary Action Card */}
        <div className="px-4 flex flex-col gap-4">
          {/* Support Card */}
          <div className="flex flex-col rounded-xl bg-surface-dark p-5 shadow-sm border border-gray-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[28px]">support_agent</span>
              </div>
              <div>
                <p className="text-black text-lg font-bold leading-tight">Suporte Oficial</p>
                <p className="text-gray-500 text-sm">DisponÃ­vel 24/7 para vocÃª</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm font-normal leading-relaxed mb-6">
              Precisa de ajuda com depÃ³sitos, retiradas ou dÃºvidas sobre a plataforma? Nosso time especializado estÃ¡ pronto para atender vocÃª agora.
            </p>
            <button
              onClick={() => window.open('https://wa.me/244933850746', '_blank')}
              className="flex w-full cursor-pointer items-center justify-center rounded-xl h-14 px-4 bg-primary text-background-dark text-base font-black leading-normal transition-all active:scale-[0.98] shadow-lg shadow-primary/20"
            >
              <span className="mr-2 material-symbols-outlined">chat</span>
              <span>Contactar Suporte Agora</span>
            </button>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="px-4 py-6">
        <h3 className="text-black text-lg font-bold mb-4 px-1">Perguntas Frequentes</h3>
        <div className="flex flex-col rounded-xl bg-surface-dark overflow-hidden shadow-sm border border-gray-200">
          {/* FAQ Items */}
          {[
            { label: 'Problemas com Pagamentos (Kz)', icon: 'payments' },
            { label: 'Rastreio de Pedidos', icon: 'local_shipping' },
            { label: 'SeguranÃ§a da Conta', icon: 'shield' },
          ].map((item, idx, arr) => (
            <button
              key={item.label}
              className={`flex w-full items-center justify-between p-4 hover:bg-white/5 text-left group ${idx !== arr.length - 1 ? 'border-b border-gray-200' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary/20 p-2 rounded-full text-primary">
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                </div>
                <span className="text-slate-200 font-medium text-sm">{item.label}</span>
              </div>
              <span className="material-symbols-outlined text-gray-500 group-hover:text-primary transition-colors text-[20px]">chevron_right</span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-auto pb-32 pt-4 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">DisponÃ­vel 24h por dia</p>
        </div>
        <p className="text-xs text-black/30">VersÃ£o do App 4.2.0 â€¢ ID: 893-KZA</p>
      </div>
    </div>
  );
};

export default Support;

