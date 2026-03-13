export default function ComingSoonPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2 pt-20">
      <p className="text-4xl">🚧</p>
      <p className="text-base font-medium">{title}</p>
      <p className="text-sm">준비 중입니다</p>
    </div>
  )
}
