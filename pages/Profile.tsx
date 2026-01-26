import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import SpokeSpinner from '../components/SpokeSpinner';
import { jsPDF } from 'jspdf';

interface ProfileProps {
  onNavigate: (page: any) => void;
  onLogout?: () => void;
  showToast?: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
  profile: any;
}

const Profile: React.FC<ProfileProps> = ({ onNavigate, onLogout, profile, showToast }) => {
  const [showBalance, setShowBalance] = useState(true);
  const [userPhone, setUserPhone] = useState<string | null>(null);
  const [currentProfile, setCurrentProfile] = useState<any>(profile);
  const [showManualModal, setShowManualModal] = useState(false);

  const [stats, setStats] = useState<any>({
    balance: profile?.balance || 0,
    reloaded_amount: 0,
    retirada_total: 0,
    renda_diaria: 0,
    fundo_aplicado: 0,
    renda_mensal: 0,
  });

  const fetchData = async () => {
    try {
      const [statsResult] = await Promise.all([
        supabase.rpc('get_profile_stats')
      ]);

      if (!statsResult.error && statsResult.data) {
        setStats(statsResult.data);
      }

      let displayPhone = currentProfile?.phone || "";
      if (displayPhone && !displayPhone.startsWith('+')) {
        displayPhone = `+244 ${displayPhone}`;
      }
      setUserPhone(displayPhone);
    } catch (err) {
      console.error("Profile fetch stats error:", err);
    }
  };

  useEffect(() => {
    if (profile) {
      setCurrentProfile(profile);
      fetchData();
    }
  }, [profile]);

  const generateManual = () => {
    try {
      const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });

      // --- COVER PAGE ---
      doc.setFillColor(255, 216, 20); // SmartBuy Yellow
      doc.rect(0, 0, 210, 297, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(40);
      doc.setTextColor(15, 17, 17); // SmartBuy Black
      doc.text('APRENDE', 105, 100, { align: 'center' });
      doc.text('AMAZON', 105, 115, { align: 'center' });

      doc.setFontSize(16);
      doc.setTextColor(50, 50, 50);
      doc.text('GUIA OFICIAL DO USUÁRIO', 105, 130, { align: 'center' });

      doc.setFontSize(12);
      doc.text('Versão 4.2.0', 105, 280, { align: 'center' });

      // --- PAGE 2: WELCOME ---
      doc.addPage();
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, 210, 297, 'F');

      // Header Bar
      doc.setFillColor(35, 47, 62); // SmartBuy Dark Blue
      doc.rect(0, 0, 210, 30, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.text('Bem-vindo ao SmartBuy App', 10, 20);

      // Content
      doc.setTextColor(15, 17, 17);
      doc.setFontSize(14);
      doc.text('Olá, Investidor!', 10, 50);

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      const welcomeText = "Parabéns por fazer parte da maior plataforma de investimentos simplificados. Este manual foi criado para ajudar você a dominar todas as funcionalidades do app e maximizar seus lucros.";
      const splitWelcome = doc.splitTextToSize(welcomeText, 190);
      doc.text(splitWelcome, 10, 60);

      // --- TUTORIAL SECTIONS ---
      let yPos = 90;

      const addSection = (title: string, content: string) => {
        // Calculate required height roughly: title (8) + lines * 6 + padding (15)
        const lines = doc.splitTextToSize(content, 190);
        const requiredHeight = 8 + (lines.length * 6) + 15;

        if (yPos + requiredHeight > 270) {
          doc.addPage();
          yPos = 30;
          // Header on new page
          doc.setFillColor(35, 47, 62);
          doc.rect(0, 0, 210, 20, 'F');
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(228, 121, 17); // SmartBuy Orange
        doc.text(title, 10, yPos);
        yPos += 8;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(60, 60, 60);
        doc.text(lines, 10, yPos);
        yPos += (lines.length * 6) + 15;
      };

      addSection('1. Como Recarregar sua Conta',
        "Para começar a investir, você precisa adicionar saldo:\n" +
        "- Vá até a aba 'Conta' e clique em 'Recarregar'.\n" +
        "- Escolha o método (Multicaixa ou USDT).\n" +
        "- Faça a transferência para os dados bancários exibidos.\n" +
        "- Envie o comprovante no app e aguarde a verificação em poucos minutos.");

      addSection('2. Aplicando em Fundos',
        "Faça seu dinheiro render:\n" +
        "- Acesse a opção 'Aplicar Fundo' no menu.\n" +
        "- Escolha um fundo disponível (ex: Eletrônicos, Livros).\n" +
        "- Digite o valor que deseja investir e confirme.\n" +
        "- Acompanhe seus lucros diários na aba 'Meus Fundos'.");

      addSection('3. Realizando Saques (Retirada)',
        "Retire seus lucros com facilidade:\n" +
        "- Primeiro, configure sua Senha de Retirada em 'Configurações'.\n" +
        "- Vá em 'Retirar Fundo' no perfil.\n" +
        "- Insira o valor e sua senha de retirada seis dígitos.\n" +
        "- O valor será processado e enviado para sua conta bancária cadastrada (IBAN) dentro de 24 horas úteis.");

      addSection('4. Programa de Convites',
        "Ganhe mais convidando amigos:\n" +
        "- Vá em 'Convidar Amigos' no seu perfil.\n" +
        "- Copie seu link ou código exclusivo.\n" +
        "- Quando seus amigos se cadastram e investem, você ganha comissões automáticas.");

      addSection('5. Como Enviar Comprovante',
        "Siga os passos para enviar seu comprovante com segurança:\n" +
        "1. Localizar Comprovante: Acesse seu histórico de transações, encontre o depósito recente e toque em 'Ver Comprovante'.\n" +
        "2. Acessar WhatsApp: Toque no botão oficial para abrir o WhatsApp.\n" +
        "3. Falar com Gerente: Inicie uma conversa com seu Gerente de conta SmartBuy (verifique o selo de verificação).\n" +
        "4. Anexar e Enviar: No chat, toque no anexo (clipe) e envie a imagem do comprovante.");

      addSection('6. Maximizar Ganhos',
        "Dicas para aumentar seus rendimentos:\n" +
        "- Acesse a Página de Ganhos (ícone de Raio) para visualizar seu painel.\n" +
        "- Acompanhe seu Saldo: Atualizado em tempo real na moeda local (Kz).\n" +
        "- Controle a Operação: Use o botão 'Check-in Diário' para coletar recompensas e mantenha o sistema ativo.");

      addSection('7. Segurança',
        "Sua segurança é prioridade. Nunca compartilhe sua senha de retirada com ninguém. " +
        "Se tiver problemas, use a opção 'Suporte' nas 'Configurações' para falar com nossa equipe.");

      // --- LEGAL & REGULATION SECTIONS ---

      addSection('REGULAMENTO INTERNO',
        "O descumprimento de qualquer uma das normas abaixo poderá resultar na suspensão imediata das atividades do utilizador e bloqueio preventivo de fundos para análise.\n\n" +
        "01. Operações de Caixa\nOs depósitos via Multicaixa Express são processados automaticamente 24/7. Pedidos de retirada são processados em dias úteis, das 09:00 às 18:00 (Hora de Luanda), com prazo de liquidação de até 24 horas úteis.\n\n" +
        "02. Limites e Taxas\nO valor mínimo de saque é de 1.000 Kz. A amazon reserva-se o direito de aplicar taxas administrativas sobre transações de acordo com o nível da conta do utilizador e as parcerias interbancárias vigentes.\n\n" +
        "03. Propriedade de Conta\nCada conta é pessoal e intransferível. A verificação de identidade (BI) é obrigatória para movimentações acima do limite básico. O uso de contas de terceiros para saques resultará em rejeição automática da transação.\n\n" +
        "04. Sistema de Ganhos\nA remuneração por tarefas e cashback é baseada em performance sistémica. Manipulações de software ou uso de bots para automatizar cliques violam as políticas de uso e levam ao encerramento definitivo da conta sem aviso prévio.");

      addSection('TERMOS E CONDIÇÕES',
        "Última atualização: 24 de Outubro de 2023.\n\n" +
        "Bem-vindo à amazon. Ao utilizar o nosso aplicativo e serviços bancários integrados, você concorda com os termos descritos abaixo.\n\n" +
        "01. Introdução\nAo criar uma conta na plataforma amazon, o utilizador declara ter capacidade jurídica e concorda integralmente com as regras de operação financeira, prazos de processamento e políticas de cashback vigentes.\n\n" +
        "02. Serviços Financeiros\nTodas as transações são efetuadas em Kwanzas (Kz). Depósitos via Multicaixa Express possuem tempo médio de compensação de 5 minutos, enquanto retiradas bancárias podem levar até 24 horas úteis. *A amazon não se responsabiliza por dados de IBAN inseridos incorretamente.\n\n" +
        "03. Marketplace e Ganhos\nA aquisição de dispositivos na loja amazon integrada concede ao utilizador o direito de participar de campanhas de recompensas por tarefas. Os rendimentos diários são variáveis.\n\n" +
        "04. Segurança\nO utilizador é o único responsável por manter o sigilo de sua senha. A amazon nunca solicitará sua senha por WhatsApp ou e-mail.");

      addSection('DECLARAÇÃO DE PRIVACIDADE',
        "A SmartBuy Angola Digital Services, SA assume o compromisso de proteger a privacidade dos seus utilizadores em conformidade com a Lei n.º 22/11 – Lei da Protecção de Dados Pessoais da República de Angola.\n\n" +
        "01. Recolha de Informação\nRecolhemos dados essenciais para a prestação de serviços financeiros: Nome, BI, IBAN, contacto telefónico e metadados de transação. Estes dados são processados exclusivamente para fins de segurança bancária.\n\n" +
        "02. Finalidade do Tratamento\nAs informações destinam-se à gestão da conta, processamento de depósitos/retiradas e prevenção contra branqueamento de capitais (AML).\n\n" +
        "03. Criptografia e Armazenamento\nTodos os dados são armazenados em servidores com criptografia militar. O acesso é restrito a pessoal autorizado.\n\n" +
        "04. Direitos do Titular\nAo abrigo da lei angolana, o utilizador tem o direito de aceder, retificar e solicitar a eliminação dos seus dados pessoais.\n\n" +
        "AUDITORIA INDEPENDENTE\nEste sistema de tratamento de dados é auditado periodicamente por entidades externas para garantir a resiliência contra ciberataques.");

      // Footer line if space permits on the last page, otherwise just let it flow
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);

      if (yPos + 20 > 280) {
        doc.addPage();
        yPos = 30;
      } else {
        yPos += 10;
      }
      doc.text("SmartBuy Angola Digital Services, SA", 10, yPos);
      doc.text("Luanda, República de Angola - Regulamentado pela APD", 10, yPos + 5);


      // Forced manual download to ensure correct MIME type and filename
      const pdfBlob = doc.output('blob');
      const blob = new Blob([pdfBlob], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'Manual_SmartBuy_Guia.pdf'; // Simplified, sure-fire extension
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      showToast?.('Manual baixado com sucesso!', 'success');
      setShowManualModal(false);
    } catch (err) {
      console.error(err);
      showToast?.('Erro ao gerar manual.', 'error');
      setShowManualModal(false);
    }
  };

  if (!currentProfile || !stats.balance === undefined) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black/5 backdrop-blur-sm">
      <SpokeSpinner size="w-12 h-12" className="text-black/60" />
    </div>
  );

  return (
    <div className="flex flex-col pb-32 bg-white text-[#111418] font-display overflow-x-hidden relative">
      {/* Header Section */}
      <div className="pt-6 pb-4 px-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold tracking-tight text-[#111418]">
              {currentProfile.full_name || 'Usuário amazon'}
            </h1>
            <div className="flex flex-col mt-1 space-y-0.5">
              <p className="text-[#637381] text-sm font-medium">{userPhone || '+244 000 000 000'}</p>
            </div>
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-[#f4d125] rounded-full">
              <span className="material-symbols-outlined text-[#111418] text-[16px] font-bold">verified</span>
              <span className="text-[#111418] text-[10px] font-extrabold uppercase tracking-wider">
                INVESTIDOR
              </span>
            </div>
          </div>
          <div className="relative shrink-0 ml-4">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-20 w-20 border-2 border-[#f4d125] shadow-sm"
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC_O5s3g5eF50cs5tQ_zh2NLwLYFyqEHtdcmZQASWBXJmsfG9k1wREC0IVW-eylYq2qw9Wumxb3YSS9L8wyFWSAANAxg0weMoxNXY5GHUshMgmu4w9sjeIyoflSKaECFCwFS1gStIJMDr7wVpnTKZtIpcTAH9dvh6Gana_Pw0-htT1Q9DdTGiPGHpfWu0oZKbmwz9Siq4VzRFUsXmwkyVAA2EOn-fhlHOMblENj8rod3pTqjUbUouxH6s1qZ6ZAEvzMM3z9YeCoHvE0")' }}
            ></div>
            <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md border border-gray-100">
              <span className="material-symbols-outlined text-[#111418] text-[14px] block">edit</span>
            </div>
          </div>
        </div>
      </div>

      {/* Balance Card Section */}
      <div className="px-4 mb-6">
        <div className="rounded-2xl bg-[#fefce8] p-6 border border-[#f4d125]/20 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none translate-x-4 -translate-y-4">
            <span className="material-symbols-outlined text-[120px] text-[#f4d125]">account_balance_wallet</span>
          </div>

          <div className="relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[#637381] text-xs font-bold uppercase tracking-widest mb-1">Saldo Disponível</p>
                <div className="flex items-center gap-2">
                  <h3 className="text-3xl font-extrabold text-[#111418] tracking-tight">
                    Kz {showBalance ? (stats.balance || 0).toLocaleString('pt-AO', { minimumFractionDigits: 2 }) : '••••••'}
                  </h3>
                  <button onClick={() => setShowBalance(!showBalance)} className="text-[#637381]/60">
                    <span className="material-symbols-outlined text-[20px]">
                      {showBalance ? 'visibility' : 'visibility_off'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-y-6 gap-x-1 mt-8 pt-4 border-t border-[#f4d125]/10">
            <div className="text-center">
              <p className="text-[9px] uppercase text-[#637381] font-bold tracking-wider">Recarga Total</p>
              <p className="text-[13px] font-bold text-[#111418] mt-1">Kz {(stats.reloaded_amount || 0).toLocaleString('pt-AO')}</p>
              <div className="mt-4 pt-3 border-t border-[#f4d125]/5">
                <p className="text-[9px] uppercase text-[#637381] font-bold tracking-wider">Fundo Aplicado</p>
                <p className="text-[13px] font-bold text-[#111418] mt-1">Kz {(stats.fundo_aplicado || 0).toLocaleString('pt-AO')}</p>
              </div>
            </div>
            <div className="text-center border-x border-[#f4d125]/10">
              <p className="text-[9px] uppercase text-[#637381] font-bold tracking-wider">Retirada Total</p>
              <p className="text-[13px] font-bold text-[#111418] mt-1">Kz {(stats.retirada_total || 0).toLocaleString('pt-AO')}</p>
              <div className="mt-4 pt-3 border-t border-[#f4d125]/5">
                <p className="text-[9px] uppercase text-[#637381] font-bold tracking-wider">Tempo Ativo</p>
                <p className="text-[13px] font-bold text-[#111418] mt-1">6h 12m</p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-[9px] uppercase text-[#637381] font-bold tracking-wider">Renda Diária</p>
              <p className="text-[13px] font-bold text-green-600 mt-1">+Kz {(stats.renda_diaria || 0).toLocaleString('pt-AO')}</p>
              <div className="mt-4 pt-3 border-t border-[#f4d125]/5">
                <p className="text-[9px] uppercase text-[#637381] font-bold tracking-wider">Renda Mensal</p>
                <p className="text-[13px] font-bold text-green-600 mt-1">+Kz {(stats.renda_mensal || 0).toLocaleString('pt-AO')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="px-4 space-y-6">
        <section>
          <h3 className="text-[11px] font-extrabold text-[#637381] uppercase tracking-[0.05em] mb-2.5 ml-1">Serviços</h3>
          <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
            {[
              { label: 'Retirar fundo', icon: 'account_balance_wallet', page: 'retirada' },
              { label: 'Recarregar', icon: 'payments', page: 'deposit' },
              { label: 'Recarga USDT', icon: 'stars', page: 'deposit-usdt' },
              { label: 'Aplicar Fundo', icon: 'trending_up', page: 'investimentos-fundo' },
              { label: 'Campanhas', icon: 'campaign', page: 'campaigns' },
              { label: 'Enviar Saldo (P2P)', icon: 'send_money', page: 'p2p-transfer' },
              { label: 'Baixar App', icon: 'download', page: 'download-app' },
              { label: 'Resgatar prêmios', icon: 'assignment', page: 'gift-chest' },
            ].map((item, i, arr) => (
              <div
                key={item.label}
                onClick={() => item.page ? onNavigate(item.page) : null}
                className={`flex items-center gap-3 p-3.5 ${i !== arr.length - 1 ? 'border-b-[0.5px] border-[#F3F4F6]' : ''} active:bg-gray-50 cursor-pointer`}
              >
                <div className="flex items-center justify-center rounded-lg bg-[#FFF9DB] text-[#f4d125] shrink-0 size-9">
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-[14px]">{item.label}</p>
                </div>
                <span className="material-symbols-outlined text-gray-300 text-xl">chevron_right</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-[11px] font-extrabold text-[#637381] uppercase tracking-[0.05em] mb-2.5 ml-1">Outros</h3>
          <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
            {[
              { label: 'Configurações', icon: 'settings', page: 'settings' },
              { label: 'Sobre a Empresa', icon: 'domain', page: 'info' },
              { label: 'Baixar Manual', icon: 'menu_book', action: () => setShowManualModal(true) },
            ].map((item, i, arr) => (
              <div
                key={item.label}
                onClick={() => item.action ? item.action() : (item.page ? onNavigate(item.page) : null)}
                className={`flex items-center gap-3 p-3.5 ${i !== arr.length - 1 ? 'border-b-[0.5px] border-[#F3F4F6]' : ''} active:bg-gray-50 cursor-pointer`}
              >
                <div className="flex items-center justify-center rounded-lg bg-[#FFF9DB] text-[#f4d125] shrink-0 size-9">
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-[14px]">{item.label}</p>
                </div>
                <span className="material-symbols-outlined text-gray-300 text-xl">chevron_right</span>
              </div>
            ))}
          </div>
        </section>

        <div className="pb-12 pt-4">
          <button
            onClick={onLogout}
            className="w-full py-3 text-center text-red-600 font-bold bg-[#fee2e2] active:bg-red-200 rounded-xl transition-colors text-[14px]"
          >
            Sair da Conta
          </button>
          <p className="text-center text-[10px] font-bold text-[#637381]/40 mt-6 uppercase tracking-widest">
            Versão 2.4.0
          </p>
        </div>
      </div>

      {/* Manual Download Modal */}
      {showManualModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowManualModal(false)}></div>
          <div className="bg-white w-full max-w-sm rounded-[24px] p-6 relative z-10 shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="size-16 rounded-2xl bg-[#FFD814] flex items-center justify-center mb-4 shadow-lg shadow-[#FFD814]/20 border border-[#FCD200]">
                <span className="material-symbols-outlined text-black text-4xl">library_books</span>
              </div>
              <h3 className="text-xl font-black text-[#0F1111] mb-2 leading-tight">Baixar Manual Aprende SmartBuy?</h3>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                Você está prestes a baixar o guia oficial em PDF com todos os tutoriais passo a passo.
              </p>

              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowManualModal(false)}
                  className="flex-1 py-3.5 bg-gray-100 rounded-xl font-bold text-gray-700 text-sm hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={generateManual}
                  className="flex-1 py-3.5 bg-[#FFD814] rounded-xl font-black text-[#0F1111] text-sm hover:bg-[#F7CA00] border border-[#FCD200] transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  Baixar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
