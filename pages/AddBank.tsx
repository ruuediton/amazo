import React, { useState, useEffect } from 'react';
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
  const [existingBank, setExistingBank] = useState<any>(null);
  const [mode, setMode] = useState<'create' | 'view' | 'edit'>('create');

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
      console.error('Erro ao buscar conta:', err);
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
        // Tenta usar RPC se existir, senão usa delete direto
        const { error } = await supabase
          .from('bancos_clientes')
          .delete()
          .eq('user_id', existingBank.user_id);

        if (error) throw error;

        showToast?.('Conta removida com sucesso!', 'success');
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

  // Formata o IBAN enquanto o usuário digita
  const handleIbanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    // Aplica máscara AO06 XXXX XXXX XXXX XXXX X (simplificado para exibição)
    setIban(value);
  };

  const handleSaveBank = async () => {
    if (!bankName || !holderName || !iban) {
      showToast?.("Por favor, preencha todos os campos.", "warning");
      return;
    }

    const cleanIban = iban.replace(/\s/g, '');
    if (cleanIban.length < 21) {
      showToast?.("IBAN inválido. Deve ter no mínimo 21 caracteres.", "error");
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        showToast?.("Sessão expirada. Faça login novamente.", "error");
        onNavigate('login');
        return;
      }

      const payload = {
        p_bank_name: bankName,
        p_holder_name: holderName,
        p_iban: cleanIban
      };

      const { error } = await supabase.rpc(
        mode === 'edit' ? 'update_bank_account' : 'add_bank_account',
        payload
      );

      if (error) throw error;

      showToast?.("Dados salvos com sucesso!", "success");
      await checkExistingBank();
      setTimeout(() => onNavigate('profile'), 800);
    } catch (err: any) {
      showToast?.(`Erro: ${err.message || 'Falha ao salvar'}`, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-display antialiased bg-background-dark text-black min-h-screen flex flex-col">
      {/* Top App Bar - Título reduzido para 14px */}
      <header className="sticky top-0 z-50 bg-background-dark border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-2">
          <button
            onClick={() => onNavigate('profile')}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 active:scale-95 transition-all text-primary"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <h1 className="text-[14px] font-bold tracking-tight flex-1 text-center pr-8 text-black uppercase">
            {mode === 'view' ? 'Gerenciar Conta' : mode === 'edit' ? 'Editar Conta' : 'Adicionar Conta'}
          </h1>
        </div>
      </header>

      <main className="flex-1 flex flex-col w-full max-w-lg mx-auto px-4 pt-4 pb-6">
        {mode === 'view' ? (
          <div className="flex flex-col items-center justify-center flex-1 space-y-4">
            {/* Stamp Compacto */}
            <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-green-500 text-3xl">check_circle</span>
            </div>
            <h2 className="text-sm font-bold text-black text-center mt-2">Conta Vinculada</h2>

            <div className="w-full bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-3">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Banco</p>
                <p className="text-[13px] font-bold text-black">{existingBank?.nome_banco}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Titular</p>
                <p className="text-[13px] font-bold text-black">{existingBank?.nome_completo}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">IBAN</p>
                <p className="text-[12px] font-mono font-bold text-black bg-gray-50 p-2 rounded-lg break-all border border-gray-100">
                  {existingBank?.iban}
                </p>
              </div>
            </div>

            <div className="flex flex-col w-full gap-2 mt-2">
              <button
                onClick={handleEdit}
                className="w-full h-10 bg-black text-white text-[12px] font-bold rounded-lg shadow-sm active:scale-[0.98] transition-all"
              >
                EDITAR DADOS
              </button>
              <button
                onClick={handleDelete}
                className="w-full h-10 bg-transparent text-red-500 text-[12px] font-bold rounded-lg border border-red-50 active:scale-[0.98] transition-all"
              >
                REMOVER
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Form Fields - Mais compactos e sem bordas coloridas */}
            <div className="space-y-3 flex-1">
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-gray-500 ml-1 uppercase">
                  Banco
                </label>
                <div className="relative">
                  <select
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full h-10 pl-4 pr-10 rounded-lg bg-white border border-gray-100 text-[12.5px] text-black focus:outline-none focus:border-gray-300 transition-all appearance-none shadow-sm"
                  >
                    <option value="" disabled>Selecione seu banco</option>
                    <option value="Banco BAI">Banco BAI</option>
                    <option value="Banco BFA">Banco BFA</option>
                    <option value="Banco BIC">Banco BIC</option>
                    <option value="Banco Atlântico">Banco Atlântico</option>
                    <option value="Banco Sol">Banco Sol</option>
                    <option value="Banco BNI">Banco BNI</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <span className="material-symbols-outlined text-[18px]">expand_more</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-gray-500 ml-1 uppercase">
                  Titular
                </label>
                <input
                  value={holderName}
                  onChange={(e) => setHolderName(e.target.value)}
                  className="w-full h-10 px-4 rounded-lg bg-white border border-gray-100 text-[12.5px] text-black placeholder:text-gray-300 focus:outline-none focus:border-gray-300 transition-all shadow-sm"
                  placeholder="Nome completo"
                  type="text"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-gray-500 ml-1 uppercase">
                  IBAN
                </label>
                <input
                  value={iban}
                  onChange={handleIbanChange}
                  maxLength={25}
                  className="w-full h-10 px-4 rounded-lg bg-white border border-gray-100 text-[12.5px] text-black placeholder:text-gray-300 focus:outline-none focus:border-gray-300 transition-all shadow-sm font-mono"
                  placeholder="AO06..."
                  type="text"
                />
              </div>
            </div>

            {/* Footer / Botão de Salvar Branco */}
            <div className="mt-auto pt-6 pb-20">
              {mode === 'edit' && (
                <button
                  onClick={() => setMode('view')}
                  className="w-full h-8 mb-2 text-gray-400 text-[11px] font-bold uppercase"
                >
                  Cancelar Edição
                </button>
              )}
              <button
                onClick={handleSaveBank}
                disabled={loading}
                className={`w-full h-11 bg-white border border-gray-200 text-black font-bold text-[13px] rounded-lg shadow-sm flex items-center justify-center transition-all active:scale-[0.98] ${loading ? 'opacity-50' : ''}`}
              >
                {loading ? (
                  <SpokeSpinner size="w-5 h-5" className="text-black" />
                ) : (
                  mode === 'edit' ? 'SALVAR ALTERAÇÕES' : 'SALVAR CARTÃO'
                )}
              </button>
              <p className="text-center text-[10px] text-gray-400 mt-4 leading-relaxed px-6">
                Ao continuar, você confirma que é o titular desta conta bancária e concorda com as políticas de segurança.
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AddBank;
