import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';

interface Props {
  onNavigate: (page: any) => void;
  data?: any;
  showToast?: (message: string, type: any) => void;
}

const ConfirmDeposit: React.FC<Props> = ({ onNavigate, data, showToast }) => {
  const [deposit, setDeposit] = useState<any>(() => {
    if (data?.deposit) return data.deposit;
    const stored = localStorage.getItem('current_deposit_data');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (data?.deposit) {
      setDeposit(data.deposit);
      localStorage.setItem('current_deposit_data', JSON.stringify(data.deposit));
    }
  }, [data]);

  const [timeLeft, setTimeLeft] = useState<string>('30:00');
  const [isExpired, setIsExpired] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCancelDeposit = async () => {
    if (!deposit) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from('depositos_clientes')
        .delete()
        .eq('id', deposit.id)
        .eq('estado_de_pagamento', 'processando...');

      if (error) throw error;

      showToast?.("Depósito cancelado.", "info");
      localStorage.removeItem('current_deposit_data');
      onNavigate('deposit');
    } catch (err: any) {
      showToast?.("Erro ao cancelar: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!deposit) return;

    const calculateTime = () => {
      const createdAt = new Date(deposit.created_at).getTime();
      const thirtyMinutes = 30 * 60 * 1000;
      const expiryTime = createdAt + thirtyMinutes;
      const now = Date.now();
      const diffInMs = expiryTime - now;

      if (diffInMs <= 0) {
        setTimeLeft('00:00');
        if (!isExpired) {
          setIsExpired(true);
          handleAutoReject();
        }
        return false;
      }

      const totalSeconds = Math.max(0, Math.ceil(diffInMs / 1000));
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;

      setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      return true;
    };

    const handleAutoReject = async () => {
      if (deposit.estado_de_pagamento === 'processando...') {
        await supabase
          .from('depositos_clientes')
          .delete()
          .eq('id', deposit.id)
          .eq('estado_de_pagamento', 'processando...');
        localStorage.removeItem('current_deposit_data');
      }
    };

    calculateTime();
    const interval = setInterval(() => {
      if (!calculateTime()) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [deposit]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast?.(`${label} copiado!`, "success");
  };

  if (!deposit) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white text-[#0F1111] p-6 text-center">
        <span className="material-symbols-outlined text-6xl mb-4 text-gray-300">receipt_long</span>
        <h3 className="text-xl font-bold mb-2">Dados não encontrados</h3>
        <p className="text-gray-500 mb-6">Não foi possível carregar os detalhes do depósito.</p>
        <button
          onClick={() => onNavigate('deposit')}
          className="bg-[#FFD814] text-[#0F1111] border border-[#FCD200] px-8 py-3 rounded-xl font-bold"
        >
          Voltar ao Depósito
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen font-sans text-[#0F1111] pb-32 selection:bg-amber-100 antialiased">
      <div className="relative flex h-full min-h-screen w-full flex-col max-w-md mx-auto">
        {/* Header - Identical to Image */}
        <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => onNavigate('deposit')}
            className="size-10 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors"
          >
            <span className="material-symbols-outlined text-[#0F1111]">arrow_back</span>
          </button>
          <span className="font-bold text-[16px]">Confirmar Depósito</span>
          <button
            onClick={() => onNavigate('deposit-history')}
            className="size-10 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors"
          >
            <span className="material-symbols-outlined text-[#0F1111]">history</span>
          </button>
        </header>

        <main className="p-5 space-y-6">

          {/* Balance/Amount Card - Identical to Image */}
          <div className="bg-[#FFD814] rounded-xl p-6 border border-[#FCD200] shadow-sm relative overflow-hidden">
            <div className="absolute right-[-20px] top-[-20px] opacity-10">
              <span className="material-symbols-outlined text-[100px]">account_balance_wallet</span>
            </div>
            <p className="text-[12px] font-bold uppercase tracking-widest text-[#0F1111]/70 mb-1">VALOR A TRANSFERIR</p>
            <h1 className="text-4xl font-extrabold text-[#0F1111]">
              Kz {(Number(deposit.valor_deposito) || 0).toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
            </h1>
          </div>

          {/* Destination Section - Label + Alterar Link */}
          <div>
            <div className="flex justify-between items-center mb-2 px-1">
              <span className="text-[13px] font-bold text-[#0F1111]">Conta de Destino (Empresa)</span>
              <button
                onClick={() => onNavigate('deposit')}
                className="text-[12px] font-bold text-[#007185] hover:underline"
              >
                Alterar
              </button>
            </div>

            {/* Bank Card - Identical to Image */}
            <div className="flex items-center gap-4 p-4 border border-[#D5D9D9] rounded-xl bg-white shadow-sm">
              <div className="size-10 rounded-lg bg-gray-100 flex items-center justify-center text-[#565959]">
                <span className="material-symbols-outlined">account_balance</span>
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-[14px] font-bold text-[#0F1111] truncate uppercase">{deposit.nome_banco || deposit.nome_do_banco || "Banco Selecionado"}</p>
                <p className="text-[11px] text-[#565959] font-mono truncate">{deposit.iban}</p>
              </div>
              <span className="material-symbols-outlined text-green-600">check_circle</span>
            </div>
          </div>

          {/* Details Section - Clean Standard Layout */}
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none">Titular do Beneficiário</p>
                <button
                  onClick={() => handleCopy(deposit.nome_destinatario || deposit.beneficiario || "", "Nome")}
                  className="text-[11px] font-bold text-blue-600 flex items-center gap-1 active:opacity-50"
                >
                  <span className="material-symbols-outlined text-[14px]">content_copy</span> COPIAR
                </button>
              </div>
              <p className="text-[14px] font-bold text-[#0F1111] uppercase tracking-tighter">
                {deposit.nome_destinatario || deposit.beneficiario || "N/A"}
              </p>
            </div>

            <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-red-500 animate-pulse">timer</span>
                <div>
                  <p className="text-[10px] font-bold text-red-700/60 uppercase tracking-widest leading-none">A sessão expira em</p>
                  <p className="text-xl font-black text-red-600 tabular-nums">{timeLeft}</p>
                </div>
              </div>
            </div>

            <div className="bg-sky-50 border border-sky-100 p-4 rounded-xl flex gap-3">
              <span className="material-symbols-outlined text-sky-500 text-[20px]">info</span>
              <p className="text-[11px] text-sky-900 font-medium leading-relaxed">
                Efetue a transferência do valor exato e carregue o comprovativo abaixo para validação imediata.
              </p>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              disabled={loading}
              onClick={handleCancelDeposit}
              className="text-[12px] font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest"
            >
              {loading ? 'Processando...' : 'Cancelar Solicitação'}
            </button>
          </div>

        </main>

        {/* Action Footer - Fixed like image */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md p-4 px-8 bg-white border-t border-gray-100 pb-8">
          <button
            disabled={isExpired}
            onClick={() => onNavigate('como-enviar-comprovante')}
            className={`w-full bg-[#FFD814] text-[#0F1111] border border-[#FCD200] font-bold text-[15px] py-3.5 rounded-xl shadow-sm active:scale-[0.98] hover:bg-[#F7CA00] transition-all flex items-center justify-center ${isExpired ? 'opacity-30 grayscale cursor-not-allowed' : ''}`}
          >
            Enviar Comprovante
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeposit;
