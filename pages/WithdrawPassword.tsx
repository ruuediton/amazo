
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
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-background-dark/95 backdrop-blur-md border-b border-gray-200">
        <button
          onClick={() => onNavigate('profile')}
          className="flex size-10 items-center justify-start rounded-full hover:bg-gray-50 transition-colors"
        >
          <span className="material-symbols-outlined text-[#00C853]" style={{ fontSize: '28px' }}>chevron_left</span>
        </button>
        <h1 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">Senha de Retirada</h1>
      </header>

      <main className="flex-1 px-5 py-2 flex flex-col">
        {/* Intro */}
        {/* Form */}
        <form className="flex flex-col gap-4 mt-6" onSubmit={handleSubmit}>
          {/* New Password */}
          <div className="flex flex-col gap-1 pt-2">

            <div className="relative flex items-center">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value.replace(/\D/g, ''))}
                maxLength={4}
                inputMode="numeric"
                className="w-full h-14 rounded-2xl border border-transparent bg-gray-50 px-4 pr-12 text-base text-black placeholder-gray-400 focus:border-[#00C853] focus:ring-1 focus:ring-[#00C853] outline-none transition-all"
                placeholder="Crie uma nova senha (4 dígitos)"
                type={showNew ? "text" : "password"}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-0 top-0 h-full w-12 flex items-center justify-center text-[text-gray-400] hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
                  {showNew ? 'visibility' : 'visibility_off'}
                </span>
              </button>
            </div>


          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1">

            <div className="relative flex items-center">
              <input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value.replace(/\D/g, ''))}
                maxLength={4}
                inputMode="numeric"
                className="w-full h-14 rounded-2xl border border-transparent bg-gray-50 px-4 pr-12 text-base text-black placeholder-gray-400 focus:border-[#00C853] focus:ring-1 focus:ring-[#00C853] outline-none transition-all"
                placeholder="Repita a nova senha"
                type={showConfirm ? "text" : "password"}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-0 top-0 h-full w-12 flex items-center justify-center text-[text-gray-400] hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
                  {showConfirm ? 'visibility' : 'visibility_off'}
                </span>
              </button>
            </div>
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

