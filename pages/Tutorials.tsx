
import React, { useState, useMemo } from 'react';
import { jsPDF } from 'jspdf';

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

    const handleDownloadManual = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const marginSize = 20;
        const contentWidth = pageWidth - (marginSize * 2);

        // Helper for multi-line text with color control
        const addText = (text: string, yPos: number, fontSize = 10, isBold = false, color: [number, number, number] = [60, 60, 60]) => {
            doc.setFont('helvetica', isBold ? 'bold' : 'normal');
            doc.setFontSize(fontSize);
            doc.setTextColor(color[0], color[1], color[2]);
            const lines = doc.splitTextToSize(text, contentWidth);
            doc.text(lines, marginSize, yPos);
            return yPos + (lines.length * (fontSize * 0.5));
        };

        // Colors
        const GREEN: [number, number, number] = [0, 180, 50]; // Stronger green for PDF readability
        const RED: [number, number, number] = [200, 0, 0];    // Clear Red
        const BLACK: [number, number, number] = [30, 30, 30];

        // --- PAGE 1: COVER ---
        doc.setFillColor(0, 200, 83); // Brand Green
        doc.rect(0, 0, pageWidth, 50, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(28);
        doc.setFont('helvetica', 'bold');
        doc.text('MANUAL MESTRE | BP ANGOLA', pageWidth / 2, 30, { align: 'center' });

        doc.setFontSize(12);
        doc.text('Protocolo Oficial de Operações e Governança Digital', pageWidth / 2, 40, { align: 'center' });

        let currentY = 65;
        currentY = addText('DATA DE PUBLICAÇÃO: 30/02/2026', currentY, 10, true, BLACK);
        currentY += 10;

        currentY = addText('1. INTRODUÇÃO E VISÃO ESTRATÉGICA', currentY, 16, true, GREEN);
        currentY += 4;
        const longIntro = "Seja bem-vindo à BP Angola, a plataforma pioneira que está liderando a inclusão financeira digital na República de Angola. Este guia mestre não é apenas um manual, mas o alicerce de uma nova era econômica. Nossa visão é estabelecer um ecossistema onde a tecnologia e a confiança caminham juntas para proporcionar liberdade financeira real a todos os nossos membros. Através de uma infraestrutura robusta de marketplace de dispositivos eletrônicos e processamento de transações de alto nível, a BP conecta oportunidades globais à realidade local angolana. Este documento detalha cada engrenagem do nosso sistema, garantindo que você tenha o conhecimento necessário para escalar seus rendimentos com segurança jurídica e tecnológica total. Operamos sob os mais rígidos padrões de compliance para garantir que sua jornada conosco seja próspera e protegida.";
        currentY = addText(longIntro, currentY, 11, false, BLACK);
        currentY += 12;

        currentY = addText('2. ATIVAÇÃO DE CONTA E LEGIBILIDADE MÁXIMA', currentY, 16, true, GREEN);
        currentY += 4;
        currentY = addText('PARA QUE UM MEMBRO SEJA CONSIDERADO TOTALMENTE LEGÍVEL PELO SISTEMA E DESBLOQUEIE TODAS AS FUNCIONALIDADES PREMIUM, É ALTAMENTE RECOMENDADO O DEPÓSITO INICIAL MÍNIMO DE 10.000 KZs.', currentY, 12, true, RED);
        currentY += 4;
        currentY = addText('Esta ativação não é apenas um valor de recarga, mas o gatilho que valida sua identidade digital em nossa rede de segurança. Membros legíveis (10k+) têm acesso prioritário a tarefas de alto rendimento, sorteios exclusivos e participam da governança de bonificação acelerada da plataforma.', currentY, 11, false, BLACK);
        currentY += 12;

        currentY = addText('3. BENEFÍCIOS E RENDIMENTOS DISPONÍVEIS', currentY, 16, true, GREEN);
        currentY += 4;
        currentY = addText('• Renda por Tarefas: Execute a validação de pedidos em nossa loja e receba comissões diárias diretas.\n• Ativos Digitais: Dispositivos de marketplace que geram cashback cumulativo de longo prazo.\n• Bônus de Liderança: Recompensas exclusivas para membros que atingem marcos de crescimento de rede.', currentY, 11, false, BLACK);

        // --- PAGE 2: P2P, INVITES & SECURITY ---
        doc.addPage();
        currentY = 30;

        currentY = addText('4. TRANSFERÊNCIAS P2P E REDE INTERNA', currentY, 16, true, GREEN);
        currentY += 4;
        currentY = addText('A BP Angola orgulha-se de oferecer um sistema de TRANSFÊRENCIA INTERNA (P2P) totalmente legível e seguro. Esta funcionalidade permite que usuários transfiram saldo entre si instantaneamente, facilitando o comércio e a liquidez imediata dentro da comunidade. Operações P2P possuem uma taxa de processamento fixa de 5%, garantindo a manutenção da rede.', currentY, 11, false, BLACK);
        currentY = addText('Status Legal: OPERAÇÕES INTERNAS AUTORIZADAS 24/7', currentY, 10, true, GREEN);
        currentY += 12;

        currentY = addText('5. CONVITES E EXPANSÃO DA EQUIPE', currentY, 16, true, GREEN);
        currentY += 4;
        currentY = addText('Ao utilizar seu código de convite, você se torna um embaixador BP. O sistema de bonificação é estruturado para recompensar a indicação direta e o crescimento orgânico de sua equipe. Cada novo membro ativo em sua rede fortalece seu ranking e aumenta suas porcentagens de rendimento passivo sobre as tarefas concluídas pela sua equipe.', currentY, 11, false, BLACK);
        currentY += 12;

        currentY = addText('6. NORMAS DE SEGURANÇA E BLOQUEIOS', currentY, 16, true, RED);
        currentY += 4;
        currentY = addText('Sua segurança é nossa prioridade inegociável. Para protegê-lo, aplicamos Tolerância Zero para:', currentY, 11, true, RED);
        currentY = addText('• MULTI-CONTAS: É estritamente proibida a criação de múltiplas contas por um único CPF ou dispositivo.\n• AUTOMATIZAÇÃO: O uso de scripts ou bots para simular atividades resultará em banimento irreversível.\n• DADOS DE IBAN: O IBAN para retiradas deve corresponder ao titular da conta BP.', currentY, 11, false, BLACK);
        currentY += 15;

        currentY = addText('DECLARAÇÃO DE COMPLIANCE', currentY, 14, true, BLACK);
        currentY += 4;
        currentY = addText('Operamos sob as leis da República de Angola, garantindo que cada transação e cada Kwanza em seu saldo estejam sob protocolos de auditoria rigorosa. A BP é seu parceiro de confiança para o futuro.', currentY, 11, false, BLACK);

        // Footer on all pages
        const pgCount = doc.getNumberOfPages();
        for (let i = 1; i <= pgCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text(`Manual Mestre BP Angola | Publicado em: 30/02/2026 | Página ${i} de ${pgCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
        }

        doc.save('Manual_Mestre_BP_Angola.pdf');
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

            <div className="flex-1 overflow-y-auto pb-6 px-4">
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

                {/* Footer Download Button */}
                <div className="mt-12 mb-20 px-2">
                    <div className="p-6 bg-gray-50 rounded-[32px] border border-gray-100 flex flex-col items-center text-center gap-4">
                        <div className="size-16 rounded-3xl bg-[#00C853] flex items-center justify-center shadow-lg shadow-green-200">
                            <span className="material-symbols-outlined text-white text-[32px]">picture_as_pdf</span>
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-[#111] font-black text-lg">Manual Completo</h4>
                            <p className="text-gray-500 text-xs px-4">Consulte as políticas, regulamentos e termos oficiais da plataforma BP em um só lugar.</p>
                        </div>
                        <button
                            onClick={handleDownloadManual}
                            className="w-full h-14 bg-white border border-gray-200 text-[#111] font-bold rounded-2xl hover:bg-gray-100 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm"
                        >
                            <span className="material-symbols-outlined text-[#00C853]">download</span>
                            <span>Baixar Manual | BP</span>
                        </button>
                    </div>
                </div>
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
