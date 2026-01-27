
import React, { useEffect } from 'react';

interface Props {
  onNavigate: (page: any) => void;
}

const SplashScreenAds: React.FC<Props> = ({ onNavigate }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onNavigate('home');
    }, 10000);

    return () => clearTimeout(timer);
  }, [onNavigate]);
  return (
    <div className="bg-background-dark font-display text-black antialiased min-h-screen relative overflow-hidden flex flex-col">
      {/* Decorative Glows */}
      <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-primary/10 blur-[100px] pointer-events-none"></div>
      <div className="absolute top-1/2 -right-20 h-64 w-64 rounded-full bg-primary/5 blur-[80px] pointer-events-none"></div>

      {/* Header with Close & WhatsApp icons */}
      <header className="relative z-10 flex w-full items-center justify-between p-4 pt-8">
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition-all hover:bg-[#25D366]/20 active:scale-95 group border border-white/10">
          <svg className="h-5 w-5 fill-slate-400 transition-colors group-hover:fill-[#25D366]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"></path>
          </svg>
        </button>
        <button
          onClick={() => onNavigate('home')}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 transition hover:bg-primary hover:text-background-dark active:scale-95 group border border-primary/20"
        >
          <span className="material-symbols-outlined text-primary transition-colors group-hover:text-background-dark" style={{ fontSize: '24px' }}>close</span>
        </button>
      </header>

      {/* Body Content */}
      <div className="flex flex-1 flex-col items-center overflow-y-auto px-6 pb-6 no-scrollbar">
        {/* Ad Image Container */}
        <div className="relative mb-8 mt-4 flex w-full max-w-sm flex-col items-center justify-center">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10">
            <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent opacity-40 z-10"></div>
            <div
              className="h-full w-full bg-cover bg-center transition-transform duration-700 hover:scale-105"
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDzyaMARPURhR3KRm8tpXc6N3QCBvED9Zat17uDNYLUoKiBoPY2wgRv_rlish6vBeR0CAXMcAJJc3a9K_5DHB38aCI0zKn4XcgaS4oXVMhGV28LtFD-hNcRvJnLeUCFRuGnk4l1HcnbwHfbSFRkCtQuyjGRoJjr3r92lqen1Qo8_Vlw4fY2aZtDwWNviDNWeM_sbw-_3Dlr-HtlMAunZofw8xd4YR0ReNreT04lMXeja9CuV-WWPieRHESSGL7qvnqVfwdMm49DVUYF")' }}
            ></div>
          </div>
        </div>

        {/* Offer Tag */}
        <div className="mb-4 flex flex-wrap justify-center gap-2">
          <div className="flex h-7 items-center justify-center rounded-full bg-primary/20 px-3 py-1 ring-1 ring-primary/30">
            <span className="material-symbols-outlined mr-1.5 text-primary" style={{ fontSize: '16px' }}>local_offer</span>
            <p className="text-primary text-xs font-bold tracking-wide uppercase">Oferta Especial</p>
          </div>
        </div>

        {/* Headlines */}
        <h1 className="mb-4 text-center text-3xl font-extrabold leading-tight tracking-tight text-black sm:text-4xl">
          Ganhe <span className="text-primary">5% de Volta</span> Hoje!
        </h1>
        <p className="mb-8 max-w-xs text-center text-base font-medium leading-relaxed text-gray-700">
          FaÃ§a compras acima de <span className="font-bold text-black">10.000 Kz</span> na categoria EletrÃ´nicos e receba cashback instantÃ¢neo na sua conta.
        </p>

        <div className="flex-1"></div>

        {/* Actions */}
        <div className="w-full max-w-sm space-y-3 pb-8">
          <button
            onClick={() => onNavigate('campaigns')}
            className="group relative flex h-14 w-full items-center justify-center overflow-hidden rounded-xl bg-primary text-background-dark transition-all hover:bg-[#eac410] active:scale-[0.98] cursor-pointer"
          >
            <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100"></div>
            <span className="z-10 text-lg font-bold tracking-tight">Aproveitar Agora</span>
            <span className="material-symbols-outlined z-10 ml-2" style={{ fontSize: '20px' }}>arrow_forward</span>
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-transparent text-sm font-semibold text-gray-500 transition hover:text-gray-600 cursor-pointer"
          >
            Fechar e ir para a conta
          </button>
        </div>
      </div>
    </div>
  );
};

export default SplashScreenAds;

