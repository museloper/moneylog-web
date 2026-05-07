import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Trash2, Receipt } from 'lucide-react'
import { toast } from 'sonner'

import type { Transaction } from '@/features/dashboard/types'
import { getTransactionsApi, deleteTransactionApi } from '@/features/transactions/api'
import { useTransactionStore } from '@/features/transactions/store'
import { useCategoryStore } from '@/features/settings/store'
import { useUserStore } from '@/features/users/store'
import Avatar from '@/features/users/components/Avatar'

type FilterType = 'all' | 'expense' | 'income'

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

const formatDateLabel = (dateStr: string) => {
  const d = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(d)
  target.setHours(0, 0, 0, 0)
  const diff = (today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24)
  if (diff === 0) return `오늘 · ${d.getMonth() + 1}월 ${d.getDate()}일 (${WEEKDAYS[d.getDay()]})`
  if (diff === 1) return `어제 · ${d.getMonth() + 1}월 ${d.getDate()}일 (${WEEKDAYS[d.getDay()]})`
  return `${d.getMonth() + 1}월 ${d.getDate()}일 (${WEEKDAYS[d.getDay()]})`
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [cursor, setCursor] = useState(() => {
    const d = new Date()
    return { year: d.getFullYear(), month: d.getMonth() } // 0-indexed
  })
  const [filter, setFilter] = useState<FilterType>('all')
  const [confirmId, setConfirmId] = useState<number | null>(null)

  const lastCreatedAt = useTransactionStore((state) => state.lastCreatedAt)
  const notifyCreated = useTransactionStore((state) => state.notifyCreated)
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
        if (!cancelled) toast.error('거래 내역을 불러오지 못했습니다')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [lastCreatedAt])

  const userMap = useMemo(() => {
    const map = new Map<number, typeof members[number]>()
    members.forEach((u) => map.set(u.id, u))
    return map
  }, [members])

  const emojiMap = useMemo(() => {
    const map = new Map<string, string>()
    categories.forEach((c) => {
      if (c.emoji) map.set(`${c.type}:${c.name}`, c.emoji)
    })
    return map
  }, [categories])

  // 선택된 월의 거래만 필터
  const monthTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const d = new Date(tx.date)
      return d.getFullYear() === cursor.year && d.getMonth() === cursor.month
    })
  }, [transactions, cursor])

  const filteredTransactions = useMemo(() => {
    if (filter === 'all') return monthTransactions
    return monthTransactions.filter((tx) => tx.type === filter)
  }, [monthTransactions, filter])

  // 일자별 그룹화
  const grouped = useMemo(() => {
    const groups = new Map<string, Transaction[]>()
    filteredTransactions.forEach((tx) => {
      const list = groups.get(tx.date) ?? []
      list.push(tx)
      groups.set(tx.date, list)
    })
    return Array.from(groups.entries()).sort((a, b) => b[0].localeCompare(a[0]))
  }, [filteredTransactions])

  const summary = useMemo(() => {
    let income = 0
    let expense = 0
    monthTransactions.forEach((tx) => {
      if (tx.type === 'income') income += tx.amount
      else expense += tx.amount
    })
    return { income, expense, balance: income - expense }
  }, [monthTransactions])

  const goPrevMonth = () => {
    setCursor((c) => {
      const m = c.month - 1
      return m < 0 ? { year: c.year - 1, month: 11 } : { ...c, month: m }
    })
  }
  const goNextMonth = () => {
    setCursor((c) => {
      const m = c.month + 1
      return m > 11 ? { year: c.year + 1, month: 0 } : { ...c, month: m }
    })
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteTransactionApi(id)
      setTransactions((prev) => prev.filter((t) => t.id !== id))
      setConfirmId(null)
      notifyCreated()
      toast.success('삭제됐어요')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '삭제에 실패했습니다')
    }
  }

  const isCurrentMonth = (() => {
    const now = new Date()
    return cursor.year === now.getFullYear() && cursor.month === now.getMonth()
  })()

  return (
    <div className="space-y-4">
      {/* 월 네비게이터 */}
      <div className="flex items-center justify-between bg-white border border-gray-100 rounded-2xl px-4 py-3">
        <button
          type="button"
          onClick={goPrevMonth}
          className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 active:bg-gray-100 cursor-pointer"
          aria-label="이전 달"
        >
          <ChevronLeft size={20} strokeWidth={2} />
        </button>
        <div className="text-center">
          <div className="text-base font-semibold text-gray-900">
            {cursor.year}년 {cursor.month + 1}월
          </div>
          {!isCurrentMonth && (
            <button
              type="button"
              onClick={() => {
                const now = new Date()
                setCursor({ year: now.getFullYear(), month: now.getMonth() })
              }}
              className="text-[11px] text-brand-strong active:opacity-70 cursor-pointer"
            >
              이번 달로
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={goNextMonth}
          className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 active:bg-gray-100 cursor-pointer"
          aria-label="다음 달"
        >
          <ChevronRight size={20} strokeWidth={2} />
        </button>
      </div>

      {/* 월간 요약 */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5">
        <div className="grid grid-cols-3 divide-x divide-gray-100">
          <div className="text-center">
            <div className="text-[11px] text-gray-400 mb-1">수입</div>
            <div className="text-sm font-bold text-emerald-600">
              ₩{summary.income.toLocaleString()}
            </div>
          </div>
          <div className="text-center">
            <div className="text-[11px] text-gray-400 mb-1">지출</div>
            <div className="text-sm font-bold text-rose-500">
              ₩{summary.expense.toLocaleString()}
            </div>
          </div>
          <div className="text-center">
            <div className="text-[11px] text-gray-400 mb-1">잔액</div>
            <div className={`text-sm font-bold ${summary.balance >= 0 ? 'text-gray-900' : 'text-rose-500'}`}>
              ₩{summary.balance.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* 타입 필터 */}
      <div className="grid grid-cols-3 bg-gray-100 rounded-xl p-1">
        {(['all', 'expense', 'income'] as FilterType[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`py-2 rounded-lg text-sm font-semibold transition cursor-pointer ${
              filter === f
                ? f === 'expense'
                  ? 'bg-white text-rose-500 shadow-sm'
                  : f === 'income'
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500'
            }`}
          >
            {f === 'all' ? '전체' : f === 'expense' ? '지출' : '수입'}
          </button>
        ))}
      </div>

      {/* 리스트 */}
      {loading ? (
        <div className="space-y-3">
          <div className="h-16 rounded-2xl bg-gray-100 animate-pulse" />
          <div className="h-16 rounded-2xl bg-gray-100 animate-pulse" />
          <div className="h-16 rounded-2xl bg-gray-100 animate-pulse" />
        </div>
      ) : grouped.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl py-12 px-5 flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <Receipt size={22} className="text-gray-400" strokeWidth={2} />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700">거래 내역이 없어요</p>
            <p className="text-xs text-gray-400 mt-1">
              {filter === 'all'
                ? '이번 달 거래를 추가해보세요'
                : filter === 'expense'
                ? '지출 내역이 없어요'
                : '수입 내역이 없어요'}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {grouped.map(([date, txs]) => {
            const dayTotal = txs.reduce(
              (acc, t) => acc + (t.type === 'income' ? t.amount : -t.amount),
              0,
            )
            return (
              <div key={date}>
                <div className="flex items-center justify-between px-2 mb-2">
                  <div className="text-xs font-semibold text-gray-500">{formatDateLabel(date)}</div>
                  <div
                    className={`text-xs font-medium ${
                      dayTotal >= 0 ? 'text-emerald-600' : 'text-rose-500'
                    }`}
                  >
                    {dayTotal >= 0 ? '+' : '-'} ₩{Math.abs(dayTotal).toLocaleString()}
                  </div>
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl divide-y divide-gray-100 overflow-hidden">
                  {txs.map((tx) => {
                    const emoji = emojiMap.get(`${tx.type}:${tx.category}`)
                    const isConfirming = confirmId === tx.id
                    return (
                      <div key={tx.id} className="px-4 py-3">
                        {isConfirming ? (
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-sm text-gray-700">이 거래를 삭제할까요?</span>
                            <div className="flex gap-2 flex-shrink-0">
                              <button
                                type="button"
                                onClick={() => setConfirmId(null)}
                                className="px-3 py-1.5 text-xs font-medium text-gray-500 rounded-lg active:bg-gray-100 cursor-pointer"
                              >
                                취소
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(tx.id)}
                                className="px-3 py-1.5 text-xs font-semibold text-white bg-rose-500 rounded-lg active:bg-rose-600 cursor-pointer"
                              >
                                삭제
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-lg flex-shrink-0">
                              {emoji ?? (tx.type === 'income' ? '✨' : '📌')}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">{tx.title}</div>
                              <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-1">
                                <span>{tx.category}</span>
                                <span className="text-gray-300">·</span>
                                <Avatar user={userMap.get(tx.userId)} size={18} />
                                <span className="font-medium text-gray-500 leading-none">
                                  {userMap.get(tx.userId)?.id === me?.id
                                    ? '나'
                                    : userMap.get(tx.userId)?.name ?? '파트너'}
                                </span>
                              </div>
                            </div>
                            <div
                              className={`text-sm font-semibold flex-shrink-0 ${
                                tx.type === 'income' ? 'text-emerald-600' : 'text-rose-500'
                              }`}
                            >
                              {tx.type === 'income' ? '+' : '-'} ₩{tx.amount.toLocaleString()}
                            </div>
                            <button
                              type="button"
                              onClick={() => setConfirmId(tx.id)}
                              className="w-8 h-8 flex items-center justify-center rounded-full text-gray-300 active:text-rose-500 active:bg-gray-50 cursor-pointer flex-shrink-0"
                              aria-label="삭제"
                            >
                              <Trash2 size={15} strokeWidth={2} />
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
