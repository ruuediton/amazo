
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

      const { data, error } = await supabase.rpc('get_withdrawal_screen_data');
      if (error) {
        console.error('RPC Error:', error);
        throw error;
      }
      setScreenData(data);
    } catch (err: any) {
      console.error('Fetch Error:', err);
      showToast?.("Erro ao carregar dados. Verifique sua conexão.", "error");
    } finally {
      setLoading(false);
    }
  };

  const validateWithdrawal = async () => {
    if (!screenData) {
      showToast?.('Aguarde o carregamento...', 'info');
      fetchInitialData();
      return;
    }

    const now = new Date();
    const angolaHour = new Date(now.toLocaleString("en-US", { timeZone: "Africa/Luanda" })).getHours();

    if (angolaHour < 9 || angolaHour >= 14) {
      showToast?.('Retiradas disponíveis das 09h às 14h (Angola).', 'error');
      return;
    }

    if (!screenData?.has_bank_account) {
      showToast?.('Vincule uma conta bancária primeiro.', 'warning');
      onNavigate('add-bank');
      return;
    }

    if (screenData?.has_pending_withdrawal) {
      showToast?.('Você já possui uma retirada em processamento.', 'error');
      return;
    }

    if (screenData?.is_blocked) {
      showToast?.(`Conta temporariamente bloqueada.`, 'error');
      return;
    }

    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount)) {
      showToast?.('Insira um valor válido.', 'warning');
      return;
    }

    if (numAmount < 300) {
      showToast?.('Mínimo: 300 Kz.', 'warning');
      return;
    }

    if (numAmount > screenData.balance) {
      showToast?.('Saldo insuficiente.', 'error');
      return;
    }

    setShowPinModal(true);
  };

  const handleConfirmWithdraw = async () => {
    if (pin.length !== 4) return;

    setSubmitting(true);
    try {
      const { data, error } = await supabase.rpc('request_withdrawal', {
        p_amount: parseFloat(amount),
        p_pin: pin
      });

      if (error) throw error;

      showToast?.('Retirada solicitada com sucesso!', 'success');
      setShowPinModal(false);
      setPin('');
      setTimeout(() => onNavigate('withdrawal-history'), 1000);
    } catch (error: any) {
      showToast?.(error.message || 'Erro ao processar retirada.', 'error');
      setPin('');
    } finally {
      setSubmitting(false);
    }
  };

  const currentFee = amount ? (parseFloat(amount) * FEE_PERCENT) : 0;
  const receiveAmount = amount ? (parseFloat(amount) - currentFee) : 0;

  if (loading && !screenData) {
    return (
      <div className="bg-background-dark min-h-screen flex items-center justify-center">
        <SpokeSpinner size="w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="bg-background-dark font-display text-black antialiased min-h-screen flex flex-col pb-24">
      {/* Header - 14px Título */}
      <header className="sticky top-0 z-50 flex items-center justify-between bg-white px-4 py-2 border-b border-gray-100">
        <button
          onClick={() => onNavigate('profile')}
          className="flex size-8 items-center justify-center rounded-full active:scale-90 transition-transform text-primary"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>
        <h1 className="flex-1 text-center text-[14px] font-bold uppercase tracking-tight text-black pr-8">
          Retirar Fundos
        </h1>
      </header>

      <main className="flex-1 flex flex-col px-4 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Balance Card - Compacto com Elevação */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 mb-6">
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">Saldo Disponível</p>
          <h2 className="text-2xl font-black text-black">
            Kz {screenData?.balance?.toLocaleString() || '0,00'}
          </h2>
        </div>

        {/* Input Area */}
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-gray-500 ml-1 uppercase">Quanto deseja retirar?</label>
            <div className="relative flex items-center bg-white rounded-xl border border-gray-100 h-12 px-4 shadow-sm focus-within:border-primary transition-all">
              <span className="text-lg font-bold text-primary mr-2">Kz</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0,00"
                className="w-full bg-transparent border-none p-0 text-[16px] font-bold text-black placeholder:text-gray-200 focus:ring-0"
              />
            </div>
            {/* Fee Info - Mais discreto */}
            <div className="flex justify-between px-1 pt-1">
              <span className="text-[10px] text-gray-400 font-medium">Taxa (12%): Kz {currentFee.toLocaleString()}</span>
              <span className="text-[10px] text-primary font-bold">Recebe: Kz {receiveAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* Quick Amounts - Compactos */}
          <div className="grid grid-cols-4 gap-2">
            {quickAmounts.map(val => (
              <button
                key={val}
                onClick={() => setAmount(val.toString())}
                className="h-9 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-[11px] font-bold hover:border-primary active:scale-95 transition-all shadow-sm"
              >
                +{val.toLocaleString()}
              </button>
            ))}
          </div>

          {/* Bank Display - Compacto e Elegante */}
          <div className="space-y-1">
            <div className="flex justify-between items-center px-1">
              <label className="text-[11px] font-bold text-gray-500 uppercase">Conta de Destino</label>
              <button onClick={() => onNavigate('add-bank')} className="text-[11px] font-bold text-primary">Alterar</button>
            </div>

            {screenData?.has_bank_account ? (
              <div className="bg-white border border-gray-100 rounded-xl p-3 flex items-center gap-3 shadow-sm">
                <div className="size-10 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-black text-[20px]">account_balance</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <p className="text-[12.5px] font-bold text-black truncate">{screenData.bank_name}</p>
                  <p className="text-[11px] text-gray-400 font-mono">{screenData.masked_iban}</p>
                </div>
                <span className="material-symbols-outlined text-green-500 ml-auto text-[20px]">verified</span>
              </div>
            ) : (
              <button
                onClick={() => onNavigate('add-bank')}
                className="w-full bg-red-50 border border-red-100 rounded-xl p-3 flex flex-col items-center gap-1 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-red-400 text-[20px]">add_card</span>
                <p className="text-[11px] font-bold text-red-500">Vincular Conta Bancária</p>
              </button>
            )}
          </div>
        </div>

        {/* Security Info Compacto */}
        <div className="mt-8 flex items-center justify-center gap-2 opacity-40">
          <span className="material-symbols-outlined text-[14px]">lock</span>
          <p className="text-[10px] font-bold uppercase tracking-widest">Processamento Criptografado</p>
        </div>
      </main>

      {/* Footer CTA - Botão Branco */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background-dark/80 backdrop-blur-md">
        <button
          onClick={validateWithdrawal}
          disabled={submitting}
          className="w-full h-12 bg-white border border-gray-200 text-black font-black text-[13px] rounded-xl shadow-lg flex items-center justify-center active:scale-[0.98] transition-all uppercase tracking-wider"
        >
          {submitting ? <SpokeSpinner size="w-5 h-5" /> : 'Confirmar Retirada'}
        </button>
      </div>

      {/* Pin Modal - Refined */}
      {showPinModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-8">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !submitting && setShowPinModal(false)}></div>
          <div className="relative w-full max-w-sm bg-white rounded-[28px] p-6 shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
            <div className="flex flex-col items-center mb-6">
              <div className="size-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-primary text-[24px]">key</span>
              </div>
              <h2 className="text-lg font-black text-black">Senha de Retirada</h2>
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Segurança Amazon</p>
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
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl h-12 text-center text-2xl font-black text-black tracking-[1em] focus:border-primary focus:ring-0 transition-all"
                />
              </div>

              <div className="flex gap-3">
                <button
                  disabled={submitting}
                  onClick={() => setShowPinModal(false)}
                  className="flex-1 h-11 text-gray-400 font-bold text-[12px] uppercase"
                >
                  Cancelar
                </button>
                <button
                  disabled={submitting || pin.length < 4}
                  onClick={handleConfirmWithdraw}
                  className="flex-1 h-11 bg-black text-white rounded-xl font-bold text-[12px] uppercase active:scale-95 transition-all"
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
