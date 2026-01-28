import React, { useState } from 'react';

interface Props {
  onNavigate: (page: any) => void;
  onOpenSupport?: () => void;
}

const TutoriaisDepositos: React.FC<Props> = ({ onNavigate, onOpenSupport }) => {
  const steps = [
    {
      title: "Recarga via Software/APP",
      description: "Utilize o seu aplicativo bancário ou ATM para realizar o pagamento através dos dados abaixo.",
      icon: "payments",
      content: (
        <div className="space-y-4 w-full">
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
        </div>
      )
    },
    {
      title: "Recarga via IBAN",
      description: "Se preferir, utilize o IBAN abaixo para realizar a transferência a partir do seu banco.",
      icon: "account_balance",
      content: (
        <div className="bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden text-left mt-2 w-full">
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
      title: "Enviar Comprovativo",
      description: "Após realizar a recarga, envie o comprovativo para que o saldo seja validado em sua conta.",
      icon: "upload_file",
      content: (
        <div className="flex gap-3 items-start p-4 rounded-2xl bg-blue-50 border border-blue-100 text-left mt-2 w-full">
          <span className="material-symbols-outlined text-blue-500 text-sm mt-0.5">info</span>
          <p className="text-xs text-blue-600 font-medium leading-relaxed">
            O tempo médio de confirmação é de cerca de 10 minutos após o envio do comprovativo.
          </p>
        </div>
      )
    }
  ];

  return (
    <div className="fixed inset-0 z-[9999] bg-white font-sans text-black flex flex-col">
      {/* Top Navigation */}
      <div className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
        <div className="flex items-center justify-between px-4 h-16 max-w-md mx-auto">
          <button
            onClick={() => onNavigate('tutorials')}
            className="flex items-center justify-center size-10 -ml-2 rounded-full hover:bg-gray-50 transition-colors text-[#00C853]"
          >
            <span className="material-symbols-outlined text-[28px]">chevron_left</span>
          </button>
          <h1 className="text-base font-bold tracking-tight">Recarga Passo a Passo</h1>
          <button className="flex items-center justify-center size-10 -mr-2 rounded-full hover:bg-gray-50 transition-colors text-gray-400" onClick={() => onOpenSupport?.()}>
            <span className="material-symbols-outlined">help</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-6 w-full max-w-md mx-auto pb-32 no-scrollbar">
        <div className="pt-8 mb-8 text-center">
          <h2 className="text-2xl font-black leading-tight mb-3 tracking-tight">
            Como fazer sua <span className="text-[#00C853]">Recarga</span>
          </h2>
          <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-[280px] mx-auto">
            Siga estes passos simples para adicionar fundos com segurança.
          </p>

          <div className="mt-6 flex flex-col gap-2 items-center">
            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
              <span className="material-symbols-outlined text-[#00C853] text-[18px]">schedule</span>
              <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">10:00 - 22:00</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
              <span className="material-symbols-outlined text-[#00C853] text-[18px]">payments</span>
              <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">Mín: 3.000 Kz | Máx: 1.000.000 Kz</span>
            </div>
          </div>
        </div>

        {/* Vertical unified steps */}
        <div className="flex flex-col gap-8 relative">
          {/* Vertical line connector */}
          <div className="absolute left-[24px] top-8 bottom-8 w-0.5 bg-gray-100 z-0"></div>

          {steps.map((step, idx) => (
            <div key={idx} className="flex gap-4 relative z-10">
              <div className="shrink-0 size-12 rounded-2xl bg-white border-2 border-[#00C853] flex items-center justify-center shadow-lg shadow-green-100">
                <span className="material-symbols-outlined text-[#00C853] text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {step.icon}
                </span>
                <div className="absolute -top-2 -right-2 size-6 rounded-full bg-[#111] text-white text-[10px] font-black flex items-center justify-center border-2 border-white">
                  {idx + 1}
                </div>
              </div>
              <div className="flex-1 pt-1">
                <h3 className="text-[16px] font-black text-[#111] mb-1">{step.title}</h3>
                <p className="text-[13px] text-gray-500 leading-relaxed mb-4">{step.description}</p>
                {step.content && (
                  <div className="w-full">
                    {step.content}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Warning Section */}
        <div className="mt-12 bg-gray-50 p-6 rounded-[32px] border border-gray-100">
          <h4 className="font-black text-sm uppercase tracking-widest text-[#111] mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00C853]">verified_user</span>
            Importante
          </h4>
          <p className="text-xs text-gray-500 leading-relaxed italic">
            Utilize apenas os canais oficiais (Softwares de pagamento ou ATM). Nunca compartilhe suas senhas com ninguém. A BP Angola nunca solicita dados de acesso via Chat.
          </p>
        </div>
      </main>

      {/* Sticky Footer CTA */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white/80 backdrop-blur-xl border-t border-gray-100 z-50">
        <button
          onClick={() => onNavigate('deposit')}
          className="w-full flex h-14 cursor-pointer items-center justify-center rounded-2xl bg-[#00C853] text-black gap-3 text-[16px] font-black shadow-xl shadow-green-500/20 hover:brightness-110 active:scale-[0.98] transition-all"
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>add_circle</span>
          <span>Recarregar Agora</span>
        </button>
      </div>
    </div>
  );
};

export default TutoriaisDepositos;
