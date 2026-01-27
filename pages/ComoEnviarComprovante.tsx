
import React from 'react';

interface Props {
  onNavigate: (page: any) => void;
  onOpenSupport?: () => void;
}

const ComoEnviarComprovante: React.FC<Props> = ({ onNavigate, onOpenSupport }) => {
  return (
    <div className="bg-background-dark font-display text-black antialiased min-h-screen selection:bg-primary selection:text-primary-content">
      {/* Main Container */}
      <div className="relative flex min-h-screen w-full flex-col mx-auto max-w-md bg-background-dark shadow-xl overflow-hidden">
        {/* Sticky Header */}
        <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-background-dark/95 backdrop-blur-md border-b border-gray-800">
          <button
            onClick={() => onNavigate('tutorials')}
            className="flex items-center justify-center p-2 -ml-2 rounded-full hover:bg-surface-dark transition-colors text-primary"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-base font-bold leading-tight tracking-tight text-center flex-1 text-black">
            Ajuda
          </h1>
          <button onClick={() => onOpenSupport?.()} className="flex items-center justify-center p-2 -mr-2 rounded-full hover:bg-surface-dark transition-colors text-black">
            <span className="material-symbols-outlined">help</span>
          </button>
        </header>

        {/* Hero Section */}
        <section className="flex flex-col px-5 pt-6 pb-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/20 text-primary">
              <span className="material-symbols-outlined text-[28px]">receipt_long</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">Tutorial</span>
              <h2 className="text-2xl font-bold leading-tight text-black">
                Como enviar comprovante
              </h2>
            </div>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            Siga os passos abaixo para enviar seu comprovante de depósito com segurança para seu gerente via WhatsApp.
          </p>
        </section>

        {/* Timeline Steps */}
        <main className="flex-1 px-5 py-6">
          <div className="relative flex flex-col gap-8">
            {/* Vertical Line */}
            <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-gray-800 -z-10"></div>

            {/* Step 1 */}
            <div className="group relative flex gap-5">
              <div className="flex flex-col items-center">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-dark border-2 border-primary text-primary font-bold shadow-sm z-10 transition-transform group-hover:scale-110">
                  1
                </div>
              </div>
              <div className="flex flex-col gap-2 pb-2 pt-1">
                <h3 className="text-lg font-bold text-black">Localizar Comprovante</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Acesse seu histórico de transações no app, encontre o depósito recente e toque em <span className="font-bold text-black">"Ver Comprovante"</span>.
                </p>
                <div className="mt-3 overflow-hidden rounded-lg bg-surface-dark border border-gray-700/50">
                  <div className="flex items-center p-3 gap-3">
                    <div className="bg-primary/20 p-2 rounded-lg">
                      <span className="material-symbols-outlined text-primary">description</span>
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                      <div className="h-2 w-3/4 rounded-full bg-gray-600"></div>
                      <div className="h-2 w-1/2 rounded-full bg-gray-600"></div>
                    </div>
                    <span className="material-symbols-outlined text-gray-600">share</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="group relative flex gap-5">
              <div className="flex flex-col items-center">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-dark border-2 border-gray-600 text-gray-600 font-bold shadow-sm z-10">
                  2
                </div>
              </div>
              <div className="flex flex-col gap-2 pb-2 pt-1">
                <h3 className="text-lg font-bold text-black">Acessar WhatsApp</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Toque no botão oficial abaixo para abrir o WhatsApp ou abra o aplicativo manualmente em seu telefone.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="group relative flex gap-5">
              <div className="flex flex-col items-center">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-dark border-2 border-gray-600 text-gray-600 font-bold shadow-sm z-10">
                  3
                </div>
              </div>
              <div className="flex flex-col gap-2 pb-2 pt-1">
                <h3 className="text-lg font-bold text-black">Falar com Gerente</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Inicie uma conversa com seu Gerente de conta BP. Verifique se o contato tem o selo de verificação.
                </p>
                <div className="mt-2 flex items-center gap-3 p-3 rounded-lg bg-surface-dark border border-gray-700/50">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-700">
                    {/* Fixed 'class' to 'className' in the img tag below */}
                    <img loading="lazy" decoding="async" alt="Manager" className="h-full w-full object-cover contrast-[1.05] brightness-[1.02] saturate-[1.05]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcwFydBne7VizYPMGVotVwmDnOqYyQInyepZHmPXZPjiw4XCv2h3bYr70mLhgayqZml3KW8F4P0aIIIBA1o28WZortjn2-KETMm8PLPc75cpgwtE_QjNJ1mQ5R9aVZ2_ul2NE1zQ0lLCZ71b-twNpfHlvUzNgTVAwg8S_DDA6STerWujt8veb1rO8Xt01i6r6cqps22WAmrEnrKVoTbsPvzUKPGArA91sxFSjef8eo52D-fXowfUdcNY-bjbvXiD54x1nuZlPSp6hO" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-black flex items-center gap-1">
                      Gerente BP
                      <span className="material-symbols-outlined text-green-500 text-[16px] fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    </span>
                    <span className="text-xs text-gray-500">Online agora</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="group relative flex gap-5">
              <div className="flex flex-col items-center">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-dark border-2 border-gray-600 text-gray-600 font-bold shadow-sm z-10">
                  4
                </div>
              </div>
              <div className="flex flex-col gap-2 pb-2 pt-1">
                <h3 className="text-lg font-bold text-black">Anexar e Enviar</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  No chat, toque no ícone de clipe (anexo), selecione o comprovante na sua galeria e envie a imagem.
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Help Accordion */}
        <section className="px-5 pb-24">
          <details className="group rounded-xl bg-surface-dark border border-gray-800 overflow-hidden transition-all duration-300 open:pb-4">
            <summary className="flex cursor-pointer items-center justify-between gap-4 p-4 list-none">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 text-gray-600">
                  <span className="material-symbols-outlined text-[20px]">help_outline</span>
                </div>
                <span className="text-sm font-semibold text-black">Problemas ao enviar?</span>
              </div>
              <span className="material-symbols-outlined text-gray-500 transition-transform group-open:rotate-180">expand_more</span>
            </summary>
            <div className="px-4 pl-[3.25rem]">
              <p className="text-xs text-gray-500 leading-relaxed">
                Certifique-se de que a imagem do comprovante esteja legível e contenha a data, valor da transação e ID. Se o WhatsApp não abrir, verifique se o app está instalado.
              </p>
            </div>
          </details>
        </section>

        {/* Sticky Footer CTA */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-background-dark border-t border-gray-800 p-5 backdrop-blur-lg bg-opacity-95 max-w-md mx-auto">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-center gap-2 text-xs text-green-500 mb-1">
              <span className="material-symbols-outlined text-[16px] fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
              <span className="font-medium">Canal oficial e seguro</span>
            </div>
            <button onClick={() => onOpenSupport?.()} className="w-full h-12 flex items-center justify-center gap-2 rounded-lg bg-primary hover:bg-green-400 active:scale-[0.98] transition-all text-background-dark font-bold text-base shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined">chat</span>
              Falar com o Gerente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComoEnviarComprovante;

