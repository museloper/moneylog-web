import { useState } from 'react'
import { Pencil, Check, X, User as UserIcon } from 'lucide-react'
import { toast } from 'sonner'

import { useUserStore } from '@/features/users/store'
import Avatar from '@/features/users/components/Avatar'

export default function ProfileSection() {
  const me = useUserStore((s) => s.me)
  const members = useUserStore((s) => s.members)
  const updateProfile = useUserStore((s) => s.updateProfile)

  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const partner = members.find((m) => m.id !== me?.id) ?? null

  const startEdit = () => {
    setName(me?.name ?? '')
    setEditing(true)
  }

  const cancel = () => {
    setEditing(false)
    setName('')
  }

  const save = async () => {
    const trimmed = name.trim()
    if (!trimmed) {
      toast.error('이름을 입력해주세요')
      return
    }
    setSubmitting(true)
    try {
      await updateProfile(trimmed)
      toast.success('프로필이 업데이트됐어요')
      setEditing(false)
    } catch {
      toast.error('업데이트에 실패했습니다')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-brand-soft flex items-center justify-center">
          <UserIcon size={14} className="text-brand-strong" strokeWidth={2.5} />
        </div>
        <h2 className="text-sm font-semibold text-gray-900">프로필</h2>
      </div>

      {/* 내 프로필 */}
      <div className="flex items-center gap-3">
        <Avatar user={me} size={48} />
        <div className="flex-1 min-w-0">
          {editing ? (
            <div className="flex items-center gap-1.5">
              <input
                autoFocus
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') save()
                  if (e.key === 'Escape') cancel()
                }}
                maxLength={20}
                placeholder="이름"
                className="flex-1 min-w-0 text-sm font-medium text-gray-900 border-b border-brand-strong bg-transparent focus:outline-none placeholder:text-gray-300 pb-0.5"
              />
              <button
                type="button"
                onClick={save}
                disabled={submitting}
                aria-label="저장"
                className="w-7 h-7 flex items-center justify-center rounded-full bg-brand-strong text-white active:opacity-80 disabled:opacity-40 cursor-pointer"
              >
                <Check size={14} strokeWidth={2.5} />
              </button>
              <button
                type="button"
                onClick={cancel}
                aria-label="취소"
                className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 active:bg-gray-100 cursor-pointer"
              >
                <X size={14} strokeWidth={2.5} />
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-gray-900 truncate">
                  {me?.name ?? '이름 없음'}
                </span>
                <span className="text-[10px] text-brand-strong font-medium bg-brand-soft px-1.5 py-0.5 rounded">
                  나
                </span>
                <button
                  type="button"
                  onClick={startEdit}
                  aria-label="이름 수정"
                  className="text-gray-400 active:text-gray-600 cursor-pointer"
                >
                  <Pencil size={12} strokeWidth={2} />
                </button>
              </div>
              <div className="text-[11px] text-gray-400 truncate">{me?.email}</div>
            </>
          )}
        </div>
      </div>

      {/* 파트너 */}
      {partner && (
        <>
          <div className="my-4 border-t border-gray-100" />
          <div className="flex items-center gap-3">
            <Avatar user={partner} size={48} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-gray-900 truncate">
                  {partner.name ?? '파트너'}
                </span>
                <span className="text-[10px] text-pink-600 font-medium bg-pink-50 px-1.5 py-0.5 rounded">
                  파트너
                </span>
              </div>
              <div className="text-[11px] text-gray-400 truncate">{partner.email}</div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
