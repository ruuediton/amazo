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

      showToast?.("Depósito cancelado e removido.", "info");
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
        <header className="sticky top-0 z-10 bg-white border-b border-gray-100 flex items-center justify-between p-4 py-3">
          <button
            onClick={() => onNavigate('deposit')}
            className="flex size-10 items-center justify-center rounded-full hover:bg-gray-50 transition-colors"
          >
            <span className="material-symbols-outlined text-[#0F1111]">arrow_back</span>
          </button>
          <h2 className="text-[16px] font-bold">Confirmar Depósito</h2>
          <div className="size-10"></div>
        </header>

        {/* Main Content */}
        <main className="p-5 flex-1 space-y-8 animate-in fade-in duration-500">

          {/* Timer Section */}
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Aguardando Pagamento</p>
            <div className="flex items-center gap-3 bg-red-50 px-6 py-2 rounded-full border border-red-100">
              <span className="material-symbols-outlined text-red-500 text-[20px] animate-pulse">timer</span>
              <span className="text-2xl font-black text-red-600 tabular-nums">{timeLeft}</span>
            </div>
            <p className="text-[11px] text-gray-400">Sua solicitação expira automaticamente após 30 min.</p>
          </div>

          {/* Amount Box */}
          <div className="bg-[#FFD814] rounded-2xl p-6 border border-[#FCD200] shadow-sm relative overflow-hidden">
            <div className="absolute right-[-20px] top-[-20px] opacity-10">
              <span className="material-symbols-outlined text-[100px]">payments</span>
            </div>
            <p className="text-[12px] font-bold uppercase tracking-widest text-[#0F1111]/70 mb-1">Valor a transferir</p>
            <h1 className="text-4xl font-extrabold text-[#0F1111]">
              Kz {(Number(deposit.valor_deposito) || 0).toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
            </h1>
          </div>

          {/* Bank Details Card */}
          <div className="bg-gray-50 border border-gray-200 rounded-3xl p-5 space-y-6">

            {/* Beneficiary */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Beneficiário</span>
              <div className="flex justify-between items-center bg-white border border-gray-100 p-3 rounded-xl shadow-sm">
                <p className="text-[14px] font-bold text-[#0F1111] truncate pr-2 uppercase">
                  {deposit.nome_destinatario || deposit.beneficiario || "N/A"}
                </p>
                <button
                  onClick={() => handleCopy(deposit.nome_destinatario || deposit.beneficiario || "", "Nome")}
                  className="size-8 flex items-center justify-center bg-blue-50 text-blue-600 rounded-lg active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">content_copy</span>
                </button>
              </div>
            </div>

            {/* Bank Name */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Banco de Destino</span>
              <div className="flex justify-between items-center bg-white border border-gray-100 p-3 rounded-xl shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-gray-50 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px] text-gray-400">account_balance</span>
                  </div>
                  <p className="text-[14px] font-bold text-[#0F1111] uppercase">
                    {deposit.nome_banco || deposit.nome_do_banco || "N/A"}
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(deposit.nome_banco || deposit.nome_do_banco || "", "Banco")}
                  className="size-8 flex items-center justify-center bg-blue-50 text-blue-600 rounded-lg active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">content_copy</span>
                </button>
              </div>
            </div>

            {/* IBAN */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">IBAN para Transferência</span>
              <div className="flex justify-between items-start bg-white border border-gray-100 p-3 rounded-xl shadow-sm gap-3">
                <p className="text-[13px] font-mono font-bold text-[#0F1111] break-all leading-relaxed leading-snug">
                  {deposit.iban}
                </p>
                <button
                  onClick={() => handleCopy(deposit.iban, "IBAN")}
                  className="size-8 shrink-0 flex items-center justify-center bg-blue-50 text-blue-600 rounded-lg active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">content_copy</span>
                </button>
              </div>
            </div>
          </div>

          {/* Security Alert */}
          <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex gap-3">
            <span className="material-symbols-outlined text-amber-500 text-[20px]">info</span>
            <p className="text-[11px] text-amber-800 font-medium leading-normal">
              Faça a transferência do valor **EXATO** mostrado acima. Após concluir no seu banco, guarde o comprovativo e clique no botão abaixo para concluir.
            </p>
          </div>

          <div className="text-center pt-2">
            <button
              disabled={loading}
              onClick={handleCancelDeposit}
              className="text-[12px] font-bold text-red-500 hover:underline active:opacity-60 transition-all uppercase tracking-widest px-4 py-2"
            >
              {loading ? 'Cancelando...' : 'Cancelar esta Solicitação'}
            </button>
          </div>

        </main>

        {/* Footer Actions */}
        <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white p-4 px-8 border-t border-gray-100 pb-10">
          <button
            disabled={isExpired}
            onClick={() => onNavigate('como-enviar-comprovante')}
            className={`w-full flex items-center justify-center gap-3 rounded-xl h-14 bg-[#FFD814] border border-[#FCD200] hover:bg-[#F7CA00] active:scale-[0.98] transition-all text-[#0F1111] text-base font-bold shadow-lg shadow-[#FFD814]/20 ${isExpired ? 'opacity-30 grayscale cursor-not-allowed' : ''}`}
          >
            <span className="material-symbols-outlined">description</span>
            <span>Já Transferi, Enviar Comprovante</span>
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ConfirmDeposit;
