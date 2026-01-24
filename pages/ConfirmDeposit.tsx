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
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white border-b border-gray-100 flex items-center justify-between p-4 py-3 px-6">
          <button
            onClick={() => onNavigate('deposit')}
            className="flex size-10 items-center justify-center rounded-full hover:bg-gray-50 transition-colors"
          >
            <span className="material-symbols-outlined text-[#0F1111] text-[24px]">arrow_back</span>
          </button>
          <span className="text-[16px] font-bold">Confirmar Depósito</span>
          <button
            onClick={() => onNavigate('deposit-history')}
            className="flex size-10 items-center justify-center rounded-full hover:bg-gray-50 transition-colors"
          >
            <span className="material-symbols-outlined text-[#0F1111] text-[24px]">history</span>
          </button>
        </header>

        <main className="p-6 space-y-6 animate-in fade-in duration-500">

          {/* Main Card Style for Amount (Matching image layout) */}
          <div className="bg-[#FFD814] rounded-[24px] p-8 border border-[#FCD200] shadow-sm relative overflow-hidden">
            <div className="absolute right-[-20px] top-[-20px] opacity-10">
              <span className="material-symbols-outlined text-[120px]">account_balance_wallet</span>
            </div>
            <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#0F1111]/60 mb-1">VALOR A DEPOSITAR</p>
            <h1 className="text-4xl font-black text-[#0F1111]">
              Kz {(Number(deposit.valor_deposito) || 0).toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
            </h1>
          </div>

          {/* Destination Account Card (Matching image style) */}
          <div className="space-y-3">
            <div className="flex justify-between items-center px-1">
              <span className="text-[13px] font-bold text-[#0F1111]">Conta de Destino</span>
              <button onClick={() => onNavigate('deposit')} className="text-[12px] font-bold text-[#007185]">Alterar</button>
            </div>

            <div className="bg-white border border-[#D5D9D9] rounded-[16px] p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-4">
                <div className="size-11 rounded-xl bg-gray-50 flex items-center justify-center text-[#565959] border border-gray-100">
                  <span className="material-symbols-outlined">account_balance</span>
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-[15px] font-bold text-[#0F1111] truncate uppercase">{deposit.nome_banco || deposit.nome_do_banco || "Seleção Padrão"}</p>
                  <p className="text-[11px] text-[#565959] font-mono truncate">{deposit.iban}</p>
                </div>
                <span className="material-symbols-outlined text-green-600">check_circle</span>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-between items-center bg-gray-50/50 -mx-5 px-5 py-3 rounded-b-[16px]">
                <div className="flex-1 overflow-hidden mr-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Titular</p>
                  <p className="text-[12px] font-bold text-[#0F1111] truncate uppercase">
                    {deposit.nome_destinatario || deposit.beneficiario || "N/A"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopy(deposit.iban, "IBAN")}
                    className="h-10 px-4 bg-white border border-gray-200 rounded-lg text-[12px] font-bold text-[#0F1111] hover:bg-gray-50 active:scale-95 transition-all shadow-sm flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px]">content_copy</span>
                    Copiar IBAN
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Timer Section (Redesigned to be more integrated) */}
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-red-500 animate-pulse">timer</span>
              <div>
                <p className="text-[10px] font-bold text-red-700/60 uppercase tracking-widest leading-none">Expira em</p>
                <p className="text-xl font-black text-red-600 tabular-nums">{timeLeft}</p>
              </div>
            </div>
            <p className="text-[10px] text-red-700/40 text-right font-medium max-w-[120px] leading-tight">
              Faça o envio antes que a sessão expire.
            </p>
          </div>

          {/* Security Alert */}
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3">
            <span className="material-symbols-outlined text-blue-500 text-[20px]">info</span>
            <p className="text-[11px] text-blue-900 font-medium leading-relaxed">
              Realize a transferência bancária e **guarde o comprovativo**. A verificação é necessária para liberar o saldo.
            </p>
          </div>

          <div className="text-center pt-4">
            <button
              disabled={loading}
              onClick={handleCancelDeposit}
              className="text-[12px] font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest"
            >
              {loading ? 'Processando...' : 'Cancelar Depósito'}
            </button>
          </div>

        </main>

        {/* Footer Action (Matching image style) */}
        <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white p-4 px-8 border-t border-gray-100 pb-10">
          <button
            disabled={isExpired}
            onClick={() => onNavigate('como-enviar-comprovante')}
            className={`w-full flex items-center justify-center gap-3 rounded-[16px] h-14 bg-[#FFD814] border border-[#FCD200] hover:bg-[#F7CA00] active:scale-[0.98] transition-all text-[#0F1111] text-base font-bold shadow-sm ${isExpired ? 'opacity-30 grayscale cursor-not-allowed' : ''}`}
          >
            <span className="material-symbols-outlined">description</span>
            <span>Enviar Comprovante</span>
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ConfirmDeposit;
