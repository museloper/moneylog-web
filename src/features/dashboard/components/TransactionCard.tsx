import { cardStyle } from '@/shared/ui/cardStyle'

import type { Transaction } from '@/features/dashboard/types'

interface Props {
  transactions: Transaction[]
}

export default function TransactionCard({ transactions }: Props) {
  return (
    <div className={`${cardStyle} px-6 py-6`}>
      <div className="text-lg font-semibold text-gray-900 mb-4">최근 거래</div>

      <div className="space-y-3">
        {transactions.map((tx) => (
          <div key={tx.id} className="flex justify-between items-center">
            <div>
              <div className="text-sm font-medium text-gray-900">{tx.title}</div>
              <div className="text-xs text-gray-400">{tx.category}</div>
            </div>

            <div
              className={`text-sm font-semibold ${
                tx.type === 'income' ? 'text-emerald-600' : 'text-rose-500'
              }`}
            >
              {tx.type === 'income' ? '+' : '-'} ₩{tx.amount.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
