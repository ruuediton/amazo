import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useLoading } from '../contexts/LoadingContext';
import SpokeSpinner from '../components/SpokeSpinner';

interface AddBankProps {
  onNavigate: (page: any) => void;
  showToast?: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void;
}

const AddBank: React.FC<AddBankProps> = ({ onNavigate, showToast }) => {
  const { withLoading } = useLoading();
  const [bankName, setBankName] = useState('');
  const [holderName, setHolderName] = useState('');
  const [iban, setIban] = useState('');
  const [loading, setLoading] = useState(false);
  const [existingBank, setExistingBank] = useState<any>(null);
  const [mode, setMode] = useState<'create' | 'view' | 'edit'>('create');

  // Custom Mini Toast State
  const [localError, setLocalError] = useState<string | null>(null);

  const BANK_PREFIXES: Record<string, string> = {
    "Banco BAI": "0040",
    "Banco BFA": "0006",
    "Banco BIC": "0051",
    "Banco Atlântico": "0055",
    "Banco Sol": "0044",
    "Banco BNI": "0009"
  };

  useEffect(() => {
    if (localError) {
      const timer = setTimeout(() => setLocalError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [localError]);

  useEffect(() => {
    checkExistingBank();
  }, []);

  const checkExistingBank = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.rpc('get_my_bank_accounts');
      if (data && data.length > 0) {
        setExistingBank(data[0]);
        setMode('view');
      }
    } catch (err) {
      console.error('Erro, no servidor', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (existingBank) {
      setBankName(existingBank.nome_banco);
      setHolderName(existingBank.nome_completo);
      setIban(existingBank.iban);
      setMode('edit');
    }
  };

  const handleDelete = async () => {
    if (confirm('Tem certeza que deseja apagar esta conta?')) {
      setLoading(true);
      try {
        const { error } = await supabase
          .from('bancos_clientes')
          .delete()
          .eq('user_id', existingBank.user_id);

        if (error) throw error;

        showToast?.('Apagada sucesso!', 'success');
        setExistingBank(null);
        setBankName('');
        setHolderName('');
        setIban('');
        setMode('create');
      } catch (error: any) {
        showToast?.('Erro ao deletar: ' + (error.message || 'Erro desconhecido'), 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleIbanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Apenas números
    setIban(value);
  };

  const handleSaveBank = async () => {
    try {
      setLocalError(null);
      let cleanIban = iban.replace(/[^0-9]/g, ''); // Apenas números

      // 1. Validação de Tamanho (21 ou 25 dígitos)
      if (cleanIban.length !== 21 && cleanIban.length !== 25) {
        setLocalError("O IBAN deve ter exatamente 21 ou 25 dígitos.");
        return;
      }

      // 2. Formatação Automática
      let finalIban = '';
      if (cleanIban.length === 21) {
        finalIban = `AO06${cleanIban}`;
      } else if (cleanIban.length === 25) {
        // Se já tem 25 dígitos, assume que são os números incluindo o 06
        finalIban = `AO${cleanIban}`;
      }

      // 3. Validação de Prefixo do Banco (Opcional/Flexível)
      if (bankName && BANK_PREFIXES[bankName]) {
        const expectedPrefix = BANK_PREFIXES[bankName];
        // O prefixo do banco são os dígitos da posição 4 a 8 no IBAN final (AO06XXXX...)
        const currentPrefix = finalIban.substring(4, 8);

        if (currentPrefix !== expectedPrefix) {
          setLocalError(`Este IBAN não parece ser do ${bankName}.`);
          return;
        }
      }

      await withLoading(async () => {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          throw new Error("Sessão expirada. Acesse novamente.");
        }

        const payload = {
          p_bank_name: bankName,
          p_holder_name: holderName,
          p_iban: finalIban
        };

        const { error } = await supabase.rpc(
          mode === 'edit' ? 'update_bank_account' : 'add_bank_account',
          payload
        );

        if (error) throw error;

        showToast?.("Bem sucedido", "success");
        await checkExistingBank();
        setTimeout(() => onNavigate('profile'), 1200);
      }, "Salvando dados bancários...");

    } catch (err: any) {
      if (err.message && !err.message.includes('loading')) {
        setLocalError(err.message);
      }
    }
  };

  const currentBankPrefix = bankName ? BANK_PREFIXES[bankName] : '';
  const ibanPlaceholder = "Digite apenas os 21 números do seu IBAN";

  const maskIban = (val: string) => {
    if (!val) return '';
    const clean = val.replace(/\s/g, '');
    if (clean.length < 13) return val;
    return `${clean.substring(0, 8)}*****${clean.substring(clean.length - 9)}`;
  };

  return (
    <div className="font-sans antialiased bg-white text-[#0F1111] min-h-screen flex flex-col selection:bg-amber-100">
      <header className="relative bg-gradient-to-b from-[#00C853] to-[#00C853]/10 pb-8 pt-4 px-4 overflow-hidden">
        {/* Background Decorative Circles */}
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>

        <div className="relative z-10 flex items-center justify-between">
          <button
            onClick={() => onNavigate('profile')}
            className="w-11 h-11 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md transition-all active:scale-90"
          >
            <span className="material-symbols-outlined text-white text-[28px]">arrow_back</span>
          </button>
          <h1 className="text-xl font-black text-white tracking-tight">
            {mode === 'view' ? 'Dados Bancários' : mode === 'edit' ? 'Editar Conta' : 'Nova Conta'}
          </h1>
          <div className="w-11"></div>
        </div>
      </header>

      <main className="flex-1 flex flex-col w-full max-w-lg mx-auto px-5 pt-6 pb-10">
        {mode === 'view' ? (
          <div className="flex flex-col items-center justify-center flex-1 space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="size-20 bg-green-50 rounded-full flex items-center justify-center mb-2 border border-green-100">
              <span className="material-symbols-outlined text-green-600 text-4xl">verified_user</span>
            </div>

            <div className="text-center space-y-1">
              <h2 className="text-xl font-bold text-[#0F1111]">Conta Vinculada</h2>
              <p className="text-[#565959] text-sm">Seus recebimentos serão enviados para:</p>
            </div>

            <div className="w-full bg-gray-50 border border-gray-100 rounded-xl p-5 space-y-5">
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <span className="text-[13px] font-bold text-[#565959]">Banco</span>
                  <span className="text-[14px] font-bold text-[#0F1111]">{existingBank?.nome_banco}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <span className="text-[13px] font-bold text-[#565959]">Titular</span>
                  <span className="text-[14px] font-bold text-[#0F1111]">{existingBank?.nome_completo}</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#565959] uppercase tracking-wider mb-1 block">IBAN</span>
                  <p className="text-[15px] font-mono font-medium text-[#0F1111] bg-gray-50 p-3 rounded-lg border border-gray-200 break-all">
                    {existingBank?.iban}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col w-full gap-3 pt-4">
              <button
                onClick={handleEdit}
                className="w-full h-12 bg-gray-50 border border-gray-100 text-[#0F1111] text-[14px] font-medium rounded-lg active:scale-[0.98] transition-all hover:bg-white"
              >
                Editar
              </button>
              <button
                onClick={handleDelete}
                className="w-full h-12 text-[#CC0C39] text-[14px] font-medium rounded-lg hover:bg-red-50 transition-all font-bold"
              >
                Remover
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6">
              <h2 className="text-[18px] font-bold text-[#0F1111] mb-1">Adicionar Conta Bancária</h2>
              <p className="text-[#565959] text-[13px]">Certifique-se que o titular da conta corresponde ao seu BI.</p>
            </div>

            <div className="space-y-3 flex-1">
              <div className="space-y-2">
                <label className="block text-[13px] font-bold text-[#0F1111]">
                  Banco Destinatário
                </label>
                <div className="bg-gray-50 rounded-[12px] h-14 flex items-center px-4 gap-3 relative border border-transparent focus-within:border-[#00C853] transition-colors">
                  <span className="material-symbols-outlined text-[#00C853] text-[24px]">account_balance</span>
                  <select
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="bg-transparent flex-1 h-full outline-none text-[#0F1111] font-medium appearance-none cursor-pointer text-[14px]"
                  >
                    <option value="">Selecione o banco...</option>
                    <option value="Banco BAI">Banco BAI</option>
                    <option value="Banco BFA">Banco BFA</option>
                    <option value="Banco BIC">Banco BIC</option>
                    <option value="Banco Atlântico">Banco Atlântico</option>
                    <option value="Banco Sol">Banco Sol</option>
                    <option value="Banco BNI">Banco BNI</option>
                  </select>
                  <span className="material-symbols-outlined text-gray-400 text-[20px]">expand_more</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[13px] font-bold text-[#0F1111]">
                  Nome do Titular
                </label>
                <div className="bg-gray-50 rounded-[12px] h-14 flex items-center px-4 gap-3 relative border border-transparent focus-within:border-[#00C853] transition-colors">
                  <span className="material-symbols-outlined text-[#00C853] text-[24px]">person</span>
                  <input
                    value={holderName}
                    onChange={(e) => setHolderName(e.target.value)}
                    className="bg-transparent flex-1 h-full outline-none text-[#0F1111] font-medium placeholder:text-gray-400 text-[14px]"
                    placeholder="Ex: João Manuel Silva"
                    type="text"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[13px] font-bold text-[#0F1111]">
                  IBAN (21 Dígitos)
                </label>
                <div className="bg-gray-50 rounded-[12px] h-14 flex items-center px-4 gap-3 relative border border-transparent focus-within:border-[#00C853] transition-colors">
                  <span className="material-symbols-outlined text-[#00C853] text-[24px]">pin</span>
                  <input
                    value={iban}
                    onChange={handleIbanChange}
                    maxLength={25}
                    className="bg-transparent flex-1 h-full outline-none text-[#0F1111] font-mono placeholder:text-gray-400 text-[14px]"
                    placeholder={ibanPlaceholder}
                    type="text"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              {mode === 'edit' && (
                <button
                  onClick={() => setMode('view')}
                  className="w-full h-10 text-[#007185] text-[13px] font-medium hover:underline transition-colors"
                >
                  Cancelar
                </button>
              )}
              <button
                onClick={handleSaveBank}
                disabled={loading}
                className="w-full h-[48px] bg-primary hover:bg-primary-hover border border-[#00C853] rounded-[8px] flex items-center justify-center font-bold text-[#0F1111] text-[15px] active:scale-[0.99] transition-all"
              >
                {loading ? (
                  <SpokeSpinner size="w-5 h-5" color="text-black" />
                ) : (
                  mode === 'edit' ? 'Salvar' : 'Vincular'
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 pt-2 opacity-60">
                <span className="material-symbols-outlined text-[16px] text-[#565959]">lock</span>
                <p className="text-[11px] text-[#565959]">Ambiente seguro BP</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Mini Toast - Pequenino, Translúcido e Centralizado */}
      {localError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none animate-in fade-in duration-200">
          <div className="bg-red-500/90 text-white px-6 py-3 rounded-xl max-w-sm mx-4 text-center text-sm font-medium pointer-events-auto">
            {localError}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddBank;

