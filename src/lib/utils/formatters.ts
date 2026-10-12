export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
}

/**
 * Converte qualquer formato numérico/monetário (ex: "1.000,00", "1000,50", "1.000", "R$ 1.500,50")
 * para um float numérico seguro para operações e persistência no banco de dados.
 */
export function parseCurrency(value: string | number): number {
  if (typeof value === 'number') {
    return isNaN(value) ? 0 : value;
  }
  if (!value || typeof value !== 'string') {
    return 0;
  }

  // Remove símbolos monetários e caracteres não numéricos exceto dígitos, vírgula e ponto
  let cleaned = value.trim().replace(/[^\d.,-]/g, '');
  if (!cleaned) return 0;

  // Se possui ponto e vírgula (ex: "1.000,00" ou "1,000.00")
  if (cleaned.includes('.') && cleaned.includes(',')) {
    const lastDot = cleaned.lastIndexOf('.');
    const lastComma = cleaned.lastIndexOf(',');

    if (lastComma > lastDot) {
      // Padrão brasileiro pt-BR: 1.000,00 -> pontos são separadores de milhar, vírgula é decimal
      cleaned = cleaned.replace(/\./g, '').replace(',', '.');
    } else {
      // Padrão internacional en-US: 1,000.00 -> vírgulas são milhares, ponto é decimal
      cleaned = cleaned.replace(/,/g, '');
    }
  } else if (cleaned.includes(',')) {
    // Apenas vírgula (ex: "1000,50" ou "1,50") -> substitui vírgula por ponto decimal
    cleaned = cleaned.replace(',', '.');
  } else if (cleaned.includes('.')) {
    // Apenas pontos (ex: "1.000" ou "1.000.000" ou "10.50")
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      // Múltiplos pontos: "1.000.000" -> são separadores de milhar
      cleaned = cleaned.replace(/\./g, '');
    } else if (parts[1] && parts[1].length === 3) {
      // Ponto único com 3 dígitos (ex: "1.000" ou "50.000") -> milhar no Brasil
      cleaned = cleaned.replace('.', '');
    }
    // Caso padrão como "10.50" permanece inalterado para o parseFloat
  }

  const result = parseFloat(cleaned);
  return isNaN(result) ? 0 : result;
}


export function formatDate(dateString: string): string {
  try {
    const [year, month, day] = dateString.split('-');
    if (year && month && day) {
      return `${day}/${month}/${year}`;
    }
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(d);
  } catch {
    return dateString;
  }
}

export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

export const MONTH_NAMES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];
