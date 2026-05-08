import { useEffect, useMemo, useState } from 'react'
import { TrendingDown, TrendingUp, Minus } from 'lucide-react'
import { toast } from 'sonner'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from 'recharts'

import type { Transaction } from '@/features/transactions/types'
import { getTransactionsApi } from '@/features/transactions/api'
import { useTransactionStore } from '@/features/transactions/store'
import { useCategoryStore } from '@/features/settings/store'
import MonthHeader, { useMonthCursor } from '@/shared/components/MonthHeader'
import { formatCurrency } from '@/shared/utils/format'

const CATEGORY_COLORS = [
  '#3faf8e',
  '#f43f5e',
  '#fb923c',
  '#facc15',
  '#06b6d4',
  '#8b5cf6',
  '#ec4899',
  '#64748b',
  '#22c55e',
  '#3b82f6',
]

const sumByType = (txs: Transaction[]) => {
  let income = 0
  let expense = 0
  txs.forEach((tx) => {
    if (tx.type === 'income') income += tx.amount
    else expense += tx.amount
  })
  return { income, expense }
}

interface ChangeIndicatorProps {
  current: number
  previous: number
  invert?: boolean // true이면 증가가 나쁨(지출용)
}

function ChangeIndicator({ current, previous, invert }: ChangeIndicatorProps) {
  if (previous === 0) {
    return <span className="text-[10px] text-gray-400">지난달 대비 -</span>
  }
  const diff = current - previous
  const percent = Math.abs(Math.round((diff / previous) * 100))
  if (diff === 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-[10px] text-gray-400">
        <Minus size={10} strokeWidth={2.5} />
        지난달과 동일
      </span>
    )
  }
  const up = diff > 0
  const isBad = invert ? up : !up
  const color = isBad ? 'text-rose-500' : 'text-emerald-600'
  const Icon = up ? TrendingUp : TrendingDown
  return (
    <span className={`inline-flex items-center gap-0.5 text-[10px] font-medium ${color}`}>
      <Icon size={10} strokeWidth={2.5} />
      {percent}% {up ? '증가' : '감소'}
    </span>
  )
}

