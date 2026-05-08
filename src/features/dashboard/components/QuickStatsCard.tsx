import { cardStyle } from '@/shared/ui/cardStyle'
import { formatCurrency } from '@/shared/utils/format'

interface Props {
  todayExpense: number
  weekExpense: number
  dailyAverage: number
}

export default function QuickStatsCard({ todayExpense, weekExpense, dailyAverage }: Props) {
  const items = [
    { label: '오늘 지출', value: todayExpense },
    { label: '이번 주', value: weekExpense },
    { label: '일평균', value: dailyAverage },
  ]

  return (
    <div className={`${cardStyle} p-4`}>
      <div className="grid grid-cols-3 divide-x divide-gray-100">
        {items.map((item) => (
          <div key={item.label} className="text-center px-2">
            <div className="text-[11px] text-gray-400 mb-1">{item.label}</div>
            <div className="text-sm font-bold text-gray-900">
              {formatCurrency(item.value)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
