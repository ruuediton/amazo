import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';

interface HomeProps {
  onNavigate: (page: any) => void;
  onOpenSupport?: () => void;
  profile: any;
}

interface MarketingItem {
  id: string;
  url_image: string;
  descricao_nome: string;
  data: string;
}

const carouselImages = [
  "/carousel1.png",
  "/carousel2.png",
  "/carousel3.png",
  "/carousel4.png"
];

const Home: React.FC<HomeProps> = ({ onNavigate, profile }) => {
  const [activeFilter, setActiveFilter] = useState('Todas');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cheapestProduct, setCheapestProduct] = useState<any>(null);
  const [marketingItems, setMarketingItems] = useState<MarketingItem[]>([]);
  const [recentPurchases, setRecentPurchases] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

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

    const fetchMarketing = async () => {
      try {
        const { data, error } = await supabase
          .from('marketing')
          .select('*')
          .order('data', { ascending: false })
          .limit(15);

        if (data && !error) {
          setMarketingItems(data);
        }
      } catch (err) {
        console.error("Marketing fetch error:", err);
      }
    };

    const fetchRecentPurchases = async () => {
      try {
        const { data } = await supabase
          .from('historico_compras')
          .select('id, nome_produto, status')
          .eq('user_id', profile.id)
          .order('data_compra', { ascending: false })
          .limit(5);

        if (data) {
          setRecentPurchases(data);
        }
      } catch (err) {
        console.error("Purchases fetch error:", err);
      }
    };

    const loadAll = async () => {
      setLoadingData(true);
      await Promise.all([
        fetchCheapest(),
        fetchMarketing(),
        fetchRecentPurchases()
      ]);
      setLoadingData(false);
    };

    loadAll();
  }, [profile?.id]);

  const FILTERS = [
    { label: 'Geral', icon: 'star', page: 'historico-conta' },
    { label: 'Retiradas', icon: 'shopping_bag', page: 'withdrawal-history' },
    { label: 'Compras', icon: 'account_balance', page: 'purchase-history' },
    { label: 'Recargas', icon: 'handshake', page: 'deposit-history' },
    { label: 'Promoção', icon: 'local_offer', page: 'shop' },
    { label: 'Suporte', icon: 'contact_support', page: 'support' }
  ];

  return (
    <div className="flex flex-col pb-40 bg-white min-h-screen font-display antialiased relative">
      {/* Carousel */}
      <section className="relative w-full h-[200px] overflow-hidden">
        <div className="flex transition-transform duration-1000 ease-in-out h-full" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {carouselImages.map((img, index) => (
            <div key={index} className="w-full h-full flex-shrink-0 bg-cover bg-center" style={{ backgroundImage: `url("${img}")` }}>
            </div>
          ))}
        </div>

        {/* User Greeting Overlay */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full border border-white/30">
          <div className="size-6 rounded-full bg-[#00C853] flex items-center justify-center">
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
      <div className="bg-[#00C853] py-2 overflow-hidden border-b border-gray-100 flex items-center h-8">
        <div className="flex whitespace-nowrap animate-marquee">
          <span className="text-[10px] font-bold text-[#0F1111] uppercase tracking-widest px-8">
            • APROVEITE AS OFERTAS EXCLUSIVAS BP • GANHE 5% DE CASHBACK EM ELETRÔNICOS • SUPORTE 24H DISPONÍVEL •
          </span>
          <span className="text-[10px] font-bold text-[#0F1111] uppercase tracking-widest px-8">
            • APROVEITE AS OFERTAS EXCLUSIVAS BP • GANHE 5% DE CASHBACK EM ELETRÔNICOS • SUPORTE 24H DISPONÍVEL •
          </span>
        </div>
      </div>

      {/* Quick Actions - Flat Border Style */}
      <div className="px-4 pt-6 mb-2">
        <div className="grid grid-cols-3 gap-3">
          <button onClick={() => onNavigate('deposit')} className="flex flex-col items-center justify-center gap-1.5 p-4 bg-[#00C853] text-black rounded-2xl border border-[#00C853] active:scale-95 transition-all group">
            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>add_card</span>
            <span className="text-[11px] font-bold uppercase tracking-tight">Recarregar</span>
          </button>
          <button onClick={() => onNavigate('retirada')} className="flex flex-col items-center justify-center gap-1.5 p-4 bg-gray-50 border border-gray-100 text-[#0F1111] rounded-2xl active:scale-95 transition-all group">
            <span className="material-symbols-outlined text-[24px]">payments</span>
            <span className="text-[11px] font-bold uppercase tracking-tight">Retirar</span>
          </button>
          <button onClick={() => onNavigate('tutorials')} className="flex flex-col items-center justify-center gap-1.5 p-4 bg-gray-50 border border-gray-100 text-[#0F1111] rounded-2xl active:scale-95 transition-all group">
            <span className="material-symbols-outlined text-[24px]">help_outline</span>
            <span className="text-[11px] font-bold uppercase tracking-tight">Ajuda</span>
          </button>
        </div>
      </div>

      {/* Sticky Filters - BP Style */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100 py-3 mt-4">
        <div className="flex gap-2.5 px-4 overflow-x-auto no-scrollbar scroll-smooth">
          {FILTERS.map((f: any) => (
            <button key={f.label} onClick={() => f.page ? onNavigate(f.page) : setActiveFilter(f.label)} className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg px-4 transition-all active:scale-95 ${activeFilter === f.label ? 'bg-gray-100 border border-gray-200' : 'bg-gray-50 border border-gray-100'}`}>
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
            <button onClick={() => onNavigate('shop')} className="text-[13px] font-bold text-brand-blue hover:underline">Ver todas</button>
          </div>
          <div className="px-4">
            <div className="relative w-full overflow-hidden rounded-2xl bg-gray-50 border border-gray-100 group">
              <div className="p-5 flex flex-col sm:flex-row gap-5">
                <div className="w-full sm:w-32 h-32 bg-white rounded-lg p-2 flex items-center justify-center border border-gray-100">
                  <img loading="lazy" decoding="async" src={cheapestProduct.image_url || "/placeholder_product.png"} alt="" className="max-w-full max-h-full object-contain" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="px-2 py-0.5 bg-[#CC0C39] text-white text-[10px] font-bold rounded">OFERTA MEGA</span>
                    <h3 className="text-[#0F1111] text-[16px] font-medium mt-2 leading-tight line-clamp-2">{cheapestProduct.name}</h3>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-[13px] font-bold">KZs</span>
                      <span className="text-[26px] font-black leading-none">{cheapestProduct.price.toLocaleString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate('shop')}
                    className="bg-[#00C853] hover:brightness-110 text-black text-[14px] font-medium py-2.5 rounded-full w-full mt-4 transition-all border border-[#00C853]"
                  >
                    Comprar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Marketing Section */}
      <section className="mt-2 bg-white px-4 pt-4 pb-2 border-t border-gray-100">
        <h2 className="text-[16px] font-bold text-[#0F1111] mb-3 leading-tight">Ofertas que podem te interessar</h2>

        {loadingData ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-100 h-32 rounded-lg mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-3/4 mb-1.5"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : marketingItems.slice(0, 4).length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {marketingItems.slice(0, 4).map((item, i) => (
              <div key={item.id} onClick={() => onNavigate('shop')} className="cursor-pointer group">
                <div className="bg-[#F7F8F8] h-32 p-4 flex items-center justify-center border border-gray-100 rounded-lg mb-2 group-hover:bg-gray-100 transition-colors">
                  <img loading="lazy" decoding="async" src={item.url_image} className="max-h-full max-w-full object-contain opacity-90 group-hover:opacity-100 transition-opacity" alt={item.descricao_nome} />
                </div>
                <div className="flex flex-wrap gap-1.5 items-center">
                  <span className="bg-[#CC0C39] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-[2px]">Oferta</span>
                  <span className="text-[#0F1111] text-[12px] font-medium leading-tight line-clamp-2">{item.descricao_nome}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2].map((item, i) => (
              <div key={i} className="cursor-pointer group opacity-50">
                <div className="bg-[#F7F8F8] h-32 p-4 flex items-center justify-center border border-gray-100 rounded-lg mb-2">
                  <span className="material-symbols-outlined text-gray-200 text-4xl">image</span>
                </div>
                <div className="h-3 bg-gray-100 rounded w-3/4 mb-1.5"></div>
              </div>
            ))}
          </div>
        )}

        <button onClick={() => onNavigate('shop')} className="mt-4 mb-2 text-[13px] font-medium text-brand-blue hover:text-[#C7511F] hover:underline">Ver todas as ofertas</button>
      </section>

      <div className="h-2 bg-[#F0F2F2]"></div>

      <section className="bg-white px-4 pt-4 pb-2">
        <h2 className="text-[16px] font-bold text-[#0F1111] mb-3 leading-tight">Continuar comprando</h2>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {marketingItems.slice(4, 8).length > 0 ? (
            marketingItems.slice(4, 8).map((item) => (
              <div key={item.id} onClick={() => onNavigate('shop')} className="min-w-[130px] cursor-pointer group">
                <div className="bg-[#F7F8F8] h-28 p-3 flex items-center justify-center border border-gray-100 rounded-lg mb-1.5 group-hover:bg-gray-100 transition-colors">
                  <img loading="lazy" decoding="async" src={item.url_image} className="max-h-full max-w-full object-contain opacity-90 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-[13px] text-[#0F1111] font-medium leading-tight truncate">{item.descricao_nome}</p>
                <p className="text-[11px] text-[#565959] truncate">Visualizado recentemente</p>
              </div>
            ))
          ) : recentPurchases.length > 0 ? (
            recentPurchases.map((purchase) => (
              <div key={purchase.id} onClick={() => onNavigate('purchase-history')} className="min-w-[130px] cursor-pointer group">
                <div className="bg-[#F7F8F8] h-28 p-3 flex items-center justify-center border border-gray-100 rounded-lg mb-1.5 group-hover:bg-gray-100 transition-colors">
                  <img loading="lazy" decoding="async" src="/placeholder_product.png" className="max-h-full max-w-full object-contain opacity-80 mix-blend-multiply" />
                </div>
                <p className="text-[13px] text-[#0F1111] font-medium leading-tight truncate">{purchase.nome_produto}</p>
                <p className="text-[11px] text-[#565959] truncate">{purchase.status === 'pendente' ? 'Processando' : 'Comprado recentemente'}</p>
              </div>
            ))
          ) : (
            [1, 2, 3].map((_, i) => (
              <div key={i} onClick={() => onNavigate('shop')} className="min-w-[130px] cursor-pointer opacity-60">
                <div className="bg-[#F7F8F8] h-28 p-3 flex items-center justify-center border border-gray-100 rounded-lg mb-1.5">
                  <span className="material-symbols-outlined text-gray-300 text-3xl">shopping_bag</span>
                </div>
                <p className="text-[13px] text-[#0F1111] font-medium leading-tight truncate">Explorar ofertas</p>
                <p className="text-[11px] text-[#565959]">Ver produtos</p>
              </div>
            ))
          )}
        </div>
        <button onClick={() => onNavigate('purchase-history')} className="mt-2 mb-2 text-[13px] font-medium text-[#00C853] hover:underline">Visualize seu histórico</button>
      </section>

      <div className="h-2 bg-[#F0F2F2]"></div>

      <section className="bg-white px-4 pt-4 pb-6">
        <h2 className="text-[16px] font-bold text-[#0F1111] mb-3 leading-tight">Conquiste os melhores PCs e acessórios</h2>
        <div className="grid grid-cols-2 gap-3">
          {marketingItems.slice(8, 12).length > 0 ? (
            marketingItems.slice(8, 12).map((item) => (
              <div key={item.id} onClick={() => onNavigate('shop')} className="cursor-pointer group">
                <div className="bg-[#F7F8F8] h-28 p-3 flex items-center justify-center border border-gray-100 rounded-lg mb-1.5 group-hover:bg-gray-100 transition-colors">
                  <img loading="lazy" decoding="async" src={item.url_image} className="max-h-full max-w-full object-contain opacity-90 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-[12px] text-[#0F1111] font-medium truncate">{item.descricao_nome}</p>
              </div>
            ))
          ) : (
            [
              { title: 'Desktops', img: '/placeholder_product.png' },
              { title: 'Laptops', img: '/placeholder_product.png' },
              { title: 'Discos rígidos', img: '/placeholder_product.png' },
              { title: 'PC e acessórios', img: '/placeholder_product.png' }
            ].map((cat, i) => (
              <div key={i} onClick={() => onNavigate('shop')} className="cursor-pointer">
                <div className="bg-[#F7F8F8] h-28 p-3 flex items-center justify-center border border-gray-100 rounded-lg mb-1.5">
                  <img loading="lazy" decoding="async" src={cat.img} className="max-h-full max-w-full object-contain opacity-80" />
                </div>
                <p className="text-[12px] text-[#0F1111] font-medium">{cat.title}</p>
              </div>
            ))
          )}
        </div>
        <button onClick={() => onNavigate('shop')} className="mt-4 text-[13px] font-medium text-[#00C853] hover:underline">Ver mais</button>
      </section>

      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 25s linear infinite; }
      `}</style>
    </div>
  );
};

export default Home;

