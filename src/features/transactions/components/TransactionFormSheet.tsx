import { useEffect, useRef, useState } from 'react'
import { X, Calendar } from 'lucide-react'
import { toast } from 'sonner'

import { useTransactionStore } from '@/features/transactions/store'
import { createTransaction, updateTransactionApi } from '@/features/transactions/api'
import { useCategoryStore } from '@/features/settings/store'
import { todayString, yesterdayString, formatDateLabel } from '@/shared/utils/date'
import { ACCENT, type TransactionType } from '@/shared/utils/accent'

const CLOSE_THRESHOLD = 120

export default function TransactionFormSheet() {
  const isOpen = useTransactionStore((state) => state.isFormOpen)
  const editTarget = useTransactionStore((state) => state.editTarget)
  const closeForm = useTransactionStore((state) => state.closeForm)
  const notifyCreated = useTransactionStore((state) => state.notifyCreated)
  const isEditMode = editTarget !== null

  const [type, setType] = useState<TransactionType>('expense')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(todayString())
  const [submitting, setSubmitting] = useState(false)

  const { categories: allCategories, load: loadCategories } = useCategoryStore()

  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartYRef = useRef(0)
  const dateInputRef = useRef<HTMLInputElement>(null)

  // 시트가 열릴 때마다 입력 초기화 + 카테고리 로드
  useEffect(() => {
    if (isOpen) {
      if (editTarget) {
        setType(editTarget.type)
        setAmount(String(editTarget.amount))
        setCategory(editTarget.category)
        setTitle(editTarget.title)
        setDate(editTarget.date)
      } else {
        setType('expense')
        setAmount('')
        setCategory('')
        setTitle('')
        setDate(todayString())
      }
      setDragOffset(0)
      loadCategories()
    }
  }, [isOpen])

  // 시트 열릴 때 body 스크롤 잠금
  useEffect(() => {
    if (!isOpen) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [isOpen])

  const categories = allCategories.filter((c) => c.type === type)

  const handleAmountChange = (value: string) => {
    const onlyDigits = value.replace(/[^0-9]/g, '')
    setAmount(onlyDigits)
  }

  const formattedAmount = amount ? Number(amount).toLocaleString() : ''

  const handleDragStart = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button')) return
    setIsDragging(true)
    dragStartYRef.current = e.clientY
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }

  const handleDragMove = (e: React.PointerEvent) => {
    if (!isDragging) return
    const delta = e.clientY - dragStartYRef.current
    setDragOffset(Math.max(0, delta))
  }

  const handleDragEnd = () => {
    if (!isDragging) return
    setIsDragging(false)
    if (dragOffset > CLOSE_THRESHOLD) {
      closeForm()
    } else {
      setDragOffset(0)
    }
  }

  const handleSubmit = async () => {
    const numericAmount = Number(amount)
    if (!numericAmount || numericAmount <= 0) {
      toast.error('금액을 입력해주세요')
      return
    }
    if (!category) {
      toast.error('카테고리를 선택해주세요')
      return
    }
    if (!title.trim()) {
      toast.error('내용을 입력해주세요')
      return
    }

    setSubmitting(true)
    try {
      if (isEditMode) {
        await updateTransactionApi(editTarget!.id, {
          type,
          amount: numericAmount,
          category,
          title: title.trim(),
          date,
        })
        toast.success('수정됐어요')
      } else {
        await createTransaction({
          type,
          amount: numericAmount,
          category,
          title: title.trim(),
          date,
        })
        toast.success(type === 'income' ? '수입이 추가됐어요' : '지출이 추가됐어요')
      }
      notifyCreated()
      closeForm()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '등록에 실패했습니다')
    } finally {
      setSubmitting(false)
    }
  }

  const accent = ACCENT[type]

  return (
    <div
      className={`fixed inset-0 z-50 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      aria-hidden={!isOpen}
    >
      {/* 백드롭 */}
      <div
        onClick={closeForm}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* 시트 */}
      <div
        className="absolute bottom-0 left-1/2 w-full max-w-[480px] bg-white rounded-t-3xl shadow-[0_-12px_40px_rgba(0,0,0,0.12)]"
        style={{
          transform: isOpen
            ? `translateX(-50%) translateY(${dragOffset}px)`
            : 'translateX(-50%) translateY(100%)',
          transition: isDragging ? 'none' : 'transform 300ms ease-out',
        }}
      >
        <div className="flex flex-col max-h-[92dvh]">
          {/* 핸들 + 헤더 (드래그 영역) */}
          <div
            className="px-5 pt-3 pb-2 touch-none select-none cursor-grab active:cursor-grabbing"
            onPointerDown={handleDragStart}
            onPointerMove={handleDragMove}
            onPointerUp={handleDragEnd}
            onPointerCancel={handleDragEnd}
          >
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-3" />
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">{isEditMode ? '거래 수정' : '새 거래 추가'}</h2>
              <button
                type="button"
                onClick={closeForm}
                aria-label="닫기"
                className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 active:bg-gray-100 cursor-pointer"
              >
                <X size={18} strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* 본문 (스크롤) */}
          <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-6">
            {/* 타입 토글 */}
            <div className="grid grid-cols-2 bg-gray-100 rounded-xl p-1">
              <button
                type="button"
                onClick={() => {
                  setType('expense')
                  setCategory('')
                }}
                className={`py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
                  type === 'expense' ? 'bg-white text-rose-500 shadow-sm' : 'text-gray-500'
                }`}
              >
                지출
              </button>
              <button
                type="button"
                onClick={() => {
                  setType('income')
                  setCategory('')
                }}
                className={`py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
                  type === 'income' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500'
                }`}
              >
                수입
              </button>
            </div>

            {/* 히어로 금액 디스플레이 */}
            <label className="flex items-center justify-center gap-0.5 py-3 cursor-text">
              <span className="text-4xl font-bold text-gray-300 leading-none">₩</span>
              <span className="relative inline-block">
                {/* 보이지 않는 미러 텍스트로 래퍼 너비 결정 */}
                <span
                  className="block invisible whitespace-pre text-4xl font-bold leading-none pointer-events-none select-none"
                  aria-hidden="true"
                >
                  {formattedAmount || '0'}
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  value={formattedAmount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  className={`absolute inset-0 text-4xl font-bold leading-none focus:outline-none placeholder:text-gray-300 bg-transparent ${accent.text}`}
                  style={{ caretColor: accent.caret }}
                />
              </span>
            </label>

            {/* 카테고리 그리드 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-gray-500">카테고리</label>
                {categories.length === 0 && (
                  <span className="text-[10px] text-gray-400">설정에서 추가해보세요</span>
                )}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {categories.map((c) => {
                  const selected = category === c.name
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCategory(c.name)}
                      className={`flex flex-col items-center justify-center gap-1 py-3 rounded-2xl transition cursor-pointer ${
                        selected
                          ? `${accent.bgSoft} ring-2 ${accent.ring}`
                          : 'bg-gray-50 active:bg-gray-100'
                      }`}
                    >
                      <span className="text-2xl leading-none">{c.emoji ?? '📌'}</span>
                      <span
                        className={`text-[11px] font-medium truncate max-w-full px-1 ${
                          selected ? accent.text : 'text-gray-600'
                        }`}
                      >
                        {c.name}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 내용 */}
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-2">내용</label>
              <input
                type="text"
                placeholder="예) 점심 식사"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={30}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-brand-strong focus:bg-white transition-colors"
              />
            </div>

            {/* 날짜 */}
            <div>
              <div className="flex items-baseline justify-between mb-2">
                <label className="text-xs font-medium text-gray-500">날짜</label>
                <span className={`text-xs font-medium ${accent.text}`}>
                  {formatDateLabel(date)}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {([todayString(), yesterdayString()] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDate(d)}
                    className={`py-2.5 rounded-xl text-sm font-medium transition cursor-pointer ${
                      date === d
                        ? `${accent.bgSoft} ${accent.text} ring-1 ${accent.ring}`
                        : 'bg-gray-50 text-gray-600 active:bg-gray-100'
                    }`}
                  >
                    {d === todayString() ? '오늘' : '어제'}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => dateInputRef.current?.showPicker?.()}
                  className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer ${
                    date !== todayString() && date !== yesterdayString()
                      ? `${accent.bgSoft} ${accent.text} ring-1 ${accent.ring}`
                      : 'bg-gray-50 text-gray-600 active:bg-gray-100'
                  }`}
                >
                  <Calendar size={14} strokeWidth={2} />
                  직접 선택
                </button>
              </div>
              <input
                ref={dateInputRef}
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="sr-only"
                aria-hidden
                tabIndex={-1}
              />
            </div>
          </div>

          {/* 푸터 */}
          <div className="px-5 pt-3 pb-[calc(env(safe-area-inset-bottom)+16px)] border-t border-gray-100">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className={`w-full ${accent.bg} text-white py-3.5 rounded-xl text-sm font-semibold active:opacity-90 transition disabled:opacity-50 cursor-pointer`}
            >
              {submitting ? (isEditMode ? '수정 중...' : '저장 중...') : (isEditMode ? '수정하기' : '저장하기')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
