
import React, { useState } from 'react';
import { supabase } from '../supabase';
import { useLoading } from '../contexts/LoadingContext';
import SpokeSpinner from '../components/SpokeSpinner';


interface Props {
  onNavigate: (page: any) => void;
  onOpenSupport?: () => void;
  showToast?: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}

const Register: React.FC<Props> = ({ onNavigate, onOpenSupport, showToast }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { withLoading } = useLoading();
  const [loading, setLoading] = useState(false);

  const [invitationCode, setInvitationCode] = useState('');

  // Extração automática do código da URL (apenas preenchimento)
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('ref');
    if (code) setInvitationCode(code);
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreedToTerms) {
      showToast?.("Você deve concordar com os Termos de Serviço.", "warning");
      return;
    }
    if (password.length !== 6) {
      showToast?.("A senha deve ter 6 dígitos.", "error");
      return;
    }
    if (password !== confirmPassword) {
      showToast?.("As senhas não coincidem.", "error");
      return;
    }
    if (phoneNumber.length < 9) {
      showToast?.("Número de telefone inválido.", "error");
      return;
    }

    await withLoading(async () => {
      if (!invitationCode) {
        throw new Error("Código de convite é obrigatório.");
      }

      const email = `${phoneNumber.replace(/\s/g, '')}@deepbank.user`;

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            phone: phoneNumber,
            referred_by: invitationCode || null
          }
        }
      });

      if (error) {
        if (error.message.includes('already registered')) {
          showToast?.("Este número já está cadastrado. Faça login.", "info");
          onNavigate('login');
          return;
        }
        throw error;
      }
    }, "Registro realizado com sucesso!");

    // Wait a moment for the success message to be seen before navigating
    setTimeout(() => {
      onNavigate('login');
    }, 1500);

  } catch (error: any) {
    console.error('Erro no registro:', error);
    // withLoading already shows the error toast/overlay
  }
};

return (
  <div className="bg-background-dark font-display text-black antialiased min-h-screen">
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto">


      <main className="flex-1 px-0 pb-8">
        {/* Top Banner Image - Mostrando a imagem completa */}
        <div className="w-full overflow-hidden mb-6 relative">
          <img
            src="/banner_register.png"
            alt="Amazon Banner"
            className="w-full h-auto block object-contain"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/20 to-transparent"></div>
        </div>

        <div className="px-5">
          {/* Title & Subtitle */}
          <div className="mb-8 pt-2">
            <h1 className="text-[32px] font-bold leading-tight tracking-tight mb-2">Crie sua conta</h1>
            <p className="text-text-secondary text-base font-normal">Junte-se ao futuro dos serviços bancários e compras.</p>
          </div>

          <form className="flex flex-col gap-6" onSubmit={handleRegister}>
            {/* Phone Number Field */}
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-[#0F1111]">Número de telefone</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <span className="text-xl mr-2">🇦🇴</span>
                  <span className="text-base font-medium text-[#0F1111]">+244</span>
                  <div className="ml-3 h-6 w-px bg-gray-200"></div>
                </div>
                <input
                  className="flex w-full rounded-[8px] border border-[#D5D9D9] bg-white pl-[7.5rem] pr-4 h-[44px] text-[15px] focus:border-[#E77600] focus:ring-1 focus:ring-[#E77600] focus:outline-none transition-all placeholder:text-gray-500"
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
              <label className="text-[13px] font-bold text-[#0F1111]">Senha</label>
              <div className="relative">
                <input
                  className="flex w-full rounded-[8px] border border-[#D5D9D9] bg-white pl-4 pr-12 h-[44px] text-[15px] focus:border-[#E77600] focus:ring-1 focus:ring-[#E77600] focus:outline-none transition-all placeholder:text-gray-500"
                  placeholder="6 dígitos numéricos"
                  type={showPassword ? "text" : "password"}
                  inputMode="numeric"
                  value={password}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setPassword(val);
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

            {/* Confirm Password Field */}
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-[#0F1111]">Confirmar Senha</label>
              <div className="relative">
                <input
                  className="flex w-full rounded-[8px] border border-[#D5D9D9] bg-white pl-4 h-[44px] text-[15px] focus:border-[#E77600] focus:ring-1 focus:ring-[#E77600] focus:outline-none transition-all placeholder:text-gray-500"
                  placeholder="Repita a senha"
                  type={showConfirmPassword ? "text" : "password"}
                  inputMode="numeric"
                  value={confirmPassword}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setConfirmPassword(val);
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-0 top-0 h-full w-12 flex items-center justify-center text-gray-600 hover:text-black transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showConfirmPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
            </div>

            {/* Invitation Code Field */}
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-[#0F1111]">
                Código de convite <span className="text-[#C40000]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <span className="material-symbols-outlined text-[20px] text-gray-500">group_add</span>
                </div>
                <input
                  className={`flex w-full rounded-[8px] border border-[#D5D9D9] bg-white pl-12 pr-4 h-[44px] text-[15px] focus:border-[#E77600] focus:ring-1 focus:ring-[#E77600] focus:outline-none transition-all placeholder:text-gray-500 ${new URLSearchParams(window.location.search).get('ref') ? 'bg-gray-50 cursor-not-allowed' : ''
                    }`}
                  placeholder="Código de convite"
                  type="text"
                  value={invitationCode}
                  onChange={(e) => {
                    // Allow manual entry if not from URL
                    if (!new URLSearchParams(window.location.search).get('ref')) {
                      setInvitationCode(e.target.value.toUpperCase().slice(0, 8));
                    }
                  }}
                  required
                  readOnly={!!new URLSearchParams(window.location.search).get('ref')}
                />
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3 mt-2">
              <div className="flex h-6 items-center">
                <input
                  className="size-5 rounded border-gray-300 text-[#E77600] focus:ring-[#E77600] cursor-pointer"
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                />
              </div>
              <div className="text-[13px] leading-snug">
                <label className="font-normal text-[#0F1111]" htmlFor="terms">
                  Eu concordo com os <a className="text-[#007185] hover:text-[#C7511F] hover:underline" href="#">Termos de Serviço</a> e a <a className="text-[#007185] hover:text-[#C7511F] hover:underline" href="#">Política de Privacidade</a>.
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`mt-4 flex w-full items-center justify-center rounded-[8px] bg-[#FFD814] py-3 text-[15px] font-normal text-[#0F1111] border border-[#FCD200] hover:bg-[#F7CA00] active:scale-[0.99] transition-all cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Criando Conta...' : 'Criar Conta'}
            </button>

            {/* Footer Link */}
            <p className="text-center text-[13px] text-[#565959] mt-2">
              Já tem uma conta? <button type="button" onClick={() => onNavigate('login')} className="text-[#007185] hover:text-[#C7511F] hover:underline ml-1">Entrar</button>
            </p>
          </form>
        </div>
      </main>
    </div>
  </div>
);
};

export default Register;
