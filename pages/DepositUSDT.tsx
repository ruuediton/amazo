import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase';
import { useLoading } from '../contexts/LoadingContext';

interface Props {
  onNavigate: (page: any, data?: any) => void;
  showToast?: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
  data?: any;
}

const DepositUSDT: React.FC<Props> = ({ onNavigate, showToast, data }) => {
  const { withLoading } = useLoading();
  const [amount, setAmount] = useState<string>(data?.amount || '');
  const [exchangeRate, setExchangeRate] = useState<number>(0);
  const [isFetching, setIsFetching] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fallback to avoid crashes, but logic requires data
  const walletAddress = data?.bank?.iban || data?.bank?.wallet_address || "Endereço indisponível";
  const recipientName = data?.bank?.nome_destinatario || "Destinatário desconhecido";

  // FunÃ§Ã£o para buscar taxa em tempo real
  const fetchRate = useCallback(async (background = false) => {
    const action = async () => {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();

      if (data && data.rates && data.rates.AOA) {
        const rate = data.rates.AOA;
        setExchangeRate(rate);
        setLastUpdate(new Date());
      } else {
        throw new Error("Taxa não disponível");
      }
    };

    if (background) {
      setIsFetching(true);
      try {
        await action();
      } catch (err) {
        // Silencioso em background
      } finally {
        setIsFetching(false);
      }
    } else {
      await withLoading(action);
    }
  }, [withLoading]);


  // Busca inicial e efeito ao digitar
  useEffect(() => {
    fetchRate(false); // Carregamento inicial com spinner
    // Atualiza a cada 2 minutos se o usuário estiver na página (background)
    const interval = setInterval(() => fetchRate(true), 120000);
    return () => clearInterval(interval);
  }, [fetchRate]);


  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    showToast?.('Endereço copiado!', 'success');
  };

  const kzEquivalent = amount && exchangeRate
    ? (parseFloat(amount) * exchangeRate).toLocaleString('pt-AO', { minimumFractionDigits: 2 })
    : '0,00';

  const handleConfirm = async () => {
    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount < 4) {
      showToast?.("Recarga mínima 4 USDT.", "warning");
      return;
    }

    // UX Validation only
    if (numAmount > 1090) {
      showToast?.("Recarga máxima 1090 USDT.", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      await withLoading(async () => {
        // ValidaÃ§Ã£o de SessÃ£o
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          onNavigate('login');
          throw new Error("Sessão expirada.");
        }

        // RPC Seguro: Valida limites, duplicidade e registra transação
        const { data, error } = await supabase.rpc('create_usdt_deposit', {
          p_amount_usdt: numAmount,
          p_exchange_rate: exchangeRate
        });

        if (error) {
          throw new Error("Erro de conexão com servidor.");
        }

        if (data && !data.success) {
          throw new Error(data.message || "Falha ao criar depósito.");
        }

        // Sucesso
        return data.message;
      }, 'Solicitação criada com sucesso!');

      onNavigate('home');
    } catch (error: any) {
      // Erro tratado pelo withLoading
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white font-sans text-black antialiased min-h-screen flex flex-col pb-32">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between bg-white/95 p-4 pb-2 border-b border-gray-100">
        <button
          onClick={() => onNavigate('profile')}
          className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-50 transition-colors"
        >
          <span className="material-symbols-outlined text-[#00C853] text-[24px]">arrow_back</span>
        </button>
        <h2 className="text-black text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">Recarregar USDT</h2>
      </header>

      <main className="flex-1 overflow-y-auto px-5 pt-6 no-scrollbar">
        {/* Intro */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="size-16 bg-[#26a17b]/10 rounded-full flex items-center justify-center mb-4 ring-2 ring-[#26a17b]/20">
            <span className="material-symbols-outlined text-[#26a17b]" style={{ fontSize: '32px', fontVariationSettings: "'FILL' 1" }}>currency_bitcoin</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight mb-2 text-black">Depósito Cripto</h1>
          <p className="text-text-secondary text-sm leading-relaxed max-w-[280px]">
            Recarregue sua conta usando USDT na rede <span className="text-black font-bold">TRON (TRC20)</span>.
          </p>
        </div>

        {/* Amount Input Section */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-6 border border-gray-100">
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Quantia (USDT)</label>
            <div className="bg-white rounded-xl h-16 flex items-center px-5 gap-3 relative border border-gray-200 focus-within:border-[#00C853] transition-colors shadow-sm">
              <span className="material-symbols-outlined text-[#00C853] text-[28px]">currency_bitcoin</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Mínimo 4 USDT"
                className="bg-transparent flex-1 h-full outline-none text-[#111] font-black text-2xl placeholder:text-gray-300"
              />
              <span className="text-sm font-bold text-[#26a17b]">USDT</span>
            </div>
            <div className="flex justify-between items-center px-1">
              <p className="text-[11px] text-gray-500 font-medium">Equivalente em Kz (Moeda de Destino)</p>
              <div className="flex flex-col items-end">
                <p className="text-sm font-black text-[#00C853]">≈ Kz {kzEquivalent}</p>
                {isFetching && <span className="text-[9px] text-gray-400 animate-pulse">Atualizando taxa...</span>}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-[#26a17b]/5 border border-[#26a17b]/10 flex flex-col items-center gap-1">
              <p className="text-[10px] text-[#26a17b] font-black uppercase tracking-widest">
                TAXA DE CÂMBIO: 1 USDT = {exchangeRate > 0 ? exchangeRate.toFixed(2) : '---'} Kz
              </p>
              {lastUpdate && (
                <p className="text-[8px] text-text-secondary/60">
                  Atualizado em: {lastUpdate.toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Payment Details Section */}
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
          <h3 className="text-xs font-bold text-gray-800 uppercase tracking-widest mb-6 text-center">Dados para Transferência</h3>

          {/* Recipient Name */}
          <div className="flex flex-col gap-1 mb-4 text-center">
            <label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">Destinatário</label>
            <p className="text-black font-bold text-sm tracking-wide">{recipientName}</p>
          </div>

          {/* QR Code Placeholder */}
          <div className="flex justify-center mb-8">
            <div className="p-3 bg-white rounded-2xl relative group">
              <div className="size-48 bg-gray-100 flex items-center justify-center overflow-hidden rounded-xl border border-gray-200">
                {/* Replying with a real-looking QR from a public URL for aesthetics */}
                <img loading="lazy" decoding="async"
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${walletAddress}`}
                  alt="USDT TRC20 QR Code"
                  className="size-full object-cover contrast-[1.05] brightness-[1.02] saturate-[1.05]"
                />
              </div>
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined text-black font-black">zoom_in</span>
              </div>
            </div>
          </div>

          {/* Wallet Address */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest text-center">Endereço da Carteira (TRC20)</label>
            <div className="flex items-center gap-2 bg-background-dark p-3 rounded-xl border border-brand-border">
              <p className="flex-1 text-[13px] font-mono font-bold text-text-primary truncate text-center select-all">{walletAddress}</p>
              <button
                onClick={handleCopy}
                className="size-10 bg-primary rounded-lg flex items-center justify-center text-text-primary active:scale-90 transition-transform"
              >
                <span className="material-symbols-outlined text-[20px]">content_copy</span>
              </button>
            </div>
          </div>
        </div>

        {/* Warning Card */}
        <div className="mt-6 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
          <div className="flex gap-3">
            <span className="material-symbols-outlined text-orange-500">warning</span>
            <div className="flex flex-col">
              <p className="text-black text-xs font-bold uppercase tracking-tight">Aviso Importante</p>
              <p className="text-gray-900/80 text-[11px] leading-relaxed mt-1">
                Envie apenas <span className="font-bold text-black underline">USDT via rede TRC20</span>. O envio para outras redes ou moedas resultará na perda definitiva dos fundos.
              </p>
            </div>
          </div>
        </div>

        <div className="h-10"></div>
      </main>

      {/* Footer Confirm */}
      <footer className="fixed bottom-0 max-w-md w-full p-4 bg-white/95 border-t border-gray-100 z-50">
        <button
          onClick={handleConfirm}
          disabled={isSubmitting || isFetching}
          className={`w-full h-14 bg-[#00C853] text-white font-bold rounded-xl text-[16px] active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${isSubmitting || isFetching ? 'opacity-50 grayscale' : 'shadow-lg shadow-green-200'}`}
        >
          <span>Confirmar Depósito</span>
          <span className="material-symbols-outlined font-bold text-[20px]">send_money</span>
        </button>
      </footer>
    </div>
  );
};

export default DepositUSDT;

