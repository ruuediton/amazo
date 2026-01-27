import React from 'react';
import TutorialSlider from '../components/TutorialSlider';

interface Props {
  onNavigate: (page: any) => void;
}

const TutoriaisComoConvidar: React.FC<Props> = ({ onNavigate }) => {
  const steps = [
    {
      title: "Copie seu link",
      description: "Copie seu link exclusivo ou código AMZ-AO-95 para compartilhar com amigos.",
      icon: "content_copy",
      content: (
        <div className="bg-gray-50 border border-gray-100 rounded-3xl p-5 text-left">
          <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-dashed border-gray-200 mb-4">
            <span className="text-xl font-mono font-bold text-black tracking-widest">AMZ-AO-95</span>
            <span className="material-symbols-outlined text-green-500 text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          </div>
          <button className="w-full bg-[#00C853] hover:brightness-110 active:scale-[0.98] text-white font-black py-4 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all">
            <span className="material-symbols-outlined text-[20px]">content_copy</span>
            Copiar Código
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
          <SocialIcon color="black" label="Tk" name="TikTok" textColor="white" />
        </div>
      )
    },
    {
      title: "Aumente seus Ganhos",
      description: "Compartilhe em grupos e stories para atrair mais pessoas e ganhar 500 Kz por cada novo amigo.",
      icon: "trending_up",
      content: (
        <div className="flex flex-col gap-3 text-left">
          <TipItem initial="WA" color="#25D366" title="Fale diretamente" desc="Envie mensagens individuais para amigos próximos." />
          <TipItem initial="IG" gradient="linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)" title="Use Stories" desc="Grave um vídeo curto recomendando o app." />
        </div>
      )
    }
  ];

  return (
    <div className="fixed inset-0 z-[9999] bg-white font-sans text-black">
      <div className="relative flex min-h-screen w-full flex-col overflow-hidden max-w-md mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-4 sticky top-0 z-20 bg-white border-b border-gray-100">
          <button
            onClick={() => onNavigate('tutorials')}
            className="flex items-center justify-center size-10 -ml-2 rounded-full text-[#00C853] hover:bg-gray-50 transition-colors"
          >
            <span className="material-symbols-outlined text-[28px]">chevron_left</span>
          </button>
          <h1 className="text-base font-bold text-black tracking-tight">Programa de Convite</h1>
          <div className="w-10"></div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col px-6 pt-6 overflow-y-auto pb-32">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-black text-black mb-3 leading-tight">
              Ganhe <span className="text-[#00C853]">500 Kz</span><br />por cada amigo
            </h2>
            <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-[260px] mx-auto text-center">
              Siga o passos para compartilhar seu código e ganhar recompensas.
            </p>
          </div>

          <TutorialSlider
            steps={steps}
            onFinish={() => onNavigate('invite')}
            finishText="Convidar Amigos"
          />
        </main>
      </div>
    </div>
  );
};

const SocialIcon: React.FC<{ color?: string, gradient?: string, label?: string, icon?: string, name: string, textColor?: string, border?: boolean }> = ({ color, gradient, label, icon, name, textColor = "white", border }) => (
  <div className="flex flex-col items-center gap-2 group cursor-pointer">
    <div
      className={`size-12 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform ${border ? 'border border-gray-100' : ''}`}
      style={{ backgroundColor: color, backgroundImage: gradient, color: textColor }}
    >
      {label && <span className="text-lg font-black">{label}</span>}
      {icon && <span className="material-symbols-outlined text-[24px]">{icon}</span>}
    </div>
    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-tight">{name}</span>
  </div>
);

const TipItem: React.FC<{ initial: string, color?: string, gradient?: string, title: string, desc: string }> = ({ initial, color, gradient, title, desc }) => (
  <div className="flex items-start gap-4 p-4 bg-gray-50 border border-gray-100 rounded-3xl">
    <div
      className="size-10 rounded-2xl flex items-center justify-center shrink-0"
      style={{ backgroundColor: color ? `${color}15` : undefined, backgroundImage: gradient, color: color || 'white' }}
    >
      <span className="text-[10px] font-black">{initial}</span>
    </div>
    <div>
      <h4 className="text-sm font-black text-black">{title}</h4>
      <p className="text-xs text-gray-600 mt-1 font-medium leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default TutoriaisComoConvidar;
