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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch only banks for transfer
      const { data, error } = await supabase
        .from('bancos_empresa')
        .select('*')
        .eq('ativo', true);

      if (!error && data) {
        // Filtramos qualquer banco que possa ser USDT, pois agora tem página própria
        const filteredBanks = data.filter(b =>
          !b.nome_do_banco.toUpperCase().includes('USDT') &&
          !b.nome_do_banco.toUpperCase().includes('USTD')
        );
        setBanks(filteredBanks);
      }
    } catch (err) {
      console.error('Erro ao carregar bancos:', err);
    } finally {
      setLoading(false);
    }
  };

  const quickAmounts = [3000, 9000, 24000, 49000, 120000, 150000, 400000];

  const handleQuickAmount = (val: number) => {
    setAmount(val.toString());
  };

  const handleConfirmClick = () => {
    const val = parseFloat(amount);
    if (!amount || isNaN(val) || val < 3000) {
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
          onNavigate('confirmar-deposito', {
            deposit: {
              ...data.data,
              nome_destinatario: bank.nome_destinatario,
              nome_banco: bank.nome_do_banco
            }
          });
        }
      }, "Gerando dados de depósito...");
    } catch (err: any) {
      showToast?.(err.message || "Erro ao processar depósito", "error");
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-white">
      <SpokeSpinner size="w-8 h-8" color="text-[#FFD814]" />
    </div>
  );

  return (
    <div className="bg-white min-h-screen font-sans text-[#0F1111] pb-20 selection:bg-amber-100">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <button onClick={() => onNavigate('profile')} className="size-10 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <span className="font-bold text-[16px]">Depositar Kwanza</span>
        <button
          onClick={() => onNavigate('deposit-history')}
          className="size-10 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors"
        >
          <span className="material-symbols-outlined text-[#0F1111]">history</span>
        </button>
      </header>

      <main className="p-5 space-y-8">
        {/* Input Section */}
        <div className="text-center space-y-4">
          <p className="text-[13px] font-bold text-gray-500 uppercase tracking-widest">Quanto deseja depositar?</p>
          <div className="relative inline-block w-full">
            <span className="absolute left-1/2 -translate-x-[110px] top-1/2 -translate-y-1/2 text-3xl font-extrabold text-gray-300">Kz</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full bg-transparent text-center text-6xl font-black text-[#0F1111] outline-none placeholder:text-gray-100"
              autoFocus
            />
          </div>
          <p className="text-[11px] font-medium text-gray-400">Min: 3.000 Kz • Max: 1.000.000 Kz</p>
        </div>

        {/* Quick Chip Selection */}
        <div className="flex flex-wrap gap-2 justify-center">
          {quickAmounts.map(val => (
            <button
              key={val}
              onClick={() => handleQuickAmount(val)}
              className="px-5 py-2.5 bg-white border border-[#D5D9D9] rounded-full text-[13px] font-bold text-[#0F1111] hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
            >
              + {val.toLocaleString('pt-AO')}
            </button>
          ))}
        </div>

        {/* Method Info Card */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex gap-4">
          <div className="size-12 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-sm shrink-0">
            <span className="material-symbols-outlined text-[28px]">account_balance</span>
          </div>
          <div>
            <p className="text-[14px] font-bold text-blue-900">Transferência Bancária</p>
            <p className="text-[12px] text-blue-700/80 leading-snug">Ao confirmar, você escolherá um banco para realizar a transferência via MultiCaixa ou SmartApp.</p>
          </div>
        </div>

      </main>

      {/* Action Footer */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md p-4 px-8 bg-white border-t border-gray-100 pb-8 z-20">
        <button
          onClick={handleConfirmClick}
          disabled={!amount || parseFloat(amount) < 3000}
          className="w-full bg-[#FFD814] text-[#0F1111] border border-[#FCD200] font-bold text-[15px] py-3.5 rounded-xl shadow-sm active:scale-[0.98] hover:bg-[#F7CA00] transition-all flex items-center justify-center disabled:opacity-50 disabled:grayscale"
        >
          Prosseguir para Pagamento
        </button>
        <div className="flex items-center justify-center gap-1.5 mt-3 opacity-50">
          <span className="material-symbols-outlined text-[14px]">lock</span>
          <p className="text-[10px] font-bold uppercase tracking-tighter">Ambiente de segurança Amazon</p>
        </div>
      </div>

      {/* Bank Selection Modal */}
      {isBankModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-[24px] p-6 shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[#0F1111]">Selecione o Destino</h3>
              <button
                onClick={() => setIsBankModalOpen(false)}
                className="size-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-3">
              {banks.map(bank => (
                <button
                  key={bank.id}
                  onClick={() => handleSelectBank(bank)}
                  className="w-full flex items-center gap-4 p-4 border border-[#D5D9D9] rounded-xl hover:border-[#E77600] active:bg-gray-50 transition-all text-left"
                >
                  <div className="size-10 rounded-lg bg-gray-50 flex items-center justify-center text-[#565959]">
                    <span className="material-symbols-outlined">account_balance</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-[14px] font-bold text-[#0F1111] leading-none mb-1">{bank.nome_do_banco}</p>
                    <p className="text-[11px] text-gray-500">{bank.nome_destinatario}</p>
                  </div>
                  <span className="material-symbols-outlined text-gray-300">chevron_right</span>
                </button>
              ))}
            </div>

            <p className="mt-6 text-[10px] text-center text-gray-400 font-medium">
              Sua solicitação será gerada imediatamente após a seleção.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Deposit;
