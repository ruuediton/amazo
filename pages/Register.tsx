import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabase';
import { useLoading } from '../contexts/LoadingContext';

interface Props {
  onNavigate: (page: any) => void;
  showToast?: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}

const Register: React.FC<Props> = ({ onNavigate, showToast }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [invitationCode, setInvitationCode] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [generatedCaptcha, setGeneratedCaptcha] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { withLoading } = useLoading();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate Captcha
  const generateCaptcha = () => {
    const chars = '0123456789'; // Numeric as shown in image (8615)
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedCaptcha(code);
    drawCaptcha(code);
  };

  const drawCaptcha = (code: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add noise (dots)
    for (let i = 0; i < 50; i++) {
      ctx.fillStyle = `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},0.5)`;
      ctx.beginPath();
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Add noise (lines)
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `rgba(${Math.random() * 200},${Math.random() * 200},${Math.random() * 200},0.3)`;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    // Text
    ctx.font = 'bold 24px monospace';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    // Draw each character with slight rotation/color
    const startX = 20;
    const spacing = 20;

    for (let i = 0; i < code.length; i++) {
      ctx.save();
      ctx.translate(startX + (i * spacing), canvas.height / 2);
      ctx.rotate((Math.random() - 0.5) * 0.4);
      ctx.fillStyle = `hsl(${Math.random() * 360}, 70%, 30%)`; // Random dark colors
      ctx.fillText(code[i], 0, 0);
      ctx.restore();
    }
  };

  useEffect(() => {
    generateCaptcha();
    // Check for referral code in URL
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode) setInvitationCode(refCode);
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreedToTerms) {
      showToast?.("Concorde com os termos da isenção de responsabilidade.", "warning");
      return;
    }

    if (captchaInput !== generatedCaptcha) {
      showToast?.("Código de verificação incorreto.", "error");
      generateCaptcha(); // Refresh captcha on error
      setCaptchaInput('');
      return;
    }

    if (phoneNumber.length < 9) {
      showToast?.("Número de telefone inválido.", "error");
      return;
    }

    if (password.length < 6) {
      showToast?.("A senha deve ter pelo menos 6 caracteres.", "error");
      return;
    }

    if (password !== confirmPassword) {
      showToast?.("As senhas não coincidem.", "error");
      return;
    }

    if (!invitationCode) {
      showToast?.("Por favor insira o código do convite.", "warning");
      return;
    }

    try {
      await withLoading(async () => {
        const email = `${phoneNumber}@deepbank.user`;

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              phone: phoneNumber,
              referred_by: invitationCode
            }
          }
        });

        if (error) {
          if (error.message.includes('already registered')) {
            throw new Error("Este número já está registrado.");
          }
          throw error;
        }
      }, "Registro realizado com sucesso!");

      setTimeout(() => onNavigate('login'), 1500);

    } catch (err: any) {
      showToast?.(err.message || "Erro ao registrar.", "error");
    }
  };

  return (
    <div className="bg-white min-h-screen font-sans text-black flex flex-col items-center px-6 pt-10 pb-10">

      {/* Header */}
      <div className="w-full mb-8 text-center sm:text-left">
        <h1 className="text-[32px] font-black text-[#111] mb-2">BP</h1>
        <h2 className="text-[18px] font-bold text-[#111]">Registrar</h2>
      </div>

      <form className="w-full flex flex-col gap-4" onSubmit={handleRegister}>

        {/* Phone Input */}
        <div className="bg-gray-50 rounded-xl h-14 flex items-center px-4 gap-3 relative border border-transparent focus-within:border-[#00C853] transition-colors">
          <span className="material-symbols-outlined text-[#00C853] text-[24px]">person</span>
          <span className="text-gray-500 font-medium">+244</span>
          <span className="material-symbols-outlined text-gray-400 text-[14px]">arrow_drop_down</span>
          <input
            type="tel"
            placeholder="Por favor insira o número do telefone"
            className="bg-transparent flex-1 h-full outline-none text-[#111] font-medium placeholder:text-gray-400 text-[14px]"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>

        {/* Captcha Field */}
        <div className="bg-gray-50 rounded-xl h-14 flex items-center px-4 gap-3 relative border border-transparent focus-within:border-[#00C853] transition-colors">
          <span className="material-symbols-outlined text-[#00C853] text-[24px]">verified_user</span>
          <input
            type="text"
            placeholder="por favor insira o código de verificação"
            className="bg-transparent flex-1 h-full outline-none text-[#111] font-medium placeholder:text-gray-400 text-[14px]"
            value={captchaInput}
            onChange={(e) => setCaptchaInput(e.target.value)}
            required
          />
          <div className="h-10 w-24 shrink-0 overflow-hidden rounded-lg cursor-pointer border border-gray-200" onClick={generateCaptcha} title="Toque para atualizar">
            <canvas ref={canvasRef} width={100} height={40} className="w-full h-full object-cover"></canvas>
          </div>
        </div>

        {/* Password Input */}
        <div className="bg-gray-50 rounded-xl h-14 flex items-center px-4 gap-3 relative border border-transparent focus-within:border-[#00C853] transition-colors">
          <span className="material-symbols-outlined text-[#00C853] text-[24px]">lock</span>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Por favor, insira sua senha"
            className="bg-transparent flex-1 h-full outline-none text-[#111] font-medium placeholder:text-gray-400 text-[14px]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)}>
            <span className="material-symbols-outlined text-gray-400 text-[20px]">
              {showPassword ? 'visibility' : 'visibility_off'}
            </span>
          </button>
        </div>

        {/* Confirm Password Input */}
        <div className="bg-gray-50 rounded-xl h-14 flex items-center px-4 gap-3 relative border border-transparent focus-within:border-[#00C853] transition-colors">
          <span className="material-symbols-outlined text-[#00C853] text-[24px]">lock</span>
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Por favor confirme sua senha"
            className="bg-transparent flex-1 h-full outline-none text-[#111] font-medium placeholder:text-gray-400 text-[14px]"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
            <span className="material-symbols-outlined text-gray-400 text-[20px]">
              {showConfirmPassword ? 'visibility' : 'visibility_off'}
            </span>
          </button>
        </div>

        {/* Invite Code Input */}
        <div className="bg-gray-50 rounded-xl h-14 flex items-center px-4 gap-3 relative border border-transparent focus-within:border-[#00C853] transition-colors">
          <span className="material-symbols-outlined text-[#00C853] text-[24px]">favorite</span>
          <input
            type="text"
            placeholder="Por favor insira o código do convite"
            className="bg-transparent flex-1 h-full outline-none text-[#111] font-medium placeholder:text-gray-400 text-[14px]"
            value={invitationCode}
            onChange={(e) => {
              // Only allow editing if invite code wasn't in URL
              const urlParams = new URLSearchParams(window.location.search);
              if (!urlParams.get('ref')) {
                setInvitationCode(e.target.value);
              }
            }}
            readOnly={!!(new URLSearchParams(window.location.search)).get('ref')}
            required
          />
        </div>

        {/* Terms Checkbox */}
        <div className="flex items-start gap-3 px-1 mt-2">
          <div
            className={`size-5 rounded-full flex shrink-0 items-center justify-center border cursor-pointer transition-colors mt-0.5 ${agreedToTerms ? 'bg-[#00C853] border-[#00C853]' : 'border-gray-300 bg-white'}`}
            onClick={() => setAgreedToTerms(!agreedToTerms)}
          >
            {agreedToTerms && <span className="material-symbols-outlined text-white text-[14px]">check</span>}
          </div>
          <p className="text-[12px] text-gray-500 leading-tight">
            Concorde com os <span className="underline cursor-pointer">termos da isenção de responsabilidade</span>
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full h-12 bg-[#00C853] text-white font-bold rounded-2xl text-[16px] mt-4 hover:bg-[#00a844] active:scale-[0.98] transition-all shadow-lg shadow-green-200 ${loading ? 'opacity-70 grayscale' : ''}`}
        >
          {loading ? 'Registrando' : 'Registrar'}
        </button>

        {/* Footer Link */}
        <div className="w-full text-center mt-4">
          <button type="button" onClick={() => onNavigate('login')} className="text-[#fe5722] font-medium text-[14px] hover:underline">
            Entrar
          </button>
        </div>

      </form>
    </div>
  );
};

export default Register;
