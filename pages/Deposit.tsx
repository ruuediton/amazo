
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useLoading } from '../contexts/LoadingContext';
import SpokeSpinner from '../components/SpokeSpinner';


interface DepositProps {
  onNavigate: (page: any, data?: any) => void;
  showToast?: (message: string, type: any) => void;
}

const Deposit: React.FC<DepositProps> = ({ onNavigate, showToast }) => {
  const [amount, setAmount] = useState<string>('');
  const { withLoading } = useLoading();
  const [banks, setBanks] = useState<any[]>([]);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [method, setMethod] = useState<'bank' | 'usdt'>('bank');

  const [recentDeposits, setRecentDeposits] = useState<any[]>([]);

  useEffect(() => {
    const init = async () => {
      await withLoading(async () => {
        await Promise.all([fetchBanks(), fetchRecentDeposits()]);
      });
    };
    init();
  }, []);

  const fetchRecentDeposits = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('depositos_clientes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(3);
    if (data) setRecentDeposits(data);
  };

  const statusMap: any = {
    'completado': { label: 'Concluído', color: 'text-green-600', bg: 'bg-green-500/20', icon: 'check_circle' },
    'processando...': { label: 'Pendente', color: 'text-primary', bg: 'bg-primary/20', icon: 'schedule' },
    'rejeitado': { label: 'Rejeitado', color: 'text-red-400', bg: 'bg-red-500/20', icon: 'error' }
  };

  const fetchBanks = async () => {
    const { data, error } = await supabase.from('bancos_empresa').select('*').eq('ativo', true);
    if (!error && data) setBanks(data);
  };

  const quickAmounts = [3000, 9000, 24000, 49000, 120000, 150000, 400000];

  const handleQuickAmount = (val: number) => {
    setAmount(val.toString());
  };

  const handleConfirmClick = () => {
    if (method === 'usdt') {
      const usdtBank = banks.find(b => b.nome_do_banco === 'USDT' || b.nome_do_banco === 'USTD');

      if (!usdtBank) {
        showToast?.("Carteira USDT indisponível no momento.", "error");
        return;
      }

      onNavigate('deposit-usdt', {
        amount,
        bank: usdtBank
      });
      return;
    }

    const val = parseFloat(amount);
    if (isNaN(val) || val < 3000) {
      showToast?.("Valor mínimo de depósito: 3.000 KZ", "warning");
      return;
    }
    if (val > 1000000) {
      showToast?.("Valor máximo permitido: 1.000.000 KZ", "warning");
      return;
    }
    setIsBankModalOpen(true);
  };

  const handleSelectBank = async (bank: any) => {
    setIsBankModalOpen(false);

    try {
      await withLoading(async () => {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          showToast?.("Sessão expirada. Faça login novamente.", "error");
          onNavigate('login');
          return;
        }

        const { data, error } = await supabase.rpc('create_deposit_request', {
          p_amount: parseFloat(amount),
          p_bank_name: bank.nome_do_banco,
          p_iban: bank.iban
        });

        if (error) throw error;

        if (data.success) {
          onNavigate('confirme', { deposit: data.data });
        }
      }, "Depósito criado com sucesso. Efetue a transferência e envie o comprovativo.");
    } catch (err) {
      // Error handled by withLoading
    }
  };

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col bg-background-dark group/design-root overflow-x-hidden font-display text-black pb-32">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-2 sticky top-0 z-10 bg-background-dark">
        <button
          onClick={() => onNavigate('profile')}
          className="text-primary flex size-12 shrink-0 items-center justify-center cursor-pointer rounded-full hover:bg-white/10 transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-black text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pl-12">Depósito</h2>
        <button
          onClick={() => onNavigate('deposit-history')}
          className="text-gray-400 flex size-12 shrink-0 items-center justify-center cursor-pointer rounded-full hover:bg-white/10 transition-colors"
        >
          <span className="material-symbols-outlined">history</span>
        </button>
      </div>

      <div className="flex flex-col flex-1 px-4 mt-2">
        {/* Amount Input Section */}
        <div className="flex flex-col items-center justify-center py-6">
          <p className="text-[text-gray-500] text-sm font-medium leading-normal mb-2">Inserir Quantia</p>
          <div className="relative flex items-center justify-center w-full max-w-[320px]">
            <span className="text-3xl font-bold text-black absolute left-2 pointer-events-none">Kz</span>
            <input
              autoFocus
              className="flex w-full bg-transparent text-center text-5xl font-bold text-black placeholder:text-black/10 focus:outline-none border-none p-0 h-16 caret-primary pl-10"
              placeholder="0"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <p className="text-[text-gray-500] text-xs font-medium mt-3">Min: 3.000 Kz - Max: 1.000.000 Kz</p>
        </div>

        {/* Quick Amount Buttons */}
        <div className="flex gap-3 py-4 justify-center flex-wrap">
          {quickAmounts.map(val => (
            <button
              key={val}
              onClick={() => handleQuickAmount(val)}
              className="flex h-9 items-center justify-center rounded-full bg-amazon-light-gray px-4 hover:bg-gray-200 transition-colors cursor-pointer border border-amazon-border focus:border-primary"
            >
              <p className="text-[text-black] text-sm font-bold leading-normal">+{val.toLocaleString()}</p>
            </button>
          ))}
          <button
            onClick={() => setAmount('1000000')}
            className="flex h-9 items-center justify-center rounded-full bg-amazon-light-gray px-4 hover:bg-gray-200 transition-colors cursor-pointer border border-amazon-border focus:border-primary"
          >
            <p className="text-[text-black] text-sm font-bold leading-normal">Máx</p>
          </button>
        </div>

        <div className="h-6"></div>

        {/* Payment Methods */}
        <div className="flex flex-col gap-3">
          <p className="text-text-primary text-base font-black leading-normal mb-1">Método de Depósito</p>

          {/* Bank Transfer */}
          <div
            onClick={() => setMethod('bank')}
            className={`flex items-center gap-4 bg-surface-dark p-4 rounded-xl border-2 transition-all cursor-pointer relative overflow-hidden ${method === 'bank' ? 'border-primary shadow-md' : 'border-amazon-border opacity-70'}`}
          >
            {method === 'bank' && (
              <div className="absolute top-0 right-0 p-2 text-primary">
                <span className="material-symbols-outlined filled text-[20px]">check_circle</span>
              </div>
            )}
            <div className="flex items-center gap-4 flex-1">
              <div className={`flex items-center justify-center h-10 w-14 shrink-0 rounded-lg ${method === 'bank' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-background-dark text-text-secondary border border-amazon-border'}`}>
                <span className="material-symbols-outlined text-2xl">account_balance</span>
              </div>
              <div className="flex flex-col">
                <p className="text-text-primary text-sm font-black leading-tight">Transferência Bancária</p>
                <p className="text-text-secondary text-[11px] leading-tight">Envio de Kz via MultiCaixa</p>
              </div>
            </div>
          </div>

          {/* USDT Crypto */}
          <div
            onClick={() => setMethod('usdt')}
            className={`flex items-center gap-4 bg-surface-dark p-4 rounded-xl border-2 transition-all cursor-pointer relative overflow-hidden ${method === 'usdt' ? 'border-[#26a17b] shadow-md' : 'border-amazon-border opacity-70'}`}
          >
            {method === 'usdt' && (
              <div className="absolute top-0 right-0 p-2 text-[#26a17b]">
                <span className="material-symbols-outlined filled text-[20px]">check_circle</span>
              </div>
            )}
            <div className="flex items-center gap-4 flex-1">
              <div className={`flex items-center justify-center h-10 w-14 shrink-0 rounded-lg ${method === 'usdt' ? 'bg-[#26a17b]/10 text-[#26a17b] border border-[#26a17b]/20' : 'bg-background-dark text-text-secondary border border-amazon-border'}`}>
                <span className="material-symbols-outlined text-2xl">currency_bitcoin</span>
              </div>
              <div className="flex flex-col">
                <p className="text-text-primary text-sm font-black leading-tight">Recarregar USDT (TRC20)</p>
                <p className="text-[#26a17b] text-[11px] font-bold leading-tight">Depósito Cripto Instantâneo</p>
              </div>
            </div>
          </div>
        </div>

        <div className="h-8"></div>

        {/* Confirm Button */}
        <button
          onClick={handleConfirmClick}
          className={`flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 bg-primary hover:bg-[#eac515] text-[text-black] text-sm font-black leading-normal tracking-[0.015em] transition-all active:scale-[0.98] shadow-lg shadow-primary/20`}
        >
          Confirmar Depósito
        </button>

        <div className="flex justify-center items-center gap-2 mt-3 text-[text-gray-500]">
          <span className="material-symbols-outlined text-sm" style={{ fontSize: '16px' }}>lock</span>
          <p className="text-xs font-medium">Transação segura criptografada de 256 bits</p>
        </div>
      </div>

      {/* Bank Selection Modal */}
      {isBankModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-surface-dark rounded-t-3xl p-6 animate-in slide-in-from-bottom-full duration-300 shadow-2xl border-t border-white/10 pb-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Escolha um Banco</h3>
              <button
                onClick={() => setIsBankModalOpen(false)}
                className="size-10 flex items-center justify-center rounded-full bg-white/5 text-black/60"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {banks.map(bank => (
                <button
                  key={bank.id}
                  onClick={() => handleSelectBank(bank)}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-gray-200 hover:border-primary/50 hover:bg-primary/5 transition-all text-left"
                >
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">account_balance</span>
                  </div>
                  <div>
                    <p className="font-bold text-black">{bank.nome_do_banco}</p>
                    <p className="text-xs text-gray-600">Clique para selecionar</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Deposit;
