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
  const [userPhone, setUserPhone] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('phone')
          .eq('id', user.id)
          .single();
        if (profile?.phone) {
          setUserPhone(profile.phone);
        }
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (data?.deposit) {
      setDeposit(data.deposit);
      localStorage.setItem('current_deposit_data', JSON.stringify(data.deposit));
    }
  }, [data]);

  const handleCopy = (text: string, fieldId: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmit = async () => {
    if (!userName) {
      showToast?.("Por favor, digite seu nome", "warning");
      return;
    }
    try {
      const message = `ID: ${userPhone || deposit.id}
VALOR: ${(Number(deposit.valor_deposito) || 0).toLocaleString('pt-AO', { minimumFractionDigits: 2 })} KZs
BANCO: ${deposit.nome_banco || deposit.nome_do_banco}
NOME DO PAGADOR: ${userName}`.trim();

      const whatsappUrl = `https://wa.me/244933850746?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');

      showToast?.("Redirecionando para o WhatsApp...", "success");
      localStorage.removeItem('current_deposit_data');
      onNavigate('home');

    } catch (err: any) {
      showToast?.("Erro: " + err.message, "error");
    }
  };

  if (!deposit) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white text-[#0F1111] p-6 text-center">
        <h3 className="text-xl font-bold mb-2">Solicitação não encontrada</h3>
        <button onClick={() => onNavigate('deposit')} className="bg-[#00C853] px-8 py-3 rounded-lg font-bold text-white">Voltar</button>
      </div>
    );
  }

  const depositDetails = [
    { label: 'Banco', value: deposit.nome_banco || deposit.nome_do_banco, id: 'bank' },
    { label: 'Titular', value: deposit.nome_destinatario || deposit.beneficiario, id: 'owner' },
    { label: 'IBAN / Referência', value: deposit.iban, id: 'iban' },
    { label: 'Valor', value: `${(Number(deposit.valor_deposito) || 0).toLocaleString('pt-AO', { minimumFractionDigits: 2 })} KZs`, id: 'amount', rawValue: deposit.valor_deposito.toString() }
  ];

  return (
    <div className="bg-white min-h-screen font-sans text-[#0F1111] pb-20 antialiased">
      <header className="p-4 border-b border-gray-100 flex items-center">
        <button onClick={() => onNavigate('deposit')} className="mr-4">
          <span className="material-symbols-outlined text-[#0F1111]">arrow_back</span>
        </button>
        <h1 className="text-[16px] font-bold">Detalhes da Recarga</h1>
      </header>

      <main className="p-6 space-y-6">
        <div className="space-y-4">
          {depositDetails.map((field) => (
            <div
              key={field.id}
              className="flex items-center justify-between py-2 border-b border-gray-50 cursor-pointer active:bg-gray-50 transition-colors"
              onClick={() => handleCopy(field.rawValue || field.value, field.id)}
            >
              <div className="flex flex-col">
                <span className="text-[12px] text-gray-500">{field.label}</span>
                <span className="text-[15px] font-medium">{field.value}</span>
              </div>
              <div className="flex items-center gap-2">
                {copiedField === field.id && (
                  <span className="text-[11px] text-[#00C853] font-medium">Copiado</span>
                )}
                <span className="material-symbols-outlined text-gray-400 text-[20px]">content_copy</span>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 space-y-4">
          <div className="space-y-1">
            <label className="text-[12px] text-gray-500">Seu Nome</label>
            <input
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full h-[52px] bg-white border border-gray-200 rounded-lg px-4 text-[15px] outline-none focus:border-[#00C853] transition-colors"
              placeholder="Digite seu nome"
              type="text"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full h-[52px] bg-[#00C853] text-white font-bold rounded-lg transition-all text-[15px]"
          >
            Finalizar Recarga
          </button>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg space-y-2">
          <p className="text-[11px] text-gray-500 leading-relaxed">
            Efetue a transferência de acordo com as informações acima. Após a operação, envie o comprovativo pelo WhatsApp.
          </p>
          <p className="text-[11px] font-bold text-red-500">
            Atenção: Esta conta é apenas para esta operação.
          </p>
        </div>
      </main>
    </div>
  );
};

export default ConfirmDeposit;


