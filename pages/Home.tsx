
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';

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
  const [cheapestProduct, setCheapestProduct] = useState<any>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!profile?.id) return;

    const fetchCheapest = async () => {
      try {
        const { data: products } = await supabase
          .from('products')
          .select('*')
          .eq('status', 'active')
          .order('price', { ascending: true })
          .limit(1);

        if (products && products.length > 0) {
          setCheapestProduct(products[0]);
        }
      } catch (err) {
        console.error("Home fetch error:", err);
      }
    };

    fetchCheapest();
  }, [profile?.id]);

  const filters = [
    { label: 'Todas', icon: 'star' },
    { label: 'Shopping', icon: 'shopping_bag' },
    { label: 'Banco', icon: 'account_balance' },
    { label: 'Parceiros', icon: 'handshake' },
    { label: 'Promoção', icon: 'local_offer' },
    { label: 'Suporte', icon: 'contact_support' }
  ];

  return (
    <div className="flex flex-col pb-32 bg-background-dark min-h-screen font-display antialiased relative">
      {/* Carousel */}
      <section className="relative w-full h-[200px] overflow-hidden">
        <div className="flex transition-transform duration-1000 ease-in-out h-full" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {carouselImages.map((img, index) => (
            <div key={index} className="w-full h-full flex-shrink-0 bg-cover bg-center" style={{ backgroundImage: `url("${img}")` }}>
            </div>
          ))}
        </div>

        {/* User Greeting Overlay */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
          <div className="size-6 rounded-full bg-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[14px] text-black font-bold">person</span>
          </div>
          <span className="text-black text-[11px] font-bold">Olá, {profile?.code || 'Usuário'}</span>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {carouselImages.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${currentSlide === i ? 'w-6 bg-primary' : 'w-1.5 bg-white/40'}`}></div>
          ))}
        </div>
      </section>

      {/* Marquee Banner */}
      <div className="bg-[#FEF9E7] py-2 overflow-hidden border-b border-gray-100">
        <div className="flex whitespace-nowrap animate-marquee">
          <span className="text-[10px] font-bold text-[#0F1111] uppercase tracking-widest px-8">
            • APROVEITE AS OFERTAS EXCLUSIVAS amazon • GANHE 5% DE CASHBACK EM ELETRÔNICOS • SUPORTE 24H DISPONÍVEL •
          </span>
          <span className="text-[10px] font-bold text-[#0F1111] uppercase tracking-widest px-8">
            • APROVEITE AS OFERTAS EXCLUSIVAS amazon • GANHE 5% DE CASHBACK EM ELETRÔNICOS • SUPORTE 24H DISPONÍVEL •
          </span>
        </div>
      </div>

      {/* Quick Actions - Flat Border Style */}
      <div className="px-4 pt-6 mb-2">
        <div className="grid grid-cols-3 gap-3">
          <button onClick={() => onNavigate('deposit')} className="flex flex-col items-center justify-center gap-1.5 p-4 bg-primary text-black rounded-2xl border border-[#FCD200] active:scale-95 transition-all group">
            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>add_card</span>
            <span className="text-[11px] font-bold uppercase tracking-tight">Recarregar</span>
          </button>
          <button onClick={() => onNavigate('retirada')} className="flex flex-col items-center justify-center gap-1.5 p-4 bg-white border border-gray-200 text-[#0F1111] rounded-2xl active:scale-95 transition-all group">
            <span className="material-symbols-outlined text-[24px]">payments</span>
            <span className="text-[11px] font-bold uppercase tracking-tight">Retirar</span>
          </button>
          <button onClick={() => onNavigate('tutorials')} className="flex flex-col items-center justify-center gap-1.5 p-4 bg-white border border-gray-200 text-[#0F1111] rounded-2xl active:scale-95 transition-all group">
            <span className="material-symbols-outlined text-[24px]">help_outline</span>
            <span className="text-[11px] font-bold uppercase tracking-tight">Ajuda</span>
          </button>
        </div>
      </div>

      {/* Sticky Filters - Amazon style */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100 py-3 mt-4">
        <div className="flex gap-2.5 px-4 overflow-x-auto no-scrollbar scroll-smooth">
          {filters.map((f) => (
            <button key={f.label} onClick={() => setActiveFilter(f.label)} className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg px-4 transition-all active:scale-95 ${activeFilter === f.label ? 'bg-[#F0F2F2] border border-gray-300' : 'bg-white border border-gray-200'}`}>
              <span className={`material-symbols-outlined text-[18px] ${activeFilter === f.label ? 'text-[#0F1111]' : 'text-[#565959]'}`} style={{ fontVariationSettings: activeFilter === f.label ? "'FILL' 1" : "'FILL' 0" }}>{f.icon}</span>
              <p className={`text-[13px] ${activeFilter === f.label ? 'text-[#0F1111] font-bold' : 'text-[#565959] font-medium'}`}>{f.label}</p>
            </button>
          ))}
        </div>
      </div>

      {cheapestProduct && (
        <section className="mt-6">
          <div className="flex items-center justify-between px-4 pb-3">
            <h2 className="text-[18px] font-bold leading-tight text-[#0F1111]">Ofertas do Dia</h2>
            <button onClick={() => onNavigate('shop')} className="text-[13px] font-bold text-amazon-blue hover:underline">Ver todas</button>
          </div>
          <div className="px-4">
            <div className="relative w-full overflow-hidden rounded-2xl bg-gray-50 border border-gray-100 group">
              <div className="p-5 flex flex-col sm:flex-row gap-5">
                <div className="w-full sm:w-32 h-32 bg-white rounded-lg p-2 flex items-center justify-center border border-gray-100">
                  <img src={cheapestProduct.image_url || "/placeholder_product.png"} alt="" className="max-w-full max-h-full object-contain" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="px-2 py-0.5 bg-[#CC0C39] text-white text-[10px] font-bold rounded">OFERTA MEGA</span>
                    <h3 className="text-[#0F1111] text-[16px] font-medium mt-2 leading-tight line-clamp-2">{cheapestProduct.name}</h3>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-[13px] font-bold">Kz</span>
                      <span className="text-[26px] font-black leading-none">{cheapestProduct.price.toLocaleString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate('shop')}
                    className="bg-primary hover:bg-primary-hover text-black text-[14px] font-medium py-2.5 rounded-full w-full mt-4 transition-all border border-[#FCD200]"
                  >
                    Comprar Agora
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="mt-8 px-4">
        <h2 className="text-[16px] font-bold text-[#0F1111] mb-4">Serviços e Benefícios</h2>
        <div className="flex flex-col gap-4">
          <OfferCard
            title="Amazon Core Cashback"
            desc="Ganhe 5% de retorno automático em todas as suas compras."
            reward="5% Off"
            image="/amazon_logistic_service.png"
            onClick={() => onNavigate('gift-chest')}
          />
          <OfferCard
            title="Programa de Fidelidade"
            desc="Acumule pontos e troque por saldo real."
            reward="Prêmios"
            image="/amazon_fidelity_stars.png"
            onClick={() => onNavigate('gift-chest')}
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
  <div className="flex gap-4 p-4 bg-white border border-gray-200 rounded-xl active:bg-gray-50 transition-colors" onClick={onClick}>
    <div className="size-20 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100 flex items-center justify-center p-2">
      <img src={image} alt="" className="max-w-full max-h-full object-contain opacity-80" />
    </div>
    <div className="flex-1 min-w-0 flex flex-col justify-center">
      <div className="flex justify-between items-start">
        <h3 className="text-[15px] font-bold text-[#0F1111] leading-tight truncate">{title}</h3>
        <span className="text-[10px] font-bold text-[#007600] uppercase">{reward}</span>
      </div>
      <p className="text-[12px] text-[#565959] mt-1 line-clamp-2">{desc}</p>
    </div>
  </div>
);

export default Home;

