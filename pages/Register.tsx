
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

    try {
      await withLoading(async () => {
        if (!invitationCode) {
          showToast?.("Código de convite é obrigatório.", "error");
          return;
        }

        const email = `${phoneNumber.replace(/\s/g, '')}@deepbank.user`;
        // Backend handle invite_code generation

        const { data, error } = await supabase.auth.signUp({
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
          throw error;
        } else if (data.user) {
          // Atualiza o perfil com telefone
          await supabase.from('profiles').update({
            phone: phoneNumber
          }).eq('id', data.user.id);
        }
      }, "Registro sucedido!");

      onNavigate('login');
    } catch (error: any) {
      // Erro tratado pelo withLoading ou throw message acima
      if (error.message && !error.message.includes('Auth')) {
        // Se for erro customizado (ex: código inválido), exibe toast
        // O withLoading ja exibe o erro, mas garantimos
      }
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

            <form className="flex flex-col gap-5" onSubmit={handleRegister}>
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
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-text-secondary uppercase tracking-wider">Senha</label>
                <div className="relative">
                  <input
                    className="flex w-full rounded-lg border border-amazon-border bg-surface-dark pl-4 pr-12 h-12 text-base focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-text-secondary/30"
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
                    className="absolute right-0 top-0 h-full w-12 flex items-center justify-center text-gray-500 hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showPassword ? 'visibility' : 'visibility_off'}
                    </span>
                  </button>
                </div>

              </div>

              {/* Confirm Password Field */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium leading-none text-gray-700">Confirmar Senha</label>
                <div className="relative">
                  <input
                    className="flex w-full rounded-lg border border-border-dark bg-surface-dark px-4 h-12 text-base focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-[text-gray-400]"
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
                    className="absolute right-0 top-0 h-full w-12 flex items-center justify-center text-gray-500 hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showConfirmPassword ? 'visibility' : 'visibility_off'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Invitation Code Field */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-text-secondary uppercase tracking-wider">
                  Código de Convite <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <span className="material-symbols-outlined text-xl text-text-secondary">group_add</span>
                  </div>
                  <input
                    className={`flex w-full rounded-lg border border-amazon-border bg-surface-dark pl-12 pr-4 h-12 text-base focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-text-secondary/30 ${new URLSearchParams(window.location.search).get('ref') ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    placeholder="AO####"
                    type="text"
                    value={invitationCode}
                    onChange={(e) => {
                      // Allow manual entry if not from URL
                      if (!new URLSearchParams(window.location.search).get('ref')) {
                        setInvitationCode(e.target.value.toUpperCase().slice(0, 6));
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
                    className="h-5 w-5 rounded border-amazon-border bg-surface-dark text-primary focus:ring-offset-0 focus:ring-primary transition duration-150 ease-in-out cursor-pointer"
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                  />
                </div>
                <div className="text-sm leading-6">
                  <label className="font-bold text-text-secondary" htmlFor="terms">
                    Eu concordo com os <a className="text-primary hover:underline underline-offset-2" href="#">Termos de Serviço</a> e a <a className="text-primary hover:underline underline-offset-2" href="#">Política de Privacidade</a>.
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`mt-4 flex w-full items-center justify-center rounded-lg bg-primary py-3 text-base font-bold text-black shadow-lg shadow-primary/10 hover:bg-yellow-400 active:scale-[0.98] transition-all cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Criando Conta...' : 'Criar Conta'}
              </button>

              {/* Footer Link */}
              <p className="text-center text-sm font-medium text-text-secondary mt-2">
                Já tem uma conta? <button type="button" onClick={() => onNavigate('login')} className="text-primary hover:text-primary-hover ml-1 font-bold">Entrar</button>
              </p>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Register;
