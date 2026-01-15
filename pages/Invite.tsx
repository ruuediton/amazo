
import React from 'react';

interface InviteProps {
  onNavigate: (page: any) => void;
}

const Invite: React.FC<InviteProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col pb-24">
      <header className="flex items-center justify-between px-4 py-4 sticky top-0 z-20 bg-background-dark/95 backdrop-blur-md border-b border-gray-200">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center justify-center p-2 rounded-full text-primary hover:bg-white/10 transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold text-black tracking-tight">Convites</h1>
        <button
          onClick={() => onNavigate('tutoriais-como-convidar')}
          className="flex items-center justify-center p-2 rounded-full text-black hover:bg-white/10 transition-colors"
        >
          <span className="material-symbols-outlined">help</span>
        </button>
      </header>

      <main className="flex-1 flex flex-col px-4 pt-4 pb-8">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: '32px' }}>loyalty</span>
          </div>
          <h2 className="text-[28px] font-extrabold text-black leading-tight mb-2">
            Convide amigos,<br />ganhe benefícios.
          </h2>
          <p className="text-gray-600 text-base max-w-[280px]">
            Compartilhe seu código e ganhe <span className="font-bold text-black">500 Kz</span> por cada conta ativada.
          </p>
        </div>

        <div className="bg-surface-dark border border-white/10 rounded-xl p-5 mb-8 shadow-sm">
          <div className="mb-5">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 text-center">
              Seu código exclusivo
            </label>
            <div className="relative group cursor-pointer">
              <div className="absolute inset-0 bg-primary/20 blur-md rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-black/40 border border-dashed border-white/20 rounded-lg py-4 flex items-center justify-center">
                <span className="text-3xl font-mono font-bold text-black tracking-widest select-all">AMZ-AO-99</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <button className="w-full bg-primary hover:bg-primary-hover text-black font-bold py-3.5 px-6 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined">content_copy</span>
              Copiar código
            </button>
            <button className="w-full bg-transparent border border-white/20 hover:bg-white/5 text-black font-bold py-3.5 px-6 rounded-lg flex items-center justify-center gap-2 transition-all">
              <span className="material-symbols-outlined">ios_share</span>
              Compartilhar link
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="bg-surface-dark border border-gray-200 p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-green-900/30 rounded-md">
                <span className="material-symbols-outlined text-green-600 text-[18px]">payments</span>
              </div>
              <span className="text-xs font-bold text-gray-600 uppercase">Ganhos</span>
            </div>
            <span className="text-2xl font-bold text-black">Kz 1.500</span>
            <p className="text-[10px] text-gray-600 mt-1">Acumulado este mês</p>
          </div>
          <div className="bg-surface-dark border border-gray-200 p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-blue-900/30 rounded-md">
                <span className="material-symbols-outlined text-blue-400 text-[18px]">group</span>
              </div>
              <span className="text-xs font-bold text-gray-600 uppercase">Total Equipe</span>
            </div>
            <span className="text-2xl font-bold text-black">6</span>
            <p className="text-[10px] text-gray-600 mt-1">L1 + L2 + L3</p>
          </div>
        </div>

        {/* Ver Subordinados Button */}
        <div className="flex flex-col gap-4">
          <button
            onClick={() => onNavigate('subordinate-list')}
            className="group flex items-center justify-between p-5 bg-surface-dark border border-white/10 rounded-2xl transition-all hover:border-primary active:scale-[0.98] shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-colors">
                <span className="material-symbols-outlined text-[32px]">diversity_3</span>
              </div>
              <div className="text-left">
                <h3 className="text-black font-bold text-lg leading-tight">Lista de Subordinados</h3>
                <p className="text-gray-500 text-xs font-medium mt-1">Ver todos os convidados (L1, L2, L3)</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-gray-600">chevron_right</span>
          </button>

          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-2 text-primary mb-2">
              <span className="material-symbols-outlined text-[18px]">info</span>
              <p className="text-[10px] font-black uppercase tracking-widest">Sistema de Níveis</p>
            </div>
            <p className="text-gray-600 text-xs leading-relaxed">
              Você ganha comissões não apenas dos seus amigos (L1), mas também dos amigos que eles convidarem (L2 e L3). Aumente sua rede para ganhos passivos.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Invite;
