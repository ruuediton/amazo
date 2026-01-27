
import React from 'react';

interface Props {
  onNavigate: (page: any) => void;
  onOpenSupport?: () => void;
}

const TutoriaisFalarComGerente: React.FC<Props> = ({ onNavigate, onOpenSupport }) => {
  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto bg-background-dark font-display text-black antialiased">
      {/* Top App Bar */}
      <div className="sticky top-0 z-50 flex items-center bg-background-dark/95 backdrop-blur-md p-4 pb-2 justify-between border-b border-white/10">
        <button
          onClick={() => onNavigate('tutorials')}
          className="text-primary flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-black text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">
          Ajuda e Suporte
        </h2>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-32 no-scrollbar">
        {/* Header Image Section */}
        <div className="px-0 sm:px-4 sm:py-3">
          <div
            className="bg-cover bg-center flex flex-col justify-end overflow-hidden bg-card-dark sm:rounded-2xl min-h-[240px] relative group"
            style={{
              backgroundImage: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(34, 31, 16, 0.95) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuB46nRMkIPkmlVFyVpwFF-SRgylOZzKtzc_JOrBP1wctiWaFtWWOH8y2LNy9LR4j5visSJz4HW9ZQDU8mgQW-3t086JJiiPJxRxtx_XT066spjlxH_hCw6QEI5fhgH5498knw4kNL62jcC55GCWzvmAoHXPfzF8p-byF6KsxWrVYsUm5cSdjTt9TwPlG4TZEOBNJaoyxI-iOi0RS5IxCI7Y-y9_-lMC2aiyylBCPaw_hXzBO-hF1VhpSN3tUoQftIDXGMAWKNHlPkS9")'
            }}
          >
            {/* Subtle BP-esque decorative element */}
            <div className="absolute top-4 right-4 opacity-20">
              <span className="material-symbols-outlined text-black text-5xl">savings</span>
            </div>
            <div className="flex flex-col p-6 relative z-10">
              <span className="inline-block px-2 py-1 mb-2 text-[10px] font-bold text-black uppercase bg-primary rounded w-fit">Tutorial</span>
              <h1 className="text-black tracking-tight text-3xl font-bold leading-tight drop-shadow-md">
                Falar com o Gerente
              </h1>
            </div>
          </div>
        </div>

        {/* Intro Text */}
        <div className="px-5 pt-6 pb-2">
          <p className="text-text-secondary text-base font-normal leading-relaxed">
            Obtenha ajuda personalizada para seus investimentos e transações em <span className="font-bold text-primary">Kz</span>. Veja o passo a passo para iniciar o atendimento VIP.
          </p>
        </div>

        {/* Timeline / Steps */}
        <div className="px-5 py-8">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-6">Como funciona</h3>
          <div className="grid grid-cols-[40px_1fr] gap-x-4">
            {/* Step 1 */}
            <div className="flex flex-col items-center gap-1 pt-1">
              <div className="flex items-center justify-center size-10 rounded-full bg-primary/20 text-primary border border-primary/30">
                <span className="material-symbols-outlined text-[20px]">chat</span>
              </div>
              <div className="w-[2px] bg-[#3a3629] h-full grow rounded-full my-2"></div>
            </div>
            <div className="flex flex-1 flex-col pb-8 pt-1">
              <p className="text-black text-lg font-bold leading-tight mb-1">Aceda ao Chat</p>
              <p className="text-text-secondary text-sm font-normal leading-normal">
                No menu principal, toque no ícone de suporte no canto inferior direito.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center gap-1 pt-1">
              <div className="flex items-center justify-center size-10 rounded-full bg-primary/20 text-primary border border-primary/30">
                <span className="material-symbols-outlined text-[20px]">list_alt</span>
              </div>
              <div className="w-[2px] bg-[#3a3629] h-full grow rounded-full my-2"></div>
            </div>
            <div className="flex flex-1 flex-col pb-8 pt-1">
              <p className="text-black text-lg font-bold leading-tight mb-1">Selecione o Assunto</p>
              <p className="text-text-secondary text-sm font-normal leading-normal">
                Escolha a opção "Gerente de Conta" ou "Investimentos Kz" na lista de tópicos.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center gap-1 pt-1">
              <div className="flex items-center justify-center size-10 rounded-full bg-primary/20 text-primary border border-primary/30">
                <span className="material-symbols-outlined text-[20px]">verified_user</span>
              </div>
            </div>
            <div className="flex flex-1 flex-col pt-1">
              <p className="text-black text-lg font-bold leading-tight mb-1">Conexão Segura</p>
              <p className="text-text-secondary text-sm font-normal leading-normal">
                Aguarde alguns instantes enquanto conectamos você ao seu gerente dedicado.
              </p>
            </div>
          </div>
        </div>

        {/* Info Card: Preparation */}
        <div className="px-5 pb-8">
          <div className="flex flex-col sm:flex-row items-stretch justify-between gap-4 rounded-xl bg-surface-dark p-5 shadow-sm border border-gray-200">
            <div className="flex flex-col gap-2 flex-1">
              <div className="flex items-center gap-2 mb-1 text-primary">
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>info</span>
                <p className="text-black text-base font-bold leading-tight">O que precisa?</p>
              </div>
              <p className="text-text-secondary text-sm font-normal leading-relaxed">
                Tenha seu <span className="text-black font-bold">ID de cliente</span> e os detalhes da transação em Kz prontos para agilizar o atendimento.
              </p>
            </div>
            <div
              className="w-full sm:w-24 h-28 sm:h-24 bg-center bg-no-repeat bg-cover rounded-lg shrink-0 border border-white/10 opacity-60"
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBKNotKwIaq8zlXsdmfW-CX_ciPrSOfqhA1N4tN5m7NPv-E6rOS6vkoPUJG6Aq8iA258pNIAFS1Wqw_FbA8tt7UBm5sUmsTacJf39AyMWEf4lEnbJOjzrR_yO_kiV5GUcRNe2bD108T9-Mn7ypMQngRdbL0ydfm-8RZGTRMBoRGOOrUPI-94Nd4bjE8-9OBF_s3-YmU6XjTuqGTpKub4ZP7zDIHkv8Y7dYaHAich7Nv5C5gT54rVplOpsFESzbtY-LJyqzh-gNJ-se_")' }}
            ></div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="px-5 pb-12">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Dúvidas Comuns</h3>
          <div className="divide-y divide-white/10 border-t border-b border-white/10">
            <div className="py-5 flex justify-between items-center group cursor-pointer hover:bg-white/5 px-1 transition-colors">
              <span className="text-black font-medium text-sm">Qual o horário de atendimento?</span>
              <span className="material-symbols-outlined text-gray-500 group-hover:text-primary transition-colors">expand_more</span>
            </div>
            <div className="py-5 flex justify-between items-center group cursor-pointer hover:bg-white/5 px-1 transition-colors">
              <span className="text-black font-medium text-sm">Posso agendar uma ligação?</span>
              <span className="material-symbols-outlined text-gray-500 group-hover:text-primary transition-colors">expand_more</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-background-dark/95 backdrop-blur-md border-t border-white/10 z-50">
        <button
          onClick={() => onOpenSupport?.()}
          className="w-full h-14 flex items-center justify-center gap-2 bg-primary hover:bg-green-400 active:scale-[0.98] text-black font-extrabold text-base rounded-xl transition-all shadow-[0_8px_16px_rgba(244,209,37,0.2)]"
        >
          <span>Falar com Gerente Agora</span>
          <span className="material-symbols-outlined text-[20px] font-bold">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};

export default TutoriaisFalarComGerente;

