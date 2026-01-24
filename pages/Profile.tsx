
import React from 'react';
import { supabase } from '../supabase';
import SpokeSpinner from '../components/SpokeSpinner';

interface ProfileProps {
  onNavigate: (page: any) => void;
  onLogout?: () => void;
  profile: any;
}

const Profile: React.FC<ProfileProps> = ({ onNavigate, onLogout, profile }) => {
  const [showBalance, setShowBalance] = React.useState(true);
  const [userPhone, setUserPhone] = React.useState<string | null>(null);
  const [currentProfile, setCurrentProfile] = React.useState<any>(profile);

  const [stats, setStats] = React.useState<any>({
    balance: profile?.balance || 0,
    reloaded_amount: 0,
    retirada_total: 0,
    renda_diaria: 0,
    fundo_aplicado: 0,
    renda_mensal: 0,
  });

  const fetchData = async () => {
    try {
      // Fetch consolidated stats via RPC
      const { data: statsData, error: statsError } = await supabase.rpc('get_profile_stats');
      if (!statsError && statsData) {
        setStats(statsData);
      }

      // Update phone display
      let displayPhone = profile?.phone || "";
      if (displayPhone && !displayPhone.startsWith('+')) {
        displayPhone = `+244 ${displayPhone}`;
      }
      setUserPhone(displayPhone);
    } catch (err) {
      console.error("Profile fetch stats error:", err);
    }
  };

  React.useEffect(() => {
    if (profile) {
      setCurrentProfile(profile);
      fetchData();
    }
  }, [profile]);

  if (!currentProfile || !stats.balance === undefined) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black/5 backdrop-blur-sm">
      <SpokeSpinner size="w-12 h-12" className="text-black/60" />
    </div>
  );

  return (
    <div className="flex flex-col pb-32 bg-white text-[#111418] font-display overflow-x-hidden">
      {/* Header Section */}
      <div className="pt-6 pb-4 px-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold tracking-tight text-[#111418]">
              {currentProfile.full_name || 'Usuário amazon'}
            </h1>
            <div className="flex flex-col mt-1 space-y-0.5">
              <p className="text-[#637381] text-sm font-medium">{userPhone || '+244 000 000 000'}</p>
            </div>
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-[#f4d125] rounded-full">
              <span className="material-symbols-outlined text-[#111418] text-[16px] font-bold">verified</span>
              <span className="text-[#111418] text-[10px] font-extrabold uppercase tracking-wider">
                INVESTIDOR
              </span>
            </div>
          </div>
          <div className="relative shrink-0 ml-4">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-20 w-20 border-2 border-[#f4d125] shadow-sm"
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC_O5s3g5eF50cs5tQ_zh2NLwLYFyqEHtdcmZQASWBXJmsfG9k1wREC0IVW-eylYq2qw9Wumxb3YSS9L8wyFWSAANAxg0weMoxNXY5GHUshMgmu4w9sjeIyoflSKaECFCwFS1gStIJMDr7wVpnTKZtIpcTAH9dvh6Gana_Pw0-htT1Q9DdTGiPGHpfWu0oZKbmwz9Siq4VzRFUsXmwkyVAA2EOn-fhlHOMblENj8rod3pTqjUbUouxH6s1qZ6ZAEvzMM3z9YeCoHvE0")' }}
            ></div>
            <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md border border-gray-100">
              <span className="material-symbols-outlined text-[#111418] text-[14px] block">edit</span>
            </div>
          </div>
        </div>
      </div>

      {/* Balance Card Section */}
      <div className="px-4 mb-6">
        <div className="rounded-2xl bg-[#fefce8] p-6 border border-[#f4d125]/20 shadow-sm relative overflow-hidden">
          {/* Decorative Background Icon */}
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none translate-x-4 -translate-y-4">
            <span className="material-symbols-outlined text-[120px] text-[#f4d125]">account_balance_wallet</span>
          </div>

          <div className="relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[#637381] text-xs font-bold uppercase tracking-widest mb-1">Saldo Disponível</p>
                <div className="flex items-center gap-2">
                  <h3 className="text-3xl font-extrabold text-[#111418] tracking-tight">
                    Kz {showBalance ? (stats.balance || 0).toLocaleString('pt-AO', { minimumFractionDigits: 2 }) : '••••••'}
                  </h3>
                  <button onClick={() => setShowBalance(!showBalance)} className="text-[#637381]/60">
                    <span className="material-symbols-outlined text-[20px]">
                      {showBalance ? 'visibility' : 'visibility_off'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-y-6 gap-x-1 mt-8 pt-4 border-t border-[#f4d125]/10">
            <div className="text-center">
              <p className="text-[9px] uppercase text-[#637381] font-bold tracking-wider">Recarga Total</p>
              <p className="text-[13px] font-bold text-[#111418] mt-1">Kz {(stats.reloaded_amount || 0).toLocaleString('pt-AO')}</p>
              <div className="mt-4 pt-3 border-t border-[#f4d125]/5">
                <p className="text-[9px] uppercase text-[#637381] font-bold tracking-wider">Fundo Aplicado</p>
                <p className="text-[13px] font-bold text-[#111418] mt-1">Kz {(stats.fundo_aplicado || 0).toLocaleString('pt-AO')}</p>
              </div>
            </div>
            <div className="text-center border-x border-[#f4d125]/10">
              <p className="text-[9px] uppercase text-[#637381] font-bold tracking-wider">Retirada Total</p>
              <p className="text-[13px] font-bold text-[#111418] mt-1">Kz {(stats.retirada_total || 0).toLocaleString('pt-AO')}</p>
              <div className="mt-4 pt-3 border-t border-[#f4d125]/5">
                <p className="text-[9px] uppercase text-[#637381] font-bold tracking-wider">Tempo Ativo</p>
                <p className="text-[13px] font-bold text-[#111418] mt-1">6h 12m</p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-[9px] uppercase text-[#637381] font-bold tracking-wider">Renda Diária</p>
              <p className="text-[13px] font-bold text-green-600 mt-1">+Kz {(stats.renda_diaria || 0).toLocaleString('pt-AO')}</p>
              <div className="mt-4 pt-3 border-t border-[#f4d125]/5">
                <p className="text-[9px] uppercase text-[#637381] font-bold tracking-wider">Renda Mensal</p>
                <p className="text-[13px] font-bold text-green-600 mt-1">+Kz {(stats.renda_mensal || 0).toLocaleString('pt-AO')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="px-4 space-y-6">
        <section>
          <h3 className="text-[11px] font-extrabold text-[#637381] uppercase tracking-[0.05em] mb-2.5 ml-1">Serviços</h3>
          <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
            {[
              { label: 'Retirar fundo', icon: 'account_balance_wallet', page: 'retirada' },
              { label: 'Recarregar', icon: 'payments', page: 'deposit' },
              { label: 'Recarga USDT', icon: 'stars', page: 'deposit-usdt' },
              { label: 'Aplicar Fundo', icon: 'trending_up', page: 'investimentos-fundo' },

              { label: 'Baixar App', icon: 'download', page: 'download-app' },
              { label: 'Resgatar prêmios', icon: 'assignment', page: 'gift-chest' },
            ].map((item, i, arr) => (
              <div
                key={item.label}
                onClick={() => item.page ? onNavigate(item.page) : null}
                className={`flex items-center gap-3 p-3.5 ${i !== arr.length - 1 ? 'border-b-[0.5px] border-[#F3F4F6]' : ''} active:bg-gray-50 cursor-pointer`}
              >
                <div className="flex items-center justify-center rounded-lg bg-[#FFF9DB] text-[#f4d125] shrink-0 size-9">
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-[14px]">{item.label}</p>
                </div>
                <span className="material-symbols-outlined text-gray-300 text-xl">chevron_right</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-[11px] font-extrabold text-[#637381] uppercase tracking-[0.05em] mb-2.5 ml-1">Históricos</h3>
          <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
            {[
              { label: 'Detalhes de Conta', icon: 'account_circle', page: 'detalhes-conta' },

            ].map((item, i, arr) => (
              <div
                key={item.label}
                onClick={() => item.page ? onNavigate(item.page) : null}
                className={`flex items-center gap-3 p-3.5 ${i !== arr.length - 1 ? 'border-b-[0.5px] border-[#F3F4F6]' : ''} active:bg-gray-50 cursor-pointer`}
              >
                <div className="flex items-center justify-center rounded-lg bg-[#FFF9DB] text-[#f4d125] shrink-0 size-9">
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-[14px]">{item.label}</p>
                </div>
                <span className="material-symbols-outlined text-gray-300 text-xl">chevron_right</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-[11px] font-extrabold text-[#637381] uppercase tracking-[0.05em] mb-2.5 ml-1">Segurança</h3>
          <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
            {[
              { label: 'Trocar Senha', icon: 'lock_reset', page: 'change-password' },
              { label: 'Definir Senha de Retirada', icon: 'pin', page: 'withdraw-password' },
              { label: 'Alterar Senha de Retirada', icon: 'lock_person', page: 'update-withdraw-password' },
            ].map((item, i, arr) => (
              <div
                key={item.label}
                onClick={() => item.page ? onNavigate(item.page) : null}
                className={`flex items-center gap-3 p-3.5 ${i !== arr.length - 1 ? 'border-b-[0.5px] border-[#F3F4F6]' : ''} active:bg-gray-50 cursor-pointer`}
              >
                <div className="flex items-center justify-center rounded-lg bg-[#FFF9DB] text-[#f4d125] shrink-0 size-9">
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-[14px]">{item.label}</p>
                </div>
                <span className="material-symbols-outlined text-gray-300 text-xl">chevron_right</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-[11px] font-extrabold text-[#637381] uppercase tracking-[0.05em] mb-2.5 ml-1">Outros</h3>
          <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
            {[
              { label: 'Configurações', icon: 'settings', page: 'settings' },

              { label: 'Suporte', icon: 'support_agent', page: 'support' },
              { label: 'Relatar Problema', icon: 'report_problem', page: 'report' },
              { label: 'Sobre a Empresa', icon: 'domain', page: 'info' },
            ].map((item, i, arr) => (
              <div
                key={item.label}
                onClick={() => item.page ? onNavigate(item.page) : null}
                className={`flex items-center gap-3 p-3.5 ${i !== arr.length - 1 ? 'border-b-[0.5px] border-[#F3F4F6]' : ''} active:bg-gray-50 cursor-pointer`}
              >
                <div className="flex items-center justify-center rounded-lg bg-[#FFF9DB] text-[#f4d125] shrink-0 size-9">
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-[14px]">{item.label}</p>
                </div>
                <span className="material-symbols-outlined text-gray-300 text-xl">chevron_right</span>
              </div>
            ))}
          </div>
        </section>

        <div className="pb-12 pt-4">
          <button
            onClick={onLogout}
            className="w-full py-3 text-center text-red-600 font-bold bg-[#fee2e2] active:bg-red-200 rounded-xl transition-colors text-[14px]"
          >
            Sair da Conta
          </button>
          <p className="text-center text-[10px] font-bold text-[#637381]/40 mt-6 uppercase tracking-widest">
            Versão 2.4.0 • Build 884
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;

