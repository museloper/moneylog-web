import { Sparkles } from 'lucide-react'

export default function ComingSoonPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 pt-20">
      <div className="w-14 h-14 rounded-full bg-brand-soft flex items-center justify-center">
        <Sparkles size={26} className="text-brand-strong" strokeWidth={2} />
      </div>
      <p className="text-base font-semibold text-gray-800">{title}</p>
      <p className="text-sm text-gray-400">곧 만나볼 수 있어요</p>
    </div>
  )
}
