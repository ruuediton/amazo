
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useLoading } from '../contexts/LoadingContext';
import SpokeSpinner from '../components/SpokeSpinner';

interface Props {
  onNavigate: (page: any) => void;
  showToast?: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void;
}

interface WithdrawStats {
  balance: number;
  isVerified: boolean;
  isBlocked: boolean;
  blockDate: string | null;
  failedAttempts: number;
}

const Withdraw: React.FC<Props> = ({ onNavigate, showToast }) => {
  const { withLoading } = useLoading();
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<WithdrawStats | null>(null);
  const [bankAccount, setBankAccount] = useState<any>(null);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const quickAmounts = [5000, 10000, 20000, 50000];
  const FEE_PERCENT = 0.12;

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        onNavigate('login');
        return;
      }

      // 1. Perfil e Bloqueios
      const { data: profile } = await supabase
        .from('profiles')
        .select('balance, verified, bloqueio_retirada, data_bloqueio, failed_withdraw_attempts')
        .eq('user_id', user.id)
        .single();

      if (profile) {
        // Verificar se expirou o bloqueio de 72h
        let isBlocked = profile.bloqueio_retirada;
        if (isBlocked && profile.data_bloqueio) {
          const blockTime = new Date(profile.data_bloqueio).getTime();
          const now = new Date().getTime();
          const threeDays = 72 * 60 * 60 * 1000;

          if (now - blockTime > threeDays) {
            // Desbloquear automaticamente
            await supabase.from('profiles').update({
              bloqueio_retirada: false,
              data_bloqueio: null,
              failed_withdraw_attempts: 0
            }).eq('user_id', user.id);
            isBlocked = false;
          }
        }

        setStats({
          balance: profile.balance || 0,
          isVerified: profile.verified || false,
          isBlocked: isBlocked || false,
          blockDate: profile.data_bloqueio,
          failedAttempts: profile.failed_withdraw_attempts || 0
        });
      }

      // 2. Conta Bancária
      const { data: bank } = await supabase
        .from('bank_accounts')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setBankAccount(bank);

    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  const validateWithdrawal = async () => {
    if (!stats || !bankAccount) {
      showToast?.('Conta bancária não encontrada. Por favor, adicione uma conta.', 'warning');
      onNavigate('add-bank');
      return;
    }

    if (stats.isBlocked) {
      showToast?.('Sua conta de retirada está bloqueada por 72h devido a erros de senha.', 'error');
      return;
    }

    if (!stats.isVerified) {
      showToast?.('Conta não verificada. Conclua a verificação para retirar.', 'warning');
      return;
    }

    // Validação de Investidor (Pelo menos um registro em historico_compra)
    const { count } = await supabase
      .from('historico_compra')
      .select('*', { count: 'exact', head: true })
      .eq('uid_user', (await supabase.auth.getUser()).data.user?.id);

    if (!count || count === 0) {
      showToast?.('Apenas investidores podem solicitar retiradas.', 'warning');
      return;
    }

    // Validação de Data/Hora (Angola = UTC+1)
    const now = new Date();
    const utcHour = now.getUTCHours();
    const angolaHour = (utcHour + 1) % 24;
    const day = now.getUTCDay(); // 0=Dom, 1=Seg...

    if (day === 0 || day === 6) {
      showToast?.('Retiradas disponíveis apenas de segunda a sexta.', 'info');
      return;
    }

    if (angolaHour < 10) {
      showToast?.('Retiradas disponíveis a partir das 10:00.', 'info');
      return;
    }

    if (angolaHour >= 18) {
      showToast?.('Retiradas encerradas. Horário limite: 18:00.', 'info');
      return;
    }

    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount < 300) {
      showToast?.('Valor mínimo de retirada: 300 Kz.', 'warning');
      return;
    }

    if (numAmount > 300000) {
      showToast?.('Valor máximo de retirada: 300.000 Kz.', 'warning');
      return;
    }

    if (numAmount > stats.balance) {
      showToast?.('Saldo insuficiente.', 'error');
      return;
    }

    // Verificar se existe saque pendente ou em revisão
    const { data: lastWithdraw } = await supabase
      .from('withdrawals')
      .select('status, created_at')
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (lastWithdraw && (lastWithdraw.status === 'pendente' || lastWithdraw.status === 'revisão')) {
      showToast?.('Você possui uma retirada pendente ou em revisão. Aguarde a aprovação.', 'warning');
      return;
    }

    if (lastWithdraw) {
      const today = new Date().toISOString().split('T')[0];
      const lastDate = new Date(lastWithdraw.created_at).toISOString().split('T')[0];
      if (today === lastDate && lastWithdraw.status !== 'aprovado') {
        showToast?.('Você já realizou uma retirada hoje.', 'info');
        return;
      }
    }

    // Se passou em tudo, abre o modal de senha
    setShowPinModal(true);
  };

  const handleConfirmWithdraw = async () => {
    if (!pin) {
      showToast?.('Por favor, insira sua senha de retirada.', 'warning');
      return;
    }

    await withLoading(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data: isValid, error: pinError } = await supabase.rpc('verify_withdrawal_password', {
        p_password: pin
      });

      if (!isValid) {
        const newAttempts = (stats?.failedAttempts || 0) + 1;
        if (newAttempts >= 2) {
          await supabase.from('profiles').update({
            bloqueio_retirada: true,
            data_bloqueio: new Date().toISOString(),
            failed_withdraw_attempts: 2
          }).eq('user_id', user.id);

          setShowPinModal(false);
          fetchInitialData();
          throw new Error('Senha incorreta! Sua conta foi bloqueada por 72h.');
        } else {
          await supabase.from('profiles').update({
            failed_withdraw_attempts: newAttempts
          }).eq('user_id', user.id);
          setStats(prev => prev ? { ...prev, failedAttempts: newAttempts } : null);
          throw new Error(`Senha incorreta! Você tem mais 1 tentativa.`);
        }
      }

      const numAmount = parseFloat(amount);
      const amountRecebendo = numAmount * (1 - FEE_PERCENT);

      const { error: withdrawError } = await supabase.rpc('process_withdrawal_secure', {
        p_amount_original: numAmount,
        p_amount_recebendo: amountRecebendo
      });

      if (withdrawError) throw withdrawError;

      setShowPinModal(false);
      onNavigate('historico-conta');
      return 'Solicitação de retirada enviada com sucesso!';
    });
  };

  const calculatingFee = amount ? (parseFloat(amount) * FEE_PERCENT).toLocaleString() : '0';
  const finalAmount = amount ? (parseFloat(amount) * (1 - FEE_PERCENT)).toLocaleString() : '0';

  if (loading) {
    return (
      <div className="bg-background-dark min-h-screen flex items-center justify-center">
        <SpokeSpinner size="w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="bg-background-dark font-display text-black antialiased min-h-screen flex flex-col selection:bg-primary selection:text-black pb-28">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between bg-background-dark/90 px-4 py-3 backdrop-blur-md border-b border-amazon-border">
        <button
          onClick={() => onNavigate('perfil')}
          className="flex size-10 shrink-0 items-center justify-center rounded-full active:bg-surface-dark cursor-pointer transition-colors text-primary"
        >
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>
        <h1 className="flex-1 text-center text-lg font-bold leading-tight tracking-tight text-text-primary pr-10">
          Retirar Fundos
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col px-5 pt-6">
        {/* Balance Display */}
        <div className="mb-8">
          <p className="text-text-secondary text-sm font-medium mb-1">Saldo Disponível</p>
          <h2 className="text-3xl font-extrabold text-text-primary tracking-tight">Kz {stats?.balance.toLocaleString() || '0,00'}</h2>
        </div>

        {/* Amount Input */}
        <div className="mb-2">
          <label className="block text-sm font-bold text-text-secondary uppercase tracking-wider mb-3">Quantia a Retirar</label>
          <div className="relative flex items-center bg-surface-dark rounded-2xl border border-amazon-border p-4 focus-within:border-primary transition-colors">
            <span className="text-2xl font-bold text-primary mr-3">Kz</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0,00"
              className="w-full bg-transparent border-none p-0 text-2xl font-bold text-text-primary placeholder:text-text-secondary/20 focus:ring-0"
            />
          </div>
        </div>

        {/* Fee Info */}
        <div className="flex justify-between items-center px-1 mb-6">
          <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest">Taxa (12%): Kz {calculatingFee}</p>
          <p className="text-[10px] text-primary font-black uppercase tracking-widest">Receberá: Kz {finalAmount}</p>
        </div>

        {/* Quick Selections */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {quickAmounts.map(val => (
            <button
              key={val}
              onClick={() => setAmount(val.toString())}
              className="h-10 rounded-lg bg-surface-dark border border-gray-200 flex items-center justify-center text-xs font-bold hover:border-primary transition-colors"
            >
              +{val.toLocaleString()}
            </button>
          ))}
        </div>

        {/* Bank Selection */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-bold text-text-secondary uppercase tracking-wider">Conta de Destino</label>
            <button
              onClick={() => onNavigate('add-bank')}
              className="text-xs font-bold text-primary hover:underline"
            >
              {bankAccount ? 'Alterar' : 'Adicionar'}
            </button>
          </div>
          {bankAccount ? (
            <div className="bg-surface-dark border border-amazon-border rounded-2xl p-4 flex items-center gap-4 relative shadow-sm">
              <div className="size-12 rounded-xl bg-background-dark p-1.5 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-text-primary" style={{ fontSize: '32px' }}>account_balance</span>
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-bold text-text-primary">{bankAccount.nome_banco}</p>
                <p className="text-xs text-text-secondary">Conta Ativa • Verificada</p>
              </div>
              <div className="ml-auto">
                <span className="material-symbols-outlined text-success-text">check_circle</span>
              </div>
            </div>
          ) : (
            <div className="bg-error-bg border border-amazon-border rounded-2xl p-6 flex flex-col items-center text-center gap-2">
              <span className="material-symbols-outlined text-error-text">warning</span>
              <p className="text-sm font-bold text-text-primary">Nenhuma conta bancária</p>
              <p className="text-xs text-text-secondary">Adicione uma conta para habilitar retiradas.</p>
            </div>
          )}
        </div>

        {/* Security Notice */}
        <div className="bg-warning-bg border border-amazon-border rounded-2xl p-4 flex items-start gap-3 mb-8">
          <span className="material-symbols-outlined text-warning-text text-[20px] mt-0.5">verified_user</span>
          <div className="flex flex-col gap-1">
            <p className="text-text-primary text-xs font-bold leading-tight">Segurança Amazon</p>
            <p className="text-text-secondary text-[11px] leading-normal">
              Para sua segurança, os dados bancários são <span className="text-text-primary font-bold">criptografados</span> e a aprovação leva até 24h.
            </p>
          </div>
        </div>

      </main>

      {/* Sticky Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-background-dark/90 backdrop-blur-lg border-t border-gray-200 z-40">
        <button
          onClick={validateWithdrawal}
          disabled={stats?.isBlocked}
          className={`w-full h-14 bg-primary hover:bg-[#ffe14d] active:scale-[0.98] transition-all rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 text-black font-extrabold text-base cursor-pointer ${stats?.isBlocked ? 'opacity-30 grayscale cursor-not-allowed' : ''}`}
        >
          {stats?.isBlocked ? 'Conta Bloqueada (72h)' : 'Confirme'}
        </button>
      </div>

      {/* Modal de Senha (PIN) */}
      {showPinModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-0 sm:p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !submitting && setShowPinModal(false)}></div>
          <div className="relative w-full max-w-md bg-surface-dark border-t border-white/10 sm:border border-white/10 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="size-14 bg-primary/10 rounded-full flex items-center justify-center mb-4 border border-primary/20">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: '32px' }}>lock</span>
              </div>
              <h2 className="text-xl font-black text-black mb-2">Segurança</h2>
              <p className="text-sm text-gray-600">Digite sua senha alfanumérica de retirada para autorizar Kz {amount}.</p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Senha de Retirada"
                  className="w-full h-14 bg-black/40 border border-white/10 rounded-xl px-4 text-center text-2xl font-black tracking-widest focus:border-primary focus:ring-0 transition-all placeholder:text-[14px] placeholder:tracking-normal placeholder:font-bold"
                />
              </div>
              <button
                onClick={handleConfirmWithdraw}
                disabled={submitting}
                className="w-full h-14 bg-primary hover:bg-[#ffe14d] text-black font-black text-lg rounded-xl flex items-center justify-center transition-all active:scale-[0.95]"
              >
                {submitting ? (
                  <SpokeSpinner size="w-6 h-6" className="text-black" />
                ) : 'Autorizar'}
              </button>
              <button
                onClick={() => setShowPinModal(false)}
                disabled={submitting}
                className="w-full h-12 text-gray-500 font-bold text-sm"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Withdraw;
