import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import type { Transaction } from '@/features/transactions/types'
import { getTransactionsApi } from '@/features/transactions/api'
import { useTransactionStore } from '@/features/transactions/store'
import { useCategoryStore } from '@/features/settings/store'
import { useUserStore } from '@/features/users/store'
import type { UserProfile } from '@/features/users/api'

import BalanceCard from '@/features/dashboard/components/BalanceCard'
import QuickStatsCard from '@/features/dashboard/components/QuickStatsCard'
import TransactionCard from '@/features/dashboard/components/TransactionCard'
import TopCategoriesCard from '@/features/dashboard/components/TopCategoriesCard'

const isSameMonth = (date: Date, target: Date) =>
  date.getFullYear() === target.getFullYear() && date.getMonth() === target.getMonth()

const isSameDay = (date: Date, target: Date) =>
  isSameMonth(date, target) && date.getDate() === target.getDate()

const getStartOfWeek = (d: Date) => {
  const start = new Date(d)
  start.setHours(0, 0, 0, 0)
  start.setDate(start.getDate() - start.getDay()) // 일요일 시작
  return start
}

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  const lastCreatedAt = useTransactionStore((state) => state.lastCreatedAt)
  const { categories, load: loadCategories } = useCategoryStore()
  const members = useUserStore((s) => s.members)
  const me = useUserStore((s) => s.me)
  const loadUsers = useUserStore((s) => s.load)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    Promise.all([getTransactionsApi(), loadCategories(), loadUsers()])
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

  const userMap = useMemo(() => {
    const map = new Map<number, UserProfile>()
    members.forEach((u) => map.set(u.id, u))
    return map
  }, [members])

  const stats = useMemo(() => {
    const now = new Date()
    const startOfWeek = getStartOfWeek(now)
    const dayOfMonth = now.getDate()
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()

    let monthIncome = 0
    let monthExpense = 0
    let todayExpense = 0
    let weekExpense = 0

    const monthTxs: Transaction[] = []

    transactions.forEach((tx) => {
      const d = new Date(tx.date)
      if (isSameMonth(d, now)) {
        monthTxs.push(tx)
        if (tx.type === 'income') monthIncome += tx.amount
        else monthExpense += tx.amount
      }
      if (tx.type === 'expense') {
        if (isSameDay(d, now)) todayExpense += tx.amount
        if (d >= startOfWeek && d <= now) weekExpense += tx.amount
      }
    })

    const dailyAverage = dayOfMonth > 0 ? Math.round(monthExpense / dayOfMonth) : 0

    return {
      monthIncome,
      monthExpense,
      monthTransactions: monthTxs,
      todayExpense,
      weekExpense,
      dailyAverage,
      dayOfMonth,
      daysInMonth,
    }
  }, [transactions])

  const greetingMonth = new Date().getMonth() + 1

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-44 rounded-3xl bg-gray-100 animate-pulse" />
        <div className="h-20 rounded-2xl bg-gray-100 animate-pulse" />
        <div className="h-48 rounded-2xl bg-gray-100 animate-pulse" />
        <div className="h-56 rounded-2xl bg-gray-100 animate-pulse" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* 인사 */}
      <div className="flex items-end justify-between px-1">
        <div>
          <h2 className="text-base font-bold text-gray-900">{greetingMonth}월의 가계부</h2>
          <p className="text-[11px] text-gray-400 mt-0.5">파트너와 함께 관리하고 있어요</p>
        </div>
        <div className="text-right">
          <div className="text-[11px] text-gray-400">{stats.dayOfMonth}일째</div>
          <div className="text-[11px] text-gray-400">/ {stats.daysInMonth}일</div>
        </div>
      </div>

      {/* 잔액 카드 */}
      <BalanceCard income={stats.monthIncome} expense={stats.monthExpense} />

      {/* 빠른 지표 */}
      <QuickStatsCard
        todayExpense={stats.todayExpense}
        weekExpense={stats.weekExpense}
        dailyAverage={stats.dailyAverage}
      />

      {/* 최근 거래 */}
      <TransactionCard
        transactions={stats.monthTransactions}
        emojiMap={emojiMap}
        userMap={userMap}
        meId={me?.id}
      />

      {/* TOP 카테고리 */}
      <TopCategoriesCard transactions={stats.monthTransactions} emojiMap={emojiMap} />
    </div>
  )
}
