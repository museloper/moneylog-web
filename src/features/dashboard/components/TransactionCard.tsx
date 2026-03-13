import { useNavigate } from 'react-router-dom'

import { cardStyle } from '@/shared/ui/cardStyle'

import type { Transaction } from '@/features/dashboard/types'

interface Props {
  transactions: Transaction[]
}

export default function TransactionCard({ transactions }: Props) {
  const navigate = useNavigate()
  const preview = transactions.slice(0, 5)

  return (
    <div className={`${cardStyle} px-5 py-4`}>
      <div className="flex justify-between items-center mb-3">
        <div className="text-lg font-semibold text-gray-900">최근 거래</div>
        {transactions.length > 5 && (
          <button
            type="button"
            onClick={() => navigate('/transactions')}
            className="text-xs text-brand-strong font-medium"
          >
            더보기
          </button>
        )}
      </div>

      <div className="space-y-2.5">
        {preview.map((tx) => (
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
