
import React from 'react';

interface Props {
  onNavigate: (page: any) => void;
}

const TermsOfUse: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="bg-background-dark font-display text-black antialiased min-h-screen flex flex-col selection:bg-primary selection:text-black">
      <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto">

        <header className="relative bg-gradient-to-b from-[#00C853] to-[#00C853]/10 pb-8 pt-4 px-4 overflow-hidden">
          {/* Background Decorative Circles */}
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>

          <div className="relative z-10 flex items-center justify-between">
            <button
              onClick={() => onNavigate('info')}
              className="w-11 h-11 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md transition-all active:scale-90"
            >
              <span className="material-symbols-outlined text-white text-[28px]">arrow_back</span>
            </button>
            <h1 className="text-xl font-black text-white tracking-tight">Termos</h1>
            <div className="w-11"></div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-6 pt-6 pb-24 no-scrollbar">
          <div className="flex flex-col gap-8">
            {/* Intro */}
            <section>
              <h1 className="text-3xl font-black mb-4 tracking-tight">Termos e Condições</h1>
              <p className="text-text-secondary text-sm leading-relaxed mb-4">
                Última atualização: 24 de Outubro de 2023.
              </p>
              <p className="text-black text-base font-medium leading-relaxed">
                Bem-vindo à BP. Ao utilizar o nosso aplicativo e serviços bancários integrados, você concorda com os termos descritos abaixo. Por favor, leia-os com atenção.
              </p>
            </section>

            {/* Divider */}
            <div className="h-px bg-white/5"></div>

            {/* Section 1 */}
            <section>
              <h3 className="text-primary text-xs font-black uppercase tracking-[0.2em] mb-3">01. Introdução</h3>
              <h4 className="text-lg font-bold mb-3 text-black">Aceitação dos Termos</h4>
              <p className="text-text-secondary text-sm leading-relaxed">
                Ao criar uma conta na plataforma BP, o utilizador declara ter capacidade jurídica e concorda integralmente com as regras de operação financeira, prazos de processamento e políticas de cashback vigentes.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h3 className="text-primary text-xs font-black uppercase tracking-[0.2em] mb-3">02. Serviços Financeiros</h3>
              <h4 className="text-lg font-bold mb-3 text-black">Depósitos e Retiradas</h4>
              <p className="text-text-secondary text-sm leading-relaxed">
                Todas as transações são efetuadas em Kwanzas (Kz). Depósitos via Multicaixa Express possuem tempo médio de compensação de 5 minutos, enquanto retiradas bancárias podem levar até 24 horas úteis para serem processadas pela rede interbancária nacional.
              </p>
              <div className="mt-4 p-4 rounded-xl bg-surface-dark border border-gray-200">
                <p className="text-xs text-text-secondary italic">
                  *A BP não se responsabiliza por dados de IBAN inseridos incorretamente pelo utilizador.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h3 className="text-primary text-xs font-black uppercase tracking-[0.2em] mb-3">03. Marketplace e Ganhos</h3>
              <h4 className="text-lg font-bold mb-3 text-black">Produtos Eletrônicos</h4>
              <p className="text-text-secondary text-sm leading-relaxed">
                A aquisição de dispositivos na loja BP integrada concede ao utilizador o direito de participar de campanhas de recompensas por tarefas. Os rendimentos diários são variáveis e dependem da eficiência do sistema e do tipo de dispositivo adquirido.
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <h3 className="text-primary text-xs font-black uppercase tracking-[0.2em] mb-3">04. Segurança</h3>
              <h4 className="text-lg font-bold mb-3 text-black">Privacidade de Dados</h4>
              <p className="text-text-secondary text-sm leading-relaxed">
                O utilizador é o único responsável por manter o sigilo de sua senha de acesso e senha de retirada. A BP nunca solicitará sua senha por WhatsApp ou e-mail. Ative sempre a verificação em duas etapas quando disponível.
              </p>
            </section>

            {/* Footer Legal Note */}
            <section className="pb-10 pt-4">
              <p className="text-[11px] text-gray-600 leading-relaxed text-center font-medium italic">
                Este documento é regido pelas leis da República de Angola. Qualquer litígio será resolvido no foro da comarca de Luanda.
              </p>
            </section>
          </div>
        </main>

        {/* Accept Button Overlay */}
        <div className="fixed bottom-0 max-w-md w-full p-6 bg-background-dark/90 border-t border-gray-200 z-20">
          <button
            onClick={() => onNavigate('info')}
            className="w-full bg-white/5 hover:bg-white/10 text-black font-bold py-4 rounded-2xl transition-all border border-white/10"
          >
            Fechar Termos
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUse;

