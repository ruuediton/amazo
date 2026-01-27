
import React from 'react';
import TutorialSlider from '../components/TutorialSlider';

interface Props {
  onNavigate: (page: any) => void;
}

const TutoriaisComoConvidar: React.FC<Props> = ({ onNavigate }) => {
  const steps = [
    {
      title: "Copie seu link",
      description: "Copie seu link exclusivo ou cÃ³digo AMZ-AO-95 para compartilhar com amigos.",
      icon: "content_copy",
      content: (
        <div className="bg-surface-dark border border-gray-200 rounded-3xl p-5 shadow-sm text-left">
          <div className="flex items-center justify-between bg-black/20 rounded-2xl p-4 border border-dashed border-white/10 mb-4">
            <span className="text-xl font-mono font-bold text-black tracking-widest italic">AMZ-AO-95</span>
            <span className="material-symbols-outlined text-green-500 text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          </div>
          <button className="w-full bg-primary hover:bg-yellow-400 active:scale-[0.98] text-black font-black py-4 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-[20px]">content_copy</span>
            Copiar CÃ³digo
          </button>
        </div>
      )
    },
    {
      title: "Escolha onde compartilhar",
      description: "Envie diretamente para seus aplicativos favoritos.",
      icon: "share",
      content: (
        <div className="grid grid-cols-4 gap-4 p-2">
          <SocialIcon color="#25D366" label="Wa" name="WhatsApp" />
          <SocialIcon gradient="linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)" label="Ig" name="Instagram" />
          <SocialIcon color="#229ED9" icon="send" name="Telegram" />
          <SocialIcon color="white" label="Tk" name="TikTok" textColor="black" />
        </div>
      )
    },
    {
      title: "Aumente seus Ganhos",
      description: "Compartilhe em grupos e stories para atrair mais pessoas e ganhar 500 Kz por cada novo amigo.",
      icon: "trending_up",
      content: (
        <div className="flex flex-col gap-3 text-left">
          <TipItem initial="WA" color="#25D366" title="Fale diretamente" desc="Envie mensagens individuais para amigos prÃ³ximos." />
          <TipItem initial="IG" gradient="linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)" title="Use Stories" desc="Grave um vÃ­deo curto recomendando o app." />
        </div>
      )
    }
  ];

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto bg-background-dark antialiased pb-32">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 sticky top-0 z-20 bg-background-dark/95 backdrop-blur-md border-b border-gray-200">
        <button
          onClick={() => onNavigate('tutorials')}
          className="flex items-center justify-center size-10 -ml-2 rounded-full text-primary hover:bg-white/10 transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-base font-bold text-black tracking-tight">Programa de Convite</h1>
        <div className="w-10"></div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col px-6 pt-6">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-black text-black mb-3 leading-tight italic">
            Ganhe <span className="text-primary">500 Kz</span><br />por cada amigo
          </h2>
          <p className="text-gray-600 text-sm font-medium leading-relaxed max-w-[260px] mx-auto text-center">
            Siga o passos para compartilhar seu cÃ³digo e ganhar recompensas.
          </p>
        </div>

        <TutorialSlider
          steps={steps}
          onFinish={() => onNavigate('invite')}
          finishText="Convidar Amigos"
        />
      </main>
    </div>
  );
};

const SocialIcon: React.FC<{ color?: string, gradient?: string, label?: string, icon?: string, name: string, textColor?: string, border?: boolean }> = ({ color, gradient, label, icon, name, textColor = "white", border }) => (
  <div className="flex flex-col items-center gap-2 group cursor-pointer">
    <div
      className={`size-12 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform ${border ? 'border border-white/10' : ''}`}
      style={{ backgroundColor: color, backgroundImage: gradient, color: textColor }}
    >
      {label && <span className="text-lg font-black italic">{label}</span>}
      {icon && <span className="material-symbols-outlined text-[24px]">{icon}</span>}
    </div>
    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-tight">{name}</span>
  </div>
);

const TipItem: React.FC<{ initial: string, color?: string, gradient?: string, title: string, desc: string }> = ({ initial, color, gradient, title, desc }) => (
  <div className="flex items-start gap-4 p-4 bg-surface-dark border border-gray-200 rounded-3xl">
    <div
      className="size-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
      style={{ backgroundColor: color ? `${color}15` : undefined, backgroundImage: gradient, color: color || 'white' }}
    >
      <span className="text-[10px] font-black italic">{initial}</span>
    </div>
    <div>
      <h4 className="text-sm font-black text-black italic">{title}</h4>
      <p className="text-xs text-gray-600 mt-1 font-medium leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default TutoriaisComoConvidar;

