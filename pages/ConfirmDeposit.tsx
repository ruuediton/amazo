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

  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (data?.deposit) {
      setDeposit(data.deposit);
      localStorage.setItem('current_deposit_data', JSON.stringify(data.deposit));
    }
  }, [data]);

  const [timeLeft, setTimeLeft] = useState<string>('30:00');
  const [isExpired, setIsExpired] = useState(false);
  const [loading, setLoading] = useState(false);

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
        }
        return false;
      }

      const totalSeconds = Math.max(0, Math.ceil(diffInMs / 1000));
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;

      setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      return true;
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
    if (!text) return;
    navigator.clipboard.writeText(text);
    showToast?.(`${label} copiado!`, "success");
  };


  const handleSubmit = async () => {
    if (!userName) {
      showToast?.("Por favor, insira o seu nome.", "warning");
      return;
    }
    try {
      // Construct WhatsApp Message
      const message = `ID: ${deposit.id}
VALOR: ${(Number(deposit.valor_deposito) || 0).toLocaleString('pt-AO', { minimumFractionDigits: 2 })} Kz
BANCO: ${deposit.nome_banco || deposit.nome_do_banco}
NOME DO PAGADOR: ${userName}`.trim();

      // Redirect to WhatsApp
      const whatsappUrl = `https://wa.me/244933850746?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');

      showToast?.("Redirecionando para o WhatsApp...", "success");
      localStorage.removeItem('current_deposit_data');
      onNavigate('home');

    } catch (err: any) {
      showToast?.("Erro: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  if (!deposit) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white text-[#0F1111] p-6 text-center">
        <h3 className="text-xl font-bold mb-2">Solicitação não encontrada</h3>
        <button onClick={() => onNavigate('deposit')} className="bg-[#FFD814] px-8 py-3 rounded-xl font-bold">Voltar</button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen font-sans text-[#0F1111] pb-20 antialiased">
      <div className="relative flex h-full min-h-screen w-full flex-col max-w-md mx-auto">

        {/* Simple Back Header with Title */}
        <header className="p-4 flex items-center justify-between border-b border-gray-50">
          <button onClick={() => onNavigate('deposit')} className="size-10 flex items-center justify-center rounded-full hover:bg-gray-100">
            <span className="material-symbols-outlined text-[#0F1111]">arrow_back</span>
          </button>
          <span className="text-[16px] font-bold text-[#0F1111]">Detalhes</span>
          <div className="w-10"></div>
        </header>

        <main className="flex-1 space-y-7 px-6 pt-4">

          {/* Amount & Time Badges */}
          <div className="flex items-center justify-center gap-2">
            <div className="px-4 py-1.5 bg-[#00A8E1] text-white text-[11px] font-bold rounded shadow-sm uppercase">Quantia</div>
            <div className="px-4 py-1.5 bg-[#FFD814] text-[#0F1111] text-[11px] font-bold rounded shadow-sm tabular-nums">{timeLeft}</div>
          </div>

          {/* Large Amount */}
          <div className="text-center">
            <h1 className="text-[36px] font-black text-[#E77600] tracking-tight">
              KZ {(Number(deposit.valor_deposito) || 0).toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
            </h1>
          </div>

          {/* Data Fields */}
          <div className="space-y-4">

            {/* Bank Name */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-400 ml-1">Nome do Banco</label>
              <div className="flex gap-2">
                <div className="flex-1 h-[52px] bg-gray-50 border border-gray-100 rounded-lg flex items-center px-4 font-bold text-[#0F1111] text-sm overflow-hidden">
                  {deposit.nome_banco || deposit.nome_do_banco || "N/A"}
                </div>
                <button onClick={() => handleCopy(deposit.nome_banco || deposit.nome_do_banco, "Banco")} className="w-[84px] h-[52px] bg-[#00A8E1] text-white font-bold rounded-lg active:scale-95 transition-all text-[13px]">
                  Cópia
                </button>
              </div>
            </div>

            {/* Account Name */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-400 ml-1">Nome da Conta</label>
              <div className="flex gap-2">
                <div className="flex-1 h-[52px] bg-gray-50 border border-gray-100 rounded-lg flex items-center px-4 font-bold text-[#0F1111] text-sm overflow-hidden whitespace-nowrap">
                  {deposit.nome_destinatario || deposit.beneficiario || "N/A"}
                </div>
                <button onClick={() => handleCopy(deposit.nome_destinatario || deposit.beneficiario, "Nome")} className="w-[84px] h-[52px] bg-[#00A8E1] text-white font-bold rounded-lg active:scale-95 transition-all text-[13px]">
                  Cópia
                </button>
              </div>
            </div>

            {/* Account Number */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-400 ml-1">Número da Conta</label>
              <div className="flex gap-2">
                <div className="flex-1 h-[52px] bg-gray-50 border border-gray-100 rounded-lg flex items-center px-4 font-mono font-bold text-[#0F1111] text-[11px] overflow-hidden">
                  {deposit.iban}
                </div>
                <button onClick={() => handleCopy(deposit.iban, "IBAN")} className="w-[84px] h-[52px] bg-[#00A8E1] text-white font-bold rounded-lg active:scale-95 transition-all text-[13px]">
                  Cópia
                </button>
              </div>
            </div>

            <hr className="border-gray-50" />

            {/* Your Name */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-400 ml-1">Seu Nome</label>
              <input
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full h-[52px] bg-white border border-gray-200 rounded-lg px-4 text-sm font-medium outline-none focus:border-[#00A8E1] transition-colors"
                placeholder="Por favor, insira o seu nome"
                type="text"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">

            <button
              disabled={loading || isExpired}
              onClick={handleSubmit}
              className="w-full h-[52px] bg-[#FFD814] text-[#0F1111] font-bold rounded-lg active:scale-[0.98] transition-all text-[15px] uppercase shadow-md disabled:opacity-50"
            >
              {loading ? 'Processando...' : 'Finalizar Depósito'}
            </button>
          </div>

          {/* Footer Info */}
          <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-5 text-[11px] text-[#565959] leading-relaxed space-y-3">
            <p>Esta encomenda tem validade de <span className="font-bold">30 minutos</span>. Por favor, efetue o pagamento de acordo com as informações da página e o valor fixo. </p>
            <p>Após o pagamento, preencha o nome do pagador o mais rapidamente possível e envie uma captura de tela da confirmação de pagamento.</p>
            <p>Para garantir que os seus fundos são creditados de forma mais rápida e precisa, preencha apenas o seu nome na nota de transferência.</p>
            <p className="font-black text-[#CC0000] bg-red-50 p-2 rounded">Atenção: Esta conta bancária é apenas para um pagamento único!</p>
          </div>

        </main>
      </div>
    </div>
  );
};

export default ConfirmDeposit;
