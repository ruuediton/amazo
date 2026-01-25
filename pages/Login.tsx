
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
  const [rememberMe, setRememberMe] = useState(false);

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

    if (!cleanPassword || cleanPassword.length < 6) {
      showToast?.("A senha deve ter 6 dígitos.", "error");
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
          // Incrementa contador de falhas apenas em caso de erro de credencial
          setFailureCount(prev => prev + 1);

          // Feedback Genérico de Segurança
          throw new Error("Credenciais inválidas");
        }

        // Sucesso: Resetar contador
        setFailureCount(0);

      }, "Login sucedido!");

      onNavigate('splash-ads');
    } catch (error) {
      // O withLoading já trata a exibição do erro, mas garantimos que a mensagem sanitizada acima ("Credenciais inválidas") seja a usada se vier do bloco try.
    }
  };


  return (
    <div className="bg-background-dark font-display text-black antialiased min-h-screen">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between p-4 sticky top-0 z-10 bg-background-dark/95 backdrop-blur-sm border-b border-amazon-border">
          <button
            onClick={() => onNavigate('home')}
            className="flex size-10 items-center justify-center rounded-full hover:bg-surface-dark transition-colors"
          >
            <span className="material-symbols-outlined text-2xl text-primary">arrow_back</span>
          </button>
          <div className="flex items-center gap-1">
            <span className="text-xl font-bold tracking-tight text-text-primary">amazon</span>
            <div className="size-1.5 rounded-full bg-primary mt-3"></div>
          </div>
          <div className="size-10"></div>
        </header>

        <main className="flex-1 px-5 pb-8">
          {/* Title & Subtitle */}
          <div className="mb-5 pt-2">
            <h1 className="text-[32px] font-bold leading-tight tracking-tight mb-1">Bem-vindo de volta</h1>
            <p className="text-text-secondary text-base font-normal">Faça login para gerir suas finanças e compras.</p>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleLogin}>
            {/* Phone Number Field */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold text-text-secondary uppercase tracking-wider">Número de Telefone</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <span className="text-xl mr-2">🇦🇴</span>
                  <span className="text-base font-medium text-text-primary">+244</span>
                  <div className="ml-3 h-6 w-px bg-amazon-border"></div>
                </div>
                <input
                  className="flex w-full rounded-lg border border-amazon-border bg-surface-dark pl-[7.5rem] pr-4 h-12 text-base focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-text-secondary/30"
                  placeholder="9XX XXX XXX"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1">
              <label className="text-[13px] font-bold text-[#0F1111]">Senha</label>
              <div className="relative">
                <input
                  className="flex w-full rounded-[8px] border border-[#D5D9D9] bg-white px-4 pr-12 h-[44px] text-[15px] focus:border-[#E77600] focus:ring-1 focus:ring-[#E77600] focus:shadow-[0_0_3px_2px_rgb(228,121,17,0.5)] focus:outline-none transition-all placeholder:text-gray-500"
                  placeholder="Sua senha Amazon"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  inputMode="numeric"
                  onChange={(e) => {
                    const cleanVal = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setPassword(cleanVal);
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-0 h-full w-12 flex items-center justify-center text-gray-600 hover:text-black transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`mt-2 flex w-full items-center justify-center rounded-[8px] bg-[#FFD814] h-[48px] text-[15px] font-bold text-[#0F1111] border border-[#FCD200] hover:bg-[#F7CA00] active:scale-[0.99] transition-all cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? <div className="flex items-center gap-2">Entrando...</div> : 'Fazer Login'}
            </button>

            {/* Footer Link */}
            <div className="text-center mt-4 relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-[#FFFFFF] px-2 text-[#565959] text-[12px]">Novo na Amazon?</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('register')}
              className="w-full py-3 rounded-[8px] bg-white border border-[#D5D9D9] text-[#0F1111] text-[14px] font-medium hover:bg-gray-50 active:scale-[0.99] shadow-sm transition-all"
            >
              Criar sua conta Amazon
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default Login;

