
import React from 'react';

interface Props {
  onNavigate: (page: any) => void;
}

const TermsOfUse: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="bg-background-dark font-display text-black antialiased min-h-screen flex flex-col selection:bg-primary selection:text-black">
      <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto shadow-2xl">

        {/* Header */}
        <header className="sticky top-0 z-50 flex items-center bg-background-dark/95 p-4 pb-2 justify-between border-b border-gray-200 backdrop-blur-md">
          <button
            onClick={() => onNavigate('info')}
            className="text-primary flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
          <h2 className="text-black text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">Termos de Uso</h2>
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
                Bem-vindo à amazon. Ao utilizar o nosso aplicativo e serviços bancários integrados, você concorda com os termos descritos abaixo. Por favor, leia-os com atenção.
              </p>
            </section>

            {/* Divider */}
            <div className="h-px bg-white/5"></div>

            {/* Section 1 */}
            <section>
              <h3 className="text-primary text-xs font-black uppercase tracking-[0.2em] mb-3">01. Introdução</h3>
              <h4 className="text-lg font-bold mb-3 text-black">Aceitação dos Termos</h4>
              <p className="text-text-secondary text-sm leading-relaxed">
                Ao criar uma conta na plataforma amazon, o utilizador declara ter capacidade jurídica e concorda integralmente com as regras de operação financeira, prazos de processamento e políticas de cashback vigentes.
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
                  *A amazon não se responsabiliza por dados de IBAN inseridos incorretamente pelo utilizador.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h3 className="text-primary text-xs font-black uppercase tracking-[0.2em] mb-3">03. Marketplace e Ganhos</h3>
              <h4 className="text-lg font-bold mb-3 text-black">Produtos Eletrônicos</h4>
              <p className="text-text-secondary text-sm leading-relaxed">
                A aquisição de dispositivos na loja amazon integrada concede ao utilizador o direito de participar de campanhas de recompensas por tarefas. Os rendimentos diários são variáveis e dependem da eficiência do sistema e do tipo de dispositivo adquirido.
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <h3 className="text-primary text-xs font-black uppercase tracking-[0.2em] mb-3">04. Segurança</h3>
              <h4 className="text-lg font-bold mb-3 text-black">Privacidade de Dados</h4>
              <p className="text-text-secondary text-sm leading-relaxed">
                O utilizador é o único responsável por manter o sigilo de sua senha de acesso e senha de retirada. A amazon nunca solicitará sua senha por WhatsApp ou e-mail. Ative sempre a verificação em duas etapas quando disponível.
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
        <div className="fixed bottom-0 max-w-md w-full p-6 bg-background-dark/90 backdrop-blur-xl border-t border-gray-200 z-20">
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
