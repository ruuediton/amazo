
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

  React.useEffect(() => {
    const fetchUserAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        let phone = user.phone || user.user_metadata?.phone || "";
        // Se o telefone não começar com +, adicionamos o prefixo de Angola +244
        if (phone && !phone.startsWith('+')) {
          phone = `+244 ${phone}`;
        }
        setUserPhone(phone);
      }
    };
    fetchUserAuth();
  }, []);

  if (!profile) return (
    <div className="flex items-center justify-center min-h-screen bg-background-dark text-black">
      <SpokeSpinner size="w-10 h-10" />
    </div>
  );

  return (
    <div className="flex flex-col pb-32 bg-background-dark text-black font-display">
      {/* Header Section */}
      <div className="bg-white pt-4 pb-8 rounded-b-[2rem] border-b border-gray-100">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-black leading-tight text-black">Usuário amazon</h1>
            <p className="text-gray-500 text-sm mt-1 font-bold italic underline decoration-primary decoration-4 underline-offset-4">ID: {profile.code}</p>
            {/* Exibe o número de telefone em vez de 'Angola' */}
            <p className="text-gray-400 text-xs mt-1 font-bold">{userPhone || '+244 000 000 000'}</p>
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-full border border-gray-200">
              <span className="material-symbols-outlined text-primary text-[16px]">verified</span>
              <span className="text-black text-[10px] font-black uppercase tracking-wider">
                {profile.verified ? 'Verificado' : 'Membro Prime'}
              </span>
            </div>
          </div>
          <div className="relative">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-20 w-20 border-4 border-surface-dark shadow-xl"
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC_O5s3g5eF50cs5tQ_zh2NLwLYFyqEHtdcmZQASWBXJmsfG9k1wREC0IVW-eylYq2qw9Wumxb3YSS9L8wyFWSAANAxg0weMoxNXY5GHUshMgmu4w9sjeIyoflSKaECFCwFS1gStIJMDr7wVpnTKZtIpcTAH9dvh6Gana_Pw0-htT1Q9DdTGiPGHpfWu0oZKbmwz9Siq4VzRFUsXmwkyVAA2EOn-fhlHOMblENj8rod3pTqjUbUouxH6s1qZ6ZAEvzMM3z9YeCoHvE0")' }}
            ></div>
            <div className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-md border border-gray-100">
              <span className="material-symbols-outlined text-primary text-[14px] block font-bold">edit</span>
            </div>
          </div>
        </div>

        {/* Balance Card */}
        <div className="px-4 mt-2">
          <div className="rounded-[32px] bg-black p-7 shadow-2xl relative overflow-hidden border border-gray-800">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <span className="material-symbols-outlined text-[120px] text-primary">account_balance_wallet</span>
            </div>
            <div className="relative z-10">
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1.5">Saldo Disponível</p>
              <div className="flex items-center gap-3">
                <h3 className="text-4xl font-black text-white italic tracking-tight tabular-nums">
                  Kz {showBalance ? (profile.balance || 0).toLocaleString('pt-AO', { minimumFractionDigits: 2 }) : '••••••'}
                </h3>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="text-gray-500 hover:text-primary transition-colors focus:outline-none"
                >
                  <span className="material-symbols-outlined text-[24px]">
                    {showBalance ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-8 border-t border-gray-800 pt-5">
              <div className="text-center">
                <p className="text-[9px] uppercase text-gray-400 font-black tracking-widest">Recarga</p>
                <p className="text-xs font-black text-white mt-1">Kz {profile.deposit_total || 0}</p>
              </div>
              <div className="text-center border-l border-r border-gray-800">
                <p className="text-[9px] uppercase text-gray-400 font-black tracking-widest">Retirada</p>
                <p className="text-xs font-black text-white mt-1">Kz {profile.withdraw_total || 0}</p>
              </div>
              <div className="text-center">
                <p className="text-[9px] uppercase text-gray-400 font-black tracking-widest">Equipe</p>
                <p className="text-xs font-black text-primary mt-1">{profile.team_count || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 mt-6">
        {/* Services Section */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-2 ml-1">Serviços</h3>
          <div className="bg-surface-dark rounded-xl overflow-hidden shadow-sm">
            {[
              { label: 'Retirar fundo', icon: 'payments', page: 'retirada' },
              { label: 'Recarregar', icon: 'account_balance_wallet', page: 'deposit' },
              { label: 'Recarregar USDT', icon: 'currency_bitcoin', page: 'deposit-usdt' },
              { label: 'Aplicar Fundo', icon: 'trending_up', page: 'investimentos-fundo' },
              { label: 'Adicionar Conta Bancária', icon: 'add_card', page: 'add-bank' },
              { label: 'Loja', icon: 'storefront', page: 'shop' },
              { label: 'Convite', icon: 'person_add', page: 'invite' },
              { label: 'Baixar App', icon: 'install_mobile', page: 'download-app' },
              { label: 'Ofertas do Dia', icon: 'local_offer', page: 'gift-chest' },
            ].map((item, i, arr) => (
              <button
                key={item.label}
                onClick={() => item.page ? onNavigate(item.page) : null}
                className={`flex items-center gap-4 w-full p-4 hover:bg-white/5 transition-colors text-left group ${i !== arr.length - 1 ? 'border-b border-amazon-border' : ''}`}
              >
                <div className="flex items-center justify-center rounded-lg bg-primary/20 text-primary shrink-0 size-10 group-hover:bg-primary group-hover:text-text-primary transition-colors">
                  <span className="material-symbols-outlined">{item.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-text-primary font-bold truncate">{item.label}</p>
                </div>
                <span className="material-symbols-outlined text-text-secondary">chevron_right</span>
              </button>
            ))}
          </div>
        </div>

        {/* My Account Section */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-2 ml-1">Minha Conta</h3>
          <div className="bg-surface-dark rounded-xl overflow-hidden shadow-sm">
            {[
              { label: 'Detalhes da Conta', icon: 'account_circle', page: 'detalhes-conta' },
              { label: 'Histórico de Conta', icon: 'receipt_long', page: 'historico-conta' },
              { label: 'Histórico de Compras', icon: 'shopping_bag', page: 'purchase-history' },
              { label: 'Verificar Conta', icon: 'verified', page: 'security-verify' },
            ].map((item, i, arr) => (
              <button
                key={item.label}
                onClick={() => item.page ? onNavigate(item.page) : null}
                className={`flex items-center gap-4 w-full p-4 hover:bg-white/5 transition-colors text-left group ${i !== arr.length - 1 ? 'border-b border-amazon-border' : ''}`}
              >
                <div className="flex items-center justify-center rounded-lg bg-primary/20 text-primary shrink-0 size-10 group-hover:bg-primary group-hover:text-text-primary transition-colors">
                  <span className="material-symbols-outlined">{item.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-text-primary font-bold truncate">{item.label}</p>
                </div>
                <span className="material-symbols-outlined text-text-secondary">chevron_right</span>
              </button>
            ))}
          </div>
        </div>

        {/* Security Section */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-2 ml-1">Segurança</h3>
          <div className="bg-surface-dark rounded-xl overflow-hidden shadow-sm">
            {[
              { label: 'Trocar Senha', icon: 'lock_reset', sub: 'Alterar Senha', page: 'change-password' },
              { label: 'Definir Senha de Retirada', icon: 'pin', page: 'withdraw-password' },
              { label: 'Alterar Senha de Retirada', icon: 'lock_person', page: 'update-withdraw-password' },
            ].map((item, i, arr) => (
              <button
                key={item.label}
                onClick={() => item.page ? onNavigate(item.page) : null}
                className={`flex items-center gap-4 w-full p-4 hover:bg-white/5 transition-colors text-left group ${i !== arr.length - 1 ? 'border-b border-amazon-border' : ''}`}
              >
                <div className="flex items-center justify-center rounded-lg bg-primary/20 text-primary shrink-0 size-10 group-hover:bg-primary group-hover:text-text-primary transition-colors">
                  <span className="material-symbols-outlined">{item.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-text-primary font-bold truncate">{item.label}</p>
                  {item.sub && <p className="text-text-secondary text-xs truncate">{item.sub}</p>}
                </div>
                <span className="material-symbols-outlined text-text-secondary">chevron_right</span>
              </button>
            ))}
          </div>
        </div>

        {/* Ajuda Section */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-2 ml-1">Ajuda</h3>
          <div className="bg-surface-dark rounded-xl overflow-hidden shadow-sm">
            {[
              { label: 'Tutoriais', icon: 'library_books', page: 'tutorials' },
              { label: 'Suporte', icon: 'support_agent', page: 'support' },
              { label: 'Relatar Problema', icon: 'report_problem', page: 'report' },
              { label: 'Sobre a Empresa', icon: 'domain', page: 'info' },
            ].map((item, i, arr) => (
              <button
                key={item.label}
                onClick={() => item.page ? onNavigate(item.page) : null}
                className={`flex items-center gap-4 w-full p-4 hover:bg-white/5 transition-colors text-left group ${i !== arr.length - 1 ? 'border-b border-amazon-border' : ''}`}
              >
                <div className="flex items-center justify-center rounded-lg bg-primary/20 text-primary shrink-0 size-10 group-hover:bg-primary group-hover:text-text-primary transition-colors">
                  <span className="material-symbols-outlined">{item.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-text-primary font-bold truncate">{item.label}</p>
                </div>
                <span className="material-symbols-outlined text-text-secondary">chevron_right</span>
              </button>
            ))}
          </div>
        </div>

        {/* Logout Section */}
        <div className="mb-8 p-1">
          <button
            onClick={onLogout}
            className="w-full py-4 text-center text-error-text font-bold bg-error-bg hover:opacity-90 rounded-2xl transition-all shadow-sm cursor-pointer border border-error-text/10"
          >
            Sair da Conta
          </button>
          <p className="text-center text-xs text-text-secondary mt-4 font-medium">Versão 2.4.0</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;

