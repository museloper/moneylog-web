import { useEffect, useState } from 'react'
import { Plus, X, LogOut, TrendingDown, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

import { useCategoryStore } from '@/features/settings/store'
import { useAuthStore } from '@/features/auth/store'
import { useUserStore } from '@/features/users/store'
import EmojiPicker from '@/features/settings/components/EmojiPicker'
import ProfileSection from '@/features/settings/components/ProfileSection'
import type { CategoryItem } from '@/features/settings/api'

type TransactionType = 'income' | 'expense'

const DEFAULT_EMOJI: Record<TransactionType, string> = {
  expense: '📌',
  income: '✨',
}

const ACCENT = {
  expense: {
    text: 'text-rose-500',
    bg: 'bg-rose-500',
    bgSoft: 'bg-rose-50',
    ring: 'ring-rose-400',
    border: 'border-rose-200',
    icon: TrendingDown,
  },
  income: {
    text: 'text-emerald-600',
    bg: 'bg-emerald-600',
    bgSoft: 'bg-emerald-50',
    ring: 'ring-emerald-400',
    border: 'border-emerald-200',
    icon: TrendingUp,
  },
} as const

type FormMode = { kind: 'idle' } | { kind: 'add' } | { kind: 'edit'; id: number }

function CategorySection({
  title,
  type,
  items,
  onAdd,
  onUpdate,
  onRemove,
}: {
  title: string
  type: TransactionType
  items: CategoryItem[]
  onAdd: (name: string, emoji: string, type: TransactionType) => Promise<void>
  onUpdate: (id: number, name: string, emoji: string) => Promise<void>
  onRemove: (id: number) => Promise<void>
}) {
  const accent = ACCENT[type]
  const Icon = accent.icon

  const [mode, setMode] = useState<FormMode>({ kind: 'idle' })
  const [inputValue, setInputValue] = useState('')
  const [selectedEmoji, setSelectedEmoji] = useState(DEFAULT_EMOJI[type])
  const [pickerOpen, setPickerOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [deletingItem, setDeletingItem] = useState<CategoryItem | null>(null)

  const startAdd = () => {
    setMode({ kind: 'add' })
    setInputValue('')
    setSelectedEmoji(DEFAULT_EMOJI[type])
    setPickerOpen(false)
    setDeletingItem(null)
  }

  const startEdit = (item: CategoryItem) => {
    setMode({ kind: 'edit', id: item.id })
    setInputValue(item.name)
    setSelectedEmoji(item.emoji ?? DEFAULT_EMOJI[type])
    setPickerOpen(false)
    setDeletingItem(null)
  }

  const resetForm = () => {
    setMode({ kind: 'idle' })
    setInputValue('')
    setSelectedEmoji(DEFAULT_EMOJI[type])
    setPickerOpen(false)
  }

  const handleSubmit = async () => {
    const trimmed = inputValue.trim()
    if (!trimmed) return
    setSubmitting(true)
    try {
      if (mode.kind === 'edit') {
        await onUpdate(mode.id, trimmed, selectedEmoji)
      } else if (mode.kind === 'add') {
        await onAdd(trimmed, selectedEmoji, type)
      }
      resetForm()
    } catch {
      toast.error(mode.kind === 'edit' ? '수정에 실패했습니다' : '추가에 실패했습니다')
    } finally {
      setSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit()
    if (e.key === 'Escape') resetForm()
  }

  const handleConfirmDelete = async () => {
    if (!deletingItem) return
    try {
      await onRemove(deletingItem.id)
      setDeletingItem(null)
    } catch {
      toast.error('삭제에 실패했습니다')
    }
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5">
      {/* 섹션 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-lg ${accent.bgSoft} flex items-center justify-center`}>
            <Icon size={14} className={accent.text} strokeWidth={2.5} />
          </div>
          <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
          <span className="text-[11px] text-gray-400">{items.length}개</span>
        </div>
      </div>

      {/* 그리드 */}
      <div className="grid grid-cols-4 gap-2">
        {items.map((item) => {
          const isEditing = mode.kind === 'edit' && mode.id === item.id
          const handleTileClick = () => {
            if (item.isDefault) {
              toast('기본 카테고리는 수정할 수 없어요', {
                description: '같은 이름으로 추가하면 사용자 지정할 수 있어요',
              })
              return
            }
            startEdit(item)
          }
          return (
            <div key={item.id} className="relative">
              <button
                type="button"
                onClick={handleTileClick}
                className={`w-full flex flex-col items-center justify-center gap-1 py-3 rounded-2xl transition cursor-pointer ${
                  isEditing
                    ? `${accent.bgSoft} ring-2 ${accent.ring}`
                    : 'bg-gray-50 active:bg-gray-100'
                }`}
              >
                <span className="text-2xl leading-none">{item.emoji ?? DEFAULT_EMOJI[type]}</span>
                <span className={`text-[11px] font-medium truncate max-w-full px-1 ${
                  isEditing ? accent.text : 'text-gray-700'
                }`}>
                  {item.name}
                </span>
              </button>
              {!item.isDefault && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setDeletingItem(item)
                  }}
                  aria-label={`${item.name} 삭제`}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center active:bg-gray-300 cursor-pointer"
                >
                  <X size={11} strokeWidth={2.5} />
                </button>
              )}
            </div>
          )
        })}

        {/* + 추가 타일 */}
        {mode.kind !== 'add' && (
          <button
            type="button"
            onClick={startAdd}
            className="flex flex-col items-center justify-center gap-1 py-3 rounded-2xl border border-dashed border-gray-300 text-gray-400 active:border-gray-400 active:text-gray-600 cursor-pointer"
          >
            <Plus size={20} strokeWidth={2} />
            <span className="text-[11px] font-medium">추가</span>
          </button>
        )}
      </div>

      {items.length === 0 && mode.kind !== 'add' && (
        <p className="text-xs text-gray-400 mt-3 text-center">아직 카테고리가 없어요</p>
      )}

      {/* 입력 영역 (추가 또는 편집) */}
      {mode.kind !== 'idle' && (
        <div className="mt-3 relative">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-[11px] font-semibold text-gray-500">
              {mode.kind === 'edit' ? '카테고리 수정' : '새 카테고리'}
            </span>
            {mode.kind === 'edit' && (
              <span className="text-[10px] text-gray-400">탭해서 다른 카테고리도 수정할 수 있어요</span>
            )}
          </div>
          <div className={`flex items-center gap-2 border ${accent.border} ${accent.bgSoft} rounded-xl px-3 py-2.5`}>
            <button
              type="button"
              onClick={() => setPickerOpen((o) => !o)}
              className="text-xl w-9 h-9 flex items-center justify-center rounded-lg bg-white active:bg-gray-50 cursor-pointer flex-shrink-0"
              aria-label="이모지 선택"
            >
              {selectedEmoji}
            </button>
            <input
              autoFocus
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={10}
              placeholder="카테고리 이름"
              className={`flex-1 text-sm font-medium bg-transparent focus:outline-none placeholder:text-gray-300 ${accent.text}`}
            />
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || !inputValue.trim()}
              className={`text-xs font-semibold px-3 py-1.5 ${accent.bg} text-white rounded-lg disabled:opacity-30 cursor-pointer`}
            >
              {mode.kind === 'edit' ? '수정' : '저장'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="text-xs text-gray-400 px-1 cursor-pointer"
              aria-label="취소"
            >
              <X size={16} strokeWidth={2} />
            </button>
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

      {/* 삭제 확인 */}
      {deletingItem && (
        <div className="mt-3 px-4 py-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center justify-between gap-2">
          <span className="text-sm text-gray-700 truncate">
            <span className="font-medium">{deletingItem.emoji ?? DEFAULT_EMOJI[type]} {deletingItem.name}</span> 삭제할까요?
          </span>
          <div className="flex gap-1.5 flex-shrink-0">
            <button
              type="button"
              onClick={() => setDeletingItem(null)}
              className="text-xs font-medium text-gray-500 px-3 py-1.5 rounded-lg active:bg-white cursor-pointer"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              className="text-xs font-semibold text-white bg-rose-500 px-3 py-1.5 rounded-lg active:bg-rose-600 cursor-pointer"
            >
              삭제
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function SettingsPage() {
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)
  const { categories, loaded, load, add, update, remove } = useCategoryStore()
  const userLoaded = useUserStore((s) => s.loaded)
  const loadUser = useUserStore((s) => s.load)

  useEffect(() => {
    load().catch(() => toast.error('카테고리를 불러오지 못했습니다'))
    loadUser().catch(() => toast.error('프로필을 불러오지 못했습니다'))
  }, [])

  const expense = categories.filter((c) => c.type === 'expense')
  const income = categories.filter((c) => c.type === 'income')

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-base font-bold text-gray-900 mb-1">설정</h1>
        <p className="text-[11px] text-gray-400">프로필과 카테고리를 관리할 수 있어요</p>
      </div>

      {userLoaded ? (
        <ProfileSection />
      ) : (
        <div className="h-32 rounded-2xl bg-gray-100 animate-pulse" />
      )}

      {!loaded ? (
        <div className="space-y-3">
          <div className="h-40 rounded-2xl bg-gray-100 animate-pulse" />
          <div className="h-32 rounded-2xl bg-gray-100 animate-pulse" />
        </div>
      ) : (
        <>
          <CategorySection
            title="지출 카테고리"
            type="expense"
            items={expense}
            onAdd={add}
            onUpdate={update}
            onRemove={remove}
          />
          <CategorySection
            title="수입 카테고리"
            type="income"
            items={income}
            onAdd={add}
            onUpdate={update}
            onRemove={remove}
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
