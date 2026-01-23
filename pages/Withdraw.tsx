
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
  reloaded_amount: number;
  full_name: string;
  isVerified: boolean;
  isBlocked: boolean;
  blockDate: string | null;
  failedAttempts: number;
}

const Withdraw: React.FC<Props> = ({ onNavigate, showToast }) => {
  const { withLoading } = useLoading();
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Estado simplificado vindo do RPC
  const [screenData, setScreenData] = useState<any>(null);

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

      // Busca dados seguros e pré-calculados do backend
      const { data, error } = await supabase.rpc('get_withdrawal_screen_data');

      if (error) throw error;
      setScreenData(data);

    } catch (err) {
      console.error(err);
      showToast?.("Erro ao carregar dados da conta.", "error");
    } finally {
      setLoading(false);
    }
  };

  const validateWithdrawal = async () => {
    // 1. Validação de Sessão/Dados
    if (!screenData) {
      showToast?.('Aguarde o carregamento do sistema...', 'info');
      return;
    }

    // 2. Validação de Horário (09h às 14h Fuso Angola/GMT+1)
    // No cliente usamos a hora local do usuário para feedback, mas o servidor tem a palavra final
    const now = new Date();
    // Ajuste para Angola (UTC+1)
    const angolaHour = new Date(now.toLocaleString("en-US", { timeZone: "Africa/Luanda" })).getHours();

    if (angolaHour < 9 || angolaHour >= 14) {
      showToast?.('O horário de retirada é das 09h às 14h (Fuso de Angola).', 'error');
      return;
    }

    // 3. Validação de Conta Bancária
    if (!screenData?.has_bank_account) {
      showToast?.('Nenhuma conta bancária vinculada. Adicione uma para retirar.', 'warning');
      onNavigate('add-bank');
      return;
    }

    // 4. Validação de Retirada Pendente
    if (screenData?.has_pending_withdrawal) {
      showToast?.('Você já possui uma retirada pendente. Aguarde a conclusão.', 'error');
      return;
    }

    // 5. Validação de Conta Bloqueada
    if (screenData?.is_blocked) {
      showToast?.(`Conta bloqueada até ${new Date(screenData.blocked_until).toLocaleTimeString()}.`, 'error');
      return;
    }

    const numAmount = parseFloat(amount);

    // 6. Validação de Montante
    if (!amount || isNaN(numAmount)) {
      showToast?.('Insira um valor de retirada válido.', 'warning');
      return;
    }

    if (numAmount < 300) {
      showToast?.('O valor mínimo de retirada é 300 Kz.', 'warning');
      return;
    }

    if (numAmount > 100000) {
      showToast?.('O valor máximo por retirada é 100.000 Kz.', 'warning');
      return;
    }

    if (numAmount > screenData.balance) {
      showToast?.('Saldo insuficiente para realizar esta retirada.', 'error');
      return;
    }

    // Abre modal de senha
    setShowPinModal(true);
  };

  const handleConfirmWithdraw = async () => {
    if (!pin || pin.length !== 4 || !/^\d+$/.test(pin)) {
      showToast?.('PIN inválido. Insira os 4 dígitos numéricos.', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      await withLoading(async () => {
        const { data, error } = await supabase.rpc('request_withdrawal', {
          p_amount: parseFloat(amount),
          p_pin: pin
        });

        if (error) throw error;

        setShowPinModal(false);
        setPin('');
      }, 'Retirada autorizada com sucesso! Aguarde o processamento.');

      onNavigate('historico-conta');
    } catch (error: any) {
      setShowPinModal(false);
      setPin('');
      console.error('Withdrawal error:', error);
    } finally {
      setSubmitting(false);
      fetchInitialData(); // Atualiza estado (saldo, pendentes, etc)
    }
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
        <h1 className="flex-1 text-center text-lg font-bold leading-tight tracking-tight text-text-primary pl-10">
          Retirar Fundos
        </h1>
        <button
          onClick={() => onNavigate('withdrawal-history')}
          className="flex size-10 shrink-0 items-center justify-center rounded-full active:bg-surface-dark cursor-pointer transition-colors text-gray-400"
        >
          <span className="material-symbols-outlined text-[24px]">history</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col px-5 pt-6">
        {/* Balance Display */}
        <div className="mb-8">
          <p className="text-text-secondary text-sm font-medium mb-1">Saldo Disponível</p>
          <h2 className="text-3xl font-extrabold text-text-primary tracking-tight">Kz {screenData?.balance?.toLocaleString() || '0,00'}</h2>
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
              disabled={screenData?.is_blocked}
              className={`w-full bg-transparent border-none p-0 text-2xl font-bold text-text-primary placeholder:text-text-secondary/20 focus:ring-0 ${screenData?.is_blocked ? 'opacity-50' : ''}`}
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
              disabled={screenData?.is_blocked}
              onClick={() => setAmount(val.toString())}
              className={`h-10 rounded-lg bg-surface-dark border border-gray-200 flex items-center justify-center text-xs font-bold hover:border-primary transition-colors ${screenData?.is_blocked ? 'opacity-50 cursor-not-allowed' : ''}`}
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
              {screenData?.has_bank_account ? 'Gerir' : 'Adicionar'}
            </button>
          </div>

          {screenData?.has_bank_account ? (
            <div className="bg-surface-dark border border-amazon-border rounded-2xl p-4 flex items-center gap-4 relative shadow-sm">
              <div className="size-12 rounded-xl bg-background-dark p-1.5 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-text-primary" style={{ fontSize: '32px' }}>account_balance</span>
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-bold text-text-primary">{screenData.bank_name}</p>
                <p className="text-xs text-text-secondary">IBAN: {screenData.masked_iban}</p>
              </div>
              <div className="ml-auto">
                <span className="material-symbols-outlined text-success-text">check_circle</span>
              </div>
            </div>
          ) : (
            <div className="bg-error-bg border border-amazon-border rounded-2xl p-6 flex flex-col items-center text-center gap-2">
              <span className="material-symbols-outlined text-error-text">warning</span>
              <p className="text-sm font-bold text-text-primary">Nenhuma conta vinculada</p>
              <p className="text-xs text-text-secondary">Adicione uma conta para retirar.</p>
            </div>
          )}
        </div>

        {/* Security Notice */}
        <div className="bg-warning-bg border border-amazon-border rounded-2xl p-4 flex items-start gap-3 mb-8">
          <span className="material-symbols-outlined text-warning-text text-[20px] mt-0.5">verified_user</span>
          <div className="flex flex-col gap-1">
            <p className="text-text-primary text-xs font-bold leading-tight">Segurança Amazon</p>
            <p className="text-text-secondary text-[11px] leading-normal">
              Seu IBAN está protegido. Validação crítica ocorre no servidor.
            </p>
          </div>
        </div>

      </main>

      {/* Sticky Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-background-dark/90 backdrop-blur-lg border-t border-gray-200 z-40">
        <button
          onClick={validateWithdrawal}
          disabled={screenData?.is_blocked}
          className={`w-full h-11 bg-primary hover:bg-[#ffe14d] active:scale-[0.98] transition-all rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 text-black font-extrabold text-sm cursor-pointer ${screenData?.is_blocked ? 'opacity-30 grayscale cursor-not-allowed' : ''}`}
        >
          {screenData?.is_blocked ? 'Conta Temporariamente Bloqueada' : 'Confirmar Retirada'}
        </button>
      </div>

      {/* Modal de Senha (PIN) - Refactored to Bottom Popup */}
      {showPinModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-8 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" onClick={() => !submitting && setShowPinModal(false)}></div>
          <div className="relative w-full max-w-sm bg-white rounded-[32px] p-6 shadow-2xl animate-in slide-in-from-bottom-8 duration-300 border border-slate-100">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="size-14 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-blue-600 text-2xl">lock_open</span>
              </div>
              <h2 className="text-xl font-black text-slate-900 mb-1">Senha de Retirada</h2>
              <p className="text-sm text-slate-500">Insira seu PIN de 4 dígitos para autorizar.</p>
            </div>

            <div className="space-y-6">
              <div className="flex justify-center">
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    if (val.length <= 4) setPin(val);
                  }}
                  placeholder="••••"
                  autoFocus
                  maxLength={4}
                  inputMode="numeric"
                  className="w-48 h-12 bg-slate-50 border border-slate-200 rounded-2xl text-center text-2xl font-black text-slate-900 tracking-[0.5em] focus:border-blue-500 focus:ring-0 transition-all placeholder:text-slate-300 placeholder:tracking-normal"
                />
              </div>

              <div className="flex items-center justify-between px-2">
                <button
                  disabled={submitting}
                  onClick={() => setShowPinModal(false)}
                  className="text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  disabled={submitting || pin.length < 4}
                  onClick={handleConfirmWithdraw}
                  className={`font-black text-sm uppercase tracking-widest px-6 py-2 rounded-full transition-all active:scale-95 ${pin.length === 4
                    ? 'text-blue-600 hover:text-blue-700'
                    : 'text-slate-300 cursor-not-allowed'
                    }`}
                >
                  {submitting ? <SpokeSpinner size="w-4 h-4" /> : 'Confirmar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Withdraw;
