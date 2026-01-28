
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
    title: 'Transações',
    items: [
      {
        icon: 'arrow_circle_down',
        title: 'Tutoriais Recarga',
        subtitle: 'Como fazer recarga',
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
        subtitle: 'Validar transações',
        route: 'como-enviar-comprovante',
      },
    ],
  },
  {
    title: 'Conta & Segurança',
    items: [
      {
        icon: 'account_balance',
        title: 'Tutoriais Adicionar Conta Bancária',
        subtitle: 'Vincular dados bancários',
        route: 'tutoriais-adicionar-conta',
      },
      {
        icon: 'lock',
        title: 'Tutoriais Definir Senha de Retirada',
        subtitle: 'Criar senha de transação',
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
  const [showSearch, setShowSearch] = useState(false);

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

  const handleSearchToggle = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchQuery('');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-black font-sans">
      <header className="relative bg-gradient-to-b from-[#00C853] to-[#00C853]/10 pt-4 px-4 overflow-hidden mb-4">
        {/* Background Decorative Circles */}
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>

        {!showSearch ? (
          <div className="relative z-10 flex items-center justify-between">
            <button
              onClick={() => onNavigate('profile')}
              className="w-11 h-11 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md transition-all active:scale-90"
            >
              <span className="material-symbols-outlined text-white text-[28px]">arrow_back</span>
            </button>
            <h1 className="text-xl font-black text-white tracking-tight">Tutoriais</h1>
            <button
              onClick={handleSearchToggle}
              className="w-11 h-11 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md transition-all active:scale-90"
            >
              <span className="material-symbols-outlined text-white text-[24px]">search</span>
            </button>
          </div>
        ) : (
          <div className="relative z-10 flex items-center w-full gap-2">
            <div className="relative flex items-center flex-1 h-11 rounded-2xl bg-white/20 backdrop-blur-md overflow-hidden border border-white/30">
              <div className="grid place-items-center h-full w-11 text-white/70">
                <span className="material-symbols-outlined text-[20px]">search</span>
              </div>
              <input
                autoFocus
                className="peer h-full w-full outline-none bg-transparent text-sm text-white pr-4 placeholder-white/50"
                placeholder="Buscar ajuda..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              onClick={handleSearchToggle}
              className="w-11 h-11 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md transition-all active:scale-90"
            >
              <span className="material-symbols-outlined text-white text-[24px]">close</span>
            </button>
          </div>
        )}
      </header>

      <div className="flex-1 overflow-y-auto pb-32 px-4">
        {filteredSections.length > 0 ? (
          filteredSections.map((section, index) => (
            <React.Fragment key={section.title}>
              <section className={index === 0 ? 'mt-2' : 'mt-6'}>
                <h3 className="text-gray-700 tracking-tight text-sm font-bold leading-tight text-left pb-3 uppercase">
                  {section.title}
                </h3>
                <div className="flex flex-col gap-2">
                  {section.items.map((item) => (
                    <TutorialItem
                      key={item.title}
                      icon={item.icon}
                      title={item.title}
                      subtitle={item.subtitle}
                      onClick={() => item.route && onNavigate(item.route)}
                    />
                  ))}
                </div>
              </section>
            </React.Fragment>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center pt-20 text-gray-400">
            <span className="material-symbols-outlined text-[48px] mb-2">search_off</span>
            <p className="text-sm">Nenhum tutorial encontrado.</p>
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
    className={`flex items-center gap-4 p-4 min-h-[72px] justify-between transition-all rounded-2xl bg-gray-50 border border-transparent hover:border-gray-200 ${onClick ? 'cursor-pointer active:scale-[0.98]' : 'cursor-default'
      }`}
  >
    <div className="flex items-center gap-4 overflow-hidden flex-1">
      <div className="text-[#00C853] flex items-center justify-center rounded-full bg-[#00C853]/10 shrink-0 size-12">
        <span className="material-symbols-outlined text-[24px]">{icon}</span>
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <p className="text-[#111] text-[15px] font-bold leading-tight truncate">{title}</p>
        <p className="text-gray-500 text-[13px] font-normal leading-normal truncate mt-0.5">{subtitle}</p>
      </div>
    </div>
    {onClick && (
      <div className="shrink-0 text-gray-300">
        <span className="material-symbols-outlined text-[20px]">chevron_right</span>
      </div>
    )}
  </div>
);

export default Tutorials;
