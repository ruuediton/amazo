import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useLoading } from '../contexts/LoadingContext';
import SpokeSpinner from '../components/SpokeSpinner';

interface Props {
  onNavigate: (page: any) => void;
  showToast?: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void;
}

const Withdraw: React.FC<Props> = ({ onNavigate, showToast }) => {
  const { withLoading } = useLoading();
  const [balance, setBalance] = useState(0);
  const [bankAccount, setBankAccount] = useState<any>(null);
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const [showPinModal, setShowPinModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const FEE_PERCENT = 0.12;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return onNavigate('login');

      // 1. Get Balance
      const { data: profile } = await supabase
        .from('profiles')
        .select('balance')
        .eq('id', user.id)
        .single();

      if (profile) setBalance(profile.balance || 0);

      // 2. Get Bank Account
      const { data: banks } = await supabase.rpc('get_my_bank_accounts');
      if (banks && banks.length > 0) {
        setBankAccount(banks[0]);
      }

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const calculateFee = () => {
    const val = parseFloat(amount);
    if (isNaN(val)) return 0;
    return val * FEE_PERCENT;
  };

  const calculateLiquid = () => {
    const val = parseFloat(amount);
    if (isNaN(val)) return 0;
    return val - calculateFee();
  };

  const handleQuickAmount = (val: number) => {
    setAmount(val.toString());
  };

  const handleInitiateWithdraw = () => {
    if (!bankAccount) {
      showToast?.("Você precisa vincular uma conta bancária.", "warning");
      onNavigate('add-bank');
      return;
    }

    const val = parseFloat(amount);
    if (!amount || isNaN(val) || val <= 0) {
      showToast?.("Digite um valor válido.", "error");
      return;
    }

    if (val < 300) {
      showToast?.("Valor mínimo de saque é 300 Kz.", "warning");
      return;
    }

    if (val > 200000) {
      showToast?.("Valor máximo de saque é 200.000 Kz.", "warning");
      return;
    }

    if (val > balance) {
      showToast?.("Saldo insuficiente.", "error");
      return;
    }

    // Validação de horário de funcionamento (10:00 às 16:00 - Horário de Angola/WAT)
    const now = new Date();
    // Converter para horário de Angola (UTC+1)
    const angolaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Africa/Luanda' }));
    const currentHour = angolaTime.getHours();

    if (currentHour < 10 || currentHour >= 16) {
      showToast?.("O horário de retirada é das 10:00 às 16:00 (Fuso Angola).", "warning");
      return;
    }

    setShowPinModal(true);
  };

  const confirmWithdraw = async () => {
    try {
      await withLoading(async () => {
        const val = parseFloat(amount);

        // RPC call to process withdrawal
        const { error } = await supabase.rpc('request_withdrawal', {
          p_amount: val,
          p_pin: pin
        });

        if (error) throw error;

        showToast?.("Retirada solicitada com sucesso!", "success");
        setShowPinModal(false);
        setPin('');
        setAmount('');
        // Atualiza saldo
        fetchData();
      }, "Processando saque...");
    } catch (error: any) {
      showToast?.(error.message || "Operação não sucedida.", "error");
    }
  };

  const maskIban = (val: string) => {
    if (!val) return '';
    const clean = val.replace(/\s/g, '');
    if (clean.length < 13) return val;
    return `${clean.substring(0, 8)}*****${clean.substring(clean.length - 9)}`;
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-white">
      <SpokeSpinner size="w-8 h-8" color="text-[#00C853]" />
    </div>
  );

  return (
    <div className="bg-white min-h-screen font-sans text-[#0F1111] pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <button onClick={() => onNavigate('profile')} className="size-10 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <span className="font-bold text-[16px]">Retirada</span>
        <button
          onClick={() => onNavigate('withdrawal-history')}
          className="size-10 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors"
        >
          <span className="material-symbols-outlined text-[#0F1111]">history</span>
        </button>
      </header>

      <main className="p-5 space-y-6">
        {/* Balance Card - BP Style */}
        <div className="bg-[#00C853] rounded-xl p-6 border border-[#00C853] relative overflow-hidden">
          <div className="absolute right-[-20px] top-[-20px] opacity-10">
            <span className="material-symbols-outlined text-[100px]">account_balance_wallet</span>
          </div>
          <p className="text-[12px] font-bold uppercase tracking-widest text-[#0F1111]/70 mb-1">Saldo Disponível</p>
          <h1 className="text-4xl font-extrabold text-[#0F1111]">Kz {balance.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}</h1>
        </div>

        {/* Input */}
        <div className="space-y-2">
          <label className="text-[13px] font-bold text-[#0F1111]">Quantia Desejada</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-gray-400">Kz</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0,00"
              className="w-full h-14 pl-12 pr-4 bg-white border border-[#D5D9D9] rounded-xl text-xl font-bold focus:border-[#00C853] focus:ring-1 focus:ring-[#00C853] outline-none transition-all placeholder:text-gray-300"
            />
          </div>
        </div>

        {/* Quick Amounts */}
        <div className="grid grid-cols-4 gap-2">
          {[2000, 5000, 10000, 20000].map(val => (
            <button
              key={val}
              onClick={() => handleQuickAmount(val)}
              className="py-2.5 bg-white border border-[#D5D9D9] rounded-lg text-[12px] font-bold text-[#0F1111] hover:bg-gray-50 active:scale-95 transition-all"
            >
              {val.toLocaleString('pt-AO')}
            </button>
          ))}
        </div>

        {/* Bank Account */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[13px] font-bold text-[#0F1111]">Conta de Destino</span>
            {bankAccount && <button onClick={() => onNavigate('add-bank')} className="text-[12px] font-bold text-[#007185]">Alterar</button>}
          </div>

          {bankAccount ? (
            <div className="flex items-center gap-4 p-4 border border-[#D5D9D9] rounded-xl bg-white">
              <div className="size-10 rounded-lg bg-gray-100 flex items-center justify-center text-[#565959]">
                <span className="material-symbols-outlined">account_balance</span>
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-[14px] font-bold text-[#0F1111] truncate">{bankAccount.nome_banco}</p>
                <p className="text-[11px] text-[#565959] font-mono truncate">{maskIban(bankAccount.iban)}</p>
              </div>
              <span className="material-symbols-outlined text-green-600">check_circle</span>
            </div>
          ) : (
            <button
              onClick={() => onNavigate('add-bank')}
              className="w-full py-4 border-2 border-dashed border-[#D5D9D9] rounded-xl flex items-center justify-center gap-2 text-[#565959] font-bold text-[13px] hover:bg-gray-50 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Adicionar Conta Bancária
            </button>
          )}
        </div>

      </main>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md p-4 px-8 bg-white border-t border-gray-100 pb-8">
        <button
          onClick={handleInitiateWithdraw}
          className="w-full bg-[#00C853] text-[#0F1111] border border-[#00C853] font-bold text-[15px] py-3.5 rounded-xl active:scale-[0.98] hover:bg-[#00C853] transition-all flex items-center justify-center"
        >
          Solicitar Saque
        </button>
      </div>

      {/* Fullscreen Confirmation Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-[9999] bg-white font-sans overflow-y-auto">
          <div className="min-h-screen flex flex-col max-w-md mx-auto">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
              <button onClick={() => setShowPinModal(false)} className="size-10 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors">
                <span className="material-symbols-outlined text-[#00C853] text-[28px]">chevron_left</span>
              </button>
              <span className="font-bold text-[16px]">Confirmar Retirada</span>
              <div className="size-10"></div>
            </header>

            {/* Content */}
            <div className="flex-1 p-5 space-y-6">
              {/* Icon */}
              <div className="flex justify-center pt-4">
                <div className="size-20 rounded-full bg-[#00C853]/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#00C853] text-[48px]">account_balance_wallet</span>
                </div>
              </div>

              {/* Title */}
              <div className="text-center">
                <h2 className="text-2xl font-black text-[#0F1111] mb-2">Detalhes da Retirada</h2>
                <p className="text-sm text-gray-500">Revise as informações antes de confirmar</p>
              </div>

              {/* Details Card */}
              <div className="bg-gray-50 rounded-2xl p-5 space-y-4 border border-gray-100">
                {/* Destinatário */}
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Destinatário</p>
                  <p className="text-base font-bold text-[#0F1111]">{bankAccount?.nome_titular || 'Não informado'}</p>
                </div>

                {/* Banco */}
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Banco</p>
                  <p className="text-base font-bold text-[#0F1111]">{bankAccount?.nome_banco}</p>
                </div>

                {/* IBAN */}
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">IBAN / Número de Conta</p>
                  <p className="text-sm font-mono font-bold text-[#0F1111] break-all">{bankAccount?.iban}</p>
                </div>

                {/* Valor Solicitado */}
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Valor Solicitado</p>
                  <p className="text-2xl font-black text-[#0F1111]">Kz {parseFloat(amount).toLocaleString('pt-AO', { minimumFractionDigits: 2 })}</p>
                </div>

                {/* Taxa */}
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Taxa de Processamento (12%)</p>
                  <p className="text-lg font-black text-red-500">- Kz {calculateFee().toLocaleString('pt-AO', { minimumFractionDigits: 2 })}</p>
                </div>

                {/* Valor a Receber */}
                <div className="border-t-2 border-[#00C853] pt-4 bg-white rounded-xl p-4 -mx-2">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Valor a Receber</p>
                  <p className="text-3xl font-black text-[#00C853]">Kz {calculateLiquid().toLocaleString('pt-AO', { minimumFractionDigits: 2 })}</p>
                </div>
              </div>

              {/* Warning Message */}
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3">
                <span className="material-symbols-outlined text-red-500 text-[20px] shrink-0 mt-0.5">info</span>
                <div>
                  <p className="text-sm font-bold text-red-700 mb-1">Importante</p>
                  <p className="text-xs text-red-600 leading-relaxed">
                    Por favor, após solicitar a sua retirada, pedimos que aguarde pacientemente no período de até 24 horas. O saque será processado na sua conta bancária.
                  </p>
                </div>
              </div>

              {/* PIN Input */}
              <div className="space-y-3 pt-4">
                <label className="text-sm font-bold text-[#0F1111] block">Digite sua Senha de Retirada</label>
                <input
                  type="password"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••"
                  className="w-full h-16 text-center text-4xl tracking-[12px] font-bold border-2 border-gray-200 rounded-2xl focus:border-[#00C853] focus:ring-2 focus:ring-[#00C853]/20 outline-none transition-all"
                  autoFocus
                />
              </div>
            </div>

            {/* Fixed Bottom Button */}
            {pin.length === 4 && (
              <div className="sticky bottom-0 p-5 bg-white border-t border-gray-100 animate-in slide-in-from-bottom-4 duration-300">
                <button
                  onClick={confirmWithdraw}
                  className="w-full bg-[#00C853] text-white font-bold text-base py-4 rounded-2xl active:scale-[0.98] hover:brightness-110 transition-all shadow-lg shadow-green-200"
                >
                  Confirmar Retirada
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Withdraw;

