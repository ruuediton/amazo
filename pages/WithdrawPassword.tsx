
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useLoading } from '../contexts/LoadingContext';
import SpokeSpinner from '../components/SpokeSpinner';

interface WithdrawPasswordProps {
  onNavigate: (page: any) => void;
  showToast?: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void;
}

const WithdrawPassword: React.FC<WithdrawPasswordProps> = ({ onNavigate, showToast }) => {
  const { withLoading } = useLoading();
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Requisitos de validação simplificados (4 dígitos)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Sanitização
    const cleanPass = password.replace(/\D/g, '');
    const cleanConfirm = confirmPassword.replace(/\D/g, '');

    if (cleanPass.length !== 4) {
      showToast?.("A senha deve conter 4 dígitos numéricos.", "warning");
      return;
    }

    if (cleanPass !== cleanConfirm) {
      showToast?.("As senhas não coincidem.", "error");
      return;
    }

    await withLoading(async () => {
      // Validação de Sessão
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Sessão expirada. Acesse novamente.");
      }

      // Chamada Segura RPC
      const { error } = await supabase.rpc('set_withdrawal_password', {
        p_password: cleanPass
      });

      if (error) throw error;

      showToast?.("Senha de retirada definida com sucesso!", "success");
      setTimeout(() => onNavigate('profile'), 1500);
    });
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-white font-sans text-black antialiased">
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
          <h1 className="text-xl font-black text-white tracking-tight">Senha de Retirada</h1>
          <div className="w-11"></div>
        </div>
      </header>

      <main className="flex-1 px-5 py-2 flex flex-col">
        {/* Intro */}
        {/* Form */}
        <form className="flex flex-col gap-4 mt-6" onSubmit={handleSubmit}>
          {/* New Password */}
          <div className="bg-gray-50 rounded-xl h-14 flex items-center px-4 gap-3 relative border border-transparent focus-within:border-[#00C853] transition-colors">
            <span className="material-symbols-outlined text-[#00C853] text-[24px]">lock</span>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value.replace(/\D/g, ''))}
              maxLength={4}
              inputMode="numeric"
              className="bg-transparent flex-1 h-full outline-none text-[#111] font-medium placeholder:text-gray-400 text-[14px]"
              placeholder="Crie uma nova senha (4 dígitos)"
              type={showNew ? "text" : "password"}
            />
            <button type="button" onClick={() => setShowNew(!showNew)}>
              <span className="material-symbols-outlined text-gray-400 text-[20px]">
                {showNew ? 'visibility' : 'visibility_off'}
              </span>
            </button>
          </div>

          {/* Confirm Password */}
          <div className="bg-gray-50 rounded-xl h-14 flex items-center px-4 gap-3 relative border border-transparent focus-within:border-[#00C853] transition-colors">
            <span className="material-symbols-outlined text-[#00C853] text-[24px]">lock</span>
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value.replace(/\D/g, ''))}
              maxLength={4}
              inputMode="numeric"
              className="bg-transparent flex-1 h-full outline-none text-[#111] font-medium placeholder:text-gray-400 text-[14px]"
              placeholder="Repita a nova senha"
              type={showConfirm ? "text" : "password"}
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)}>
              <span className="material-symbols-outlined text-gray-400 text-[20px]">
                {showConfirm ? 'visibility' : 'visibility_off'}
              </span>
            </button>
          </div>

          <div className="flex-1 min-h-[30px]"></div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full h-14 rounded-2xl bg-[#00C853] hover:bg-[#00a844] active:scale-[0.98] transition-all flex items-center justify-center shadow-lg shadow-green-200 mb-6 ${loading ? 'opacity-50' : ''}`}
          >
            {loading ? (
              <SpokeSpinner size="w-6 h-6" className="text-black" />
            ) : (
              <span className="text-[#181711] text-[15px] font-bold tracking-wide">Confirmar</span>
            )}
          </button>
        </form>
      </main>
    </div>
  );
};

export default WithdrawPassword;

