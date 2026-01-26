import { Transaction } from './pages/HistoricoConta';

export const mockTransactions: Transaction[] = [
    // Outubro
    { id: '1', title: 'Levantamento de Fundos', subtitle: 'Conta Bancária (BAI)', amount: -50000, time: '14:30', dateLabel: '25 de Outubro', monthIndex: 9, year: 2025, type: 'outgoing', category: 'Retirada' },
    { id: '2', title: 'Depósito Confirmado', subtitle: 'Multicaixa Express', amount: 150000, time: '10:15', dateLabel: '22 de Outubro', monthIndex: 9, year: 2025, type: 'incoming', category: 'Depósito' },
    { id: '3', title: 'Alteração de Senha', subtitle: 'Segurança da Conta', amount: 0, time: '09:00', dateLabel: '15 de Outubro', monthIndex: 9, year: 2025, type: 'info', category: 'Segurança' },
    { id: '4', title: 'Senha de Retirada Definida', subtitle: 'Configuração de PIN', amount: 0, time: '16:20', dateLabel: '05 de Outubro', monthIndex: 9, year: 2025, type: 'info', category: 'Segurança' },

    // Setembro
    { id: '5', title: 'Tentativa de Saque Bloqueada', subtitle: 'Erro de Senha (x2)', amount: 0, time: '11:00', dateLabel: '28 de Setembro', monthIndex: 8, year: 2025, type: 'warning', category: 'Segurança' },
    { id: '6', title: 'Bônus de Boas-vindas', subtitle: 'Promoção SmartBuy', amount: 2000, time: '08:45', dateLabel: '10 de Setembro', monthIndex: 8, year: 2025, type: 'incoming', category: 'Bônus' },
    { id: '7', title: 'Compra de Pacote Shop', subtitle: 'Plano Plus', amount: -25000, time: '12:30', dateLabel: '05 de Setembro', monthIndex: 8, year: 2025, type: 'outgoing', category: 'Compras' },
];
