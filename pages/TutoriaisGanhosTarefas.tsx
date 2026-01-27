
import React from 'react';
import TutorialSlider from '../components/TutorialSlider';

interface Props {
  onNavigate: (page: any) => void;
}

const TutoriaisGanhosTarefas: React.FC<Props> = ({ onNavigate }) => {
  const steps = [
    {
      title: "Acesse a PÃ¡gina",
      description: "No menu inferior do aplicativo, toque no Ã­cone de Raio (Ganhos) para visualizar seu painel de controle financeiro.",
      icon: "bolt"
    },
    {
      title: "Acompanhe seu Saldo",
      description: "Seu saldo Ã© atualizado em tempo real na moeda local (Kz). O valor aumenta conforme suas tarefas sÃ£o processadas automaticamente.",
      icon: "account_balance_wallet",
      content: (
        <div className="flex flex-col items-center py-6 px-4 bg-surface-dark rounded-3xl border border-gray-200 shadow-sm">
          <p className="text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-widest">Saldo Acumulado</p>
          <h1 className="text-3xl font-black text-black italic">15.450,00 <span className="text-xs text-primary not-italic">Kz</span></h1>
        </div>
      )
    },
    {
      title: "Controle a OperaÃ§Ã£o",
      description: 'Use o botÃ£o central "Check-in DiÃ¡rio" para coletar suas recompensas. Mantenha o sistema ativo para maximizar ganhos.',
      icon: "power_settings_new",
      content: (
        <div className="flex justify-center py-4 relative">
          <div className="absolute size-24 rounded-full bg-primary/20 animate-pulse"></div>
          <div className="relative flex items-center justify-center size-20 rounded-3xl bg-primary shadow-lg shadow-primary/20 z-10">
            <span className="material-symbols-outlined text-black text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>power_settings_new</span>
          </div>
        </div>
      )
    },
    {
      title: "Itens Ativos",
      description: 'Verifique a lista de "Itens Ativos" para ver quais produtos estÃ£o gerando renda e o desempenho individual de cada um.',
      icon: "precision_manufacturing",
      content: (
        <div className="flex items-center gap-4 p-4 bg-surface-dark rounded-3xl border border-gray-200 opacity-90 text-left">
          <div className="relative size-14 shrink-0 rounded-2xl overflow-hidden bg-white flex items-center justify-center p-1">
            <div className="absolute top-1 right-1 size-2.5 bg-green-500 rounded-full border-2 border-white z-10"></div>
            <img loading="lazy" decoding="async" alt="Item" className="object-contain w-full h-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAlk7FIH9Fbmd2_EjOKGTAG7uhAvatv7BV3PL8P2XQ9Kxv-crFxTOoqZv4qnsFIkMb4abs_2S0sZ5KYvrVAm_lkO7w9kXvMLKDyZ7_33jJmyrJxiI7BYWZkT9y_5ZlCztmm9vsRf9zBnbqt50mihcm-bE4OsaGODnZeN-WaD-eyWAR1NxBlG-exEeqXZJwu_cugCnJGuJ1Tk98YQwuhH9Qc2JM492_pRAL2H40EWgN1pqi5k-yRbXYgSyZJtGJQh4xNKtk4GNq8K1h9" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-black truncate">PlayStation 5</h4>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="h-1.5 w-20 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[70%] rounded-full shadow-[0_0_8px_rgba(244,209,37,0.5)]"></div>
              </div>
              <span className="text-[10px] text-gray-500 font-bold uppercase">Gerando...</span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-sm font-black text-primary italic">+850 Kz</span>
            <p className="text-[10px] text-gray-500 font-bold">/hr</p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="bg-background-dark font-display text-black transition-colors duration-200 min-h-screen pb-32">
      <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sticky top-0 z-10 bg-background-dark/95 backdrop-blur-md border-b border-gray-200">
          <div
            onClick={() => onNavigate('tutorials')}
            className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-white/10 cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-primary">arrow_back</span>
          </div>
          <h2 className="text-base font-bold tracking-tight text-center flex-1">GestÃ£o de Ganhos</h2>
          <div className="size-10"></div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col px-6 pt-6 gap-8">
          <div className="text-center mb-4">
            <h1 className="text-2xl font-black italic text-black mb-3">Maximizar Ganhos</h1>
            <p className="text-gray-600 text-sm leading-relaxed max-w-[280px] mx-auto font-medium">
              Siga este guia para aprender a monitorar seus rendimentos e lucros.
            </p>
          </div>

          <TutorialSlider
            steps={steps}
            onFinish={() => onNavigate('ganhos-tarefas')}
            finishText="Ir para Ganhos"
          />
        </div>
      </div>
    </div>
  );
};

export default TutoriaisGanhosTarefas;

