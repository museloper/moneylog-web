export const EXPENSE_CATEGORIES = [
  '식비',
  '카페/간식',
  '교통',
  '쇼핑',
  '생활',
  '의료',
  '문화',
  '기타',
] as const

export const INCOME_CATEGORIES = [
  '급여',
  '용돈',
  '부수입',
  '기타',
] as const

export type TransactionTypeValue = 'income' | 'expense'

export const getCategories = (type: TransactionTypeValue): readonly string[] =>
  type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
