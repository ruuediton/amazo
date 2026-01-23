
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { jsPDF } from 'jspdf';
import SpokeSpinner from '../components/SpokeSpinner';

export interface Transaction {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  time: string;
  dateLabel: string;
  monthIndex: number;
  type: 'incoming' | 'outgoing' | 'info' | 'warning';
  category: 'Depósito' | 'Retirada' | 'Segurança' | 'Bônus' | 'Compras' | 'Misto';
  status?: string;
  year: number;
}

interface Props {
  onNavigate: (page: any) => void;
}

const months = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
];

const HistoricoConta: React.FC<Props> = ({ onNavigate }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [activeMonth, setActiveMonth] = useState(new Date().getMonth());
  const [activeDay, setActiveDay] = useState<number | 'Todos'>('Todos');
  const [activeYear, setActiveYear] = useState(new Date().getFullYear());
  const [activeType, setActiveType] = useState<'Misto' | 'Depósito' | 'Retirada' | 'Segurança'>('Misto');
  const [activeTimeRange, setActiveTimeRange] = useState<'Dia Inteiro' | 'Manhã (06-12)' | 'Tarde (12-18)' | 'Noite (18-00)'>('Dia Inteiro');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfProgress, setPdfProgress] = useState(0);
  const [userProfile, setUserProfile] = useState<{ code: string, phone: string } | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRealData();
  }, []);

  const fetchRealData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Buscar perfil para o Código e Telefone
      const { data: profile } = await supabase
        .from('profiles')
        .select('code')
        .eq('user_id', user.id)
        .single();

      setUserProfile({
        code: profile?.code || "N/A",
        phone: user.phone || user.user_metadata?.phone || "N/A"
      });

      const { data: deposits } = await supabase.from('deposits').select('*').eq('user_id', user.id);
      const { data: withdrawals } = await supabase.from('withdrawals').select('*').eq('user_id', user.id);
      const { data: purchases } = await supabase.from('historico_compra').select('*').eq('uid_user', user.id);

      const combined: Transaction[] = [];

      deposits?.forEach(d => {
        const date = new Date(d.created_at);
        combined.push({
          id: `dep-${d.id}`,
          title: 'Depósito de Saldo',
          subtitle: `${d.nome_banco || d.method} - ${d.status_playment || 'Pendente'}`,
          amount: Number(d.amount),
          time: date.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
          dateLabel: `${date.getDate()} de ${months[date.getMonth()]}`,
          monthIndex: date.getMonth(),
          year: date.getFullYear(),
          type: 'incoming',
          category: 'Depósito',
          status: d.status_playment
        });
      });

      withdrawals?.forEach(w => {
        const date = w.created_at ? new Date(w.created_at) : new Date();
        combined.push({
          id: `wit-${w.id}`,
          title: 'Levantamento de Fundos',
          subtitle: `${w.nome_banco} - ${w.status}`,
          amount: -Number(w.amount_original),
          time: date.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
          dateLabel: `${date.getDate()} de ${months[date.getMonth()]}`,
          monthIndex: date.getMonth(),
          year: date.getFullYear(),
          type: 'outgoing',
          category: 'Retirada',
          status: w.status
        });
      });

      purchases?.forEach(p => {
        const date = new Date(p.created_at);
        combined.push({
          id: `pur-${p.id}`,
          title: p.nome || 'Compra de Pacote',
          subtitle: `Investimento amazon`,
          amount: -Number(p.preco_unitario),
          time: date.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
          dateLabel: `${date.getDate()} de ${months[date.getMonth()]}`,
          monthIndex: date.getMonth(),
          year: date.getFullYear(),
          type: 'outgoing',
          category: 'Compras'
        });
      });

      setTransactions(combined.sort((a, b) => b.id.localeCompare(a.id)));
    } catch (err) {
      console.error('Erro ao buscar histórico real:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesMonth = t.monthIndex === activeMonth;
    const matchesYear = t.year === activeYear;
    const matchesType = activeType === 'Misto' || t.category === activeType;

    const day = parseInt(t.dateLabel.split(' ')[0]);
    const matchesDay = activeDay === 'Todos' || day === activeDay;

    const hour = parseInt(t.time.split(':')[0]);
    let matchesTime = true;
    if (activeTimeRange === 'Manhã (06-12)') matchesTime = hour >= 6 && hour < 12;
    if (activeTimeRange === 'Tarde (12-18)') matchesTime = hour >= 12 && hour < 18;
    if (activeTimeRange === 'Noite (18-00)') matchesTime = hour >= 18 || hour < 6;

    return matchesMonth && matchesYear && matchesType && matchesDay && matchesTime;
  });

  const groupedTransactions = filteredTransactions.reduce((groups: any, transaction) => {
    const date = transaction.dateLabel;
    if (!groups[date]) groups[date] = [];
    groups[date].push(transaction);
    return groups;
  }, {});

  const generatePDF = () => {
    const doc = new jsPDF();
    const now = new Date();
    const formattedDate = now.toLocaleDateString('pt-PT');
    const formattedTime = now.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });

    // Configurações de Cabeçalho PDF
    doc.setFillColor(24, 23, 17); // Background muito escuro (Estilo Amazon)
    doc.rect(0, 0, 210, 50, 'F');

    // Linha de detalhe amarela (Amazon Prime style)
    doc.setFillColor(255, 153, 0);
    doc.rect(0, 48, 210, 2, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('EXTRATO AMAZON', 105, 18, { align: 'center' });

    doc.setFontSize(10);
    doc.text(`ID: ${userProfile?.code}`, 105, 28, { align: 'center' });
    doc.text(`TELEFONE: ${userProfile?.phone}`, 105, 34, { align: 'center' });

    doc.setFontSize(9);
    doc.setTextColor(180, 180, 180);
    const filterInfo = `MÊS: ${months[activeMonth].toUpperCase()} | DIA: ${activeDay} | ANO: ${activeYear} | PERÍODO: ${activeTimeRange.toUpperCase()}`;
    doc.text(`${filterInfo}`, 105, 40, { align: 'center' });
    doc.text(`TIPO: ${activeType.toUpperCase()} | GERADO EM: ${formattedDate} ÀS ${formattedTime}`, 105, 45, { align: 'center' });

    // Tabela de Dados
    let y = 65;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);

    // Header da Tabela
    doc.setFillColor(245, 245, 245);
    doc.rect(10, y - 6, 190, 10, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('DATA / HORA', 15, y);
    doc.text('DESCRIÇÃO DA OPERAÇÃO', 60, y);
    doc.text('VALOR (KZ)', 165, y);
    y += 12;

    filteredTransactions.forEach((t) => {
      if (y > 275) {
        doc.addPage();
        y = 25;
      }

      const isPositive = t.type === 'incoming';
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);

      const day = t.dateLabel.split(' de ')[0];
      const monthNum = (months.indexOf(t.dateLabel.split(' de ')[1]) + 1).toString().padStart(2, '0');
      doc.text(`${day}/${monthNum}/${t.year}`, 15, y);
      doc.text(t.time, 15, y + 4);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text(t.title.toUpperCase(), 60, y);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text(t.subtitle, 60, y + 4);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      if (isPositive) {
        doc.setTextColor(0, 120, 0);
        doc.text(`+ ${t.amount.toLocaleString('pt-AO')}`, 165, y + 2);
      } else {
        doc.setTextColor(200, 0, 0);
        doc.text(`- ${Math.abs(t.amount).toLocaleString('pt-AO')}`, 165, y + 2);
      }

      y += 14;
      doc.setDrawColor(240, 240, 240);
      doc.line(10, y - 9, 200, y - 9);
    });

    // Rodapé
    doc.setFontSize(8);
    doc.setTextColor(180, 180, 180);
    doc.text('© Amazon Angola Financial System - Este é um documento gerado eletronicamente.', 105, 290, { align: 'center' });

    doc.save(`Extrato_Amazon_${userProfile?.code}_${months[activeMonth]}_${activeYear}.pdf`);
  };

  const handleStartPDF = () => {
    if (filteredTransactions.length === 0) {
      alert(`O extrato de ${activeType} para o período selecionado não possui registros.`);
      return;
    }
    setShowMenu(false);
    setIsGeneratingPDF(true);
    setPdfProgress(0);
  };

  useEffect(() => {
    if (isGeneratingPDF) {
      const interval = setInterval(() => {
        setPdfProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              generatePDF();
              setIsGeneratingPDF(false);
            }, 600);
            return 100;
          }
          return prev + 5;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isGeneratingPDF, activeType, activeMonth, activeDay, activeYear, activeTimeRange]);

  return (
    <div className="bg-background-dark font-display text-black antialiased min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center p-4 justify-between bg-background-dark sticky top-0 z-40 border-b border-gray-200 backdrop-blur-md bg-opacity-90">
        <button onClick={() => onNavigate('profile')} className="size-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-primary">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold flex-1 text-center pr-10 tracking-tight">Histórico de Conta</h2>
      </header>

      {/* Action Bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-surface-dark/30">
        <div className="flex flex-col">
          <p className="text-[text-gray-400] text-[10px] font-black uppercase tracking-widest">Exibindo</p>
          <div className="flex flex-col">
            <p className="text-black text-sm font-bold truncate max-w-[150px]">{activeType} - {months[activeMonth].toUpperCase()}</p>
            <p className="text-primary text-[10px] font-bold">
              {activeDay === 'Todos' ? 'Mês Inteiro' : `Dia ${activeDay}`} | {activeYear} | {activeTimeRange}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowMenu(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-xl font-black text-xs shadow-lg shadow-primary/20 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">tune</span>
          FILTROS
        </button>
      </div>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-24 touch-pan-y">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <SpokeSpinner size="w-8 h-8" />
          </div>
        ) : Object.keys(groupedTransactions).length > 0 ? (
          Object.keys(groupedTransactions).map(date => (
            <div key={date} className="mb-6">
              <p className="text-[text-gray-400] text-[11px] font-black uppercase tracking-[0.2em] pb-3 pt-6 px-6 opacity-60 flex items-center gap-2">
                <span className="size-1 bg-primary rounded-full"></span>
                {date}
              </p>
              <div className="flex flex-col gap-1 px-3">
                {groupedTransactions[date].map((t: Transaction) => (
                  <div key={t.id} className="group flex items-center gap-4 px-4 py-4 hover:bg-white/5 transition-colors rounded-[24px] border border-transparent hover:border-gray-200">
                    <div className={`relative flex items-center justify-center size-12 rounded-2xl shrink-0 border border-gray-200 shadow-inner ${t.category === 'Depósito' ? 'bg-green-500/10 text-green-600' :
                      t.category === 'Retirada' ? 'bg-primary/10 text-primary' :
                        t.category === 'Segurança' ? 'bg-blue-500/10 text-blue-400' :
                          'bg-white/5 text-gray-600'
                      }`}>
                      <span className="material-symbols-outlined text-[24px]">
                        {t.category === 'Depósito' ? 'add_card' :
                          t.category === 'Retirada' ? 'payments' :
                            t.category === 'Segurança' ? 'security' :
                              'shopping_bag'}
                      </span>
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <p className="text-black text-[15px] font-bold truncate leading-tight">{t.title}</p>
                        {t.amount !== 0 && (
                          <p className={`text-[15px] font-black ${t.type === 'incoming' ? 'text-green-600' : 'text-black'}`}>
                            {t.amount > 0 ? '+' : ''} Kz {Math.abs(t.amount).toLocaleString()}
                          </p>
                        )}
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-[text-gray-400] text-[11px] uppercase font-bold tracking-wider opacity-70 truncate">{t.subtitle}</p>
                        <p className="text-[text-gray-400] text-[11px] font-medium">{t.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-32 px-10 text-center opacity-30">
            <div className="size-20 bg-surface-dark rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-4xl">folder_off</span>
            </div>
            <p className="font-black uppercase tracking-[0.2em] text-[12px] leading-relaxed">
              Nenhum registro encontrado para este filtro
            </p>
          </div>
        )}
      </main>

      {/* Menu de Filtros Flutuante (Drum Picker Style) */}
      {showMenu && (
        <div className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-12">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowMenu(false)}></div>
          <div className="relative w-full max-w-sm bg-[#111] rounded-[40px] p-8 shadow-2xl border border-gray-200 animate-in fade-in slide-in-from-bottom-20 overflow-hidden">

            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-black text-black italic tracking-tighter uppercase flex items-center gap-2">
                <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                Filtrar Extrato
              </h3>
              <button onClick={() => setShowMenu(false)} className="text-gray-500 hover:text-black transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Drum Picker Container */}
            <div className="relative h-56 flex items-center justify-between overflow-hidden bg-white/5 rounded-3xl border border-gray-200 px-2">

              {/* Highlight Bar Overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-full h-12 bg-white/10 border-y border-white/10 relative">
                  {/* Decorative Amazon Indicators */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-primary"></div>
                </div>
              </div>

              {/* Column: Year */}
              <div className="flex-1 h-full overflow-y-auto no-scrollbar snap-y snap-mandatory py-[88px] text-center touch-pan-y">
                {[2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030].map(y => (
                  <button
                    key={y}
                    onClick={() => setActiveYear(y)}
                    className={`snap-center h-12 w-full flex items-center justify-center transition-all ${activeYear === y ? 'text-black font-black text-lg' : 'text-gray-600 font-bold text-xs opacity-40'}`}
                  >
                    {y}
                  </button>
                ))}
              </div>

              {/* Column: Day */}
              <div className="flex-1 h-full overflow-y-auto no-scrollbar snap-y snap-mandatory py-[88px] text-center touch-pan-y">
                {['Todos', ...Array.from({ length: 31 }, (_, i) => i + 1)].map(d => (
                  <button
                    key={d}
                    onClick={() => setActiveDay(d as any)}
                    className={`snap-center h-12 w-full flex items-center justify-center transition-all ${activeDay === d ? 'text-black font-black text-lg' : 'text-gray-600 font-bold text-xs opacity-40'}`}
                  >
                    {d === 'Todos' ? 'ALL' : d}
                  </button>
                ))}
              </div>

              {/* Column: Month */}
              <div className="flex-1 h-full overflow-y-auto no-scrollbar snap-y snap-mandatory py-[88px] text-center touch-pan-y">
                {months.map((m, i) => (
                  <button
                    key={m}
                    onClick={() => setActiveMonth(i)}
                    className={`snap-center h-12 w-full flex items-center justify-center transition-all ${activeMonth === i ? 'text-black font-black text-lg' : 'text-gray-600 font-bold text-xs opacity-40'}`}
                  >
                    {m.toLowerCase()}
                  </button>
                ))}
              </div>

              {/* Column: Type */}
              <div className="flex-[1.5] h-full overflow-y-auto no-scrollbar snap-y snap-mandatory py-[88px] text-center touch-pan-y">
                {['Misto', 'Depósito', 'Retirada', 'Segurança'].map((type: any) => (
                  <button
                    key={type}
                    onClick={() => setActiveType(type)}
                    className={`snap-center h-12 w-full flex items-center justify-center transition-all px-1 ${activeType === type ? 'text-primary font-black text-sm uppercase scale-110' : 'text-gray-600 font-bold text-[10px] opacity-40 lowercase'}`}
                  >
                    {type === 'Segurança' ? 'seg' : type}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={handleStartPDF}
                className="flex-[2] h-14 bg-primary text-black rounded-2xl flex items-center justify-center gap-3 font-black shadow-xl shadow-primary/20 active:scale-95 transition-all text-xs tracking-widest uppercase"
              >
                <span className="material-symbols-outlined text-xl">picture_as_pdf</span>
                Baixar PDF
              </button>
              <button
                onClick={() => setShowMenu(false)}
                className="flex-1 h-14 bg-white/5 text-black rounded-2xl flex items-center justify-center font-black active:scale-95 transition-all text-xs uppercase"
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simulador de Download PDF */}
      {isGeneratingPDF && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-8">
          <div className="absolute inset-0 bg-background-dark/95 backdrop-blur-xl"></div>
          <div className="relative w-full max-w-xs flex flex-col items-center text-center">
            {/* Template PDF Colorido */}
            <div className={`w-32 h-40 rounded-lg mb-8 relative transition-transform animate-pulse shadow-2xl ${activeType === 'Depósito' ? 'bg-green-600' :
              activeType === 'Retirada' ? 'bg-yellow-600' :
                activeType === 'Segurança' ? 'bg-blue-600' : 'bg-primary'
              }`}>
              <div className="absolute inset-0 flex flex-col p-3 text-black overflow-hidden opacity-50">
                <p className="text-[8px] font-black mb-1">AMAZON EXT. {activeType.toUpperCase()}</p>
                <div className="w-full h-1 bg-white/20 mb-1 rounded"></div>
                <div className="w-2/3 h-1 bg-white/20 mb-3 rounded"></div>
                <div className="space-y-1">
                  {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-full h-0.5 bg-white/10 rounded"></div>)}
                </div>
              </div>
              <div className="absolute right-2 bottom-2">
                <span className="material-symbols-outlined text-black text-2xl">verified_user</span>
              </div>
            </div>

            <h2 className="text-2xl font-black text-black mb-2 leading-tight">Gerando Extrato...</h2>
            <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-8">Amazon Angola Sytem</p>

            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-4 border border-gray-200 ring-4 ring-white/5">
              <div
                className={`h-full transition-all duration-100 ease-linear ${activeType === 'Depósito' ? 'bg-green-400' :
                  activeType === 'Retirada' ? 'bg-primary' :
                    activeType === 'Segurança' ? 'bg-blue-400' : 'bg-primary'
                  }`}
                style={{ width: `${pdfProgress}%` }}
              ></div>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-black text-4xl font-black tracking-tighter">{pdfProgress}</span>
              <span className="text-primary text-xl font-black">%</span>
            </div>

            <p className="mt-8 text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3">
              <span className="size-1.5 bg-green-500 rounded-full animate-ping"></span>
              PROCESSANDO DADOS SEGUROS
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoricoConta;
