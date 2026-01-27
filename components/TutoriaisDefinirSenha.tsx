import React from 'react';

interface Props {
  onNavigate: (page: any) => void;
}

const TutoriaisDefinirSenha: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="fixed inset-0 z-[9999] bg-white font-sans text-black overflow-y-auto">
      <div className="relative flex h-full w-full flex-col max-w-md mx-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center bg-white p-4 pb-3 justify-between border-b border-gray-100">
          <button
            onClick={() => onNavigate('tutorials')}
            className="flex size-10 shrink-0 items-center justify-start rounded-full hover:bg-gray-50 transition-colors"
          >
            <span className="material-symbols-outlined text-[#00C853]" style={{ fontSize: '28px' }}>chevron_left</span>
          </button>
          <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center">Definir Senha</h2>
          <div className="size-10"></div>
        </header>

        {/* Progress Indicators */}
        <div className="flex w-full flex-row items-center justify-center gap-2 py-4 px-4">
          <div className="h-1.5 w-8 rounded-full bg-[#00C853] transition-all duration-300"></div>
          <div className="h-1.5 w-2 rounded-full bg-gray-200 transition-all duration-300"></div>
          <div className="h-1.5 w-2 rounded-full bg-gray-200 transition-all duration-300"></div>
        </div>

        {/* Main Scrollable Content */}
        <main className="flex-1 flex flex-col px-4 pb-24 overflow-y-auto">
          {/* Hero Card */}
          <div className="flex flex-col items-stretch justify-start rounded-3xl bg-gradient-to-br from-[#00C853]/10 to-[#00C853]/5 overflow-hidden mb-6 border border-gray-100 p-6">
            <span className="px-3 py-1 rounded-full bg-[#00C853] text-xs font-medium text-white border border-[#00C853]/20 w-fit mb-3">Passo 1 de 3</span>
            <h1 className="text-xl font-bold leading-tight tracking-tight mb-2 text-black">Proteja os seus Kz</h1>
            <p className="text-gray-600 text-sm font-normal leading-relaxed">
              A sua senha de levantamento é a chave para movimentar o seu dinheiro com segurança. Escolha uma combinação que só você conheça.
            </p>
          </div>

          {/* Rules Section Title */}
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4 px-1">Regras de Segurança</h3>

          {/* Description List (Security Rules) */}
          <div className="grid grid-cols-[auto_1fr] gap-x-4 mb-6 bg-gray-50 rounded-2xl p-4 border border-gray-100">
            {/* Item 1 */}
            <div className="flex items-start justify-center pt-1">
              <span className="material-symbols-outlined text-[#00C853]" style={{ fontSize: '24px' }}>block</span>
            </div>
            <div className="flex flex-col border-b border-gray-200 pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">
              <p className="text-black text-base font-bold leading-normal">Sem sequências</p>
              <p className="text-gray-500 text-sm font-normal leading-normal">Evite números fáceis como 123456 ou 111111.</p>
            </div>
            {/* Item 2 */}
            <div className="flex items-start justify-center pt-1">
              <span className="material-symbols-outlined text-[#00C853]" style={{ fontSize: '24px' }}>calendar_month</span>
            </div>
            <div className="flex flex-col border-b border-gray-200 pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">
              <p className="text-black text-base font-bold leading-normal">Sem datas</p>
              <p className="text-gray-500 text-sm font-normal leading-normal">Não use o seu ano de nascimento ou dia.</p>
            </div>
            {/* Item 3 */}
            <div className="flex items-start justify-center pt-1">
              <span className="material-symbols-outlined text-[#00C853]" style={{ fontSize: '24px' }}>fingerprint</span>
            </div>
            <div className="flex flex-col pb-0 mb-0">
              <p className="text-black text-base font-bold leading-normal">Única</p>
              <p className="text-gray-500 text-sm font-normal leading-normal">Não repita a senha de login do app.</p>
            </div>
          </div>

          {/* Meta Text / Warning */}
          <div className="flex gap-3 items-start px-4 py-3 rounded-2xl bg-red-50 border border-red-100 mb-4">
            <span className="material-symbols-outlined text-red-500 shrink-0" style={{ fontSize: '20px', marginTop: '2px' }}>shield</span>
            <p className="text-red-600 text-xs font-medium leading-relaxed">
              Nunca partilhe esta senha com ninguém, nem mesmo com a equipa de suporte BP.
            </p>
          </div>
        </main>

        {/* Footer / CTA */}
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white border-t border-gray-100 z-20">
          <button
            onClick={() => onNavigate('withdraw-password')}
            className="w-full bg-[#00C853] hover:brightness-110 text-white text-base font-bold h-12 rounded-2xl flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
          >
            <span>Começar Configuração</span>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>
          </button>
          <div className="text-center mt-3">
            <button
              onClick={() => onNavigate('support')}
              className="text-sm font-medium text-gray-500 hover:text-black underline decoration-gray-300 underline-offset-4"
            >
              Precisa de ajuda?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutoriaisDefinirSenha;
