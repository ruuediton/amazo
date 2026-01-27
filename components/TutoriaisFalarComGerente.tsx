import React from 'react';

interface Props {
  onNavigate: (page: any) => void;
  onOpenSupport?: () => void;
}

const TutoriaisFalarComGerente: React.FC<Props> = ({ onNavigate, onOpenSupport }) => {
  return (
    <div className="fixed inset-0 z-[9999] bg-white font-sans text-black overflow-y-auto">
      <div className="relative flex h-full w-full flex-col max-w-md mx-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center bg-white p-4 pb-3 justify-between border-b border-gray-100">
          <button
            onClick={() => onNavigate('tutorials')}
            className="text-[#00C853] flex size-10 shrink-0 items-center justify-start rounded-full hover:bg-gray-50 transition-colors"
          >
            <span className="material-symbols-outlined text-[28px]">chevron_left</span>
          </button>
          <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center">
            Ajuda e Suporte
          </h2>
          <div className="size-10"></div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pb-24">
          {/* Hero Section */}
          <div className="px-4 pt-6 pb-4">
            <div className="bg-gradient-to-br from-[#00C853]/10 to-[#00C853]/5 rounded-3xl p-6 border border-gray-100">
              <span className="inline-block px-3 py-1 mb-3 text-[10px] font-bold text-white uppercase bg-[#00C853] rounded-full">Tutorial</span>
              <h1 className="text-black tracking-tight text-2xl font-black leading-tight mb-2">
                Falar com o Gerente
              </h1>
              <p className="text-gray-600 text-sm font-normal leading-relaxed">
                Obtenha ajuda personalizada para seus investimentos e transações em <span className="font-bold text-[#00C853]">Kz</span>. Veja o passo a passo para iniciar o atendimento VIP.
              </p>
            </div>
          </div>

          {/* Steps Timeline */}
          <div className="px-5 py-6">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-6">Como funciona</h3>
            <div className="grid grid-cols-[40px_1fr] gap-x-4">
              {/* Step 1 */}
              <div className="flex flex-col items-center gap-1 pt-1">
                <div className="flex items-center justify-center size-10 rounded-full bg-[#00C853]/10 text-[#00C853] border border-[#00C853]/20">
                  <span className="material-symbols-outlined text-[20px]">chat</span>
                </div>
                <div className="w-[2px] bg-gray-200 h-full grow rounded-full my-2"></div>
              </div>
              <div className="flex flex-1 flex-col pb-8 pt-1">
                <p className="text-black text-base font-bold leading-tight mb-1">Aceda ao Chat</p>
                <p className="text-gray-500 text-sm font-normal leading-normal">
                  No menu principal, toque no ícone de suporte no canto inferior direito.
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center gap-1 pt-1">
                <div className="flex items-center justify-center size-10 rounded-full bg-[#00C853]/10 text-[#00C853] border border-[#00C853]/20">
                  <span className="material-symbols-outlined text-[20px]">list_alt</span>
                </div>
                <div className="w-[2px] bg-gray-200 h-full grow rounded-full my-2"></div>
              </div>
              <div className="flex flex-1 flex-col pb-8 pt-1">
                <p className="text-black text-base font-bold leading-tight mb-1">Selecione o Assunto</p>
                <p className="text-gray-500 text-sm font-normal leading-normal">
                  Escolha a opção "Gerente de Conta" ou "Investimentos Kz" na lista de tópicos.
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center gap-1 pt-1">
                <div className="flex items-center justify-center size-10 rounded-full bg-[#00C853]/10 text-[#00C853] border border-[#00C853]/20">
                  <span className="material-symbols-outlined text-[20px]">verified_user</span>
                </div>
              </div>
              <div className="flex flex-1 flex-col pt-1">
                <p className="text-black text-base font-bold leading-tight mb-1">Conexão Segura</p>
                <p className="text-gray-500 text-sm font-normal leading-normal">
                  Aguarde alguns instantes enquanto conectamos você ao seu gerente dedicado.
                </p>
              </div>
            </div>
          </div>

          {/* Info Card */}
          <div className="px-5 pb-8">
            <div className="flex flex-col gap-4 rounded-2xl bg-gray-50 p-5 border border-gray-100">
              <div className="flex items-center gap-2 text-[#00C853]">
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>info</span>
                <p className="text-black text-base font-bold leading-tight">O que precisa?</p>
              </div>
              <p className="text-gray-600 text-sm font-normal leading-relaxed">
                Tenha seu <span className="text-black font-bold">ID de cliente</span> e os detalhes da transação em Kz prontos para agilizar o atendimento.
              </p>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="px-5 pb-12">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Dúvidas Comuns</h3>
            <div className="divide-y divide-gray-100 border-t border-b border-gray-100">
              <div className="py-5 flex justify-between items-center group cursor-pointer hover:bg-gray-50 px-2 transition-colors rounded-lg">
                <span className="text-black font-medium text-sm">Qual o horário de atendimento?</span>
                <span className="material-symbols-outlined text-gray-400 group-hover:text-[#00C853] transition-colors">expand_more</span>
              </div>
              <div className="py-5 flex justify-between items-center group cursor-pointer hover:bg-gray-50 px-2 transition-colors rounded-lg">
                <span className="text-black font-medium text-sm">Posso agendar uma ligação?</span>
                <span className="material-symbols-outlined text-gray-400 group-hover:text-[#00C853] transition-colors">expand_more</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Bottom Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white border-t border-gray-100 z-50">
          <button
            onClick={() => onOpenSupport?.()}
            className="w-full h-14 flex items-center justify-center gap-2 bg-[#00C853] hover:brightness-110 active:scale-[0.98] text-white font-bold text-base rounded-2xl transition-all shadow-lg shadow-green-200"
          >
            <span>Falar com Gerente Agora</span>
            <span className="material-symbols-outlined text-[20px] font-bold">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutoriaisFalarComGerente;
