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
const Deposit = lazy(() => import('./pages/Deposit'));
const PurchaseHistory = lazy(() => import('./pages/PurchaseHistory'));
const ChangePassword = lazy(() => import('./pages/ChangePassword'));
const TutoriaisFalarComGerente = lazy(() => import('./pages/TutoriaisFalarComGerente'));
const TutoriaisComoConvidar = lazy(() => import('./pages/TutoriaisComoConvidar'));
const ComoComprar = lazy(() => import('./pages/ComoComprar'));
const DetalhesConta = lazy(() => import('./pages/DetalhesConta'));
const UpdateWithdrawPassword = lazy(() => import('./pages/UpdateWithdrawPassword'));
const HistoricoConta = lazy(() => import('./pages/HistoricoConta'));
const Register = lazy(() => import('./pages/Register'));
const ConfirmDeposit = lazy(() => import('./pages/ConfirmDeposit'));
const ComoRetirarFundos = lazy(() => import('./pages/ComoRetirarFundos'));
const TutoriaisDepositos = lazy(() => import('./pages/TutoriaisDepositos'));
const Withdraw = lazy(() => import('./pages/Withdraw'));
const Login = lazy(() => import('./pages/Login'));
const SecurityVerify = lazy(() => import('./pages/SecurityVerify'));
const SplashScreenAds = lazy(() => import('./pages/SplashScreenAds'));
const Campaigns = lazy(() => import('./pages/Campaigns'));
const ComoEnviarComprovante = lazy(() => import('./pages/ComoEnviarComprovante'));
const TutoriaisDefinirSenha = lazy(() => import('./pages/TutoriaisDefinirSenha'));
const TutoriaisAdicionarConta = lazy(() => import('./pages/TutoriaisAdicionarConta'));
const TutoriaisGanhosTarefas = lazy(() => import('./pages/TutoriaisGanhosTarefas'));
const GanhosTarefas = lazy(() => import('./pages/GanhosTarefas'));
const GiftChest = lazy(() => import('./pages/GiftChest'));
const RewardClaim = lazy(() => import('./pages/RewardClaim'));
const Info = lazy(() => import('./pages/Info'));
const TermsOfUse = lazy(() => import('./pages/TermsOfUse'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const SystemRules = lazy(() => import('./pages/SystemRules'));
const DepositUSDT = lazy(() => import('./pages/DepositUSDT'));
const DepositHistory = lazy(() => import('./pages/DepositHistory'));
const DownloadApp = lazy(() => import('./pages/DownloadApp'));
const InvestimentosFundo = lazy(() => import('./pages/InvestimentosFundo'));
const HistoricoFundos = lazy(() => import('./pages/HistoricoFundos'));
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
  const timerRef = useRef<any>(null);


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

    const setupAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      if (session) {
        fetchProfile(session.user.id);
        profileSubscription = setupRealtimeSubscription(session.user.id);
      } else {
        const params = new URLSearchParams(window.location.search);
        if (params.get('ref') || window.location.pathname === '/reg') {
          setCurrentPage('register');
        }
      }
    };

    setupAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
        if (!profileSubscription) {
          profileSubscription = setupRealtimeSubscription(session.user.id);
        }
        resetSessionTimer();
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
      await supabase.auth.signOut();
      showError('Sessão expirada. Por favor, entre novamente para sua segurança.');
      setCurrentPage('login');
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
    setNavigationData(data);

    // Otimização: Apenas processos pesados ou explicitamente solicitados mostram loading
    const heavyPages = ['historico-conta', 'withdrawal-history'];

    if (heavyPages.includes(page)) {
      withLoading(async () => {
        // Simulação curta para garantir que o usuário perceba a transição
        await new Promise(resolve => setTimeout(resolve, 300));
        setCurrentPage(page);
      });
    } else {
      setCurrentPage(page);
    }
  }, [withLoading]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentPage('login');
  };

  const PageComponent = () => {
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
      'deposit': <Deposit onNavigate={handleNavigate} showToast={showToast} />,
      'purchase-history': <PurchaseHistory onNavigate={handleNavigate} showToast={showToast} profile={profile} />,
      'change-password': <ChangePassword onNavigate={handleNavigate} />,
      'tutoriais-falar-com-gerente': <TutoriaisFalarComGerente onNavigate={handleNavigate} />,
      'tutoriais-como-convidar': <TutoriaisComoConvidar onNavigate={handleNavigate} />,
      'como-comprar': <ComoComprar onNavigate={handleNavigate} />,
      'detalhes-conta': <DetalhesConta onNavigate={handleNavigate} showToast={showToast} />,
      'historico-conta': <HistoricoConta onNavigate={handleNavigate} />,
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
      'ganhos-tarefas': <GanhosTarefas onNavigate={handleNavigate} />,
      'gift-chest': <GiftChest onNavigate={handleNavigate} showToast={showToast} />,
      'reward-claim': <RewardClaim onNavigate={handleNavigate} />,
      'deposit-usdt': <DepositUSDT onNavigate={handleNavigate} showToast={showToast} data={navigationData} />,
      'info': <Info onNavigate={handleNavigate} />,
      'terms-of-use': <TermsOfUse onNavigate={handleNavigate} />,
      'privacy-policy': <PrivacyPolicy onNavigate={handleNavigate} />,
      'system-rules': <SystemRules onNavigate={handleNavigate} />,
      'subordinate-list': <SubordinateList onNavigate={handleNavigate} />,
      'deposit-history': <DepositHistory onNavigate={handleNavigate} />,
      'download-app': <DownloadApp onNavigate={handleNavigate} />,
      'investimentos-fundo': <InvestimentosFundo onNavigate={handleNavigate} showToast={showToast} />,
      'historico-fundos': <HistoricoFundos onNavigate={handleNavigate} showToast={showToast} />,
      'p2p-transfer': <TransferenciaP2P onNavigate={handleNavigate} showToast={showToast} />,
      'settings': <Settings onNavigate={handleNavigate} showToast={showToast} profile={profile} />,
      'withdrawal-history': <WithdrawalHistory onNavigate={handleNavigate} />,
      'invite-page': <InvitePage onNavigate={handleNavigate} showToast={showToast} />
    };

    const target = pagesMap[currentPage] || <Home onNavigate={handleNavigate} profile={profile} />;
    return cloneElement(target, { onNavigate: handleNavigate, onLogout: handleLogout, showToast });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-dark max-w-md mx-auto shadow-2xl overflow-x-hidden">
      <main className="flex-1 overflow-y-auto no-scrollbar">
        <Suspense fallback={
          <div className="flex h-screen items-center justify-center bg-background-dark">
            <SpokeSpinner size="w-12 h-12" className="text-white" />
          </div>
        }>
          <PageComponent />
        </Suspense>
        {session && <FloatingSupportButton />}
      </main>

      {/* Bottom Navigation */}
      {session && ['home', 'shop', 'profile', 'ganhos-tarefas', 'invite-page'].includes(currentPage) && (
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-surface-dark/95 backdrop-blur-lg border-t border-amazon-border pb-1.5 pt-1.5 px-2 z-50">
          <div className="flex justify-between items-center">
            <button
              onClick={() => setCurrentPage('home')}
              className={`flex flex-col items-center gap-0.5 w-full transition-colors ${currentPage === 'home' ? 'text-primary' : 'text-gray-500'}`}
            >
              <span className={`material-symbols-outlined text-[23px] ${currentPage === 'home' ? 'fill-1' : ''}`} style={{ fontVariationSettings: `'FILL' ${currentPage === 'home' ? 1 : 0}` }}>home</span>
              <span className="text-[9px] font-bold">Início</span>
            </button>

            <button
              onClick={() => setCurrentPage('invite-page')}
              className={`flex flex-col items-center gap-0.5 w-full transition-colors ${currentPage === 'invite-page' ? 'text-primary' : 'text-gray-500'}`}
            >
              <span className={`material-symbols-outlined text-[23px] ${currentPage === 'invite-page' ? 'fill-1' : ''}`} style={{ fontVariationSettings: `'FILL' ${currentPage === 'invite-page' ? 1 : 0}` }}>group_add</span>
              <span className="text-[9px] font-medium">Convidar</span>
            </button>

            <button
              onClick={() => setCurrentPage('ganhos-tarefas')}
              className={`flex flex-col items-center gap-0.5 w-full transition-colors ${currentPage === 'ganhos-tarefas' ? 'text-primary' : 'text-gray-500'}`}
            >
              <span className={`material-symbols-outlined text-[23px] ${currentPage === 'ganhos-tarefas' ? 'fill-1' : ''}`} style={{ fontVariationSettings: `'FILL' ${currentPage === 'ganhos-tarefas' ? 1 : 0}` }}>bolt</span>
              <span className="text-[9px] font-medium">Ganhos</span>
            </button>

            <button
              onClick={() => setCurrentPage('shop')}
              className={`flex flex-col items-center gap-0.5 w-full transition-colors ${currentPage === 'shop' ? 'text-primary' : 'text-gray-500'}`}
            >
              <span className={`material-symbols-outlined text-[23px] ${currentPage === 'shop' ? 'fill-1' : ''}`} style={{ fontVariationSettings: `'FILL' ${currentPage === 'shop' ? 1 : 0}` }}>shopping_bag</span>
              <span className="text-[9px] font-medium">Loja</span>
            </button>

            <button
              onClick={() => setCurrentPage('profile')}
              className={`flex flex-col items-center gap-0.5 w-full transition-colors ${currentPage === 'profile' ? 'text-primary' : 'text-gray-500'}`}
            >
              <span className={`material-symbols-outlined text-[23px] ${currentPage === 'profile' ? 'fill-1' : ''}`} style={{ fontVariationSettings: `'FILL' ${currentPage === 'profile' ? 1 : 0}` }}>person</span>
              <span className="text-[9px] font-medium">Conta</span>
            </button>
          </div>
        </nav>
      )}







    </div>
  );
};


export default App;
