import React from 'react';
import TutorialSlider from '../components/TutorialSlider';

interface Props {
  onNavigate: (page: any) => void;
}

const TutoriaisGanhosTarefas: React.FC<Props> = ({ onNavigate }) => {
  const steps = [
    {
      title: "Acesse a Página",
      description: "No menu inferior do aplicativo, toque no ícone de Raio (Ganhos) para visualizar seu painel de controle financeiro.",
      icon: "bolt"
    },
    {
      title: "Acompanhe seu Saldo",
      description: "Seu saldo é atualizado em tempo real na moeda local (Kz). O valor aumenta conforme suas tarefas são processadas automaticamente.",
      icon: "account_balance_wallet",
      content: (
        <div className="flex flex-col items-center py-6 px-4 bg-gray-50 rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-widest">Saldo Acumulado</p>
          <h1 className="text-3xl font-black text-black">15.450,00 <span className="text-xs text-[#00C853]">Kz</span></h1>
        </div>
      )
    },
    {
      title: "Controle a Operação",
      description: 'Use o botão central "Check-in Diário" para coletar suas recompensas. Mantenha o sistema ativo para maximizar ganhos.',
      icon: "power_settings_new",
      content: (
        <div className="flex justify-center py-4 relative">
          <div className="absolute size-24 rounded-full bg-[#00C853]/20 animate-pulse"></div>
          <div className="relative flex items-center justify-center size-20 rounded-3xl bg-[#00C853] shadow-lg shadow-green-200 z-10">
            <span className="material-symbols-outlined text-white text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>power_settings_new</span>
          </div>
        </div>
      )
    },
    {
      title: "Itens Ativos",
      description: 'Verifique a lista de "Itens Ativos" para ver quais produtos estão gerando renda e o desempenho individual de cada um.',
      icon: "precision_manufacturing",
      content: (
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-3xl border border-gray-100 text-left">
          <div className="relative size-14 shrink-0 rounded-2xl overflow-hidden bg-white flex items-center justify-center p-1 border border-gray-100">
            <div className="absolute top-1 right-1 size-2.5 bg-green-500 rounded-full border-2 border-white z-10"></div>
            <img loading="lazy" decoding="async" alt="Item" className="object-contain w-full h-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAlk7FIH9Fbmd2_EjOKGTAG7uhAvatv7BV3PL8P2XQ9Kxv-crFxTOoqZv4qnsFIkMb4abs_2S0sZ5KYvrVAm_lkO7w9kXvMLKDyZ7_33jJmyrJxiI7BYWZkT9y_5ZlCztmm9vsRf9zBnbqt50mihcm-bE4OsaGODnZeN-WaD-eyWAR1NxBlG-exEeqXZJwu_cugCnJGuJ1Tk98YQwuhH9Qc2JM492_pRAL2H40EWgN1pqi5k-yRbXYgSyZJtGJQh4xNKtk4GNq8K1h9" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-black truncate">PlayStation 5</h4>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="h-1.5 w-20 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#00C853] w-[70%] rounded-full"></div>
              </div>
              <span className="text-[10px] text-gray-500 font-bold uppercase">Gerando...</span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-sm font-black text-[#00C853]">+850 Kz</span>
            <p className="text-[10px] text-gray-500 font-bold">/hr</p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="fixed inset-0 z-[9999] bg-white font-sans text-black">
      <div className="relative flex h-full w-full flex-col overflow-hidden max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white">
          <button
            onClick={() => onNavigate('tutorials')}
            className="flex size-10 shrink-0 items-center justify-start rounded-full hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-[#00C853] text-[28px]">chevron_left</span>
          </button>
          <h2 className="text-base font-bold tracking-tight text-center flex-1">Gestão de Ganhos</h2>
          <div className="size-10"></div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col px-6 pt-6 gap-8 overflow-y-auto">
          <div className="text-center mb-4">
            <h1 className="text-2xl font-black text-black mb-3">Maximizar Ganhos</h1>
            <p className="text-gray-500 text-sm leading-relaxed max-w-[280px] mx-auto font-medium">
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
