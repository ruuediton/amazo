
import React from 'react';

interface Props {
  onNavigate: (page: any) => void;
}

const SystemRules: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="bg-white font-display text-black antialiased min-h-screen flex flex-col selection:bg-primary selection:text-black">
      <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto shadow-2xl bg-white">

        {/* Header Institucional */}
        <header className="sticky top-0 z-50 flex items-center bg-white/95 p-4 pb-2 justify-between border-b border-gray-100 backdrop-blur-md">
          <button
            onClick={() => onNavigate('info')}
            className="text-primary flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
          <h2 className="text-black text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10 uppercase text-[12px] tracking-[0.15em]">Normas de Operação</h2>
        </header>

        {/* Conteúdo Rigoroso */}
        <main className="flex-1 overflow-y-auto px-6 pt-8 pb-32 no-scrollbar">

          {/* Selos de Compliance */}
          <div className="flex justify-around mb-10 bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <div className="flex flex-col items-center gap-2">
              <div className="size-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-[20px]">verified</span>
              </div>
              <span className="text-[8px] font-black text-gray-500 uppercase text-center leading-tight">Compliance<br />Verificado</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="size-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-blue-500 text-[20px]">rule</span>
              </div>
              <span className="text-[8px] font-black text-gray-500 uppercase text-center leading-tight">Auditoria<br />Externa</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="size-10 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-green-500 text-[20px]">shield_check</span>
              </div>
              <span className="text-[8px] font-black text-gray-500 uppercase text-center leading-tight">Operação<br />Protegida</span>
            </div>
          </div>

          <div className="flex flex-col gap-10">
            <section>
              <h1 className="text-2xl font-black mb-4 leading-tight tracking-tight border-l-4 border-primary pl-4">Regulamento Interno</h1>
              <p className="text-gray-500 text-sm leading-relaxed mb-6 italic">
                O descumprimento de qualquer uma das normas abaixo poderá resultar na suspensão imediata das atividades do utilizador e bloqueio preventivo de fundos para análise.
              </p>
            </section>

            {/* Regra 1 */}
            <RuleBlock
              id="01"
              title="Operações de Caixa"
              content="Os depósitos via Multicaixa Express são processados automaticamente 24/7. Pedidos de retirada são processados em dias úteis, das 09:00 às 18:00 (Hora de Luanda), com prazo de liquidação de até 24 horas úteis."
            />

            {/* Regra 2 */}
            <RuleBlock
              id="02"
              title="Limites e Taxas"
              content="O valor mínimo de saque é de 1.000 Kz. A SmartBuy reserva-se o direito de aplicar taxas administrativas sobre transações de acordo com o nível da conta do utilizador e as parcerias interbancárias vigentes."
            />

            {/* Regra 3 */}
            <RuleBlock
              id="03"
              title="Propriedade de Conta"
              content="Cada conta é pessoal e intransferível. A verificação de identidade (BI) é obrigatória para movimentações acima do limite básico. O uso de contas de terceiros para saques resultará em rejeição automática da transação."
            />

            {/* Regra 4 */}
            <RuleBlock
              id="04"
              title="Sistema de Ganhos"
              content="A remuneração por tarefas e cashback é baseada em performance sistémica. Manipulações de software ou uso de bots para automatizar cliques violam as políticas de uso e levam ao encerramento definitivo da conta sem aviso prévio."
            />

            {/* Nota de Rodapé Oficial */}
            <div className="mt-6 flex flex-col items-center gap-4 py-8 border-t border-gray-100">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAX1nZQgiOTx5eDY9az3IDpQxwq_xV55MjgvXJXONNRdsEThtofBf4cQ4HsSMhjnPHjVXbszEBW3mCQVuCQ2y-P0l1unQR2pNSCUhmhyKL3gJ6P3P8N5KlKVx5gToFfYvygunNhf9O8u5gMKPMytTu6s2CyUGsrz3F_qOQ_WpHb6jImikbGi4ZciIi16FgBYvSa-NmtEbWfOZkTAOnX--ev6DldHY6b0R7j-1utVDZ9g7ww5tdCA9u5r-7lF5q2G2FoNTuDPzAbIkT9"
                alt="SmartBuy Seal"
                className="h-12 opacity-80 grayscale"
              />
              <p className="text-[10px] text-gray-400 leading-relaxed text-center font-bold uppercase tracking-[0.2em]">
                SmartBuy Angola Digital Services, SA<br />
                Registo n.º 0284/2024
              </p>
            </div>
          </div>
        </main>

        {/* Botão de Fechar */}
        <div className="fixed bottom-0 max-w-md w-full p-6 bg-white/95 backdrop-blur-xl border-t border-gray-100 z-20">
          <button
            onClick={() => onNavigate('info')}
            className="w-full bg-primary text-black font-bold py-4 rounded-xl transition-all shadow-lg active:scale-[0.98]"
          >
            LI E CONCORDO
          </button>
        </div>
      </div>
    </div>
  );
};

const RuleBlock = ({ id, title, content }: { id: string, title: string, content: string }) => (
  <div className="flex flex-col gap-3 group">
    <div className="flex items-center gap-3">
      <span className="text-[10px] font-black text-black bg-primary px-2 py-0.5 rounded shadow-sm">{id}</span>
      <h3 className="text-sm font-black uppercase tracking-widest text-black group-hover:text-primary transition-colors">{title}</h3>
    </div>
    <p className="text-gray-600 text-[13px] leading-relaxed pl-1">
      {content}
    </p>
  </div>
);

export default SystemRules;
