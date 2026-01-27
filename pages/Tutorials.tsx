
import React, { useState, useMemo } from 'react';

interface TutorialsProps {
  onNavigate: (page: any) => void;
}

interface TutorialItemData {
  icon: string;
  title: string;
  subtitle: string;
  route?: string;
}

interface TutorialSection {
  title: string;
  items: TutorialItemData[];
}

const tutorialsData: TutorialSection[] = [
  {
    title: 'TransaÃ§Ãµes',
    items: [
      {
        icon: 'arrow_circle_down',
        title: 'Tutoriais DepÃ³sitos',
        subtitle: 'Como adicionar fundos',
        route: 'tutoriais-depositos',
      },
      {
        icon: 'arrow_circle_up',
        title: 'Tutoriais Retiradas',
        subtitle: 'Como realizar saques',
        route: 'como-retirar-fundos',
      },
      {
        icon: 'upload_file',
        title: 'Tutoriais Enviar Comprovante ao Gerente',
        subtitle: 'Validar transaÃ§Ãµes',
        route: 'como-enviar-comprovante',
      },
    ],
  },
  {
    title: 'Conta & SeguranÃ§a',
    items: [
      {
        icon: 'account_balance',
        title: 'Tutoriais Adicionar Conta BancÃ¡ria',
        subtitle: 'Vincular dados bancÃ¡rios',
        route: 'tutoriais-adicionar-conta',
      },
      {
        icon: 'lock',
        title: 'Tutoriais Definir Senha de Retirada',
        subtitle: 'Criar senha de transaÃ§Ã£o',
        route: 'tutoriais-definir-senha',
      },
    ],
  },
  {
    title: 'Atividades & Loja',
    items: [
      {
        icon: 'shopping_bag',
        title: 'Tutoriais Comprar na Loja',
        subtitle: 'Usando saldo na BP',
        route: 'como-comprar',
      },
      {
        icon: 'task_alt',
        title: 'Tutoriais Ganhos de Tarefas',
        subtitle: 'Como completar e ganhar',
        route: 'tutoriais-ganhos-tarefas',
      },
    ],
  },
  {
    title: 'Suporte Oficial',
    items: [
      {
        icon: 'support_agent',
        title: 'Tutoriais Falar com o Gerente',
        subtitle: 'Obter suporte personalizado',
        route: 'tutoriais-falar-com-gerente',
      },
    ],
  },
];

const Tutorials: React.FC<TutorialsProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return tutorialsData;

    const lowerQuery = searchQuery.toLowerCase();

    return tutorialsData
      .map((section) => ({
        ...section,
        items: section.items.filter(
          (item) =>
            item.title.toLowerCase().includes(lowerQuery) ||
            item.subtitle.toLowerCase().includes(lowerQuery)
        ),
      }))
      .filter((section) => section.items.length > 0);
  }, [searchQuery]);

  return (
    <div className="flex flex-col min-h-screen bg-background-dark text-black font-display">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center bg-background-dark p-4 pb-2 justify-between border-b border-gray-200">
        <button
          onClick={() => onNavigate('profile')}
          className="text-primary flex size-12 shrink-0 items-center justify-start cursor-pointer hover:opacity-70"
        >
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>
        <h2 className="text-black text-lg font-bold leading-tight tracking-tight flex-1 text-center">Menu de Tutoriais</h2>
        <div className="flex w-12 items-center justify-end">
          {/* O botÃ£o de busca no header pode focar no input ou ser removido se redundante, mantendo visual por enquanto */}
          <button className="flex size-12 cursor-pointer items-center justify-center rounded-lg bg-transparent text-black">
            <span className="material-symbols-outlined text-[24px]">search</span>
          </button>
        </div>
      </header>

      {/* Search Input */}
      <div className="px-4 py-3 bg-background-dark">
        <div className="relative flex items-center w-full h-12 rounded-xl focus-within:ring-2 ring-primary bg-gray-100 overflow-hidden">
          <div className="grid place-items-center h-full w-12 text-gray-600">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </div>
          <input
            className="peer h-full w-full outline-none bg-transparent text-sm text-black pr-4 placeholder-gray-400"
            placeholder="Buscar ajuda..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-32">
        {filteredSections.length > 0 ? (
          filteredSections.map((section, index) => (
            <React.Fragment key={section.title}>
              <section className={index === 0 ? 'mt-2' : ''}>
                <h3 className="text-black tracking-tight text-xl font-bold leading-tight px-4 text-left pb-3 pt-4">
                  {section.title}
                </h3>
                {section.items.map((item) => (
                  <TutorialItem
                    key={item.title}
                    icon={item.icon}
                    title={item.title}
                    subtitle={item.subtitle}
                    onClick={() => item.route && onNavigate(item.route)}
                  />
                ))}
              </section>
              {index < filteredSections.length - 1 && (
                <div className="h-px bg-white/5 mx-6 my-2"></div>
              )}
            </React.Fragment>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center pt-10 text-gray-600">
            <span className="material-symbols-outlined text-[48px] mb-2">search_off</span>
            <p>Nenhum tutorial encontrado.</p>
          </div>
        )}
      </div>
    </div>
  );
};

interface TutorialItemProps {
  icon: string;
  title: string;
  subtitle: string;
  onClick?: () => void;
}

const TutorialItem: React.FC<TutorialItemProps> = ({ icon, title, subtitle, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-4 px-4 min-h-[72px] justify-between transition-colors rounded-xl mx-2 group ${onClick ? 'cursor-pointer hover:bg-white/5' : 'cursor-default'
      }`}
  >
    <div className="flex items-center gap-4 overflow-hidden">
      <div className="text-primary flex items-center justify-center rounded-full bg-primary/10 shrink-0 size-12 group-hover:bg-primary group-hover:text-black transition-colors">
        <span className="material-symbols-outlined text-[24px]">{icon}</span>
      </div>
      <div className="flex flex-col">
        <p className="text-black text-base font-semibold leading-normal truncate">{title}</p>
        <p className="text-gray-600 text-sm font-normal leading-normal truncate">{subtitle}</p>
      </div>
    </div>
    {onClick && (
      <div className="shrink-0 text-gray-500">
        <span className="material-symbols-outlined text-[24px]">chevron_right</span>
      </div>
    )}
  </div>
);

export default Tutorials;

