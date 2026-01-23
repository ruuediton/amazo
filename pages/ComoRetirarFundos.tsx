
import React, { useRef, useState, useEffect } from 'react';

interface Props {
  onNavigate: (page: any) => void;
  onOpenSupport?: () => void;
}

const ComoRetirarFundos: React.FC<Props> = ({ onNavigate, onOpenSupport }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollPosition = scrollRef.current.scrollLeft;
      const width = scrollRef.current.offsetWidth;
      // Calculate active index based on scroll center. 
      // Approximate card width logic or center point.
      const cardWidth = scrollRef.current.scrollWidth / 3;
      const newIndex = Math.round(scrollPosition / cardWidth);
      if (newIndex !== activeStep && newIndex >= 0 && newIndex <= 2) {
        setActiveStep(newIndex);
      }
    }
  };

  const scrollToStep = (index: number) => {
    if (scrollRef.current) {
      const child = scrollRef.current.children[index] as HTMLElement;
      if (child) {
        child.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
      setActiveStep(index);
    }
  };

  useEffect(() => {
    handleScroll();
  }, []);

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-hidden bg-background-dark font-display text-black">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center bg-background-dark p-4 pb-2 justify-between border-b border-gray-200">
        <button
          onClick={() => onNavigate('tutorials')}
          className="text-primary flex size-12 shrink-0 items-center justify-start hover:opacity-70 transition-opacity cursor-pointer"
        >
          <span className="material-symbols-outlined text-3xl">arrow_back</span>
        </button>
        <h2 className="text-black text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">Como Retirar Fundos</h2>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-32">
        {/* Headline */}
        <div className="px-4 pb-2 pt-6">
          <h1 className="text-black tracking-tight text-[28px] font-extrabold leading-tight text-left">
            Retire seus Kz com segurança em <span className="text-primary">3 passos simples</span>.
          </h1>
          <p className="mt-2 text-sm text-text-secondary">Siga este guia rápido para transferir seu dinheiro.</p>
        </div>

        {/* Carousel of Steps */}
        <div className="mt-6 flex w-full flex-col">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory scroll-pl-4 gap-4 px-4 pb-4 no-scrollbar items-start"
          >
            {/* Step 1 */}
            <div className="snap-center flex-none w-[85%] max-w-[320px] flex flex-col gap-4 rounded-2xl bg-card-dark p-4 shadow-lg border border-gray-200">
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-zinc-800">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-90"
                  style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBAytjPFrnrmLQeBumrr09UNEiuHYFWM9x6hV7jqrk2I0mpUlerOn-Arg8kewCqbmhD0cr5YeXGy12xlfzV4OgCY7R6CQZ8x3DO5DdaqxXog9mSTRRxuAmIPGqfQzsCInIXQjxtJw1ZeTC3b1-V0QMNw33eBhHSfoNBG1Z05mrOBaSO6JqG1FOgOPhemPkVbeBW8y6pP8UO4KsCBUSec_DnYzpX0WCtLxlh6ByoGUV4OQK3iJXtaGHCOhuCboeVqUNZ7ak1j75FApL_")' }}
                ></div>
                <div className="absolute top-3 left-3 bg-primary text-black text-xs font-bold px-3 py-1 rounded-full">Passo 1</div>
              </div>
              <div>
                <h3 className="text-black text-lg font-bold leading-normal mb-1">Acessar Carteira</h3>
                <p className="text-text-secondary text-sm font-medium leading-relaxed">
                  Vá para o saldo da sua conta no painel principal e toque no botão de retirada.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="snap-center flex-none w-[85%] max-w-[320px] flex flex-col gap-4 rounded-2xl bg-card-dark p-4 shadow-lg border border-gray-200">
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-zinc-800">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-90"
                  style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAAtqj3utvCkYkhYjzMjNSOMNxvxlMzezN0Dbxa3x9DlDxXLca7DdJGY0EXqn2e4O4NLREZt5jgiuXyOtvcT7F1h1udye1CO0_ZpmtBfupb1MunxfHQvaHymVYilRAuq1OgTXtk7NcUkB2w8VtE3GBvpI07Co29vxYzNgoLRppJ87gM2_GQHgLkr-EkR4Ql633EPnsthbA8Ir6mngSCfmP0D3-LeQxBsS1ywJzHBasC_J-f0jveWir8NGa9k_uxPYrfWcsTxlEKVqay")' }}
                ></div>
                <div className="absolute top-3 left-3 bg-primary text-black text-xs font-bold px-3 py-1 rounded-full">Passo 2</div>
              </div>
              <div>
                <h3 className="text-black text-lg font-bold leading-normal mb-1">Escolher Método</h3>
                <p className="text-text-secondary text-sm font-medium leading-relaxed">
                  Escolha Transferência Bancária para bancos locais ou Saque com Agente.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="snap-center flex-none w-[85%] max-w-[320px] flex flex-col gap-4 rounded-2xl bg-card-dark p-4 shadow-lg border border-gray-200">
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-zinc-800">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-90"
                  style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCNLdKdDkaZqZE0fts8LLIBwg4Zngb4IJ-fEwi-XbuozHvTSz5g_PGP1GwvSBMBZXxyNEw2IcZwuP8_ysUTCVpddFnYwz3VFLWee7JLsOXoEe0Azrf6Hicr9vwLI8CTWxuM6EKfipC2a8EBBF1vL16Q_xJPebRwgf5ZXYMQPtqIVhpqQBg76R27w6hRhFC4FiuITaUzbNw6DeamnN56FOMsOZTuoA4POujhev2lZsIn8UpPTomYGpjg5NqUV9V4Trb3INpv1Hv4bOoP")' }}
                ></div>
                <div className="absolute top-3 left-3 bg-primary text-black text-xs font-bold px-3 py-1 rounded-full">Passo 3</div>
              </div>
              <div>
                <h3 className="text-black text-lg font-bold leading-normal mb-1">Confirmar e Verificar</h3>
                <p className="text-text-secondary text-sm font-medium leading-relaxed">
                  Insira seu PIN de segurança para autorizar a transação e finalizar o saque.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Page Indicators */}
        <div className="flex w-full flex-row items-center justify-center gap-2 py-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              onClick={() => scrollToStep(i)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${activeStep === i ? 'w-6 bg-primary' : 'w-1.5 bg-[#54503b]'
                }`}
            ></div>
          ))}
        </div>

        {/* Pro Tip Card */}
        <div className="p-4 mt-2">
          <div className="bg-primary/10 border border-primary/20 rounded-2xl p-5 flex items-start gap-4">
            <div className="bg-primary text-black rounded-full p-2 shrink-0 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">lightbulb</span>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-black text-base font-bold leading-tight">Dica Profissional</p>
              <p className="text-text-secondary text-sm font-medium leading-normal">
                Verifique os limites diários de retirada em Kz para evitar atrasos na sua transferência.
              </p>
            </div>
          </div>
        </div>

        {/* Help Link */}
        <div className="flex justify-center p-4">
          <button
            onClick={() => onOpenSupport?.()}
            className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">help</span>
            Precisa de mais ajuda?
          </button>
        </div>
      </main>

      {/* Sticky Footer CTA */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-background-dark border-t border-white/10 p-4 pb-8 z-40">
        <button
          onClick={() => onNavigate('retirada')}
          className="w-full h-14 bg-primary hover:bg-primary/90 active:scale-[0.98] transition-all rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 cursor-pointer"
        >
          <span className="text-black text-base font-bold font-display">Iniciar Retirada</span>
          <span className="material-symbols-outlined text-black">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};

export default ComoRetirarFundos;
