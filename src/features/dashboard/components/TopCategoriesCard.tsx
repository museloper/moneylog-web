import { cardStyle } from '@/shared/ui/cardStyle'

import type { Transaction } from '@/features/dashboard/types'

interface Props {
  transactions: Transaction[]
}

export default function TopCategoriesCard({ transactions }: Props) {
  const categoryTotals = transactions
    .filter((tx) => tx.type === 'expense')
    .reduce<Record<string, number>>((acc, tx) => {
      acc[tx.category] = (acc[tx.category] ?? 0) + tx.amount
      return acc
    }, {})

  const sorted = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  const max = sorted[0]?.[1] ?? 1

  return (
    <div className={`${cardStyle} px-5 py-4`}>
      <div className="text-lg font-semibold text-gray-900 mb-3">이번 달 지출 TOP 카테고리</div>

      <div className="space-y-2.5">
        {sorted.map(([category, total], index) => (
          <div key={category}>
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-brand-strong w-4">{index + 1}</span>
                <span className="text-sm font-medium text-gray-800">{category}</span>
              </div>
              <span className="text-sm font-semibold text-rose-500">
                - ₩{total.toLocaleString()}
              </span>
            </div>
            <div className="h-1.5 bg-brand-soft rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-strong rounded-full transition-all duration-500"
                style={{ width: `${(total / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
