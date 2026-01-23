
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
    <div className="bg-[#0a0a0b] font-display text-white antialiased min-h-screen flex flex-col selection:bg-amber-500/30 pb-24">
      {/* Premium Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between bg-[#0a0a0b]/80 px-6 py-4 backdrop-blur-xl border-b border-white/5">
        <button
          onClick={() => onNavigate('profile')}
          className="group flex items-center justify-center w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 active:scale-90 transition-all border border-white/10"
        >
          <span className="material-symbols-outlined text-amber-500 text-[22px] group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
        </button>
        <h1 className="flex-1 text-center text-[15px] font-black uppercase tracking-[0.1em] text-white pr-10">
          Retirar kwanza
        </h1>
      </header>

      <main className="flex-1 flex flex-col px-6 pt-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        {/* Neon Balance Display */}
        <div className="relative mb-10 group">
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 to-amber-200/20 blur-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative bg-white/[0.03] backdrop-blur-2xl p-6 rounded-[32px] border border-white/10 shadow-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-amber-500 text-[18px]">account_balance_wallet</span>
              <p className="text-gray-400 text-[11px] font-black uppercase tracking-widest">Saldo para Retirada</p>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-amber-500">Kz</span>
              <h2 className="text-4xl font-black text-white tracking-tighter">
                {screenData?.balance?.toLocaleString() || '0,00'}
              </h2>
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="space-y-6">
          <div className="space-y-2 group">
            <label className="block text-[11px] font-black text-gray-500 ml-1 uppercase tracking-widest group-focus-within:text-amber-500 transition-colors">
              Quantia Desejada
            </label>
            <div className="relative flex items-center bg-white/[0.03] rounded-2xl border border-white/10 h-16 px-5 focus-within:border-amber-500/50 transition-all">
              <span className="text-xl font-bold text-amber-500 mr-3">Kz</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Introduza o valor"
                className="w-full bg-transparent border-none p-0 text-[18px] font-bold text-white placeholder:text-gray-700 focus:ring-0"
              />
            </div>
            {/* Fee Metadata */}
            <div className="flex justify-between items-center px-2 pt-1 border-t border-white/5">
              <div className="flex items-center gap-1.5 grayscale">
                <span className="material-symbols-outlined text-xs">analytics</span>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">Taxa 12%: Kz {currentFee.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1.5 font-black text-amber-500">
                <span className="text-[10px] uppercase tracking-wide">Líquido: Kz {receiveAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Quick Amount Chips */}
          <div className="grid grid-cols-4 gap-2">
            {quickAmounts.map(val => (
              <button
                key={val}
                onClick={() => setAmount(val.toString())}
                className="h-11 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-[12px] font-bold hover:bg-amber-500 hover:text-black hover:border-amber-500 active:scale-95 transition-all shadow-sm"
              >
                {val >= 1000 ? `${val / 1000}k` : val}
              </button>
            ))}
          </div>

          {/* Destination Account Card */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Canal de Destino</label>
              <button onClick={() => onNavigate('add-bank')} className="text-[11px] font-black text-amber-500 uppercase">Alterar</button>
            </div>

            {screenData?.has_bank_account ? (
              <div className="bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 rounded-2xl p-4 flex items-center gap-4 group hover:bg-white/[0.08] transition-colors cursor-pointer" onClick={() => onNavigate('add-bank')}>
                <div className="size-12 rounded-2xl bg-amber-500 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
                  <span className="material-symbols-outlined text-black text-[28px]">payments</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <p className="text-[15px] font-black text-white truncate">{screenData.bank_name}</p>
                  <p className="text-[11px] text-gray-500 font-mono tracking-wider">{screenData.masked_iban}</p>
                </div>
                <span className="material-symbols-outlined text-amber-500 ml-auto animate-pulse">check_circle</span>
              </div>
            ) : (
              <button
                onClick={() => onNavigate('add-bank')}
                className="w-full bg-white/5 border border-dashed border-white/20 rounded-2xl p-6 flex flex-col items-center gap-2 hover:bg-white/10 transition-all"
              >
                <div className="size-10 rounded-full bg-gray-900 flex items-center justify-center">
                  <span className="material-symbols-outlined text-gray-500">add_task</span>
                </div>
                <p className="text-[11px] font-black text-white uppercase tracking-widest">Ativar Conta Bancária</p>
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Glossy Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0a0a0b] via-[#0a0a0b]/90 to-transparent">
        <button
          onClick={validateWithdrawal}
          disabled={submitting}
          className="relative group w-full h-16 overflow-hidden rounded-2xl shadow-2xl shadow-amber-500/10"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-400 group-hover:scale-105 transition-transform duration-500"></div>
          <div className="relative flex items-center justify-center font-black text-black text-sm uppercase tracking-[0.2em]">
            {submitting ? (
              <SpokeSpinner size="w-6 h-6" className="text-black" />
            ) : (
              'Solicitar Saque'
            )}
          </div>
        </button>
      </div>

      {/* Security Pin Bottom Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-10">
          <div className="absolute inset-0 bg-[#0a0a0b]/95 backdrop-blur-md" onClick={() => !submitting && setShowPinModal(false)}></div>
          <div className="relative w-full max-w-sm bg-[#121214] border border-white/10 rounded-[40px] p-8 shadow-2xl animate-in slide-in-from-bottom-20 duration-500">
            <div className="flex flex-col items-center mb-8">
              <div className="size-16 bg-amber-500/10 rounded-full flex items-center justify-center mb-4 border border-amber-500/20">
                <span className="material-symbols-outlined text-amber-500 text-[32px]">dialpad</span>
              </div>
              <h2 className="text-xl font-black text-white mb-1">PIN Operacional</h2>
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Criptografia de 256 bits</p>
            </div>

            <div className="space-y-8">
              <div className="flex justify-center">
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    if (val.length <= 4) setPin(val);
                  }}
                  placeholder="0000"
                  autoFocus
                  maxLength={4}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl h-16 text-center text-4xl font-black text-amber-500 tracking-[0.5em] focus:border-amber-500/50 focus:ring-0 transition-all placeholder:text-gray-800"
                />
              </div>

              <div className="flex gap-4">
                <button
                  disabled={submitting}
                  onClick={() => setShowPinModal(false)}
                  className="flex-1 h-14 bg-white/5 text-gray-400 font-black text-[12px] uppercase tracking-widest rounded-2xl border border-white/5 active:scale-95 transition-all"
                >
                  Cancelar
                </button>
                <button
                  disabled={submitting || pin.length < 4}
                  onClick={handleConfirmWithdraw}
                  className="flex-1 h-14 bg-white text-black font-black text-[12px] uppercase tracking-widest rounded-2xl active:scale-95 transition-all disabled:opacity-30"
                >
                  {submitting ? <SpokeSpinner size="w-5 h-5" /> : 'Confirmar'}
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
