
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

      // Usamos Math.ceil para garantir que se faltarem 29m 59.5s, ele mostre 30:00 no início
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-background-dark text-black p-6 text-center">
        <span className="material-symbols-outlined text-6xl mb-4 text-gray-600">error</span>
        <h3 className="text-xl font-bold mb-2">Dados não encontrados</h3>
        <p className="text-gray-600 mb-6">Não foi possível carregar os detalhes deste depósito.</p>
        <button
          onClick={() => onNavigate('deposit')}
          className="bg-primary text-black px-8 py-3 rounded-xl font-bold"
        >
          Voltar ao Depósito
        </button>
      </div>
    );
  }

  return (
    <div className="bg-background-dark font-display text-black min-h-screen flex flex-col selection:bg-primary selection:text-neutral-dark antialiased">
      <div className="relative flex h-full min-h-screen w-full flex-col max-w-md mx-auto shadow-xl">
        {/* Header */}
        <header className="flex items-center justify-between p-4 pb-2 sticky top-0 z-10 bg-background-dark/80 backdrop-blur-md border-b border-amazon-border">
          <button
            onClick={() => onNavigate('deposit')}
            className="flex size-10 items-center justify-center rounded-full hover:bg-surface-dark transition-colors"
          >
            <span className="material-symbols-outlined text-primary" style={{ fontSize: '24px' }}>arrow_back</span>
          </button>
          <h2 className="text-text-primary text-lg font-bold leading-tight tracking-[-0.015em] text-center">Confirmar Depósito</h2>
          <button className="flex size-10 items-center justify-center rounded-full hover:bg-surface-dark transition-colors">
            <span className="material-symbols-outlined text-text-primary" style={{ fontSize: '24px' }}>more_horiz</span>
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col px-6 pt-6 pb-32 overflow-y-auto no-scrollbar">
          {/* Timer Card */}
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="flex flex-col items-center bg-warning-bg border border-amazon-border rounded-2xl p-6 w-full shadow-sm">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary mb-3 text-center">Tempo restante para depósito</span>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-warning-text text-3xl font-bold">schedule</span>
                <span className="text-4xl font-extrabold tracking-tighter tabular-nums text-text-primary">{timeLeft}</span>
              </div>
            </div>
          </div>

          {/* Amount Section */}
          <div className="flex flex-col items-center justify-center mb-8">
            <p className="text-gray-500 text-sm font-medium mb-1">Valor a depositar</p>
            <h1 className="text-primary tracking-tight text-[40px] font-extrabold leading-tight text-center">
              {(Number(deposit.valor_deposito) || 0).toLocaleString('pt-AO', { minimumFractionDigits: 2 })} Kz
            </h1>
          </div>

          {/* Bank Details Card */}
          <div className="bg-white/5 rounded-2xl p-5 space-y-6 border border-gray-200 shadow-inner">
            {/* Beneficiary */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-text-secondary">
                <span className="material-symbols-outlined text-lg">person</span>
                <p className="text-[10px] font-black uppercase tracking-widest leading-none">Nome do Beneficiário</p>
              </div>
              <div className="flex justify-between items-center mt-1">
                <p className="text-text-primary text-base font-bold uppercase truncate pr-4">{deposit.nome_destinatario || deposit.beneficiario || "N/A"}</p>
                <button
                  onClick={() => handleCopy(deposit.nome_destinatario || deposit.beneficiario || "", "Nome")}
                  className="text-text-primary hover:scale-110 active:scale-95 transition-all bg-primary/10 size-8 flex items-center justify-center rounded-md"
                >
                  <span className="material-symbols-outlined text-lg font-bold">content_copy</span>
                </button>
              </div>
            </div>

            <div className="h-px bg-white/10"></div>

            {/* Target Bank */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-gray-500">
                <span className="material-symbols-outlined text-lg">account_balance</span>
                <p className="text-[10px] font-black uppercase tracking-widest leading-none">Banco Destino</p>
              </div>
              <div className="flex justify-between items-center mt-1">
                <p className="text-black text-base font-bold uppercase">{deposit.nome_banco || deposit.nome_do_banco || "N/A"}</p>
                <button
                  onClick={() => handleCopy(deposit.nome_banco || deposit.nome_do_banco || "", "Banco")}
                  className="text-primary hover:scale-110 active:scale-95 transition-all bg-primary/10 size-8 flex items-center justify-center rounded-md"
                >
                  <span className="material-symbols-outlined text-lg font-bold">content_copy</span>
                </button>
              </div>
            </div>

            <div className="h-px bg-white/10"></div>

            {/* IBAN */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-gray-500">
                <span className="material-symbols-outlined text-lg">numbers</span>
                <p className="text-[10px] font-black uppercase tracking-widest leading-none">IBAN</p>
              </div>
              <div className="flex justify-between items-center mt-1">
                <p className="text-black text-sm font-bold break-all leading-relaxed flex-1 pr-4 select-all">{deposit.iban}</p>
                <button
                  onClick={() => handleCopy(deposit.iban, "IBAN")}
                  className="text-primary hover:scale-110 active:scale-95 transition-all bg-primary/10 size-8 flex items-center justify-center rounded-md"
                >
                  <span className="material-symbols-outlined text-lg font-bold">content_copy</span>
                </button>
              </div>
            </div>
          </div>

          {/* Info Alert */}
          <div className="mt-8">
            <div className="flex items-start gap-4 px-4 py-4 rounded-2xl bg-warning-bg border border-amazon-border">
              <div className="bg-warning-text size-6 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-white text-sm font-bold">info</span>
              </div>
              <p className="text-warning-text text-xs leading-relaxed font-bold">
                Faça a transferência no valor exato e envie o comprovativo para validar o seu depósito no suporte.
              </p>
            </div>
          </div>

          {/* Cancel Action */}
          <div className="mt-6 flex justify-center">
            <button
              disabled={loading}
              onClick={handleCancelDeposit}
              className="text-red-500 text-sm font-bold hover:text-red-400 transition-colors flex items-center gap-2 py-2 px-4 rounded-xl hover:bg-red-500/5 active:scale-95"
            >
              <span className="material-symbols-outlined text-lg">cancel</span>
              {loading ? 'Cancelando...' : 'Cancelar Depósito'}
            </button>
          </div>
        </main>

        {/* Footer Actions */}
        <footer className="fixed bottom-0 w-full max-w-md bg-background-dark/95 p-4 border-t border-gray-200 backdrop-blur-xl pb-6">
          <button
            disabled={isExpired}
            onClick={() => onNavigate('como-enviar-comprovante')}
            className={`w-full flex items-center justify-center gap-3 rounded-xl h-14 px-5 bg-primary overflow-hidden hover:bg-[#eac515] active:scale-[0.98] transition-all text-[#181711] text-base font-black tracking-wide shadow-lg shadow-primary/20 ${isExpired ? 'opacity-30 grayscale cursor-not-allowed' : ''}`}
          >
            <svg className="size-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.747-2.874-2.512-2.96-2.626-.087-.115-.708-.941-.708-1.793 0-.852.449-1.27.608-1.441.159-.171.348-.215.464-.215.116 0 .232.001.333.006.106.005.249-.04.391.302.144.348.491 1.196.535 1.282.043.086.072.187.015.302-.058.115-.087.187-.174.287-.087.1-.183.224-.26.31-.087.086-.177.18-.076.352.101.171.449.741.964 1.201.663.591 1.221.777 1.394.863.174.086.275.072.376-.043.101-.115.434-.503.55-.675.115-.172.231-.144.39-.086.158.058 1.011.477 1.184.563.174.086.289.129.332.201.043.072.043.418-.101.823z"></path>
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.662 1.435 5.176L2 22l4.957-1.301c1.465.778 3.12 1.301 5.043 1.301 5.523 0 10-4.477 10-10S17.523 2 12 2zM4 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8c-1.708 0-3.284-.537-4.577-1.445l-.33-.232-2.316.608.619-2.261-.252-.361C4.596 14.94 4 13.541 4 12z"></path>
            </svg>
            <span className="font-bold">Enviar Comprovante</span>
          </button>
          <div className="flex justify-center mt-3">
            <button
              onClick={() => onNavigate('support')}
              className="text-[11px] font-bold text-gray-600 hover:text-primary transition-colors flex items-center gap-1 uppercase tracking-widest"
            >
              Falar com Suporte <span className="material-symbols-outlined shrink-0" style={{ fontSize: '14px' }}>arrow_forward</span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ConfirmDeposit;

