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

  try {
    const cleanIban = iban.replace(/[^A-Z0-9]/g, '');
    if (cleanIban.length < 21) {
      showToast?.("IBAN inválido. Um IBAN angolano deve conter pelo menos 21 caracteres.", "error");
      return;
    }

    await withLoading(async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Sessão expirada. Acesse novamente.");
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

      showToast?.("Conta bancária vinculada com sucesso!", "success");
      await checkExistingBank();
      setTimeout(() => onNavigate('profile'), 1200);
    }, undefined, "Não foi possível salvar os dados bancários.");
  } catch (err: any) {
    // O withLoading já trata a maior parte, mas capturamos erros de validação pré-loading aqui
    if (err.message && !err.message.includes('loading')) {
      showToast?.(err.message, "error");
    }
  }
};

return (
  <div className="font-display antialiased bg-[#0a0a0b] text-white min-h-screen flex flex-col selection:bg-amber-500/30">
    {/* Premium Header */}
    <header className="sticky top-0 z-50 bg-[#0a0a0b]/80 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center justify-between px-6 py-4">
        <button
          onClick={() => onNavigate('profile')}
          className="group flex items-center justify-center w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 active:scale-90 transition-all border border-white/10"
        >
          <span className="material-symbols-outlined text-amber-500 text-[22px] group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
        </button>
        <h1 className="text-[15px] font-black tracking-[0.1em] text-white uppercase">
          {mode === 'view' ? 'Dados Bancários' : mode === 'edit' ? 'Editar Conta' : 'Nova Conta'}
        </h1>
        <div className="w-10"></div>
      </div>
    </header>

    <main className="flex-1 flex flex-col w-full max-w-lg mx-auto px-6 pt-8 pb-10">
      {mode === 'view' ? (
        <div className="flex flex-col items-center justify-center flex-1 space-y-8 animate-in fade-in zoom-in-95 duration-500">
          {/* Holographic Icon Container */}
          <div className="relative">
            <div className="absolute inset-0 bg-amber-500/20 blur-3xl rounded-full"></div>
            <div className="relative w-24 h-24 bg-gradient-to-tr from-amber-500 to-amber-200 rounded-3xl flex items-center justify-center shadow-2xl rotate-3">
              <span className="material-symbols-outlined text-black text-5xl -rotate-3">account_balance</span>
            </div>
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-white">Conta Verificada</h2>
            <p className="text-gray-400 text-sm font-medium">Seus pagamentos serão enviados para:</p>
          </div>

          {/* Glass Card */}
          <div className="w-full bg-white/[0.03] backdrop-blur-2xl p-6 rounded-[32px] border border-white/10 shadow-2xl space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-6xl">verified</span>
            </div>

            <div className="space-y-4 relative">
              <div>
                <p className="text-[10px] text-amber-500 font-black uppercase tracking-[0.2em] mb-1.5 px-1">Instituição</p>
                <p className="text-lg font-bold text-white bg-white/5 p-3 rounded-2xl border border-white/5">{existingBank?.nome_banco}</p>
              </div>
              <div>
                <p className="text-[10px] text-amber-500 font-black uppercase tracking-[0.2em] mb-1.5 px-1">Titular</p>
                <p className="text-lg font-bold text-white bg-white/5 p-3 rounded-2xl border border-white/5">{existingBank?.nome_completo}</p>
              </div>
              <div>
                <p className="text-[10px] text-amber-500 font-black uppercase tracking-[0.2em] mb-1.5 px-1">IBAN de Depósito</p>
                <div className="bg-black/40 p-4 rounded-2xl border border-white/5 group/iban">
                  <p className="text-sm font-mono font-bold text-amber-200/90 break-all leading-relaxed">
                    {existingBank?.iban}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col w-full gap-3 pt-4">
            <button
              onClick={handleEdit}
              className="w-full h-14 bg-white text-black text-[13px] font-black uppercase tracking-widest rounded-2xl shadow-xl active:scale-[0.97] transition-all hover:bg-gray-100"
            >
              Atualizar Dados
            </button>
            <button
              onClick={handleDelete}
              className="w-full h-14 bg-transparent text-red-400 text-[13px] font-bold uppercase tracking-widest rounded-2xl border border-red-400/20 hover:bg-red-400/5 transition-all"
            >
              Remover Conta
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-700">
          {/* Section Label */}
          <div className="mb-8 ">
            <h2 className="text-3xl font-black text-white mb-2">Configure seu banco</h2>
            <p className="text-gray-400 text-sm font-medium">Assegure que os dados batem com seu BI para evitar atrasos.</p>
          </div>

          {/* Premium Form */}
          <div className="space-y-5 flex-1">
            <div className="space-y-2 group">
              <label className="block text-[11px] font-black text-gray-500 ml-1 uppercase tracking-widest group-focus-within:text-amber-500 transition-colors">
                Banco Destinatário
              </label>
              <div className="relative">
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full h-14 pl-4 pr-12 rounded-2xl bg-white/[0.03] border border-white/10 text-[15px] text-white focus:outline-none focus:border-amber-500/50 focus:bg-white/[0.06] transition-all appearance-none"
                >
                  <option value="" className="bg-[#121214]">Escolha seu banco...</option>
                  <option value="Banco BAI" className="bg-[#121214]">Banco BAI</option>
                  <option value="Banco BFA" className="bg-[#121214]">Banco BFA</option>
                  <option value="Banco BIC" className="bg-[#121214]">Banco BIC</option>
                  <option value="Banco Atlântico" className="bg-[#121214]">Banco Atlântico</option>
                  <option value="Banco Sol" className="bg-[#121214]">Banco Sol</option>
                  <option value="Banco BNI" className="bg-[#121214]">Banco BNI</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-amber-500">
                  <span className="material-symbols-outlined">expand_more</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="block text-[11px] font-black text-gray-500 ml-1 uppercase tracking-widest group-focus-within:text-amber-500 transition-colors">
                Nome do Titular
              </label>
              <input
                value={holderName}
                onChange={(e) => setHolderName(e.target.value)}
                className="w-full h-14 px-5 rounded-2xl bg-white/[0.03] border border-white/10 text-[15px] text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-500/50 focus:bg-white/[0.06] transition-all"
                placeholder="Ex: João Manuel Silva"
                type="text"
              />
            </div>

            <div className="space-y-2 group">
              <label className="block text-[11px] font-black text-gray-500 ml-1 uppercase tracking-widest group-focus-within:text-amber-500 transition-colors">
                Código IBAN (21 Dígitos)
              </label>
              <input
                value={iban}
                onChange={handleIbanChange}
                maxLength={25}
                className="w-full h-14 px-5 rounded-2xl bg-white/[0.03] border border-white/10 text-[15px] text-amber-200 font-mono focus:outline-none focus:border-amber-500/50 focus:bg-white/[0.06] transition-all"
                placeholder="AO06 0000 0000..."
                type="text"
              />
            </div>
          </div>

          {/* Fixed Bottom CTA */}
          <div className="mt-12 space-y-4">
            {mode === 'edit' && (
              <button
                onClick={() => setMode('view')}
                className="w-full h-10 text-gray-500 text-[11px] font-black uppercase tracking-widest hover:text-white transition-colors"
              >
                Cancelar Alterações
              </button>
            )}
            <button
              onClick={handleSaveBank}
              disabled={loading}
              className="relative group w-full h-16 overflow-hidden rounded-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-400 group-hover:scale-105 transition-transform duration-500"></div>
              <div className="relative flex items-center justify-center font-black text-black text-sm uppercase tracking-[0.2em]">
                {loading ? (
                  <SpokeSpinner size="w-6 h-6" className="text-black" />
                ) : (
                  mode === 'edit' ? 'Salvar Novo Cartão' : 'Vincular Minha Conta'
                )}
              </div>
            </button>
            <div className="flex items-center justify-center gap-2 opacity-30 pt-2">
              <span className="material-symbols-outlined text-xs">shield</span>
              <p className="text-[9px] uppercase font-bold tracking-tighter">Dados guardados sob criptografia militar</p>
            </div>
          </div>
        </div>
      )}
    </main>
  </div>
);
};

export default AddBank;
