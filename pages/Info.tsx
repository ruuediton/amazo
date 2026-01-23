
import React from 'react';

interface Props {
  onNavigate: (page: any) => void;
}

const Info: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-dark group/design-root overflow-x-hidden font-display transition-colors duration-200 text-black">
      {/* TopAppBar */}
      <div className="sticky top-0 z-50 flex items-center bg-background-dark/95 p-4 pb-2 justify-between border-b border-gray-800/30 backdrop-blur-md">
        <button
          onClick={() => onNavigate('profile')}
          className="text-primary flex size-12 shrink-0 items-center justify-start cursor-pointer hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>arrow_back</span>
        </button>
        <h2 className="text-black text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">Informações</h2>
      </div>

      {/* Hero / Brand Section */}
      <div className="flex flex-col gap-3 p-4">
        <div
          className="w-full bg-center bg-no-repeat aspect-[3/1] bg-cover rounded-2xl shadow-lg relative overflow-hidden border border-gray-200"
          style={{ backgroundImage: 'url("/amazon_info_hero.png")' }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-5">
            <p className="text-white text-sm font-bold opacity-90 tracking-wide uppercase">amazon secure</p>
          </div>
        </div>
      </div>

      {/* Content List Group */}
      <div className="flex flex-col gap-4 px-4 pb-4">
        {/* Information Group */}
        <div className="flex flex-col bg-surface-dark rounded-2xl overflow-hidden shadow-sm border border-gray-200">
          {/* Item: Sobre a Amazon */}
          <InfoItem
            icon="info"
            label="Sobre a Amazon"
            onClick={() => onNavigate('about')}
          />
          <div className="h-[1px] bg-gray-200 mx-4"></div>

          {/* Item: Regras do sistema */}
          <InfoItem
            icon="gavel"
            label="Regras do sistema"
            onClick={() => onNavigate('system-rules')}
          />
          <div className="h-[1px] bg-gray-800/50 mx-4"></div>

          {/* Item: Termos de uso */}
          <InfoItem
            icon="description"
            label="Termos de uso"
            onClick={() => onNavigate('terms-of-use')}
          />
          <div className="h-[1px] bg-gray-800/50 mx-4"></div>

          {/* Item: Política de privacidade */}
          <InfoItem
            icon="policy"
            label="Política de privacidade"
            onClick={() => onNavigate('privacy-policy')}
          />
        </div>

        {/* Spacer for visual separation */}
        <div className="h-2"></div>

        {/* Support Group */}
        <div className="flex flex-col bg-surface-dark rounded-2xl overflow-hidden shadow-sm border border-gray-200">
          <div
            onClick={() => onNavigate('support')}
            className="flex items-center gap-4 px-4 min-h-[72px] justify-between cursor-pointer hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="text-primary flex items-center justify-center rounded-xl bg-primary/20 shrink-0 size-11 shadow-lg shadow-primary/10">
                <span className="material-symbols-outlined" style={{ fontSize: '26px', fontWeight: 'bold' }}>headset_mic</span>
              </div>
              <p className="text-black text-base font-bold leading-normal flex-1 truncate">Suporte</p>
            </div>
            <div className="shrink-0 text-gray-600">
              <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>chevron_right</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto pb-10 pt-6">
        <p className="text-center text-xs font-bold text-gray-600 tracking-widest uppercase">
          Versão 2.4.1 (Build 890)
        </p>
      </div>
    </div>
  );
};

const InfoItem = ({ icon, label, onClick }: { icon: string, label: string, onClick?: () => void }) => (
  <div
    onClick={onClick}
    className="flex items-center gap-4 px-4 min-h-[64px] justify-between cursor-pointer hover:bg-white/5 transition-colors group"
  >
    <div className="flex items-center gap-4">
      <div className="text-primary flex items-center justify-center rounded-xl bg-primary/20 shrink-0 size-10 group-hover:bg-primary group-hover:text-black transition-colors">
        <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>{icon}</span>
      </div>
      <p className="text-black text-base font-medium leading-normal flex-1 truncate">{label}</p>
    </div>
    <div className="shrink-0 text-gray-600">
      <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>chevron_right</span>
    </div>
  </div>
);

export default Info;
