
import React, { useState } from 'react';
import { supabase } from '../supabase';
import SpokeSpinner from '../components/SpokeSpinner';

interface AddBankProps {
  onNavigate: (page: any) => void;
  showToast?: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void;
}

const AddBank: React.FC<AddBankProps> = ({ onNavigate, showToast }) => {
  const [bankName, setBankName] = useState('');
  const [holderName, setHolderName] = useState('');
  const [iban, setIban] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSaveBank = async () => {
    // 1. Validação de campos vazios
    if (!bankName || !holderName || !iban) {
      showToast?.("Por favor, preencha todos os campos obrigatórios.", "warning");
      return;
    }

    // 2. Validação do IBAN (21 dígitos conforme pedido)
    // Removemos espaços e caracteres não alfanuméricos para contar apenas os dígitos/letras
    const cleanIban = iban.replace(/\s/g, '');
    if (cleanIban.length !== 21) {
      showToast?.("O IBAN deve conter exatamente 21 caracteres (ex: AO06...).", "error");
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        showToast?.("Sessão expirada. Por favor, faça login novamente.", "error");
        onNavigate('login');
        return;
      }

      // Chamada via RPC para garantir que a criptografia ocorra no banco de dados
      const { error } = await supabase.rpc('add_encrypted_bank_account', {
        p_bank_name: bankName,
        p_holder_name: holderName,
        p_iban: cleanIban
      });

      if (error) {
        showToast?.(`Erro ao salvar: ${error.message}`, "error");
      } else {
        showToast?.("Dados bancários salvos com segurança!", "success");
        // Pequeno delay para o usuário ver o modal de sucesso antes de navegar
        setTimeout(() => {
          onNavigate('profile');
        }, 2000);
      }
    } catch (err: any) {
      showToast?.("Ocorreu um erro inesperado. Tente novamente.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-display antialiased bg-background-dark text-black min-h-screen flex flex-col">
      {/* Top App Bar */}
      <header className="sticky top-0 z-50 bg-background-dark border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => onNavigate('profile')}
            aria-label="Voltar"
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 active:scale-95 transition-all text-yellow-500"
          >
            <span className="material-symbols-outlined font-medium">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10 text-black">
            Cartão Banco
          </h1>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col w-full max-w-lg mx-auto px-4 pt-2 pb-6">
        {/* Security Badge */}
        <div className="flex items-center justify-center gap-1.5 py-4 mb-2 opacity-80">
          <span className="material-symbols-outlined text-green-400 text-[18px]">lock</span>
          <span className="text-[#bab59c] text-xs font-medium uppercase tracking-wide">Conexão Segura</span>
        </div>

        {/* Form Fields */}
        <div className="space-y-6 flex-1">
          {/* Bank Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-200 ml-1">
              Selecione o seu banco
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#bab59c] pointer-events-none flex items-center">
                <span className="material-symbols-outlined text-[24px]">account_balance</span>
              </div>
              <select
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full h-14 pl-12 pr-10 rounded-xl bg-surface-dark border border-[#4a4635] text-black text-base focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all cursor-pointer shadow-sm appearance-none"
              >
                <option value="" disabled>Escolha uma opção (e.g., BAI, BFA)</option>
                <option value="Banco BAI">Banco BAI</option>
                <option value="Banco BFA">Banco BFA</option>
                <option value="Banco BIC">Banco BIC</option>
                <option value="Banco Atlântico">Banco Atlântico</option>
                <option value="Banco Sol">Banco Sol</option>
                <option value="Banco BNI">Banco BNI</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#bab59c] flex items-center">
                <span className="material-symbols-outlined">expand_more</span>
              </div>
            </div>
          </div>

          {/* Account Holder Name */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-200 ml-1">
              Nome do Titular
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#bab59c] pointer-events-none flex items-center">
                <span className="material-symbols-outlined text-[24px]">person</span>
              </div>
              <input
                value={holderName}
                onChange={(e) => setHolderName(e.target.value)}
                className="w-full h-14 pl-12 pr-4 rounded-xl bg-surface-dark border border-[#4a4635] text-black placeholder:text-[#6e6b5e] text-base focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
                placeholder="Nome completo como consta no banco"
                type="text"
              />
            </div>
          </div>

          {/* IBAN / Account Number */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-200 ml-1">
              Número da Conta / IBAN
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#bab59c] pointer-events-none flex items-center">
                <span className="material-symbols-outlined text-[24px]">credit_card</span>
              </div>
              <input
                value={iban}
                onChange={(e) => setIban(e.target.value)}
                maxLength={25} // Maior que 21 para permitir espaços na digitação
                className="w-full h-14 pl-12 pr-4 rounded-xl bg-surface-dark border border-[#4a4635] text-black placeholder:text-[#6e6b5e] text-base focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
                placeholder="AO06 ..."
                type="text"
              />
            </div>
            <p className="text-xs text-[#bab59c] ml-1 pt-1">
              Certifique-se de que o IBAN corresponde a uma conta em kwanzas (Kz). O IBAN deve ter 21 dígitos.
            </p>
          </div>
        </div>

        {/* Spacer */}
        <div className="h-8"></div>

        {/* Footer / CTA */}
        <div className="mt-auto pt-4 pb-32">
          <button
            onClick={handleSaveBank}
            disabled={loading}
            className={`w-full h-14 bg-primary hover:bg-primary/90 active:bg-primary/80 text-black font-bold text-lg rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center transition-all transform active:scale-[0.98] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <SpokeSpinner size="w-6 h-6" className="text-black" />
            ) : (
              'Salvar Cartão'
            )}
          </button>
          <p className="text-center text-xs text-[#6e6b5e] mt-4 leading-relaxed px-4">
            Ao continuar, você concorda com os <a className="underline hover:text-primary decoration-1 underline-offset-2" href="#">Termos de Serviço</a> da Amazon e confirma que é o titular desta conta bancária.
          </p>
        </div>
      </main>
    </div>
  );
};

export default AddBank;
