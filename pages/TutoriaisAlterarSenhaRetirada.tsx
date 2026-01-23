
import React, { useState } from 'react';

interface Props {
  onNavigate: (page: any) => void;
}

const TutoriaisAlterarSenhaRetirada: React.FC<Props> = ({ onNavigate }) => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="bg-background-dark font-display text-black antialiased min-h-screen">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto shadow-2xl">
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-background-dark/95 backdrop-blur-md">
          <button
            onClick={() => onNavigate('tutorials')}
            className="flex size-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-primary" style={{ fontSize: '24px' }}>arrow_back</span>
          </button>
          <h1 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">Senha de Retirada</h1>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-5 py-2 flex flex-col">
          <div className="mb-6 mt-2">
            <h2 className="text-[28px] font-bold leading-tight tracking-tight mb-3">Alterar Senha de Retirada</h2>
            <p className="text-text-secondary text-base font-normal leading-relaxed">
              Esta senha será solicitada exclusivamente para confirmar saques, transferências e pagamentos.
            </p>
          </div>

          <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
            {/* Current Password */}
            <div className="space-y-1">
              <label className="text-sm font-medium leading-normal text-black ml-1">Senha de retirada atual</label>
              <div className="relative flex items-center">
                <input
                  className="w-full h-14 rounded-xl border border-border-dark bg-surface-dark px-4 pr-12 text-base text-black placeholder-text-secondary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  placeholder="Digite a senha atual"
                  type={showCurrent ? "text" : "password"}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-0 top-0 h-full w-12 flex items-center justify-center text-text-secondary hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
                    {showCurrent ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>

            </div>

            {/* New Password */}
            <div className="space-y-1 pt-2">
              <label className="text-sm font-medium leading-normal text-black ml-1">Nova senha de retirada</label>
              <div className="relative flex items-center">
                <input
                  className="w-full h-14 rounded-xl border border-border-dark bg-surface-dark px-4 pr-12 text-base text-black placeholder-text-secondary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  placeholder="Crie uma nova senha (4 dígitos)"
                  type={showNew ? "text" : "password"}
                  maxLength={4}
                  inputMode="numeric"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-0 top-0 h-full w-12 flex items-center justify-center text-text-secondary hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
                    {showNew ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>


            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="text-sm font-medium leading-normal text-black ml-1">Confirmar nova senha de retirada</label>
              <div className="relative flex items-center">
                <input
                  className="w-full h-14 rounded-xl border border-border-dark bg-surface-dark px-4 pr-12 text-base text-black placeholder-text-secondary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  placeholder="Repita a nova senha"
                  type={showConfirm ? "text" : "password"}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-0 top-0 h-full w-12 flex items-center justify-center text-text-secondary hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
                    {showConfirm ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex-1 min-h-[40px]"></div>

            <button
              type="submit"
              className="w-full h-14 rounded-full bg-primary hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center shadow-lg shadow-primary/20 mb-6"
            >
              <span className="text-[#181711] text-base font-bold tracking-wide">Confirmar</span>
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default TutoriaisAlterarSenhaRetirada;
