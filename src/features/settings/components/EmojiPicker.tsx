import { useEffect, useRef } from 'react'

const EMOJI_GROUPS = [
  {
    label: '음식',
    emojis: ['🍚', '🍜', '🍕', '🍔', '🍣', '🥗', '🥘', '🍱', '🥪', '🍞', '🥐', '🍳'],
  },
  {
    label: '카페/음료',
    emojis: ['☕', '🧋', '🧃', '🥤', '🍵', '🧉', '🍺', '🍷', '🍰', '🍩', '🍫', '🧁'],
  },
  {
    label: '교통',
    emojis: ['🚌', '🚇', '🚗', '🚕', '✈️', '🚲', '🛵', '🚢', '🚃', '🛺', '🏍️', '⛽'],
  },
  {
    label: '쇼핑/생활',
    emojis: ['🛍️', '👗', '👟', '💄', '🎁', '🛒', '🏠', '🛋️', '💡', '🧹', '🪴', '🧺'],
  },
  {
    label: '건강/의료',
    emojis: ['💊', '🏥', '🧘', '🏋️', '🩺', '💉', '🩹', '🧴', '🪥', '🏃', '🧠', '❤️'],
  },
  {
    label: '문화/취미',
    emojis: ['🎬', '🎵', '🎮', '📚', '🎨', '🎭', '⚽', '🎤', '🎲', '🎪', '📷', '🎯'],
  },
  {
    label: '금융/수입',
    emojis: ['💰', '💵', '💳', '📈', '🏦', '💎', '🪙', '📊', '💹', '🤑', '✨', '🎉'],
  },
  {
    label: '기타',
    emojis: ['📌', '⭐', '🔑', '📱', '💻', '🖥️', '🐶', '🐱', '🌿', '🌸', '☀️', '🌙'],
  },
]

interface Props {
  onSelect: (emoji: string) => void
  onClose: () => void
}

export default function EmojiPicker({ onSelect, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [onClose])

  return (
    <div
      ref={ref}
      className="absolute bottom-full left-0 mb-2 w-72 bg-white border border-gray-200 rounded-2xl shadow-xl z-10 overflow-hidden"
    >
      <div className="max-h-64 overflow-y-auto p-3 space-y-3">
        {EMOJI_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="text-[10px] font-semibold text-gray-400 mb-1.5 px-1">{group.label}</p>
            <div className="grid grid-cols-6 gap-1">
              {group.emojis.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => onSelect(emoji)}
                  className="text-xl h-9 w-9 flex items-center justify-center rounded-lg active:bg-gray-100 cursor-pointer hover:bg-gray-50 transition"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
