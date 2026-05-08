import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

import { cardStyle } from '@/shared/ui/cardStyle'

import type { Transaction } from '@/features/transactions/types'
import type { UserProfile } from '@/features/users/api'
import Avatar from '@/features/users/components/Avatar'
import { formatSignedCurrency } from '@/shared/utils/format'

interface Props {
  transactions: Transaction[]
  emojiMap: Map<string, string>
  userMap: Map<number, UserProfile>
  meId: number | undefined
}

export default function TransactionCard({ transactions, emojiMap, userMap, meId }: Props) {
  const navigate = useNavigate()
  const preview = transactions.slice(0, 5)

  return (
    <div className={`${cardStyle} px-5 py-4`}>
      <div className="flex justify-between items-center mb-3">
        <div className="text-base font-semibold text-gray-900">최근 거래</div>
        <button
          type="button"
          onClick={() => navigate('/transactions')}
          className="flex items-center text-xs text-gray-400 active:text-gray-600 cursor-pointer"
        >
          전체보기
          <ChevronRight size={14} strokeWidth={2} />
        </button>
      </div>

      {preview.length === 0 ? (
        <div className="py-6 text-center text-xs text-gray-400">
          아직 거래 내역이 없어요
        </div>
      ) : (
        <div className="space-y-3">
          {preview.map((tx) => {
            const emoji = emojiMap.get(`${tx.type}:${tx.category}`)
            const user = userMap.get(tx.userId)
            const userLabel = user?.id === meId ? '나' : user?.name ?? '파트너'
            return (
              <div key={tx.id} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-lg flex-shrink-0">
                  {emoji ?? (tx.type === 'income' ? '✨' : '📌')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{tx.title}</div>
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-1">
                    <span>{tx.category}</span>
                    <span className="text-gray-300">·</span>
                    <Avatar user={user} size={18} />
                    <span className="font-medium text-gray-500 leading-none">{userLabel}</span>
                  </div>
                </div>
                <div
                  className={`text-sm font-semibold flex-shrink-0 ${
                    tx.type === 'income' ? 'text-emerald-600' : 'text-rose-500'
                  }`}
                >
                  {formatSignedCurrency(tx.amount, tx.type)}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
