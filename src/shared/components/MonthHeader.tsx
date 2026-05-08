import { useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface MonthCursor {
  year: number
  month: number // 0-indexed
}

const initialCursor = (): MonthCursor => {
  const d = new Date()
  return { year: d.getFullYear(), month: d.getMonth() }
}

const isCurrentMonth = (c: MonthCursor) => {
  const now = new Date()
  return c.year === now.getFullYear() && c.month === now.getMonth()
}

/** 월 커서 상태 + prev/next/today 동작을 한 묶음으로 제공 */
export const useMonthCursor = () => {
  const [cursor, setCursor] = useState<MonthCursor>(initialCursor)

  const goPrev = useCallback(() => {
    setCursor((c) =>
      c.month === 0 ? { year: c.year - 1, month: 11 } : { ...c, month: c.month - 1 },
    )
  }, [])

  const goNext = useCallback(() => {
    setCursor((c) =>
      c.month === 11 ? { year: c.year + 1, month: 0 } : { ...c, month: c.month + 1 },
    )
  }, [])

  const goToday = useCallback(() => {
    setCursor(initialCursor())
  }, [])

  return { cursor, setCursor, goPrev, goNext, goToday, isCurrent: isCurrentMonth(cursor) }
}

interface Props {
  cursor: MonthCursor
  onPrev: () => void
  onNext: () => void
  onToday: () => void
  isCurrent: boolean
}

export default function MonthHeader({ cursor, onPrev, onNext, onToday, isCurrent }: Props) {
  return (
    <div className="flex items-center justify-between bg-white border border-gray-100 rounded-2xl px-4 py-3">
      <button
        type="button"
        onClick={onPrev}
        aria-label="이전 달"
        className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 active:bg-gray-100 cursor-pointer"
      >
        <ChevronLeft size={20} strokeWidth={2} />
      </button>
      <div className="text-center">
        <div className="text-base font-semibold text-gray-900">
          {cursor.year}년 {cursor.month + 1}월
        </div>
        {!isCurrent && (
          <button
            type="button"
            onClick={onToday}
            className="text-[11px] text-brand-strong active:opacity-70 cursor-pointer"
          >
            이번 달로
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={onNext}
        aria-label="다음 달"
        className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 active:bg-gray-100 cursor-pointer"
      >
        <ChevronRight size={20} strokeWidth={2} />
      </button>
    </div>
  )
}
