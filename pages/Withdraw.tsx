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

    if (val < 300) { // Exemplo de mínimo
      showToast?.("Valor mínimo 300 Kz.", "warning");
      return;
    }

    if (val > balance) {
      showToast?.("balance insuficiente.", "error");
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

        showToast?.("Retirada sucedida!", "success");
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
        <span className="font-bold text-[16px]">Retirar Kwanza</span>
        <button
          onClick={() => onNavigate('withdrawal-history')}
          className="size-10 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors"
        >
          <span className="material-symbols-outlined text-[#0F1111]">history</span>
        </button>
      </header>

      <main className="p-5 space-y-6">
        {/* Balance Card - BP Style */}
        <div className="bg-[#00C853] rounded-xl p-6 border border-[#00C853] shadow-sm relative overflow-hidden">
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
              className="w-full h-14 pl-12 pr-4 bg-white border border-[#D5D9D9] rounded-xl text-xl font-bold focus:border-[#E77600] focus:ring-1 focus:ring-[#E77600] outline-none transition-all placeholder:text-gray-300"
            />
          </div>
          {/* Fee Info - Flat */}
          {amount && !isNaN(parseFloat(amount)) && (
            <div className="flex justify-between items-center text-[11px] bg-gray-50 p-2 rounded-lg border border-gray-100">
              <span className="text-gray-500">Taxa (12%): <span className="font-bold text-red-500">- Kz {calculateFee().toLocaleString()}</span></span>
              <span className="font-bold text-green-600">Receberá: Kz {calculateLiquid().toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Quick Amounts */}
        <div className="grid grid-cols-4 gap-2">
          {[2000, 5000, 10000, 20000].map(val => (
            <button
              key={val}
              onClick={() => handleQuickAmount(val)}
              className="py-2.5 bg-white border border-[#D5D9D9] rounded-lg text-[12px] font-bold text-[#0F1111] hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
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
            <div className="flex items-center gap-4 p-4 border border-[#D5D9D9] rounded-xl bg-white shadow-sm">
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
          className="w-full bg-[#00C853] text-[#0F1111] border border-[#00C853] font-bold text-[15px] py-3.5 rounded-xl shadow-sm active:scale-[0.98] hover:bg-[#00C853] transition-all flex items-center justify-center"
        >
          Solicitar Saque
        </button>
      </div>

      {/* Pin Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-[24px] p-6 shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
            <div className="text-center mb-6">
              <span className="size-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <span className="material-symbols-outlined text-[#0F1111]">lock</span>
              </span>
              <h3 className="text-lg font-bold text-[#0F1111]">Confirme com seu PIN</h3>
              <p className="text-xs text-gray-500 mt-1">Digite sua senha de retirada para confirmar</p>
            </div>

            <input
              type="password"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              placeholder="••••"
              className="w-full h-14 text-center text-3xl tracking-[8px] font-bold border border-[#D5D9D9] rounded-xl focus:border-[#E77600] outline-none mb-6"
              autoFocus
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowPinModal(false)}
                className="flex-1 py-3 border border-[#D5D9D9] rounded-lg font-bold text-[#0F1111] hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={confirmWithdraw}
                disabled={pin.length < 4}
                className="flex-1 py-3 bg-[#00C853] border border-[#00C853] rounded-lg font-normal text-[#0F1111] disabled:opacity-50"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Withdraw;

