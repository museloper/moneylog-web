interface BalanceCardProps {
  income: number
  expense: number
}

export default function BalanceCard({ income, expense }: BalanceCardProps) {
  const balance = income - expense

  return (
    <div className="rounded-3xl overflow-hidden bg-white shadow-sm">
      {/* 상단 컬러 영역 */}
      <div className="bg-brand-soft px-6 py-6">
        <div className="text-sm text-gray-600 mb-2">이번 달 남은 금액</div>
        <div className="text-3xl font-bold text-gray-900">₩{balance.toLocaleString()}</div>
      </div>

      {/* 하단 정보 영역 */}
      <div className="px-6 py-5">
        <div className="flex justify-between text-sm">
          <div>
            <div className="text-gray-400 mb-1">총 수입</div>
            <div className="font-semibold text-emerald-600">+ ₩{income.toLocaleString()}</div>
          </div>

          <div className="text-right">
            <div className="text-gray-400 mb-1">총 지출</div>
            <div className="font-semibold text-rose-500">- ₩{expense.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
