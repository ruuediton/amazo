import React, { lazy, Suspense, useState, useEffect, useRef, useCallback, ReactElement, cloneElement } from 'react';

// Lazy loading all pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/ShopPage'));
const Wallet = lazy(() => import('./pages/Wallet'));
const Profile = lazy(() => import('./pages/Profile'));
const Support = lazy(() => import('./pages/Support'));
const Tutorials = lazy(() => import('./pages/Tutorials'));
const About = lazy(() => import('./pages/About'));
const Report = lazy(() => import('./pages/Report'));
const AddBank = lazy(() => import('./pages/AddBank'));
const WithdrawPassword = lazy(() => import('./pages/WithdrawPassword'));
const Recharge = lazy(() => import('./pages/Recharge'));
const PurchaseHistory = lazy(() => import('./pages/PurchaseHistory'));
const ChangePassword = lazy(() => import('./pages/ChangePassword'));
const TutoriaisFalarComGerente = lazy(() => import('./components/TutoriaisFalarComGerente'));
const TutoriaisComoConvidar = lazy(() => import('./components/TutoriaisComoConvidar'));
const ComoComprar = lazy(() => import('./components/ComoComprar'));
const DetalhesConta = lazy(() => import('./pages/DetalhesConta'));
const UpdateWithdrawPassword = lazy(() => import('./pages/UpdateWithdrawPassword'));
const AccountHistory = lazy(() => import('./pages/AccountHistory'));
const Register = lazy(() => import('./pages/Register'));
const ConfirmDeposit = lazy(() => import('./components/ConfirmDeposit'));
const ComoRetirarFundos = lazy(() => import('./components/ComoRetirarFundos'));
const TutoriaisDepositos = lazy(() => import('./components/TutoriaisDepositos'));
const Withdraw = lazy(() => import('./pages/Withdraw'));
const Login = lazy(() => import('./pages/Login'));
const SecurityVerify = lazy(() => import('./pages/SecurityVerify'));
const SplashScreenAds = lazy(() => import('./pages/SplashScreenAds'));
const Campaigns = lazy(() => import('./components/Campaigns'));
const ComoEnviarComprovante = lazy(() => import('./components/ComoEnviarComprovante'));
const TutoriaisDefinirSenha = lazy(() => import('./components/TutoriaisDefinirSenha'));
const TutoriaisAdicionarConta = lazy(() => import('./components/TutoriaisAdicionarConta'));
const TutoriaisGanhosTarefas = lazy(() => import('./components/TutoriaisGanhosTarefas'));
const Rewards = lazy(() => import('./pages/Rewards'));
const GiftChest = lazy(() => import('./pages/GiftChest'));
const RewardClaim = lazy(() => import('./pages/RewardClaim'));
const Info = lazy(() => import('./pages/Info'));
const TermsOfUse = lazy(() => import('./pages/TermsOfUse'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const SystemRules = lazy(() => import('./pages/SystemRules'));
const DepositUSDT = lazy(() => import('./pages/DepositUSDT'));
const WalletHistory = lazy(() => import('./pages/WalletHistory'));

const Marketplace = lazy(() => import('./pages/Marketplace'));
const Orders = lazy(() => import('./pages/Orders'));
const TransferenciaP2P = lazy(() => import('./pages/TransferenciaP2P'));
const Settings = lazy(() => import('./pages/Settings'));
const WithdrawalHistory = lazy(() => import('./pages/WithdrawalHistory'));
const SubordinateList = lazy(() => import('./pages/SubordinateList'));
const InvitePage = lazy(() => import('./pages/InvitePage'));
import LoadingOverlay from './components/LoadingOverlay';
import SpokeSpinner from './components/SpokeSpinner';
import FloatingSupportButton from './components/FloatingSupportButton';


import { supabase } from './supabase';
import { ToastType } from './components/Toast';
import { Session } from '@supabase/supabase-js';

import { useLoading } from './contexts/LoadingContext';
import { useNetwork } from './contexts/NetworkContext';

const App: React.FC = () => {
  const { showLoading, hideLoading, withLoading, showSuccess, showError, showWarning, reset } = useLoading();
  const { runWithTimeout } = useNetwork();
  const [currentPage, setCurrentPage] = useState<'home' | 'shop' | 'wallet' | 'profile' | 'invite' | 'support' | 'tutorials' | 'about' | 'report' | 'add-bank' | 'withdraw-password' | 'deposit' | 'purchase-history' | 'change-password' | 'tutoriais-falar-com-gerente' | 'tutoriais-como-convidar' | 'como-comprar' | 'detalhes-conta' | 'update-withdraw-password' | 'historico-conta' | 'register' | 'confirmar-deposito' | 'como-retirar-fundos' | 'tutoriais-depositos' | 'retirada' | 'login' | 'security-auth' | 'security-verify' | 'splash-ads' | 'campaigns' | 'como-enviar-comprovante' | 'tutoriais-definir-senha' | 'tutoriais-adicionar-conta' | 'tutoriais-ganhos-tarefas' | 'ganhos-tarefas' | 'gift-chest' | 'reward-claim' | 'info' | 'terms-of-use' | 'privacy-policy' | 'system-rules' | 'subordinate-list' | 'deposit-usdt' | 'deposit-history' | 'tutoriais-adicionar-conta' | 'investimentos-fundo' | 'historico-fundos' | 'settings' | 'withdrawal-history' | 'invite-page'>('register');
  const [lastAction, setLastAction] = useState<() => void>(() => { });
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const timerRef = useRef<any>(null);



  // Dynamic Title Management
  useEffect(() => {
    const titles: Record<string, string> = {
      'home': 'Início',
      'shop': 'Loja BP',
      'register': 'Criar Conta',
      'login': 'Acessar Conta',
      'profile': 'Meu Perfil',
      'wallet': 'Carteira',
      'deposit': 'Recarga',
      'retirada': 'Retirada',
      'investimentos-fundo': 'Marketplace',
      'historico-fundos': 'Meus Pedidos',
      'ganhos-tarefas': 'Recompensas',
      'invite-page': 'Convidar Amigos',
      'support': 'Suporte',
      'splash-ads': 'Bem-vindo',
      'security-verify': 'Segurança',
      'deposit-history': 'Histórico',
      'purchase-history': 'Compras',
      'change-password': 'Senha',
      'add-bank': 'Adicionar Banco'
    };
    const title = titles[currentPage as string] || 'BP Commerce';
    document.title = `${title} | BP`;
  }, [currentPage]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    switch (type) {
      case 'success': showSuccess(message); break;
      case 'error': showError(message); break;
      case 'warning': showWarning(message); break;
      default: showSuccess(message); break;
    }
  }, [showSuccess, showError, showWarning]);

  useEffect(() => {
    let profileSubscription: any = null;

    const initializeApp = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      if (session) {
        await fetchProfile(session.user.id);
        profileSubscription = setupRealtimeSubscription(session.user.id);
      } else {
        const params = new URLSearchParams(window.location.search);
        if (params.get('ref')) {
          setCurrentPage('register');
        }
      }

      // Signal that basic initialization is done
      document.body.classList.add('app-loaded');
    };

    initializeApp();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
        if (!profileSubscription) {
          profileSubscription = setupRealtimeSubscription(session.user.id);
        }
      } else {
        setProfile(null);
        if (profileSubscription) {
          profileSubscription.unsubscribe();
          profileSubscription = null;
        }
        setCurrentPage('register');
      }
    });

    function setupRealtimeSubscription(userId: string) {
      return supabase
        .channel(`profile-changes-${userId}`)
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${userId}` },
          (payload) => setProfile(payload.new)
        )
        .subscribe();
    }

    return () => {
      subscription.unsubscribe();
      if (profileSubscription) profileSubscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error && data) setProfile(data);
    } catch (err) {
      console.error("Profile fetch error:", err);
    }
  };

  const resetSessionTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!session) return;

    const sessionDuration = 45 * 60 * 1000; // 45 minutos para melhor UX

    timerRef.current = setTimeout(async () => {
      await performFullLogout();
      showError('SessÃ£o expirada. Por favor, entre novamente para sua seguranÃ§a.');
    }, sessionDuration);
  }, [session, showError]);

  useEffect(() => {
    const events = ['mousedown', 'keydown', 'touchstart'];
    const handleActivity = () => resetSessionTimer();

    if (session) {
      events.forEach(event => window.addEventListener(event, handleActivity, { passive: true }));
      resetSessionTimer();
    }

    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [session, resetSessionTimer]);

  const [navigationData, setNavigationData] = useState<any>(null);

  const handleNavigate = useCallback((page: any, data: any = null) => {
    if (page === currentPage) return; // Prevent redundant navigation re-renders
    setNavigationData(data);

    // Dynamic prioritization
    const heavyPages = ['historico-conta', 'withdrawal-history', 'purchase-history', 'shop'];

    if (heavyPages.includes(page)) {
      withLoading(async () => {
        await new Promise(resolve => setTimeout(resolve, 150));
        setCurrentPage(page);
      });
    } else {
      setCurrentPage(page);
    }
  }, [currentPage, withLoading]);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const performFullLogout = async () => {
    try {
      showLoading('Limpando dados e saindo...');

      // 1. Sign out from Supabase
      await supabase.auth.signOut();

      // 2. Clear LocalStorage and SessionStorage
      localStorage.clear();
      sessionStorage.clear();

      // 3. Clear Cookies (Standard Browser Cookies)
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      }

      // 4. Reset UI State
      setProfile(null);
      setSession(null);
      setShowLogoutModal(false);
      setCurrentPage('login');

      // 5. Force reload to clear remaining memory caches if needed, 
      // but usually page redirect is enough. 
      // window.location.reload(); 

    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      hideLoading();
    }
  };

  const renderPageComponent = () => {
    const publicPages = ['login', 'register', 'splash-ads'];
    if (!session && !publicPages.includes(currentPage)) {
      return <Register onNavigate={handleNavigate} showToast={showToast} />;
    }

    const pagesMap: Record<string, ReactElement> = {
      'home': <Home onNavigate={handleNavigate} profile={profile} />,
      'shop': <Shop onNavigate={handleNavigate} showToast={showToast} balance={profile?.balance || 0} />,
      'wallet': <Wallet onNavigate={handleNavigate} />,
      'profile': <Profile onNavigate={handleNavigate} profile={profile} onLogout={handleLogout} />,
      'support': <Support onNavigate={handleNavigate} />,
      'tutorials': <Tutorials onNavigate={handleNavigate} />,
      'about': <About onNavigate={handleNavigate} />,
      'report': <Report onNavigate={handleNavigate} />,
      'add-bank': <AddBank onNavigate={handleNavigate} showToast={showToast} />,
      'withdraw-password': <WithdrawPassword onNavigate={handleNavigate} showToast={showToast} />,
      'update-withdraw-password': <UpdateWithdrawPassword onNavigate={handleNavigate} showToast={showToast} />,
      'deposit': <Recharge onNavigate={handleNavigate} showToast={showToast} />,
      'purchase-history': <PurchaseHistory onNavigate={handleNavigate} showToast={showToast} profile={profile} />,
      'change-password': <ChangePassword onNavigate={handleNavigate} />,
      'tutoriais-falar-com-gerente': <TutoriaisFalarComGerente onNavigate={handleNavigate} />,
      'tutoriais-como-convidar': <TutoriaisComoConvidar onNavigate={handleNavigate} />,
      'como-comprar': <ComoComprar onNavigate={handleNavigate} />,
      'detalhes-conta': <DetalhesConta onNavigate={handleNavigate} showToast={showToast} />,
      'historico-conta': <AccountHistory onNavigate={handleNavigate} />,
      'register': <Register onNavigate={handleNavigate} showToast={showToast} />,
      'confirmar-deposito': <ConfirmDeposit onNavigate={handleNavigate} data={navigationData} showToast={showToast} />,
      'como-retirar-fundos': <ComoRetirarFundos onNavigate={handleNavigate} />,
      'tutoriais-depositos': <TutoriaisDepositos onNavigate={handleNavigate} />,
      'retirada': <Withdraw onNavigate={handleNavigate} showToast={showToast} />,
      'login': <Login onNavigate={handleNavigate} showToast={showToast} />,
      'security-verify': <SecurityVerify onNavigate={handleNavigate} showToast={showToast} />,
      'splash-ads': <SplashScreenAds onNavigate={handleNavigate} />,
      'campaigns': <Campaigns onNavigate={handleNavigate} />,
      'como-enviar-comprovante': <ComoEnviarComprovante onNavigate={handleNavigate} />,
      'tutoriais-definir-senha': <TutoriaisDefinirSenha onNavigate={handleNavigate} />,
      'tutoriais-adicionar-conta': <TutoriaisAdicionarConta onNavigate={handleNavigate} />,
      'tutoriais-ganhos-tarefas': <TutoriaisGanhosTarefas onNavigate={handleNavigate} />,
      'ganhos-tarefas': <Rewards onNavigate={handleNavigate} />,
      'gift-chest': <GiftChest onNavigate={handleNavigate} showToast={showToast} />,
      'reward-claim': <RewardClaim onNavigate={handleNavigate} />,
      'deposit-usdt': <DepositUSDT onNavigate={handleNavigate} showToast={showToast} data={navigationData} />,
      'info': <Info onNavigate={handleNavigate} />,
      'terms-of-use': <TermsOfUse onNavigate={handleNavigate} />,
      'privacy-policy': <PrivacyPolicy onNavigate={handleNavigate} />,
      'system-rules': <SystemRules onNavigate={handleNavigate} />,
      'subordinate-list': <SubordinateList onNavigate={handleNavigate} />,
      'deposit-history': <WalletHistory onNavigate={handleNavigate} />,
      'investimentos-fundo': <Marketplace onNavigate={handleNavigate} showToast={showToast} />,
      'historico-fundos': <Orders onNavigate={handleNavigate} showToast={showToast} />,
      'p2p-transfer': <TransferenciaP2P onNavigate={handleNavigate} showToast={showToast} />,
      'settings': <Settings onNavigate={handleNavigate} showToast={showToast} profile={profile} />,
      'withdrawal-history': <WithdrawalHistory onNavigate={handleNavigate} />,
      'invite-page': <InvitePage onNavigate={handleNavigate} showToast={showToast} />
    };

    const target = pagesMap[currentPage] || <Home onNavigate={handleNavigate} profile={profile} />;
    return cloneElement(target, { onNavigate: handleNavigate, onLogout: handleLogout, showToast });
  };

  return (
    <div className="flex flex-col min-h-screen bg-white max-w-md mx-auto shadow-premium overflow-x-hidden">
      <main className="flex-1 overflow-y-auto no-scrollbar">
        <Suspense fallback={
          <div className="flex h-screen items-center justify-center bg-white">
            <SpokeSpinner size="w-12 h-12" className="text-secondary" />
          </div>
        }>
          {renderPageComponent()}
        </Suspense>
        {session && <FloatingSupportButton />}
      </main>

      {/* Bottom Navigation */}
      {session && ['home', 'shop', 'profile', 'ganhos-tarefas', 'invite-page'].includes(currentPage) && (
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-100 pb-2 pt-2 px-2 z-50">
          <div className="flex justify-between items-center">
            <button
              onClick={() => setCurrentPage('home')}
              className={`flex flex-col items-center gap-1 w-full transition-all duration-300 ${currentPage === 'home' ? 'text-[#00C853]' : 'text-gray-400'}`}
            >
              <span className="material-symbols-outlined text-[24px]">home</span>
              <span className="text-[10px]">Início</span>
            </button>

            <button
              onClick={() => setCurrentPage('ganhos-tarefas')}
              className={`flex flex-col items-center gap-1 w-full transition-all duration-300 ${currentPage === 'ganhos-tarefas' ? 'text-[#00C853]' : 'text-gray-400'}`}
            >
              <span className="material-symbols-outlined text-[24px]">grade</span>
              <span className="text-[10px]">Tarefas</span>
            </button>

            <button
              onClick={() => setCurrentPage('shop')}
              className={`flex flex-col items-center gap-1 w-full transition-all duration-300 ${currentPage === 'shop' ? 'text-[#00C853]' : 'text-gray-400'}`}
            >
              <span className="material-symbols-outlined text-[24px]">crown</span>
              <span className="text-[10px]">VIP</span>
            </button>

            <button
              onClick={() => setCurrentPage('invite-page')}
              className={`flex flex-col items-center gap-1 w-full transition-all duration-300 ${currentPage === 'invite-page' ? 'text-[#00C853]' : 'text-gray-400'}`}
            >
              <span className="material-symbols-outlined text-[24px]">groups</span>
              <span className="text-[10px]">Equipe</span>
            </button>

            <button
              onClick={() => setCurrentPage('profile')}
              className={`flex flex-col items-center gap-1 w-full transition-all duration-300 ${currentPage === 'profile' ? 'text-[#00C853]' : 'text-gray-400'}`}
            >
              <span className="material-symbols-outlined text-[24px]">person</span>
              <span className="text-[10px]">Perfil</span>
            </button>
          </div>
        </nav>
      )}







      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLogoutModal(false)}></div>
          <div className="bg-white w-full max-w-sm rounded-[32px] p-8 relative z-10 shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="size-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-red-500 text-4xl">logout</span>
              </div>
              <h3 className="text-2xl font-black text-[#0F1111] mb-2">Deseja sair?</h3>
              <p className="text-gray-500 mb-8 leading-relaxed">
                VocÃª precisarÃ¡ entrar novamente para acessar sua conta BP. Seus dados de navegaÃ§Ã£o serÃ£o limpos.
              </p>

              <div className="flex flex-col gap-3 w-full">
                <button
                  onClick={performFullLogout}
                  className="w-full py-4 bg-black text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-900 active:scale-[0.98] transition-all"
                >
                  Confirmar e Sair
                </button>
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="w-full py-4 bg-gray-50 text-gray-500 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-gray-100 active:scale-[0.98] transition-all"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default App;