export default function StatsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const { cursor, goPrev, goNext, goToday, isCurrent } = useMonthCursor()

  const lastCreatedAt = useTransactionStore((state) => state.lastCreatedAt)
  const { categories, load: loadCategories } = useCategoryStore()

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    Promise.all([getTransactionsApi(), loadCategories()])
      .then(([data]) => {
        if (!cancelled) setTransactions(data)
      })
      .catch(() => {
        if (!cancelled) toast.error('데이터를 불러오지 못했습니다')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [lastCreatedAt])

  const emojiMap = useMemo(() => {
    const map = new Map<string, string>()
    categories.forEach((c) => {
      if (c.emoji) map.set(`${c.type}:${c.name}`, c.emoji)
    })
    return map
  }, [categories])

  // 월 필터
  const monthTxs = useMemo(
    () =>
      transactions.filter((tx) => {
        const d = new Date(tx.date)
        return d.getFullYear() === cursor.year && d.getMonth() === cursor.month
      }),
    [transactions, cursor],
  )

  const prevMonthTxs = useMemo(() => {
    const prevMonth = cursor.month === 0 ? 11 : cursor.month - 1
    const prevYear = cursor.month === 0 ? cursor.year - 1 : cursor.year
    return transactions.filter((tx) => {
      const d = new Date(tx.date)
      return d.getFullYear() === prevYear && d.getMonth() === prevMonth
    })
  }, [transactions, cursor])

  const monthSums = useMemo(() => sumByType(monthTxs), [monthTxs])
  const prevSums = useMemo(() => sumByType(prevMonthTxs), [prevMonthTxs])

  // 일별 지출 (현재 월)
  const dailyData = useMemo(() => {
    const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate()
    const arr = Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      expense: 0,
    }))
    monthTxs.forEach((tx) => {
      if (tx.type !== 'expense') return
      const d = new Date(tx.date)
      arr[d.getDate() - 1].expense += tx.amount
    })
    return arr
  }, [monthTxs, cursor])

  // 카테고리별 지출
  const categoryData = useMemo(() => {
    const totals = new Map<string, number>()
    monthTxs.forEach((tx) => {
      if (tx.type !== 'expense') return
      totals.set(tx.category, (totals.get(tx.category) ?? 0) + tx.amount)
    })
    const arr = Array.from(totals.entries())
      .map(([name, value]) => ({
        name,
        value,
        emoji: emojiMap.get(`expense:${name}`) ?? '📌',
      }))
      .sort((a, b) => b.value - a.value)
    return arr
  }, [monthTxs, emojiMap])

  const totalExpense = categoryData.reduce((acc, c) => acc + c.value, 0)

  // 최근 6개월 추이
  const trendData = useMemo(() => {
    const months: { label: string; income: number; expense: number; year: number; month: number }[] = []
    for (let i = 5; i >= 0; i--) {
      const ref = new Date(cursor.year, cursor.month - i, 1)
      months.push({
        label: `${ref.getMonth() + 1}월`,
        year: ref.getFullYear(),
        month: ref.getMonth(),
        income: 0,
        expense: 0,
      })
    }
    transactions.forEach((tx) => {
      const d = new Date(tx.date)
      const target = months.find((m) => m.year === d.getFullYear() && m.month === d.getMonth())
      if (!target) return
      if (tx.type === 'income') target.income += tx.amount
      else target.expense += tx.amount
    })
    return months.map(({ label, income, expense }) => ({ label, income, expense }))
  }, [transactions, cursor])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-12 rounded-2xl bg-gray-100 animate-pulse" />
        <div className="h-32 rounded-2xl bg-gray-100 animate-pulse" />
        <div className="h-48 rounded-2xl bg-gray-100 animate-pulse" />
        <div className="h-56 rounded-2xl bg-gray-100 animate-pulse" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <MonthHeader
        cursor={cursor}
        onPrev={goPrev}
        onNext={goNext}
        onToday={goToday}
        isCurrent={isCurrent}
      />

      {/* 월간 요약 + 비교 */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-3">
        <h2 className="text-sm font-semibold text-gray-900">월간 요약</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-rose-50 p-3">
            <div className="text-[11px] text-rose-500/80 mb-1">지출</div>
            <div className="text-base font-bold text-rose-500 mb-1">
              {formatCurrency(monthSums.expense)}
            </div>
            <ChangeIndicator current={monthSums.expense} previous={prevSums.expense} invert />
          </div>
          <div className="rounded-xl bg-emerald-50 p-3">
            <div className="text-[11px] text-emerald-700/80 mb-1">수입</div>
            <div className="text-base font-bold text-emerald-700 mb-1">
              {formatCurrency(monthSums.income)}
            </div>
            <ChangeIndicator current={monthSums.income} previous={prevSums.income} />
          </div>
        </div>
      </div>

      {/* 일별 지출 */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-semibold text-gray-900">일별 지출</h2>
          <span className="text-[11px] text-gray-400">
            평균 ₩{Math.round(
              dailyData.reduce((a, d) => a + d.expense, 0) /
              (isCurrent ? new Date().getDate() : dailyData.length)
            ).toLocaleString()}
          </span>
        </div>
        {monthSums.expense === 0 ? (
          <p className="py-8 text-center text-xs text-gray-400">지출 내역이 없어요</p>
        ) : (
          <div className="h-40 -mx-2">
            <ResponsiveContainer>
              <BarChart data={dailyData} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  axisLine={false}
                  tickLine={false}
                  ticks={[1, 5, 10, 15, 20, 25, dailyData.length]}
                />
                <YAxis hide />
                <Tooltip
                  cursor={{ fill: '#f9fafb' }}
                  contentStyle={{
                    fontSize: 11,
                    borderRadius: 8,
                    border: '1px solid #e5e7eb',
                    padding: '4px 8px',
                  }}
                  formatter={(v: number) => [formatCurrency(v), '지출']}
                  labelFormatter={(d) => `${cursor.month + 1}월 ${d}일`}
                />
                <Bar dataKey="expense" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* 카테고리별 지출 */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">카테고리별 지출</h2>
        {categoryData.length === 0 ? (
          <p className="py-8 text-center text-xs text-gray-400">지출 내역이 없어요</p>
        ) : (
          <div className="flex items-center gap-4">
            <div className="w-28 h-28 flex-shrink-0">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    innerRadius="60%"
                    outerRadius="100%"
                    strokeWidth={0}
                  >
                    {categoryData.map((_, i) => (
                      <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-1.5 min-w-0">
              {categoryData.slice(0, 5).map((c, i) => {
                const percent = totalExpense > 0 ? Math.round((c.value / totalExpense) * 100) : 0
                return (
                  <div key={c.name} className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }}
                    />
                    <span className="text-sm flex-shrink-0">{c.emoji}</span>
                    <span className="text-xs text-gray-700 truncate flex-1">{c.name}</span>
                    <span className="text-xs font-semibold text-gray-900 flex-shrink-0">
                      {percent}%
                    </span>
                  </div>
                )
              })}
              {categoryData.length > 5 && (
                <div className="text-[10px] text-gray-400 pl-4">외 {categoryData.length - 5}개</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 6개월 추이 */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">최근 6개월</h2>
        {trendData.every((m) => m.income === 0 && m.expense === 0) ? (
          <p className="py-8 text-center text-xs text-gray-400">데이터가 없어요</p>
        ) : (
          <div className="h-44 -mx-2">
            <ResponsiveContainer>
              <LineChart data={trendData} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    fontSize: 11,
                    borderRadius: 8,
                    border: '1px solid #e5e7eb',
                    padding: '4px 8px',
                  }}
                  formatter={(v: number, key) => [formatCurrency(v), key === 'income' ? '수입' : '지출']}
                />
                <Legend
                  iconSize={8}
                  wrapperStyle={{ fontSize: 11 }}
                  formatter={(v) => (v === 'income' ? '수입' : '지출')}
                />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#059669"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#059669' }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="expense"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#f43f5e' }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}
