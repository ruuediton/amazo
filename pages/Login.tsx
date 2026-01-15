
import React, { useState } from 'react';
import { supabase } from '../supabase';
import { useNetwork } from '../contexts/NetworkContext';

interface Props {
  onNavigate: (page: any) => void;
  showToast?: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}

const Login: React.FC<Props> = ({ onNavigate, showToast }) => {
  const { runWithTimeout } = useNetwork();
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length < 9) {
      showToast?.("Número de telefone inválido.", "error");
      return;
    }

    setLoading(true);
    const email = `${phoneNumber.replace(/\s/g, '')}@amazon.com`;

    const { data, error } = await runWithTimeout(() => supabase.auth.signInWithPassword({
      email,
      password,
    }));

    if (error) {
      showToast?.("Falha no login: " + error.message, "error");
    } else {
      showToast?.("Login realizado com sucesso!", "success");
      onNavigate('splash-ads');
    }
    setLoading(false);
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
            <span className="material-symbols-outlined text-2xl text-yellow-500">arrow_back</span>
          </button>
          <div className="flex items-center gap-1">
            <span className="text-xl font-bold tracking-tight text-text-primary">amazon</span>
            <div className="size-1.5 rounded-full bg-primary mt-3"></div>
          </div>
          <div className="size-10"></div>
        </header>

        <main className="flex-1 px-5 pb-8">
          {/* Title & Subtitle */}
          <div className="mb-8 pt-2">
            <h1 className="text-[32px] font-bold leading-tight tracking-tight mb-2">Bem-vindo de volta</h1>
            <p className="text-text-secondary text-base font-normal">Faça login para gerir suas finanças e compras.</p>
          </div>

          <form className="flex flex-col gap-6" onSubmit={handleLogin}>
            {/* Phone Number Field */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-text-secondary uppercase tracking-wider">Número de Telefone</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <span className="text-xl mr-2">🇦🇴</span>
                  <span className="text-base font-medium text-text-primary">+244</span>
                  <div className="ml-3 h-6 w-px bg-amazon-border"></div>
                </div>
                <input
                  className="flex w-full rounded-lg border border-amazon-border bg-surface-dark pl-[7.5rem] pr-4 h-14 text-base focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-text-secondary/30"
                  placeholder="9XX XXX XXX"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium leading-none text-gray-700">Senha</label>
                <button type="button" className="text-xs font-bold text-primary hover:underline">Esqueceu a senha?</button>
              </div>
              <div className="relative">
                <input
                  className="flex w-full rounded-lg border border-border-dark bg-surface-dark px-4 pr-12 h-14 text-base focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-gray-600"
                  placeholder="Digite sua senha (6 dígitos)"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  maxLength={6}
                  inputMode="numeric"
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setPassword(val);
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-0 h-full w-12 flex items-center justify-center text-gray-500 hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="size-5 rounded border-amazon-border bg-surface-dark text-primary focus:ring-0 focus:ring-offset-0 transition-all cursor-pointer"
              />
              <label htmlFor="remember" className="text-sm font-bold text-text-secondary cursor-pointer italic">Lembrar de mim</label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`mt-4 flex w-full items-center justify-center rounded-lg bg-primary py-4 text-base font-black text-text-primary shadow-lg shadow-primary/20 hover:bg-primary-hover active:scale-[0.98] transition-all cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>

            {/* Footer Link */}
            <div className="text-center mt-4">
              <p className="text-sm font-medium text-text-secondary">
                Não tem uma conta?
                <button type="button" onClick={() => onNavigate('register')} className="text-primary hover:text-primary-hover ml-1 font-bold">Criar conta</button>
              </p>
            </div>
          </form>

          {/* Security Branding */}
          <div className="mt-16 flex flex-col items-center opacity-30">
            <span className="material-symbols-outlined text-3xl mb-2">lock</span>
            <p className="text-[10px] font-bold uppercase tracking-widest">Segurança amazon</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Login;

