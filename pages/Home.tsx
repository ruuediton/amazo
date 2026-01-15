
import React, { useState, useEffect, useRef } from 'react';

interface HomeProps {
  onNavigate: (page: any) => void;
  onOpenSupport?: () => void;
  profile: any;
}

const carouselImages = [
  "/carousel1.png",
  "/carousel2.png",
  "/carousel3.jpg"
];

const Home: React.FC<HomeProps> = ({ onNavigate, profile }) => {
  const [activeFilter, setActiveFilter] = useState('Todas');
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const filters = [
    { label: 'Todas', icon: 'star' },
    { label: 'Shopping', icon: 'shopping_bag' },
    { label: 'Banco', icon: 'account_balance' },
    { label: 'Parceiros', icon: 'handshake' }
  ];

  return (
    <div className="flex flex-col pb-32 bg-background-dark min-h-screen font-display antialiased relative">
      <section className="relative w-full h-[220px] overflow-hidden">
        <div className="flex transition-transform duration-1000 ease-in-out h-full" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {carouselImages.map((img, index) => (
            <div key={index} className="w-full h-full flex-shrink-0 bg-cover bg-center" style={{ backgroundImage: `url("${img}")` }}>
              <div className="w-full h-full bg-gradient-to-t from-background-dark via-transparent to-transparent"></div>
            </div>
          ))}
        </div>

        {/* User Greeting Overlay */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-text-primary/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-amazon-border">
          <div className="size-6 rounded-full bg-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[14px] text-text-primary font-bold">person</span>
          </div>
          <span className="text-text-primary text-xs font-bold">Olá, {profile?.code || 'Usuário'}</span>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {carouselImages.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${currentSlide === i ? 'w-6 bg-primary' : 'w-1.5 bg-text-primary/20'}`}></div>
          ))}
        </div>
      </section>

      <div className="bg-surface-dark py-2 overflow-hidden border-y border-amazon-border">
        <div className="flex whitespace-nowrap animate-marquee">
          <span className="text-[11px] font-bold text-text-primary uppercase tracking-widest px-8">
            • APROVEITE AS OFERTAS EXCLUSIVAS amazon • GANHE 5% DE CASHBACK EM ELETRÔNICOS • CONVIDE AMIGOS E GANHE 500 Kz • SUPORTE 24H DISPONÍVEL •
          </span>
          <span className="text-[11px] font-bold text-text-primary uppercase tracking-widest px-8">
            • APROVEITE AS OFERTAS EXCLUSIVAS amazon • GANHE 5% DE CASHBACK EM ELETRÔNICOS • CONVIDE AMIGOS E GANHE 500 Kz • SUPORTE 24H DISPONÍVEL •
          </span>
        </div>
      </div>

      <div className="px-4 pt-6 mb-4">
        <div className="grid grid-cols-3 gap-3">
          <button onClick={() => onNavigate('deposit')} className="flex flex-col items-center justify-center gap-2 p-4 bg-primary text-text-primary rounded-2xl shadow-lg shadow-primary/20 active:scale-95 transition-all group">
            <span className="material-symbols-outlined text-[28px] font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>add_card</span>
            <span className="text-[10px] font-black uppercase tracking-tight">Recarregar</span>
          </button>
          <button onClick={() => onNavigate('retirada')} className="flex flex-col items-center justify-center gap-2 p-4 bg-secondary border border-amazon-border text-text-primary rounded-2xl shadow-md active:scale-95 transition-all group">
            <span className="material-symbols-outlined text-primary text-[28px]">payments</span>
            <span className="text-[10px] font-bold uppercase tracking-tight text-text-primary">Retirar</span>
          </button>
          <button onClick={() => onNavigate('tutorials')} className="flex flex-col items-center justify-center gap-2 p-4 bg-secondary border border-amazon-border text-text-primary rounded-2xl shadow-md active:scale-95 transition-all group">
            <span className="material-symbols-outlined text-primary text-[28px]">auto_stories</span>
            <span className="text-[10px] font-bold uppercase tracking-tight text-text-primary">Tutoriais</span>
          </button>
        </div>
      </div>

      <div className="sticky top-0 z-40 bg-background-dark/95 backdrop-blur-md py-3 border-b border-amazon-border">
        <div className="flex gap-3 px-4 overflow-x-auto no-scrollbar">
          {filters.map((f) => (
            <button key={f.label} onClick={() => setActiveFilter(f.label)} className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 transition-all active:scale-95 ${activeFilter === f.label ? 'bg-primary shadow-sm' : 'bg-surface-dark border border-amazon-border'}`}>
              <span className={`material-symbols-outlined text-[20px] ${activeFilter === f.label ? 'text-text-primary' : 'text-text-secondary'}`} style={{ fontVariationSettings: activeFilter === f.label ? "'FILL' 1" : "'FILL' 0" }}>{f.icon}</span>
              <p className={`text-sm leading-normal ${activeFilter === f.label ? 'text-text-primary font-bold' : 'text-text-secondary font-medium'}`}>{f.label}</p>
            </button>
          ))}
        </div>
      </div>

      <section className="mt-6">
        <div className="flex items-center justify-between px-4 pb-3">
          <h2 className="text-xl font-bold leading-tight text-black">Destaques</h2>
          <div className="flex gap-1.5">
            <div className="size-1.5 rounded-full bg-primary"></div>
            <div className="size-1.5 rounded-full bg-gray-700"></div>
            <div className="size-1.5 rounded-full bg-gray-700"></div>
          </div>
        </div>
        <div className="flex w-full gap-4 overflow-x-auto px-4 pb-4 snap-x snap-mandatory no-scrollbar">
          <div className="relative w-[85vw] max-w-[320px] shrink-0 overflow-hidden rounded-2xl bg-surface-dark snap-center shadow-md border border-amazon-border group">
            <div className="aspect-[16/9] w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD4u9ztQRHbWJTurqjXlrhdlWb0t7PSd24UZZxtgJ0IOV5mnlVKquznJ0lKjFTRgM3CyNBP2o5L4kav-RXtJVmOWxch3fml51VpQ-F5xu3m5dPBPHq4FW1KZSJwoJ4_Hi8gzXwfMMJYRxmbnqZsdoCY5x1hpGK3DLbOnc-q8sKsURgAvp2h_c--4mhvU68OB-XxRHiwuYcrUHRPptutlDAvWWo9reh-tCe1wePQEPPPojN4xMf6C5mdc5lGLbaXAO30Y5NUfhiDdicz")' }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-text-primary/95 via-text-primary/20 to-transparent"></div>
            <div className="absolute top-3 left-3">
              <span className="px-2.5 py-1 bg-primary text-text-primary text-[10px] font-black rounded uppercase tracking-wider">Novo</span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 text-left">
              <h3 className="text-white text-lg font-bold mb-0.5">Boas-vindas</h3>
              <p className="text-gray-300 text-xs mb-3 font-medium">Ganhe até 2.000 Kz na primeira compra.</p>
              <button onClick={() => onNavigate('shop')} className="bg-primary hover:bg-primary-hover text-text-primary text-xs font-bold py-2.5 px-4 rounded-xl w-full transition-colors shadow-lg active:scale-[0.98]">Começar Agora</button>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-4 px-4">
        <h2 className="text-xl font-bold leading-tight text-black mb-4">Todas as Ofertas</h2>
        <div className="flex flex-col gap-5">
          <OfferCard
            title="Cashback amazon"
            desc="5% de volta em eletrônicos e acessórios comprados pelo app."
            reward="Até 10.000 Kz"
            image="https://lh3.googleusercontent.com/aida-public/AB6AXuAuaMKWwB27fbDL4YsiUmp-eRFktZ4FvM8_3IJr1dbn4C9r-tmoaliKVaepZXoBM0U4y5Gf3f_G_Nh9flSyAxfKeaoZL4oVHL1Jq2Mxq6t2J2LezS-oJo7yJh6pfA2Pqodkx-x07yYcnNG_uZmTm31ZI94xE1rOVBmpMUZ2JsPbEBH51OY6V8V0SVc3UaZIJiUh-P0GsHX07Iw9Uxv906Tw3IcghwZxTHOOAjeZ_qvx7-FzQPI8Y49FDOec85zCD27WiZ8MSWqMzj2X"
            onClick={() => onNavigate('gift-chest')}
          />
          <OfferCard
            title="Indique um Amigo"
            desc="Convide seus amigos para o amazon e ganhe dinheiro."
            reward="500 Kz / amigo"
            image="/amazon_team.png"
            onClick={() => onNavigate('invite')}
          />
        </div>
      </section>

      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 25s linear infinite; }
      `}</style>
    </div>
  );
};

const OfferCard = ({ title, desc, reward, image, onClick }: any) => (
  <div className="group overflow-hidden rounded-[24px] bg-surface-dark shadow-md border border-amazon-border transition-all">
    <div className="relative h-48 w-full overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url("${image}")` }}></div>
    </div>
    <div className="p-5">
      <h3 className="text-lg font-bold text-text-primary mb-1.5">{title}</h3>
      <p className="text-sm text-text-secondary font-medium leading-relaxed mb-5">{desc}</p>
      <div className="flex items-center justify-between pt-4 border-t border-amazon-border">
        <div className="flex flex-col">
          <span className="text-[10px] text-text-secondary font-black uppercase tracking-widest mb-0.5">Recompensa</span>
          <span className="text-primary font-black text-lg">{reward}</span>
        </div>
        <button onClick={onClick} className="rounded-xl bg-primary hover:bg-primary-hover text-text-primary px-6 py-3 text-sm font-black transition-all active:scale-[0.95] shadow-lg shadow-primary/20">Ativar</button>
      </div>
    </div>
  </div>
);

export default Home;
