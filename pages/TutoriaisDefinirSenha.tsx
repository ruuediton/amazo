
import React from 'react';

interface Props {
  onNavigate: (page: any) => void;
}

const TutoriaisDefinirSenha: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="bg-background-dark font-display text-black min-h-screen flex flex-col antialiased overflow-x-hidden selection:bg-primary selection:text-black">
      {/* Header */}
      <header className="flex items-center p-4 pb-2 justify-between sticky top-0 z-10 bg-background-dark/90 backdrop-blur-md">
        <button
          onClick={() => onNavigate('tutorials')}
          className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
        >
          <span className="material-symbols-outlined text-primary" style={{ fontSize: '24px' }}>arrow_back</span>
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">Definir Senha</h2>
      </header>

      {/* Progress Indicators */}
      <div className="flex w-full flex-row items-center justify-center gap-2 py-4 px-4">
        <div className="h-1.5 w-8 rounded-full bg-primary transition-all duration-300"></div>
        <div className="h-1.5 w-2 rounded-full bg-neutral-700 transition-all duration-300"></div>
        <div className="h-1.5 w-2 rounded-full bg-neutral-700 transition-all duration-300"></div>
      </div>

      {/* Main Scrollable Content */}
      <main className="flex-1 flex flex-col px-4 pb-24">
        {/* Hero Card */}
        <div className="flex flex-col items-stretch justify-start rounded-2xl shadow-sm bg-[#2d2a1e] overflow-hidden mb-6 border border-gray-200">
          <div
            className="w-full h-48 bg-center bg-no-repeat bg-cover relative"
            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDrqDFdBZWNgHfUZTAGiG6Cu6jRvWdmb1Iv_x1f8NtWmzs5KWzPfjWjEoMFpyb-MxLJqoAewuFwzRtqLFv2O3rrARGO4ieEk0r6Ov0me_T1F-5kIvshKf4yVVRs-GoKEp_wzDmKpiTh4zqSau8TOBFOvDCSV3eqq5F-lB-yeAjHQ-Zw07veAS3flbhaedLHk840OoAka1Efz3mpVPBd6hY5f-HCFBQWsUB3rjkkWfVXGmPEddqxJGA5vU1ZINecsc1ftiGikqDfDL1k")' }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
              <span className="px-2 py-1 rounded bg-black/50 backdrop-blur-sm text-xs font-medium text-black border border-white/20">Passo 1 de 3</span>
            </div>
          </div>
          <div className="flex w-full flex-col items-stretch justify-center gap-3 p-5">
            <div>
              <h1 className="text-xl font-bold leading-tight tracking-tight mb-2 text-black">Proteja os seus Kz</h1>
              <p className="text-[text-gray-400] text-sm font-normal leading-relaxed">
                A sua senha de levantamento é a chave para movimentar o seu dinheiro com segurança. Escolha uma combinação que só você conheça.
              </p>
            </div>
          </div>
        </div>

        {/* Rules Section Title */}
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-4 px-1">Regras de Segurança</h3>

        {/* Description List (Security Rules) */}
        <div className="grid grid-cols-[auto_1fr] gap-x-4 mb-6 bg-[#2d2a1e] rounded-xl p-4 border border-gray-200">
          {/* Item 1 */}
          <div className="flex items-start justify-center pt-1">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: '24px' }}>block</span>
          </div>
          <div className="flex flex-col border-b border-white/10 pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">
            <p className="text-black text-base font-bold leading-normal">Sem sequências</p>
            <p className="text-[text-gray-400] text-sm font-normal leading-normal">Evite números fáceis como 123456 ou 111111.</p>
          </div>
          {/* Item 2 */}
          <div className="flex items-start justify-center pt-1">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: '24px' }}>calendar_month</span>
          </div>
          <div className="flex flex-col border-b border-white/10 pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">
            <p className="text-black text-base font-bold leading-normal">Sem datas</p>
            <p className="text-[text-gray-400] text-sm font-normal leading-normal">Não use o seu ano de nascimento ou dia.</p>
          </div>
          {/* Item 3 */}
          <div className="flex items-start justify-center pt-1">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: '24px' }}>fingerprint</span>
          </div>
          <div className="flex flex-col pb-0 mb-0">
            <p className="text-black text-base font-bold leading-normal">Única</p>
            <p className="text-[text-gray-400] text-sm font-normal leading-normal">Não repita a senha de login do app.</p>
          </div>
        </div>

        {/* Meta Text / Warning */}
        <div className="flex gap-3 items-start px-2 py-2 rounded-lg bg-red-900/10 border border-red-900/20 mb-4">
          <span className="material-symbols-outlined text-red-400 shrink-0" style={{ fontSize: '20px', marginTop: '2px' }}>shield</span>
          <p className="text-red-200 text-xs font-medium leading-relaxed">
            Nunca partilhe esta senha com ninguém, nem mesmo com a equipa de suporte SmartBuy.
          </p>
        </div>
      </main>

      {/* Footer / CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background-dark border-t border-gray-200 z-20">
        <button
          onClick={() => onNavigate('withdraw-password')}
          className="w-full bg-primary hover:bg-yellow-400 text-black text-base font-bold h-12 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
        >
          <span>Começar Configuração</span>
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>
        </button>
        <div className="text-center mt-3">
          <button
            onClick={() => onNavigate('support')}
            className="text-sm font-medium text-neutral-400 hover:text-black underline decoration-neutral-600 underline-offset-4"
          >
            Precisa de ajuda?
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutoriaisDefinirSenha;
