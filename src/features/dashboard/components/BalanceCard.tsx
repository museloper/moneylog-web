interface Props {
  income: number
  expense: number
}

export default function BalanceCard({ income, expense }: Props) {
  const balance = income - expense
  const total = income + expense
  const expenseRatio = total > 0 ? Math.min(100, (expense / Math.max(income, 1)) * 100) : 0

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-strong to-[#2d8a70] text-white p-6 shadow-[0_10px_30px_rgba(63,175,142,0.25)]">
      {/* 데코 원 */}
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
      <div className="absolute -bottom-12 -left-4 w-24 h-24 rounded-full bg-white/5" />

      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-white/80">이번 달 잔액</span>
          {balance < 0 && (
            <span className="text-[10px] font-semibold bg-rose-400/30 text-white px-2 py-0.5 rounded-full">
              지출 초과
            </span>
          )}
        </div>

        <div className="text-3xl font-bold tracking-tight mb-5">
          ₩{balance.toLocaleString()}
        </div>

        {/* progress bar (수입 대비 지출) */}
        <div className="mb-4">
          <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${expenseRatio}%` }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[10px] text-white/70">수입의 {Math.round(expenseRatio)}% 지출</span>
          </div>
        </div>

        <div className="flex justify-between pt-3 border-t border-white/15">
          <div>
            <div className="text-[10px] text-white/70 mb-0.5">수입</div>
            <div className="text-sm font-semibold">+ ₩{income.toLocaleString()}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-white/70 mb-0.5">지출</div>
            <div className="text-sm font-semibold">- ₩{expense.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
