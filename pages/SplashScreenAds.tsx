
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';

interface Props {
  onNavigate: (page: any) => void;
}

const SplashScreenAds: React.FC<Props> = ({ onNavigate }) => {
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();
        if (profile?.full_name) {
          setUserName(profile.full_name.split(' ')[0]);
        }
      }
    };
    fetchUser();

    const timer = setTimeout(() => {
      onNavigate('home');
    }, 12000);

    return () => clearTimeout(timer);
  }, [onNavigate]);

  return (
    <div className="bg-[#F8FAF8] font-sans text-black antialiased min-h-screen relative overflow-hidden flex flex-col selection:bg-[#00C853] selection:text-white">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-gradient-to-br from-[#00C853]/10 to-transparent blur-[120px] animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[-5%] left-[-5%] h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-[#00C853]/5 to-transparent blur-[100px] pointer-events-none"></div>

      {/* Extreme Top Header */}
      <header className="relative z-20 flex w-full items-center justify-between p-6 pt-10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center border border-gray-100">
            <span className="material-symbols-outlined text-[#00C853] text-[22px]">auto_awesome</span>
          </div>
          <p className="text-[14px] font-black uppercase tracking-[3px] text-gray-400">BP Exclusive</p>
        </div>
        <button
          onClick={() => onNavigate('home')}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 backdrop-blur-md shadow-sm border border-gray-100 transition-all hover:scale-110 active:scale-90 group"
        >
          <span className="material-symbols-outlined text-gray-400 group-hover:text-black transition-colors" style={{ fontSize: '24px' }}>close</span>
        </button>
      </header>

      {/* Main Content Area - Layered Depth Topology */}
      <div className="flex-1 flex flex-col relative z-10 px-6 pt-2">

        {/* Personalized Greeting - Asymmetric Tension */}
        <div className="mb-4 animate-in fade-in slide-in-from-left-8 duration-700">
          <h2 className="text-[42px] font-black leading-[0.9] tracking-tighter text-[#111]">
            Olá, {userName || 'Investidor'}<span className="text-[#00C853]">!</span>
          </h2>
          <p className="text-[15px] font-medium text-gray-500 mt-2">Que bom ter você de volta.</p>
        </div>

        {/* Visual Product Layer - Overlapping */}
        <div className="relative w-full h-[320px] mt-8 mb-4 animate-in fade-in zoom-in-95 duration-1000 delay-300">
          <div className="absolute inset-0 bg-[#00C853]/5 rounded-[40px] transform rotate-[-2deg]"></div>
          <div className="absolute inset-0 bg-white rounded-[40px] shadow-2xl shadow-green-900/5 overflow-hidden border border-white/20">
            <div
              className="absolute inset-0 bg-cover bg-center animate-subtle-zoom"
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDzyaMARPURhR3KRm8tpXc6N3QCBvED9Zat17uDNYLUoKiBoPY2wgRv_rlish6vBeR0CAXMcAJJc3a9K_5DHB38aCI0zKn4XcgaS4oXVMhGV28LtFD-hNcRvJnLeUCFRuGnk4l1HcnbwHfbSFRkCtQuyjGRoJjr3r92lqen1Qo8_Vlw4fY2aZtDwWNviDNWeM_sbw-_3Dlr-HtlMAunZofw8xd4YR0ReNreT04lMXeja9CuV-WWPieRHESSGL7qvnqVfwdMm49DVUYF")' }}
            ></div>
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>

          {/* Floating Ad Badge */}
          <div className="absolute -bottom-4 -right-2 bg-[#00C853] text-white px-5 py-2.5 rounded-2xl shadow-xl shadow-green-500/30 flex items-center gap-2 animate-bounce-subtle">
            <span className="material-symbols-outlined text-[18px]">bolt</span>
            <span className="text-[14px] font-black uppercase tracking-wider">Oferta Ativa</span>
          </div>
        </div>

        {/* Headlines - Massive Typographic Layout */}
        <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
          <h3 className="text-[32px] font-black leading-tight tracking-tight text-[#111]">
            Ganhe <span className="underline decoration-[#00C853] decoration-8 underline-offset-[-4px]">5% Cashback</span> agora.
          </h3>
          <p className="text-[16px] font-medium leading-relaxed text-gray-600 max-w-[90%]">
            Realize compras acima de <span className="text-black font-bold">10.000 Kz</span> e recupere parte do seu valor instantaneamente.
          </p>
        </div>

        <div className="flex-1"></div>

        {/* Actions - Impactful & Clean */}
        <div className="w-full space-y-4 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700">
          <button
            onClick={() => onNavigate('campaigns')}
            className="group relative h-16 w-full flex items-center justify-center overflow-hidden rounded-[24px] bg-[#111] text-white transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-black/10"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#00C853] to-[#00E676] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <span className="relative z-10 text-[17px] font-black tracking-tight flex items-center gap-2">
              Aproveitar Agora
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
            </span>
          </button>

          <button
            onClick={() => onNavigate('home')}
            className="w-full py-2 text-[14px] font-bold text-gray-400 hover:text-gray-600 transition-colors cursor-pointer text-center"
          >
            Pular oferta e ir para conta
          </button>
        </div>
      </div>

      <style>{`
        @keyframes subtle-zoom {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-subtle-zoom { animation: subtle-zoom 20s infinite ease-in-out; }
        .animate-bounce-subtle { animation: bounce-subtle 3s infinite ease-in-out; }
      `}</style>
    </div>
  );
};

export default SplashScreenAds;

