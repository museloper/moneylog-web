import { cardStyle } from '@/shared/ui/cardStyle'

import type { Transaction } from '@/features/dashboard/types'

interface Props {
  transactions: Transaction[]
  emojiMap: Map<string, string>
}

export default function TopCategoriesCard({ transactions, emojiMap }: Props) {
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
  const totalExpense = Object.values(categoryTotals).reduce((acc, v) => acc + v, 0)

  return (
    <div className={`${cardStyle} px-5 py-4`}>
      <div className="text-base font-semibold text-gray-900 mb-3">이번 달 TOP 지출</div>

      {sorted.length === 0 ? (
        <div className="py-6 text-center text-xs text-gray-400">
          지출 내역이 없어요
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map(([category, total], index) => {
            const emoji = emojiMap.get(`expense:${category}`)
            const percent = totalExpense > 0 ? Math.round((total / totalExpense) * 100) : 0
            return (
              <div key={category}>
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[11px] font-bold text-gray-400 w-3">{index + 1}</span>
                    <span className="text-base flex-shrink-0">{emoji ?? '📌'}</span>
                    <span className="text-sm font-medium text-gray-800 truncate">{category}</span>
                    <span className="text-[11px] text-gray-400 flex-shrink-0">{percent}%</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 flex-shrink-0">
                    ₩{total.toLocaleString()}
                  </span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden ml-5">
                  <div
                    className="h-full bg-brand-strong rounded-full transition-all duration-500"
                    style={{ width: `${(total / max) * 100}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
