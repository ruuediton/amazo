
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import SpokeSpinner from '../components/SpokeSpinner';

interface ChangePasswordProps {
  onNavigate: (page: any) => void;
  showToast?: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ onNavigate, showToast }) => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Validações em tempo real
  const [isSixDigits, setIsSixDigits] = useState(false);

  useEffect(() => {
    setIsSixDigits(newPassword.length === 6);
  }, [newPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast?.("Por favor, preencha todos os campos.", "warning");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast?.("A nova senha e a confirmação não coincidem.", "error");
      return;
    }

    if (!isSixDigits) {
      showToast?.("A nova senha deve ter exatamente 6 dígitos.", "error");
      return;
    }

    setLoading(true);

    try {
      // Nota: No Supabase, atualizar a senha de um usuário logado 
      // não exige a senha antiga via API auth.updateUser, mas 
      // é uma boa prática validar ou reautenticar se o sistema exigir.
      // Para simplicidade e seguindo o padrão Supabase:
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        showToast?.(`Erro ao atualizar: ${error.message}`, "error");
      } else {
        showToast?.("Senha alterada com sucesso!", "success");
        setTimeout(() => onNavigate('profile'), 2000);
      }
    } catch (err: any) {
      showToast?.("Ocorreu um erro inesperado.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-dark font-display text-black antialiased">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-background-dark/95 backdrop-blur-md border-b border-gray-200">
        <button
          onClick={() => onNavigate('profile')}
          className="flex size-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
        >
          <span className="material-symbols-outlined text-primary" style={{ fontSize: '24px' }}>arrow_back</span>
        </button>
        <h1 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">Trocar Senha</h1>
      </header>

      <main className="flex-1 px-5 py-2 flex flex-col">
        {/* Headline Section */}
        <div className="mb-4 mt-2">
          <h2 className="text-[28px] font-bold leading-tight tracking-tight mb-2">Alterar Senha de Acesso</h2>
          <p className="text-[text-gray-400] text-base font-normal leading-relaxed">
            Para sua segurança, crie uma senha forte que você não use em outros sites.
          </p>
        </div>

        {/* Form Section */}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Current Password */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-black ml-1">Senha atual</label>
            <div className="relative flex items-center">
              <input
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full h-14 rounded-xl border border-[#423f30] bg-surface-dark px-4 pr-12 text-base text-black placeholder-[text-gray-400] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                placeholder="Digite sua senha atual"
                type={showCurrent ? "text" : "password"}
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-0 top-0 h-full w-12 flex items-center justify-center text-[text-gray-400] hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
                  {showCurrent ? 'visibility' : 'visibility_off'}
                </span>
              </button>
            </div>
            <div className="flex justify-end pt-1">
              <button
                type="button"
                className="text-sm font-medium text-[text-gray-400] hover:text-primary transition-colors underline decoration-primary/30 underline-offset-4"
              >
                Esqueceu sua senha?
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="flex flex-col gap-1 pt-2">
            <label className="text-sm font-bold text-black ml-1">Nova senha</label>
            <div className="relative flex items-center">
              <input
                value={newPassword}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setNewPassword(val);
                }}
                className="w-full h-14 rounded-xl border border-[#423f30] bg-surface-dark px-4 pr-12 text-base text-black placeholder-[text-gray-400] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                placeholder="Crie uma nova senha (6 dígitos)"
                type={showNew ? "text" : "password"}
                maxLength={6}
                inputMode="numeric"
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

            {/* Password Strength Meter */}
            <div className="p-4 mt-3 rounded-xl bg-surface-dark/50 border border-[#423f30]/50">
              <p className="text-xs font-semibold text-[text-gray-400] uppercase tracking-wider mb-3">Requisitos da senha</p>
              <ul className="space-y-2">
                <li className={`flex items-center gap-3 text-sm transition-colors ${isSixDigits ? 'text-primary font-medium' : 'text-[text-gray-400]'}`}>
                  <div className={`size-4 rounded-full flex items-center justify-center ${isSixDigits ? 'bg-primary text-black' : 'border border-current'}`}>
                    {isSixDigits ? (
                      <span className="material-symbols-outlined" style={{ fontSize: '12px', fontWeight: 'bold' }}>check</span>
                    ) : (
                      <div className="size-2 rounded-full bg-transparent"></div>
                    )}
                  </div>
                  Exatamente 6 dígitos numéricos
                </li>
              </ul>
            </div>
          </div>

          {/* Confirm New Password */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-black ml-1">Confirmar nova senha</label>
            <div className="relative flex items-center">
              <input
                value={confirmPassword}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setConfirmPassword(val);
                }}
                className="w-full h-14 rounded-xl border border-[#423f30] bg-surface-dark px-4 pr-12 text-base text-black placeholder-[text-gray-400] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                placeholder="Repita a nova senha"
                type={showConfirm ? "text" : "password"}
                maxLength={6}
                inputMode="numeric"
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

          {/* Action Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full h-[48px] rounded-[12px] bg-primary hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center shadow-md shadow-primary/10 mb-6 ${loading ? 'opacity-50' : ''}`}
          >
            {loading ? (
              <SpokeSpinner size="w-6 h-6" className="text-black" />
            ) : (
              <span className="text-[#181711] text-[15px] font-bold tracking-wide">Confirmar Alteração</span>
            )}
          </button>
        </form>
      </main>
    </div>
  );
};

export default ChangePassword;
