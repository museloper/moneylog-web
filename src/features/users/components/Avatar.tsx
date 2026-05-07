import type { UserProfile } from '@/features/users/api'

interface Props {
  user: UserProfile | undefined | null
  size?: number
  className?: string
}

const PALETTE = [
  'bg-rose-100 text-rose-600',
  'bg-amber-100 text-amber-700',
  'bg-emerald-100 text-emerald-700',
  'bg-sky-100 text-sky-700',
  'bg-violet-100 text-violet-700',
  'bg-pink-100 text-pink-700',
]

const DOT_PALETTE = [
  'bg-rose-400',
  'bg-amber-400',
  'bg-emerald-400',
  'bg-sky-400',
  'bg-violet-400',
  'bg-pink-400',
]

const colorForId = (id: number) => PALETTE[id % PALETTE.length]

export const getUserDotColor = (id: number | undefined) =>
  id !== undefined ? DOT_PALETTE[id % DOT_PALETTE.length] : 'bg-gray-300'

export default function Avatar({ user, size = 24, className = '' }: Props) {
  const initial = (user?.name?.trim() || user?.email || '?').charAt(0).toUpperCase()
  const base = `inline-flex items-center justify-center rounded-full overflow-hidden flex-shrink-0 ${className}`

  if (user?.profileImage) {
    return (
      <img
        src={user.profileImage}
        alt={user.name ?? user.email ?? '사용자'}
        referrerPolicy="no-referrer"
        className={base}
        style={{ width: size, height: size }}
      />
    )
  }

  const colorClass = user ? colorForId(user.id) : 'bg-gray-100 text-gray-400'

  return (
    <span
      className={`${base} ${colorClass} font-semibold leading-none`}
      style={{ width: size, height: size, fontSize: size * 0.45 }}
    >
      {initial}
    </span>
  )
}
