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
      {/* Premium Header */}
      <header className="relative bg-gradient-to-b from-[#00C853] to-[#00C853]/10 pb-20 pt-4 px-4 overflow-hidden">
        {/* Background Decorative Circles */}
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>

        <div className="relative z-10 flex items-center justify-between">
          <button
            onClick={() => onNavigate('profile')}
            className="w-11 h-11 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md transition-all active:scale-90"
          >
            <span className="material-symbols-outlined text-white text-[28px]">arrow_back</span>
          </button>
          <h1 className="text-xl font-black text-white tracking-tight text-center">Retirada</h1>
          <button
            onClick={() => onNavigate('withdrawal-history')}
            className="w-11 h-11 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md transition-all active:scale-90"
          >
            <span className="material-symbols-outlined text-white text-[28px]">history</span>
          </button>
        </div>
      </header>

      <main className="px-4 -mt-12 relative z-10 space-y-6">
        {/* Floating Balance Card */}
        <div className="bg-white border border-gray-100 rounded-[28px] p-6 shadow-premium relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-[#00C853]/5 rounded-full blur-2xl -mr-16 -mt-16"></div>
          <div className="flex items-center gap-2 mb-2">
            <p className="text-[#565959] text-[13px] font-medium leading-none">Saldo</p>
          </div>
          <div className="flex items-baseline gap-1.5 leading-none">
            <span className="text-[28px] font-black text-[#111] tracking-tighter">
              {balance.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[13px] font-bold text-[#565959]">KZs</span>
          </div>
        </div>

        {/* Input */}
        <div className="space-y-2">
          <label className="text-[13px] font-bold text-[#0F1111]">Quantia Desejada</label>
          <div className="bg-gray-50 rounded-xl h-14 flex items-center px-4 gap-3 relative border border-transparent focus-within:border-[#00C853] transition-colors">
            <span className="material-symbols-outlined text-[#00C853] text-[24px]">payments</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0,00"
              className="bg-transparent flex-1 h-full outline-none text-[#111] font-medium placeholder:text-gray-400 text-[14px]"
            />
            <span className="text-[14px] font-bold text-gray-400">Kz</span>
          </div>
        </div>

        {/* Quick Amounts */}
        <div className="grid grid-cols-4 gap-2">
          {[2000, 5000, 10000, 20000].map(val => (
            <button
              key={val}
              onClick={() => handleQuickAmount(val)}
              className="py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-[12px] font-bold text-[#0F1111] hover:bg-white active:scale-95 transition-all"
            >
              {val.toLocaleString('pt-AO')}
            </button>
          ))}
        </div>

        {/* Bank Account */}
        <div className="space-y-2">
          <div className="flex justify-between items-center ml-1">
            <span className="text-[13px] font-bold text-[#0F1111]">Conta de Destino</span>
          </div>

          {bankAccount ? (
            <button
              onClick={() => onNavigate('add-bank')}
              className="w-full flex items-center gap-4 p-4 border border-gray-100 rounded-[12px] bg-gray-50 hover:bg-white transition-all text-left active:scale-[0.99]"
            >
              <div className="size-10 rounded-lg bg-white flex items-center justify-center text-[#00C853] shadow-sm">
                <span className="material-symbols-outlined">account_balance</span>
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-[14px] font-bold text-[#0F1111] truncate">{bankAccount.nome_banco}</p>
                <p className="text-[11px] text-[#565959] font-mono truncate">{maskIban(bankAccount.iban)}</p>
              </div>
              <span className="material-symbols-outlined text-gray-400 group-hover:text-[#00C853] transition-colors">chevron_right</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigate('add-bank')}
              className="w-full py-4 border-2 border-dashed border-gray-100 rounded-xl flex items-center justify-center gap-2 text-[#565959] font-bold text-[13px] hover:bg-gray-50 transition-colors"
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
          Confirmar
        </button>
      </div>

      {/* Fullscreen Confirmation Modal - Compacted */}
      {showPinModal && (
        <div className="fixed inset-0 z-[9999] bg-white/60 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-[32px] shadow-2xl border border-gray-50 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-300">
            {/* Simple Top Bar */}
            <div className="flex items-center justify-between px-6 pt-6 pb-2">
              <span className="text-[14px] font-black uppercase tracking-[0.1em] text-gray-400">Verificação</span>
              <button onClick={() => setShowPinModal(false)} className="size-8 rounded-full bg-gray-50 flex items-center justify-center active:scale-90 transition-all">
                <span className="material-symbols-outlined text-[18px] text-gray-400">close</span>
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Compact Details Grid */}
              <div className="bg-[#F8FAF8] rounded-2xl p-5 space-y-3 border border-gray-50/50">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Banco</span>
                  <span className="text-[13px] font-bold text-[#111]">{bankAccount?.nome_banco}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">IBAN</span>
                  <span className="text-[12px] font-mono font-medium text-[#111]">{maskIban(bankAccount?.iban)}</span>
                </div>

                <div className="flex justify-between items-center pt-1">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Solicitado</span>
                  <span className="text-[15px] font-black text-[#111]">Kz {parseFloat(amount).toLocaleString('pt-AO')}</span>
                </div>

                <div className="flex justify-between items-center text-[#00C853] bg-white rounded-xl p-3 shadow-sm border border-gray-50">
                  <span className="text-[11px] font-black uppercase tracking-wider">Líquido</span>
                  <span className="text-[20px] font-black">Kz {calculateLiquid().toLocaleString('pt-AO')}</span>
                </div>
              </div>

              {/* Minimal PIN Input */}
              <div className="space-y-4 pt-2">
                <div className="text-center">
                  <p className="text-[13px] font-bold text-[#111]">Senha de Retirada</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">4 Dígitos Obrigatórios</p>
                </div>

                <div className="flex justify-center">
                  <div className="bg-gray-50 rounded-2xl h-14 w-full flex items-center px-4 border border-gray-100 focus-within:border-[#00C853] transition-all">
                    <input
                      type="password"
                      maxLength={4}
                      value={pin}
                      onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                      placeholder="••••"
                      className="w-full bg-transparent text-center text-3xl tracking-[16px] font-black outline-none text-black placeholder:text-gray-300"
                      autoFocus
                    />
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={confirmWithdraw}
                disabled={pin.length < 4 || loading}
                className={`w-full h-14 rounded-2xl font-black text-[15px] transition-all flex items-center justify-center gap-2 shadow-xl ${pin.length === 4
                    ? 'bg-[#00C853] text-black shadow-green-500/10 active:scale-95'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                  }`}
              >
                {loading ? <SpokeSpinner size="w-5 h-5" color="text-black" /> : 'Confirmar Saque'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Withdraw;

