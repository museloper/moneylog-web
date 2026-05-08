export type TransactionType = 'income' | 'expense'

export interface AccentClasses {
  text: string
  textStrong: string
  bg: string
  bgSoft: string
  ring: string
  border: string
  caret: string
}

export const ACCENT: Record<TransactionType, AccentClasses> = {
  expense: {
    text: 'text-rose-500',
    textStrong: 'text-rose-600',
    bg: 'bg-rose-500',
    bgSoft: 'bg-rose-50',
    ring: 'ring-rose-400',
    border: 'border-rose-200',
    caret: '#f43f5e',
  },
  income: {
    text: 'text-emerald-600',
    textStrong: 'text-emerald-700',
    bg: 'bg-emerald-600',
    bgSoft: 'bg-emerald-50',
    ring: 'ring-emerald-400',
    border: 'border-emerald-200',
    caret: '#059669',
  },
}
