
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
  const [recentDeposit, setRecentDeposit] = useState<any>(null);
  const [recentWithdrawal, setRecentWithdrawal] = useState<any>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch cheapest product
      const { data: products } = await supabase
        .from('produtos')
        .select('*')
        .eq('status', 'ativo')
        .order('preco', { ascending: true })
        .limit(1);

      if (products && products.length > 0) {
        setCheapestProduct(products[0]);
      }

      // Fetch recent deposit
      const { data: deposits } = await supabase
        .from('deposits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (deposits && deposits.length > 0) {
        setRecentDeposit(deposits[0]);
      }

      // Fetch recent withdrawal
      const { data: withdrawals } = await supabase
        .from('withdrawals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (withdrawals && withdrawals.length > 0) {
        setRecentWithdrawal(withdrawals[0]);
      }
    };

    fetchData();
  }, [profile]);

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
      <section className="relative w-full h-[220px] overflow-hidden">
        <div className="flex transition-transform duration-1000 ease-in-out h-full" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {carouselImages.map((img, index) => (
            <div key={index} className="w-full h-full flex-shrink-0 bg-cover bg-center" style={{ backgroundImage: `url("${img}")` }}>
              <div className="w-full h-full bg-gradient-to-t from-background-dark via-transparent to-transparent"></div>
            </div>
          ))}
        </div>

        {/* User Greeting Overlay */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
          <div className="size-6 rounded-full bg-primary flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-[14px] text-black font-bold">person</span>
          </div>
          <span className="text-black text-xs font-bold">Olá, {profile?.code || 'Usuário'}</span>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {carouselImages.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${currentSlide === i ? 'w-6 bg-primary shadow-[0_0_10px_#f4c025]' : 'w-1.5 bg-white/40'}`}></div>
          ))}
        </div>
      </section>

      <div className="bg-white py-2 overflow-hidden border-y border-amazon-border">
        <div className="flex whitespace-nowrap animate-marquee">
          <span className="text-[11px] font-bold text-black uppercase tracking-widest px-8">
            • APROVEITE AS OFERTAS EXCLUSIVAS amazon • GANHE 5% DE CASHBACK EM ELETRÔNICOS • CONVIDE AMIGOS E GANHE 500 Kz • SUPORTE 24H DISPONÍVEL •
          </span>
          <span className="text-[11px] font-bold text-black uppercase tracking-widest px-8">
            • APROVEITE AS OFERTAS EXCLUSIVAS amazon • GANHE 5% DE CASHBACK EM ELETRÔNICOS • CONVIDE AMIGOS E GANHE 500 Kz • SUPORTE 24H DISPONÍVEL •
          </span>
        </div>
      </div>

      <div className="px-4 pt-6 mb-2">
        <div className="grid grid-cols-3 gap-3">
          <button onClick={() => onNavigate('deposit')} className="flex flex-col items-center justify-center gap-2 p-4 bg-primary text-black rounded-2xl shadow-lg shadow-primary/20 active:scale-95 transition-all group">
            <span className="material-symbols-outlined text-[28px] font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>add_card</span>
            <span className="text-[10px] font-black uppercase tracking-tight">Recarregar</span>
          </button>
          <button onClick={() => onNavigate('retirada')} className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-amazon-border text-black rounded-2xl shadow-sm active:scale-95 transition-all group">
            <span className="material-symbols-outlined text-primary text-[28px]">payments</span>
            <span className="text-[10px] font-bold uppercase tracking-tight">Retirar</span>
          </button>
          <button onClick={() => onNavigate('tutorials')} className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-amazon-border text-black rounded-2xl shadow-sm active:scale-95 transition-all group">
            <span className="material-symbols-outlined text-primary text-[28px]">auto_stories</span>
            <span className="text-[10px] font-bold uppercase tracking-tight">Tutoriais</span>
          </button>
        </div>
      </div>

      {/* Mini Recent Transactions */}
      {(recentDeposit || recentWithdrawal) && (
        <div className="px-4 mb-4">
          <div className="bg-[#fefce8] rounded-xl border border-primary/20 p-3 flex flex-col gap-2">
            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Atividades Recentes</p>
            <div className="flex gap-4">
              {recentDeposit && (
                <div className="flex-1 flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-600 text-[18px]">add_circle</span>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-black">Kz {recentDeposit.amount.toLocaleString()}</span>
                    <span className="text-[8px] text-gray-400">Depósito</span>
                  </div>
                </div>
              )}
              {recentWithdrawal && (
                <div className="flex-1 flex items-center gap-2 border-l border-primary/10 pl-4">
                  <span className="material-symbols-outlined text-amber-500 text-[18px]">remove_circle</span>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-black">Kz {recentWithdrawal.amount_original.toLocaleString()}</span>
                    <span className="text-[8px] text-gray-400">Saque</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md py-3 border-b border-amazon-border">
        <div className="flex gap-3 px-4 overflow-x-auto no-scrollbar scroll-smooth">
          {filters.map((f) => (
            <button key={f.label} onClick={() => setActiveFilter(f.label)} className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 transition-all active:scale-95 ${activeFilter === f.label ? 'bg-primary shadow-sm' : 'bg-white border border-amazon-border'}`}>
              <span className={`material-symbols-outlined text-[20px] ${activeFilter === f.label ? 'text-black' : 'text-gray-500'}`} style={{ fontVariationSettings: activeFilter === f.label ? "'FILL' 1" : "'FILL' 0" }}>{f.icon}</span>
              <p className={`text-sm leading-normal ${activeFilter === f.label ? 'text-black font-bold' : 'text-gray-500 font-medium'}`}>{f.label}</p>
            </button>
          ))}
        </div>
      </div>

      {cheapestProduct && (
        <section className="mt-6">
          <div className="flex items-center justify-between px-4 pb-3">
            <h2 className="text-xl font-bold leading-tight text-black">Destaques</h2>
            <div className="flex gap-1.5 items-center">
              <span className="text-[10px] font-black text-primary uppercase bg-black px-2 py-0.5 rounded">Mega Oferta</span>
            </div>
          </div>
          <div className="px-4">
            <div className="relative w-full overflow-hidden rounded-3xl bg-black shadow-2xl group border border-white/10">
              {/* Decorative Background */}
              <div
                className="absolute inset-0 bg-cover bg-center opacity-70 group-hover:scale-105 transition-transform duration-[2000ms]"
                style={{ backgroundImage: 'url("https://antigravity-artifacts.s3.amazonaws.com/product_highlight_bg65186552_1768552161471.png")' }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-black/90 via-black/40 to-transparent"></div>

              <div className="relative z-10 p-6 flex flex-col h-full min-h-[180px] justify-between">
                <div>
                  <span className="px-2.5 py-1 bg-primary text-black text-[10px] font-black rounded uppercase tracking-widest shadow-lg">Preço Imbatível</span>
                  <h3 className="text-white text-2xl font-black mt-3 leading-tight uppercase italic">{cheapestProduct.nome}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-primary text-xl font-black italic">Kz {cheapestProduct.preco.toLocaleString()}</span>
                    <span className="text-white/40 text-xs line-through">Por tempo limitado</span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('shop')}
                  className="bg-primary hover:bg-primary-hover text-black text-xs font-black py-3.5 px-6 rounded-2xl w-full mt-4 transition-all shadow-xl shadow-primary/30 active:scale-[0.98] uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
                  Comprar Agora
                </button>
              </div>

              {/* Decorative Floating Element */}
              <div className="absolute top-4 right-4 animate-bounce pointer-events-none">
                <span className="material-symbols-outlined text-primary text-4xl opacity-40">stars</span>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="mt-8 px-4">
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
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

const OfferCard = ({ title, desc, reward, image, onClick }: any) => (
  <div className="group overflow-hidden rounded-[24px] bg-white shadow-md border border-amazon-border transition-all hover:shadow-xl">
    <div className="relative h-48 w-full overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url("${image}")` }}></div>
    </div>
    <div className="p-5">
      <h3 className="text-lg font-bold text-black mb-1.5">{title}</h3>
      <p className="text-sm text-gray-500 font-medium leading-relaxed mb-5">{desc}</p>
      <div className="flex items-center justify-between pt-4 border-t border-amazon-border">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-0.5">Recompensa</span>
          <span className="text-primary font-black text-lg">{reward}</span>
        </div>
        <button onClick={onClick} className="rounded-xl bg-primary hover:bg-primary-hover text-black px-6 py-3 text-sm font-black transition-all active:scale-[0.95] shadow-lg shadow-primary/20">Ativar</button>
      </div>
    </div>
  </div>
);

export default Home;

