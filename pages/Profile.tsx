import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import SpokeSpinner from '../components/SpokeSpinner';

interface ProfileProps {
  onNavigate: (page: any) => void;
  onLogout?: () => void;
  showToast?: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
  profile: any;
}

const Profile: React.FC<ProfileProps> = ({ onNavigate, onLogout, profile }) => {
  const [currentProfile, setCurrentProfile] = useState<any>(profile);
  const [stats, setStats] = useState<any>({
    balance: profile?.balance || 0,
    total_earnings: 0,
    today_earnings: 0,
  });

  useEffect(() => {
    if (profile) {
      setCurrentProfile(profile);
      fetchStats();
    }
  }, [profile]);

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase.rpc('get_profile_stats');
      if (!error && data) {
        setStats({
          balance: data.balance || 0,
          total_earnings: data.total_earnings || 0,
          today_earnings: data.renda_diaria || 0,
        });
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  if (!currentProfile) return (
    <div className="flex justify-center items-center h-screen">
      <SpokeSpinner size="w-10 h-10" color="text-[#00C853]" />
    </div>
  );

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-24 font-sans text-[#333]">
      {/* Red/Green Header Gradient Area */}
      <div className="bg-gradient-to-b from-[#00C853] to-[#00C853]/10 pt-8 pb-16 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-14 rounded-full border-2 border-white overflow-hidden bg-white">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_O5s3g5eF50cs5tQ_zh2NLwLYFyqEHtdcmZQASWBXJmsfG9k1wREC0IVW-eylYq2qw9Wumxb3YSS9L8wyFWSAANAxg0weMoxNXY5GHUshMgmu4w9sjeIyoflSKaECFCwFS1gStIJMDr7wVpnTKZtIpcTAH9dvh6Gana_Pw0-htT1Q9DdTGiPGHpfWu0oZKbmwz9Siq4VzRFUsXmwkyVAA2EOn-fhlHOMblENj8rod3pTqjUbUouxH6s1qZ6ZAEvzMM3z9YeCoHvE0"
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-white">
              <p className="font-bold text-[15px]">Conta: {currentProfile.phone || 'N/A'}</p>
              <p className="text-[12px] opacity-90">Código de Convite: {currentProfile.invite_code || '---'}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="px-5 py-1.5 bg-white/20 rounded-full text-white text-[13px] font-bold border border-white/30 active:scale-95 transition-all"
          >
            Sair
          </button>
        </div>
      </div>

      {/* Wallet Card */}
      <div className="px-4 -mt-10">
        <div className="bg-white rounded-xl p-5 shadow-sm flex items-center justify-between overflow-hidden relative">
          <div>
            <p className="text-gray-500 text-[14px]">Saldo <span className="text-[20px] font-bold text-black ml-2">{(stats.balance || 0).toLocaleString('pt-AO', { minimumFractionDigits: 2 })}</span> <span className="text-[12px] font-medium text-gray-500">KZs</span></p>
          </div>
          <button
            onClick={() => onNavigate('wallet')}
            className="bg-[#00C853] text-white px-4 py-2 rounded-lg text-[12px] font-bold active:scale-95 transition-all"
          >
            Minha Carteira
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 mt-6 grid grid-cols-2 gap-4">
        <button
          onClick={() => onNavigate('deposit')}
          className="flex items-center justify-center gap-2 bg-[#00C853] text-white h-[56px] rounded-xl font-bold text-[15px] active:scale-95 transition-all shadow-sm"
        >
          <span className="material-symbols-outlined">payments</span>
          Recarrega
        </button>
        <button
          onClick={() => onNavigate('retirada')}
          className="flex items-center justify-center gap-2 bg-[#00C853] text-white h-[56px] rounded-xl font-bold text-[15px] active:scale-95 transition-all shadow-sm"
        >
          <span className="material-symbols-outlined">account_balance_wallet</span>
          retirar o
        </button>
      </div>

      {/* Stats Cards */}
      <div className="px-4 mt-6 grid grid-cols-2 gap-4 text-center">
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <p className="text-gray-400 text-[12px] mb-2 font-medium">Total Obtido</p>
          <p className="text-[18px] font-bold">{(stats.total_earnings || 0).toLocaleString('pt-AO', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <p className="text-gray-400 text-[12px] mb-2 font-medium">Obtido Hoje</p>
          <p className="text-[18px] font-bold">{(stats.today_earnings || 0).toLocaleString('pt-AO', { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="px-4 mt-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm grid grid-cols-4 gap-y-8 gap-x-2">
          {[
            { label: 'Informação pessoal', icon: 'person', page: 'settings', color: 'bg-green-50 text-[#00C853]' },
            { label: 'Registro de tarefa', icon: 'assignment', page: 'purchase-history', color: 'bg-green-50 text-[#00C853]' },
            { label: 'Registro de mudança de conta', icon: 'account_balance', page: 'historico-conta', color: 'bg-green-50 text-[#00C853]' },
            { label: 'Relatório de equipe', icon: 'pie_chart', page: 'subordinate-list', color: 'bg-green-50 text-[#00C853]' },
            { label: 'Manual de ajuda', icon: 'description', page: 'tutorials', color: 'bg-green-50 text-[#00C853]' },
            { label: 'Catálogo de Produtos', icon: 'shopping_basket', page: 'investimentos-fundo', color: 'bg-green-50 text-[#00C853]' },
            { label: 'Sorteio da Sorte', icon: 'auto_awesome', page: 'gift-chest', color: 'bg-green-50 text-[#00C853]' },
            { label: 'Convidar Amigos', icon: 'share', page: 'invite-page', color: 'bg-green-50 text-[#00C853]' },
            { label: 'Baixar APP', icon: 'download', page: 'download-app', color: 'bg-pink-50 text-pink-500' },
          ].map((item) => (
            <div
              key={item.label}
              onClick={() => onNavigate(item.page)}
              className="flex flex-col items-center gap-2 cursor-pointer active:scale-95 transition-all text-center"
            >
              <div className={`size-12 rounded-full flex items-center justify-center ${item.color}`}>
                <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
              </div>
              <span className="text-[10px] text-gray-500 leading-tight font-medium px-1 capitalize">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Illustrative Banner */}
      <div className="px-4 mt-6">
        <div
          onClick={() => onNavigate('invite-page')}
          className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-5 border border-orange-100 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all relative overflow-hidden"
        >
          <div className="relative z-10">
            <h4 className="font-black text-[16px] text-orange-900">Convide para Ganhar Moedas</h4>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-[11px] text-orange-700 font-bold uppercase tracking-wider">Clique para Convidar Amigos</span>
              <div className="size-4 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-[12px]">chevron_right</span>
              </div>
            </div>
          </div>
          <div className="relative z-10">
            <span className="material-symbols-outlined text-[48px] text-orange-400 drop-shadow-sm">wallet</span>
          </div>
          {/* Decorative background circle */}
          <div className="absolute -right-4 -bottom-4 size-24 bg-orange-200/20 rounded-full blur-2xl"></div>
        </div>
      </div>
    </div>
  );
};

export default Profile;


