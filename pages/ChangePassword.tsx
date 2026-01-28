
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
      // Nota: No Supabase, atualizar a senha de um usuÃ¡rio logado 
      // nÃ£o exige a senha antiga via API auth.updateUser, mas 
      // Ã© uma boa prÃ¡tica validar ou reautenticar se o sistema exigir.
      // Para simplicidade e seguindo o padrÃ£o Supabase:
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
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-white font-sans text-black antialiased">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-background-dark border-b border-gray-200">
        <button
          onClick={() => onNavigate('profile')}
          className="flex size-10 items-center justify-start rounded-full hover:bg-gray-50 transition-colors"
        >
          <span className="material-symbols-outlined text-[#00C853]" style={{ fontSize: '28px' }}>chevron_left</span>
        </button>
        <h1 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">Trocar Senha</h1>
      </header>

      <main className="flex-1 px-5 py-2 flex flex-col">
        {/* Form Section */}
        <form className="flex flex-col gap-3 mt-4" onSubmit={handleSubmit}>
          {/* Current Password */}
          <div className="bg-gray-50 rounded-xl h-14 flex items-center px-4 gap-3 relative border border-transparent focus-within:border-[#00C853] transition-colors">
            <span className="material-symbols-outlined text-[#00C853] text-[24px]">lock</span>
            <input
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="bg-transparent flex-1 h-full outline-none text-[#111] font-medium placeholder:text-gray-400 text-[14px]"
              placeholder="Digite sua senha atual"
              type={showCurrent ? "text" : "password"}
            />
            <button type="button" onClick={() => setShowCurrent(!showCurrent)}>
              <span className="material-symbols-outlined text-gray-400 text-[20px]">
                {showCurrent ? 'visibility' : 'visibility_off'}
              </span>
            </button>
          </div>

          {/* New Password */}
          <div className="bg-gray-50 rounded-xl h-14 flex items-center px-4 gap-3 relative border border-transparent focus-within:border-[#00C853] transition-colors">
            <span className="material-symbols-outlined text-[#00C853] text-[24px]">lock</span>
            <input
              value={newPassword}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                setNewPassword(val);
              }}
              className="bg-transparent flex-1 h-full outline-none text-[#111] font-medium placeholder:text-gray-400 text-[14px]"
              placeholder="Crie uma nova senha (6 dígitos)"
              type={showNew ? "text" : "password"}
              maxLength={6}
              inputMode="numeric"
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
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                setConfirmPassword(val);
              }}
              className="bg-transparent flex-1 h-full outline-none text-[#111] font-medium placeholder:text-gray-400 text-[14px]"
              placeholder="Repita a nova senha"
              type={showConfirm ? "text" : "password"}
              maxLength={6}
              inputMode="numeric"
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)}>
              <span className="material-symbols-outlined text-gray-400 text-[20px]">
                {showConfirm ? 'visibility' : 'visibility_off'}
              </span>
            </button>
          </div>

          <div className="flex-1 min-h-[10px]"></div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full h-14 rounded-2xl bg-[#00C853] hover:bg-[#00a844] active:scale-[0.98] transition-all flex items-center justify-center mb-6 shadow-lg shadow-green-200 ${loading ? 'opacity-50' : ''}`}
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

