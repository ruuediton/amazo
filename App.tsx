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
const TutoriaisAlterarSenhaRetirada = lazy(() => import('./pages/TutoriaisAlterarSenhaRetirada'));
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


import { supabase } from './supabase';
import { ToastType } from './components/Toast';
import { Session } from '@supabase/supabase-js';

import { useLoading } from './contexts/LoadingContext';
import { useNetwork } from './contexts/NetworkContext';

const App: React.FC = () => {
  const { showLoading, hideLoading, withLoading, showSuccess, showError, showWarning, reset } = useLoading();
  const { runWithTimeout } = useNetwork();
  const [currentPage, setCurrentPage] = useState<'home' | 'shop' | 'wallet' | 'profile' | 'invite' | 'support' | 'tutorials' | 'about' | 'report' | 'add-bank' | 'withdraw-password' | 'deposit' | 'purchase-history' | 'change-password' | 'tutoriais-falar-com-gerente' | 'tutoriais-como-convidar' | 'como-comprar' | 'tutoriais-alterar-senha-retirada' | 'detalhes-conta' | 'update-withdraw-password' | 'historico-conta' | 'register' | 'confirmar-deposito' | 'como-retirar-fundos' | 'tutoriais-depositos' | 'retirada' | 'login' | 'security-auth' | 'security-verify' | 'splash-ads' | 'campaigns' | 'como-enviar-comprovante' | 'tutoriais-definir-senha' | 'tutoriais-adicionar-conta' | 'tutoriais-ganhos-tarefas' | 'ganhos-tarefas' | 'gift-chest' | 'reward-claim' | 'info' | 'terms-of-use' | 'privacy-policy' | 'system-rules' | 'subordinate-list' | 'deposit-usdt' | 'deposit-history' | 'tutoriais-adicionar-conta' | 'investimentos-fundo' | 'historico-fundos' | 'settings' | 'withdrawal-history' | 'invite-page'>('register');
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

    // Escuta mudanças de autenticação
    withLoading(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session) {
        await fetchProfile(session.user.id);
        setupRealtimeSubscription(session.user.id);
      } else {
        // Detetar URL de convite: /reg?ref=ABCDE
        const params = new URLSearchParams(window.location.search);
        const ref = params.get('ref');
        const path = window.location.pathname;

        if (path === '/reg' || ref) {
          setCurrentPage('register');
        } else {
          setCurrentPage('register');
        }
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        // Background update for auth change, maybe show loading if explicit login
        fetchProfile(session.user.id);
        setupRealtimeSubscription(session.user.id);
        resetSessionTimer();
      } else {
        setProfile(null);
        if (profileSubscription) profileSubscription.unsubscribe();

        // Detetar URL de convite novamente no logout
        const params = new URLSearchParams(window.location.search);
        const ref = params.get('ref');
        const path = window.location.pathname;

        if (path === '/reg' || ref) {
          setCurrentPage('register');
        } else {
          // Manter na página de registro por padrão se não houver sessão
          setCurrentPage('register');
        }
      }
    });

    function setupRealtimeSubscription(userId: string) {
      if (profileSubscription) profileSubscription.unsubscribe();

      profileSubscription = supabase
        .channel(`profile-changes-${userId}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${userId}`
          },
          (payload) => {
            setProfile(payload.new);
          }
        )
        .subscribe();
    }

    return () => {
      subscription.unsubscribe();
      if (profileSubscription) profileSubscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await runWithTimeout(() => supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single());

    if (!error && data) {
      setProfile(data);
    }
  };

  const resetSessionTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    // Se não houver sessão, não inicia o timer
    if (!session) return;

    const thirtyMinutes = 30 * 60 * 1000;

    timerRef.current = setTimeout(async () => {
      await supabase.auth.signOut();
      showError('Sua sessão expirou por inatividade de 30 minutos. Por favor, faça login novamente.');
      setCurrentPage('login');
    }, thirtyMinutes);
  }, [session]);

  // Listeners de atividade para resetar o timer
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];

    const handleActivity = () => {
      resetSessionTimer();
    };

    if (session) {
      events.forEach(event => window.addEventListener(event, handleActivity));
      resetSessionTimer(); // Inicia o timer
    }

    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [session, resetSessionTimer]);

  const [navigationData, setNavigationData] = useState<any>(null);

  const renderPage = () => {
    // Redireciona para login se não houver sessão, exceto em páginas públicas
    const publicPages = ['login', 'register', 'splash-ads'];
    if (!session && !publicPages.includes(currentPage)) {
      return <Register onNavigate={handleNavigate} showToast={showToast} />;
    }

    switch (currentPage) {
      case 'home': return <Home onNavigate={handleNavigate} profile={profile} />;
      case 'shop': return <Shop onNavigate={handleNavigate} showToast={showToast} balance={profile?.balance || 0} />;
      case 'wallet': return <Wallet onNavigate={handleNavigate} />;
      case 'profile': return <Profile onNavigate={handleNavigate} profile={profile} onLogout={handleLogout} />;
      case 'support': return <Support onNavigate={handleNavigate} />;
      case 'tutorials': return <Tutorials onNavigate={handleNavigate} />;
      case 'about': return <About onNavigate={handleNavigate} />;
      case 'report': return <Report onNavigate={handleNavigate} />;
      case 'add-bank': return <AddBank onNavigate={handleNavigate} showToast={showToast} />;
      case 'withdraw-password': return <WithdrawPassword onNavigate={handleNavigate} showToast={showToast} />;
      case 'update-withdraw-password': return <UpdateWithdrawPassword onNavigate={handleNavigate} showToast={showToast} />;
      case 'deposit': return <Deposit onNavigate={handleNavigate} showToast={showToast} />;
      case 'purchase-history': return <PurchaseHistory onNavigate={handleNavigate} showToast={showToast} />;
      case 'change-password': return <ChangePassword onNavigate={handleNavigate} />;
      case 'tutoriais-falar-com-gerente': return <TutoriaisFalarComGerente onNavigate={handleNavigate} />;
      case 'tutoriais-como-convidar': return <TutoriaisComoConvidar onNavigate={handleNavigate} />;
      case 'como-comprar': return <ComoComprar onNavigate={handleNavigate} />;
      case 'tutoriais-alterar-senha-retirada': return <TutoriaisAlterarSenhaRetirada onNavigate={handleNavigate} />;
      case 'detalhes-conta': return <DetalhesConta onNavigate={handleNavigate} showToast={showToast} />;
      case 'historico-conta': return <HistoricoConta onNavigate={handleNavigate} />;
      case 'register': return <Register onNavigate={handleNavigate} showToast={showToast} />;
      case 'confirme': return <ConfirmDeposit onNavigate={handleNavigate} data={navigationData} showToast={showToast} />;
      case 'como-retirar-fundos': return <ComoRetirarFundos onNavigate={handleNavigate} />;
      case 'tutoriais-depositos': return <TutoriaisDepositos onNavigate={handleNavigate} />;
      case 'retirada': return <Withdraw onNavigate={handleNavigate} showToast={showToast} />;
      case 'login': return <Login onNavigate={handleNavigate} showToast={showToast} />;
      case 'security-verify': return <SecurityVerify onNavigate={handleNavigate} showToast={showToast} />;
      case 'splash-ads': return <SplashScreenAds onNavigate={handleNavigate} />;
      case 'campaigns': return <Campaigns onNavigate={handleNavigate} />;
      case 'como-enviar-comprovante': return <ComoEnviarComprovante onNavigate={handleNavigate} />;
      case 'tutoriais-definir-senha': return <TutoriaisDefinirSenha onNavigate={handleNavigate} />;
      case 'tutoriais-adicionar-conta': return <TutoriaisAdicionarConta onNavigate={handleNavigate} />;
      case 'tutoriais-ganhos-tarefas': return <TutoriaisGanhosTarefas onNavigate={handleNavigate} />;
      case 'ganhos-tarefas': return <GanhosTarefas onNavigate={handleNavigate} />;
      case 'gift-chest': return <GiftChest onNavigate={handleNavigate} showToast={showToast} />;
      case 'reward-claim': return <RewardClaim onNavigate={handleNavigate} />;
      case 'deposit-usdt': return <DepositUSDT onNavigate={handleNavigate} showToast={showToast} data={navigationData} />;
      case 'info': return <Info onNavigate={handleNavigate} />;
      case 'terms-of-use': return <TermsOfUse onNavigate={handleNavigate} />;
      case 'privacy-policy': return <PrivacyPolicy onNavigate={handleNavigate} />;
      case 'system-rules': return <SystemRules onNavigate={handleNavigate} />;
      case 'subordinate-list': return <SubordinateList onNavigate={handleNavigate} />;
      case 'deposit-history': return <DepositHistory onNavigate={handleNavigate} />;
      case 'download-app': return <DownloadApp onNavigate={handleNavigate} />;
      case 'investimentos-fundo': return <InvestimentosFundo onNavigate={handleNavigate} showToast={showToast} />;
      case 'historico-fundos': return <HistoricoFundos onNavigate={handleNavigate} showToast={showToast} />;
      case 'p2p-transfer': return <TransferenciaP2P onNavigate={handleNavigate} showToast={showToast} />;
      case 'settings': return <Settings onNavigate={handleNavigate} showToast={showToast} profile={profile} />;
      case 'withdrawal-history': return <WithdrawalHistory onNavigate={handleNavigate} />;
      case 'invite-page': return <InvitePage onNavigate={handleNavigate} showToast={showToast} />;
      default: return <Home onNavigate={handleNavigate} profile={profile} />;
    }
  };

  const handleNavigate = useCallback((page: any, data: any = null) => {
    setNavigationData(data);

    // Processos críticos que exibem Modal de Sucesso após o loading
    const successFlowPages = ['historico-conta'];
    // Processos que apenas mostram loading curto
    const loadingPages = ['confirmar-deposito', 'investimentos-fundo', 'retirada', 'deposit'];

    if (successFlowPages.includes(page)) {
      withLoading(async () => {
        await new Promise(resolve => setTimeout(resolve, 600));
        setCurrentPage(page);
      }, 'Dados carregados com sucesso.');
    } else if (loadingPages.includes(page)) {
      withLoading(async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        setCurrentPage(page);
      });
    } else {
      setCurrentPage(page);
    }
  }, [withLoading]);


  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentPage('register');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-dark max-w-md mx-auto shadow-2xl overflow-x-hidden">
      <main className="flex-1 overflow-y-auto no-scrollbar">
        <Suspense fallback={
          <div className="flex h-screen items-center justify-center bg-background-dark">
            <SpokeSpinner size="w-12 h-12" className="text-white" />
          </div>
        }>
          {(() => {
            const page = renderPage();
            return cloneElement(page as ReactElement, {
              onNavigate: handleNavigate,
              onLogout: handleLogout,
              showToast
            });
          })()}
        </Suspense>
      </main>

      {/* Bottom Navigation */}
      {session && ['home', 'shop', 'profile', 'ganhos-tarefas'].includes(currentPage) && (
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-surface-dark/95 backdrop-blur-lg border-t border-amazon-border pb-1.5 pt-1.5 px-2 z-50">
          <div className="flex justify-between items-center">
            <button
              onClick={() => setCurrentPage('home')}
              className={`flex flex-col items-center gap-0.5 w-full transition-colors ${currentPage === 'home' ? 'text-primary' : 'text-gray-500'}`}
            >
              <span className={`material-symbols-outlined text-[22px] ${currentPage === 'home' ? 'fill-1' : ''}`} style={{ fontVariationSettings: `'FILL' ${currentPage === 'home' ? 1 : 0}` }}>home</span>
              <span className="text-[9px] font-bold">Início</span>
            </button>

            <button
              onClick={() => setCurrentPage('ganhos-tarefas')}
              className={`flex flex-col items-center gap-0.5 w-full transition-colors ${currentPage === 'ganhos-tarefas' ? 'text-primary' : 'text-gray-500'}`}
            >
              <span className={`material-symbols-outlined text-[22px] ${currentPage === 'ganhos-tarefas' ? 'fill-1' : ''}`} style={{ fontVariationSettings: `'FILL' ${currentPage === 'ganhos-tarefas' ? 1 : 0}` }}>bolt</span>
              <span className="text-[9px] font-medium">Ganhos</span>
            </button>

            <button
              onClick={() => setCurrentPage('shop')}
              className={`flex flex-col items-center gap-0.5 w-full transition-colors ${currentPage === 'shop' ? 'text-primary' : 'text-gray-500'}`}
            >
              <div className={`flex items-center justify-center p-0.5 rounded-full ${currentPage === 'shop' ? 'bg-primary/10' : ''}`}>
                <span className={`material-symbols-outlined text-[22px] ${currentPage === 'shop' ? 'fill-1' : ''}`} style={{ fontVariationSettings: `'FILL' ${currentPage === 'shop' ? 1 : 0}` }}>storefront</span>
              </div>
              <span className="text-[9px] font-medium">Loja</span>
            </button>

            <button
              onClick={() => setCurrentPage('profile')}
              className={`flex flex-col items-center gap-0.5 w-full transition-colors ${currentPage === 'profile' ? 'text-primary' : 'text-gray-500'}`}
            >
              <span className={`material-symbols-outlined text-[22px] ${currentPage === 'profile' ? 'fill-1' : ''}`} style={{ fontVariationSettings: `'FILL' ${currentPage === 'profile' ? 1 : 0}` }}>person</span>
              <span className="text-[9px] font-medium">Conta</span>
            </button>
          </div>
        </nav>
      )}







    </div>
  );
};


export default App;
