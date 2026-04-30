import { useEffect, useState } from 'react'
import { Plus, X, LogOut } from 'lucide-react'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

import { useCategoryStore } from '@/features/settings/store'
import { useAuthStore } from '@/features/auth/store'
import EmojiPicker from '@/features/settings/components/EmojiPicker'
import type { CategoryItem } from '@/features/settings/api'

type TransactionType = 'income' | 'expense'

const DEFAULT_EMOJI: Record<TransactionType, string> = {
  expense: '📌',
  income: '✨',
}

function CategorySection({
  title,
  type,
  items,
  onAdd,
  onRemove,
}: {
  title: string
  type: TransactionType
  items: CategoryItem[]
  onAdd: (name: string, emoji: string, type: TransactionType) => Promise<void>
  onRemove: (id: number) => Promise<void>
}) {
  const [inputVisible, setInputVisible] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [selectedEmoji, setSelectedEmoji] = useState(DEFAULT_EMOJI[type])
  const [pickerOpen, setPickerOpen] = useState(false)
  const [adding, setAdding] = useState(false)

  const resetInput = () => {
    setInputVisible(false)
    setInputValue('')
    setSelectedEmoji(DEFAULT_EMOJI[type])
    setPickerOpen(false)
  }

  const handleAdd = async () => {
    const trimmed = inputValue.trim()
    if (!trimmed) return
    setAdding(true)
    try {
      await onAdd(trimmed, selectedEmoji, type)
      resetInput()
    } catch {
      toast.error('추가에 실패했습니다')
    } finally {
      setAdding(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd()
    if (e.key === 'Escape') resetInput()
  }

  const accentColor = type === 'expense' ? 'text-rose-500' : 'text-emerald-600'
  const chipBg = type === 'expense' ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50 border-emerald-200'

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-sm font-semibold ${accentColor}`}>{title}</h2>
        {!inputVisible && (
          <button
            type="button"
            onClick={() => setInputVisible(true)}
            className="flex items-center gap-1 text-xs text-gray-500 active:text-gray-700 cursor-pointer"
          >
            <Plus size={14} strokeWidth={2.5} />
            추가
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <div
            key={item.id}
            className={`flex items-center gap-1.5 pl-2 pr-2 py-1.5 rounded-full border text-sm font-medium ${chipBg} ${accentColor}`}
          >
            {item.emoji && <span className="text-base leading-none">{item.emoji}</span>}
            <span>{item.name}</span>
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              className="ml-0.5 opacity-40 active:opacity-100 cursor-pointer"
              aria-label={`${item.name} 삭제`}
            >
              <X size={13} strokeWidth={2.5} />
            </button>
          </div>
        ))}
      </div>

      {inputVisible && (
        <div className="mt-3 relative">
          <div className={`flex items-center gap-2 border rounded-xl px-3 py-2.5 ${chipBg}`}>
            {/* 이모지 선택 버튼 */}
            <button
              type="button"
              onClick={() => setPickerOpen((o) => !o)}
              className="text-xl w-8 h-8 flex items-center justify-center rounded-lg bg-white/70 active:bg-white cursor-pointer flex-shrink-0"
              aria-label="이모지 선택"
            >
              {selectedEmoji}
            </button>

            {/* 이름 입력 */}
            <input
              autoFocus
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={10}
              placeholder="카테고리 이름"
              className={`flex-1 text-sm font-medium bg-transparent focus:outline-none placeholder:text-gray-300 ${accentColor}`}
            />

            {/* 확인 / 취소 */}
            <div className="flex gap-1 flex-shrink-0">
              <button
                type="button"
                onClick={handleAdd}
                disabled={adding || !inputValue.trim()}
                className="text-xs font-semibold px-2.5 py-1 bg-white/80 rounded-lg active:bg-white disabled:opacity-40 cursor-pointer"
              >
                확인
              </button>
              <button
                type="button"
                onClick={resetInput}
                className="text-xs text-gray-400 px-2 py-1 cursor-pointer"
              >
                취소
              </button>
            </div>
          </div>

          {pickerOpen && (
            <EmojiPicker
              onSelect={(emoji) => {
                setSelectedEmoji(emoji)
                setPickerOpen(false)
              }}
              onClose={() => setPickerOpen(false)}
            />
          )}
        </div>
      )}

      {items.length === 0 && !inputVisible && (
        <p className="text-xs text-gray-400 mt-1">아직 카테고리가 없어요</p>
      )}
    </div>
  )
}

export default function SettingsPage() {
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)
  const { categories, loaded, load, add, remove } = useCategoryStore()

  useEffect(() => {
    load().catch(() => toast.error('카테고리를 불러오지 못했습니다'))
  }, [])

  const expense = categories.filter((c) => c.type === 'expense')
  const income = categories.filter((c) => c.type === 'income')

  const handleRemove = async (id: number) => {
    try {
      await remove(id)
    } catch {
      toast.error('삭제에 실패했습니다')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-base font-bold text-gray-900 mb-1">카테고리 관리</h1>
        <p className="text-xs text-gray-400">파트너와 공유되는 카테고리예요</p>
      </div>

      {!loaded ? (
        <div className="space-y-3">
          <div className="h-32 rounded-2xl bg-gray-100 animate-pulse" />
          <div className="h-24 rounded-2xl bg-gray-100 animate-pulse" />
        </div>
      ) : (
        <>
          <CategorySection
            title="지출 카테고리"
            type="expense"
            items={expense}
            onAdd={add}
            onRemove={handleRemove}
          />
          <CategorySection
            title="수입 카테고리"
            type="income"
            items={income}
            onAdd={add}
            onRemove={handleRemove}
          />
        </>
      )}

      <div className="pt-2">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-white border border-gray-100 text-sm font-medium text-gray-500 active:bg-gray-50 transition cursor-pointer"
        >
          <LogOut size={16} strokeWidth={2} />
          로그아웃
        </button>
      </div>
    </div>
  )
}
