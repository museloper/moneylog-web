/** 금액을 "₩123,456" 포맷으로 변환 */
export const formatCurrency = (amount: number): string => `₩${amount.toLocaleString()}`

/** 부호 포함 ("+₩100", "-₩100") */
export const formatSignedCurrency = (amount: number, type: 'income' | 'expense'): string =>
  `${type === 'income' ? '+' : '-'} ${formatCurrency(amount)}`
