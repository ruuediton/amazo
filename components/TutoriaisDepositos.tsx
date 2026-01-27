import React, { useState } from 'react';
import TutorialSlider from '../components/TutorialSlider';

interface Props {
  onNavigate: (page: any) => void;
  onOpenSupport?: () => void;
}

const TutoriaisDepositos: React.FC<Props> = ({ onNavigate, onOpenSupport }) => {
  const [activeTab, setActiveTab] = useState<'multicaixa' | 'bank'>('multicaixa');

  const multicaixaSteps = [
    {
      title: "Aceda ao App",
      description: "Abra a aplicação Multicaixa Express no seu telemóvel e faça login com o seu código PIN.",
      icon: "touch_app"
    },
    {
      title: "Selecione Pagamentos",
      description: 'No menu principal, escolha "Pagamentos" e de seguida a opção "Pagamento por Referência".',
      icon: "payments",
      content: (
        <div className="w-full h-32 rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-100 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#00C853]/10 via-transparent to-transparent"></div>
          <div className="flex flex-col items-center gap-2 opacity-50">
            <div className="w-32 h-2 rounded-full bg-gray-300"></div>
            <div className="w-20 h-2 rounded-full bg-gray-300"></div>
            <div className="flex gap-2 mt-2">
              <div className="size-8 rounded-lg bg-[#00C853]/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#00C853] text-sm">receipt_long</span>
              </div>
              <div className="size-8 rounded-lg bg-gray-200"></div>
              <div className="size-8 rounded-lg bg-gray-200"></div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Insira os Dados",
      description: "Utilize a Entidade e Referência abaixo para concluir o depósito. O valor mínimo é 2.000 Kz.",
      icon: "input",
      content: (
        <div className="space-y-4">
          <div className="bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden text-left">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">Entidade</span>
                <span className="font-mono text-xl font-bold tracking-wide text-black">00882</span>
              </div>
              <button className="size-10 flex items-center justify-center rounded-xl bg-[#00C853]/10 hover:bg-[#00C853]/20 text-[#00C853] transition-colors active:scale-95">
                <span className="material-symbols-outlined text-[20px]">content_copy</span>
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-100/50">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">Referência</span>
                <span className="font-mono text-xl font-bold tracking-wide text-black">923 411 882</span>
              </div>
              <button className="size-10 flex items-center justify-center rounded-xl bg-[#00C853]/10 hover:bg-[#00C853]/20 text-[#00C853] transition-colors active:scale-95">
                <span className="material-symbols-outlined text-[20px]">content_copy</span>
              </button>
            </div>
          </div>
          <div className="flex gap-3 items-start p-4 rounded-2xl bg-blue-50 border border-blue-100 text-left">
            <span className="material-symbols-outlined text-blue-500 text-sm mt-0.5">info</span>
            <p className="text-xs text-blue-600 font-medium leading-relaxed">
              Guarde o comprovativo digital. O saldo deve aparecer na sua conta BP em menos de 5 minutos.
            </p>
          </div>
        </div>
      )
    }
  ];

  const bankSteps = [
    {
      title: "Dados Bancários",
      description: "Utilize o IBAN abaixo para realizar a transferência a partir do seu banco.",
      icon: "account_balance",
      content: (
        <div className="bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden text-left mt-4">
          <div className="flex items-center justify-between p-4 bg-gray-100/50">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">IBAN</span>
              <span className="font-mono text-lg font-bold tracking-wide text-black break-all">AO06 0000 0000 0000 0000 0000 0</span>
            </div>
            <button className="size-10 flex items-center justify-center rounded-xl bg-[#00C853]/10 hover:bg-[#00C853]/20 text-[#00C853] transition-colors active:scale-95 shrink-0 ml-4">
              <span className="material-symbols-outlined text-[20px]">content_copy</span>
            </button>
          </div>
        </div>
      )
    },
    {
      title: "Realizar Transferência",
      description: "Faça a transferência do valor desejado no aplicativo do seu banco ou balcão.",
      icon: "payments"
    },
    {
      title: "Enviar Comprovativo",
      description: "É obrigatório enviar o comprovativo da transferência para a validação do saldo.",
      icon: "upload_file",
      content: (
        <div className="flex gap-3 items-start p-4 rounded-2xl bg-yellow-50 border border-yellow-100 text-left mt-2">
          <span className="material-symbols-outlined text-yellow-600 text-sm mt-0.5">warning</span>
          <p className="text-xs text-yellow-700 font-medium leading-relaxed">
            Sim, é estritamente necessário enviar a foto/PDF do comprovativo.
          </p>
        </div>
      )
    }
  ];

  return (
    <div className="fixed inset-0 z-[9999] bg-white font-sans text-black">
      {/* Top Navigation */}
      <div className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
        <div className="flex items-center justify-between px-4 h-16 max-w-md mx-auto">
          <button
            onClick={() => onNavigate('tutorials')}
            className="flex items-center justify-center size-10 -ml-2 rounded-full hover:bg-gray-50 transition-colors text-[#00C853]"
          >
            <span className="material-symbols-outlined text-[28px]">chevron_left</span>
          </button>
          <h1 className="text-base font-bold tracking-tight">Depósito Passo a Passo</h1>
          <button className="flex items-center justify-center size-10 -mr-2 rounded-full hover:bg-gray-50 transition-colors text-gray-400" onClick={() => onOpenSupport?.()}>
            <span className="material-symbols-outlined">help</span>
          </button>
        </div>

        {/* Method Selector (Chips) */}
        <div className="flex gap-3 px-4 pb-4 overflow-x-auto no-scrollbar items-center max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('multicaixa')}
            className={`group flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full pl-4 pr-4 transition-transform active:scale-95 ${activeTab === 'multicaixa'
                ? 'bg-[#00C853] text-white border border-[#00C853]'
                : 'bg-gray-100 text-gray-700 border border-transparent hover:border-[#00C853]/50'
              }`}
          >
            <p className={`text-sm font-bold leading-normal ${activeTab === 'multicaixa' ? 'text-white' : 'text-gray-700'}`}>
              Multicaixa Express
            </p>
          </button>
          <button
            onClick={() => setActiveTab('bank')}
            className={`group flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full pl-4 pr-4 transition-transform active:scale-95 ${activeTab === 'bank'
                ? 'bg-[#00C853] text-white border border-[#00C853]'
                : 'bg-gray-100 text-gray-700 border border-transparent hover:border-[#00C853]/50'
              }`}
          >
            <p className={`text-sm font-bold leading-normal ${activeTab === 'bank' ? 'text-white' : 'text-gray-700'}`}>
              Transferência Bancária
            </p>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="h-[calc(100vh-180px)] overflow-y-auto px-6 w-full max-w-lg mx-auto">
        <div className="pt-8 mb-10 text-center">
          <h2 className="text-2xl font-black leading-tight mb-3 tracking-tight">
            Como depositar com <span className="text-[#00C853]">
              {activeTab === 'multicaixa' ? 'Multicaixa' : 'Transferência'}
            </span>
          </h2>
          <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-[280px] mx-auto">
            Siga estes passos simples para adicionar fundos {activeTab === 'multicaixa' ? 'instantaneamente' : 'com segurança'}.
          </p>
        </div>

        {/* Tutorial Slider */}
        <TutorialSlider
          key={activeTab}
          steps={activeTab === 'multicaixa' ? multicaixaSteps : bankSteps}
          onFinish={() => onNavigate('deposit')}
          finishText="Fazer Depósito"
        />

        {/* FAQ Section */}
        <div className="mt-12 mb-6 border-t border-gray-100 pt-10">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-black">
            <span className="material-symbols-outlined text-[#00C853]" style={{ fontVariationSettings: "'FILL' 1" }}>help_center</span>
            Dúvidas Comuns
          </h3>
          <div className="space-y-4">
            <details className="group bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300">
              <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-100 transition-colors list-none">
                <span className="font-bold text-sm text-gray-700">Preciso enviar o comprovativo?</span>
                <span className="material-symbols-outlined text-gray-400 transition-transform duration-300 group-open:rotate-180">expand_more</span>
              </summary>
              <div className="px-5 pb-5 pt-0">
                <p className="text-sm text-gray-600 leading-relaxed text-left">
                  {activeTab === 'multicaixa'
                    ? "Não é necessário. O sistema valida automaticamente via MultiCaixa assim que o pagamento é processado."
                    : "Sim, é necessário enviar o comprovativo para que a validação seja realizada."}
                </p>
              </div>
            </details>
            <details className="group bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300">
              <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-100 transition-colors list-none">
                <span className="font-bold text-sm text-gray-700">Quanto tempo demora?</span>
                <span className="material-symbols-outlined text-gray-400 transition-transform duration-300 group-open:rotate-180">expand_more</span>
              </summary>
              <div className="px-5 pb-5 pt-0">
                <p className="text-sm text-gray-600 leading-relaxed text-left">
                  {activeTab === 'multicaixa'
                    ? "Normalmente o saldo entra em menos de 5 minutos após a confirmação no app MultiCaixa Express."
                    : "Para transferências bancárias, o tempo médio de confirmação é de cerca de 10 minutos após o envio do comprovativo."}
                </p>
              </div>
            </details>
          </div>
        </div>
      </main>

      {/* Sticky Footer CTA */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white border-t border-gray-100 z-40">
        <div className="flex gap-4">
          <button
            onClick={() => onOpenSupport?.()}
            className="shrink-0 size-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <span className="material-symbols-outlined">support_agent</span>
          </button>
          <button
            onClick={() => onNavigate('deposit')}
            className="flex-1 flex h-12 cursor-pointer items-center justify-center rounded-2xl bg-[#00C853] text-white gap-2 text-base font-bold leading-normal tracking-[0.015em] hover:brightness-110 active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
            <span>Depositar Agora</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutoriaisDepositos;
