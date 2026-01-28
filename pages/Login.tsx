import React, { useState } from 'react';
import { supabase } from '../supabase';
import { useNetwork } from '../contexts/NetworkContext';
import { useLoading } from '../contexts/LoadingContext';

interface Props {
  onNavigate: (page: any) => void;
  showToast?: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}

const Login: React.FC<Props> = ({ onNavigate, showToast }) => {
  const { runWithTimeout } = useNetwork();
  const { withLoading } = useLoading();
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [failureCount, setFailureCount] = useState(0);
  const MAX_ATTEMPTS = 5;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (failureCount >= MAX_ATTEMPTS) {
      showToast?.("Muitas tentativas falhadas. Aguarde alguns instantes.", "error");
      return;
    }

    // 1. Sanitização e Validação
    const cleanPhone = phoneNumber.replace(/\D/g, ''); // Remove tudo que não for dígito
    const cleanPassword = password.trim();

    if (!cleanPhone || cleanPhone.length < 9) {
      showToast?.("Número de telefone inválido.", "error");
      return;
    }

    if (!cleanPassword || cleanPassword.length < 6 || cleanPassword.length > 8) {
      showToast?.("A senha deve ter entre 6 e 8 caracteres.", "error");
      return;
    }

    const email = `${cleanPhone}@deepbank.user`;

    try {
      await withLoading(async () => {
        const { error } = await runWithTimeout(() => supabase.auth.signInWithPassword({
          email,
          password: cleanPassword,
        }));

        if (error) {
          setFailureCount(prev => prev + 1);
          throw new Error("Credenciais inválidas");
        }

        setFailureCount(0);

      }, "Login sucedido!");

      onNavigate('splash-ads');
    } catch (error) {
      // Toast handled by withLoading
    }
  };

  return (
    <div className="bg-white font-sans text-black antialiased min-h-screen flex flex-col px-6 pt-6 pb-10">

      {/* Header / Back Button */}
      <div className="w-full flex items-start mb-6">
        <button
          onClick={() => onNavigate('home')}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <span className="material-symbols-outlined text-[28px]">chevron_left</span>
        </button>
      </div>

      {/* 3D Illustration */}
      <div className="w-full flex justify-center mb-10">
        <div className="w-[40%] aspect-square relative flex items-center justify-center">
          {/* Using a high-quality green 3D shield illustration */}
          <img
            src="https://cdn3d.iconscout.com/3d/premium/thumb/security-check-box-5353591-4482563.png"
            alt="Security Login"
            className="w-full h-full object-contain"
            onError={(e) => {
              // Fallback if image fails
              (e.target as HTMLImageElement).src = "https://cdn-icons-png.flaticon.com/512/3699/3699516.png";
            }}
          />
        </div>
      </div>

      {/* Title */}
      <div className="w-full mb-8">
        <h1 className="text-[28px] font-bold text-[#111] leading-tight">Entrar</h1>
      </div>

      <form className="w-full flex-col gap-5 flex" onSubmit={handleLogin}>

        {/* Phone Input */}
        <div className="bg-gray-50 rounded-xl h-14 flex items-center px-4 gap-3 relative border border-transparent focus-within:border-[#00C853] transition-colors">
          <span className="material-symbols-outlined text-[#00C853] text-[24px]">person</span>
          <span className="text-gray-500 font-medium">+244</span>
          <span className="material-symbols-outlined text-gray-400 text-[14px]">arrow_drop_down</span>
          <input
            type="tel"
            placeholder="9XX XXX XXX"
            className="bg-transparent flex-1 h-full outline-none text-[#111] font-medium placeholder:text-gray-400 text-[14px]"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>

        {/* Password Input */}
        <div className="bg-gray-50 rounded-xl h-14 flex items-center px-4 gap-3 relative border border-transparent focus-within:border-[#00C853] transition-colors">
          <span className="material-symbols-outlined text-[#00C853] text-[24px]">lock</span>
          <input
            type={showPassword ? "text" : "password"}
            placeholder=".........."
            className="bg-transparent flex-1 h-full outline-none text-[#111] font-medium placeholder:text-gray-400 text-[14px] tracking-widest"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)}>
            <span className="material-symbols-outlined text-gray-400 text-[20px]">
              {showPassword ? 'visibility' : 'visibility_off'}
            </span>
          </button>
        </div>

        {/* Checkbox */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setRememberMe(!rememberMe)}>
          <div className={`size-5 rounded-full flex items-center justify-center border transition-all ${rememberMe ? 'bg-[#00C853] border-[#00C853]' : 'border-gray-300 bg-white'}`}>
            {rememberMe && <span className="material-symbols-outlined text-white text-[14px]">check</span>}
          </div>
          <span className="text-gray-500 text-[13px] font-medium">Lembre-se de nome de usuário / senha</span>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full h-14 bg-[#00C853] text-white font-bold rounded-2xl text-[16px] mt-2 hover:bg-[#00a844] active:scale-[0.98] transition-all shadow-lg shadow-green-200 ${loading ? 'opacity-70 grayscale' : ''}`}
        >
          {loading ? 'Entrando' : 'Entrar'}
        </button>

        {/* Footer */}
        <div className="w-full text-center mt-6">
          <p className="text-gray-400 text-[13px]">
            não tem conta? <span onClick={() => onNavigate('register')} className="text-[#fe5722] font-bold cursor-pointer hover:underline">Registrar</span>
          </p>
        </div>

      </form>

    </div >
  );
};

export default Login;
