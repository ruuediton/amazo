
import React from 'react';

interface Props {
  onNavigate: (page: any) => void;
}

const PrivacyPolicy: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="bg-white font-display text-black antialiased min-h-screen flex flex-col selection:bg-primary selection:text-black">
      <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto shadow-2xl bg-white">

        {/* Header Profissional */}
        <header className="sticky top-0 z-50 flex items-center bg-white/95 p-4 pb-2 justify-between border-b border-gray-100 backdrop-blur-md">
          <button
            onClick={() => onNavigate('info')}
            className="text-primary flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
          <h2 className="text-black text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10 uppercase text-[13px] tracking-[0.1em]">Privacidade & Segurança</h2>
        </header>

        {/* Conteúdo Legal */}
        <main className="flex-1 overflow-y-auto px-6 pt-8 pb-32 no-scrollbar">
          {/* Logo SmartBuy */}
          <div className="flex justify-center mb-8">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_O5s3g5eF50cs5tQ_zh2NLwLYFyqEHtdcmZQASWBXJmsfG9k1wREC0IVW-eylYq2qw9Wumxb3YSS9L8wyFWSAANAxg0weMoxNXY5GHUshMgmu4w9sjeIyoflSKaECFCwFS1gStIJMDr7wVpnTKZtIpcTAH9dvh6Gana_Pw0-htT1Q9DdTGiPGHpfWu0oZKbmwz9Siq4VzRFUsXmwkyVAA2EOn-fhlHOMblENj8rod3pTqjUbUouxH6s1qZ6ZAEvzMM3z9YeCoHvE0"
              alt="SmartBuy"
              className="h-16 w-16 rounded-2xl shadow-lg border border-gray-100"
            />
          </div>

          {/* Selos de Confiança */}
          <div className="flex justify-center gap-6 mb-10">
            <div className="flex flex-col items-center gap-2">
              <div className="size-12 rounded-full bg-green-50 border border-green-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-green-500 text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              </div>
              <span className="text-[9px] font-bold text-gray-400 uppercase text-center tracking-tighter">Dados<br />Protegidos</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="size-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-[24px]">lock</span>
              </div>
              <span className="text-[9px] font-bold text-gray-400 uppercase text-center tracking-tighter">SSL<br />256-BIT</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="size-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-blue-500 text-[24px]">gavel</span>
              </div>
              <span className="text-[9px] font-bold text-gray-400 uppercase text-center tracking-tighter">Lei<br />22/11 AO</span>
            </div>
          </div>

          <div className="flex flex-col gap-10">
            <section>
              <h1 className="text-2xl font-black mb-4 leading-tight">Declaração de Privacidade</h1>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                A SmartBuy Angola Digital Services, SA (adiante "SmartBuy") assume o compromisso de proteger a privacidade dos seus utilizadores em conformidade com a <span className="text-black font-bold italic underline decoration-primary/40">Lei n.º 22/11 – Lei da Protecção de Dados Pessoais</span> da República de Angola.
              </p>
            </section>

            {/* Seções Rigorosas */}
            <LegalSection
              number="01"
              title="Recolha de Informação"
              content="Recolhemos dados essenciais para a prestação de serviços financeiros: Nome, BI, IBAN, contacto telefónico e metadados de transação. Estes dados são processados exclusivamente para fins de segurança bancária e validação de operações em Kz."
            />

            <LegalSection
              number="02"
              title="Finalidade do Tratamento"
              content="As informações recolhidas destinam-se à gestão da conta do utilizador, processamento de depósitos/retiradas via Multicaixa Express e prevenção contra branqueamento de capitais (AML) e financiamento ao terrorismo."
            />

            <LegalSection
              number="03"
              title="Criptografia e Armazenamento"
              content="Todos os dados são armazenados em servidores com criptografia militar. O acesso físico e digital aos dados é restrito a pessoal autorizado sob rigoroso dever de sigilo profissional."
            />

            <LegalSection
              number="04"
              title="Direitos do Titular"
              content="Ao abrigo da lei angolana, o utilizador tem o direito de aceder, retificar, atualizar e solicitar a eliminação dos seus dados pessoais, bem como a opor-se ao seu tratamento para fins de marketing direto."
            />

            {/* Nota de Auditoria */}
            <div className="mt-4 p-5 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-[20px]">security</span>
                <span className="text-xs font-black uppercase tracking-widest">Auditoria Independente</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed italic">
                "Este sistema de tratamento de dados é auditado periodicamente por entidades externas para garantir a resiliência contra ciberataques e vazamento de informações."
              </p>
            </div>

            {/* Rodapé Legal */}
            <section className="pb-12 pt-6">
              <p className="text-[10px] text-gray-400 leading-relaxed text-center font-bold uppercase tracking-widest">
                SmartBuy Angola Digital Services, SA<br />
                Luanda, República de Angola<br />
                Regulamentado pela APD (Agência de Proteção de Dados)
              </p>
            </section>
          </div>
        </main>

        {/* Botão de Fechar */}
        <div className="fixed bottom-0 max-w-md w-full p-6 bg-white/95 backdrop-blur-xl border-t border-gray-100 z-20">
          <button
            onClick={() => onNavigate('info')}
            className="w-full bg-primary hover:bg-[#eac410] text-black font-black py-4 rounded-xl transition-all shadow-lg shadow-primary/20 active:scale-[0.98]"
          >
            CONFIRMAR LEITURA
          </button>
        </div>
      </div>
    </div>
  );
};

const LegalSection = ({ number, title, content }: { number: string, title: string, content: string }) => (
  <section className="flex flex-col gap-3">
    <div className="flex items-center gap-4">
      <span className="text-[10px] font-black text-primary border border-primary/40 rounded px-1.5 py-0.5">{number}</span>
      <h3 className="text-sm font-black uppercase tracking-widest text-black">{title}</h3>
    </div>
    <p className="text-gray-600 text-[13px] leading-relaxed pl-10 border-l border-gray-200">
      {content}
    </p>
  </section>
);

export default PrivacyPolicy;
