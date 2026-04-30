import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Copy, LogOut, Heart } from 'lucide-react'

import { getCoupleStatus, createCouple, joinCouple } from '@/features/couple/api'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store'

export default function CouplePage() {
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)
  const setLinked = useAuthStore((state) => state.setLinked)
  const [generatedCode, setGeneratedCode] = useState('')
  const [inputCode, setInputCode] = useState('')

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  useEffect(() => {
    getCoupleStatus().then(({ linked, inviteCode }) => {
      if (linked) {
        navigate('/dashboard', { replace: true })
      } else if (inviteCode) {
        setGeneratedCode(inviteCode)
      }
    })
  }, [])

  const handleCreate = async () => {
    try {
      const data = await createCouple()
      setGeneratedCode(data.inviteCode)
    } catch {
      toast.error('초대 코드 생성에 실패했습니다')
    }
  }

  const handleJoin = async () => {
    if (!inputCode.trim()) {
      toast.error('초대 코드를 입력해주세요')
      return
    }
    try {
      await joinCouple(inputCode.trim())
      setLinked(true)
      toast.success('커플 연동이 완료됐습니다!')
      navigate('/dashboard', { replace: true })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '연동에 실패했습니다')
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode)
    toast.success('초대 코드가 복사됐습니다')
  }

  return (
    <div className="min-h-dvh bg-gray-50 px-6 py-10 flex flex-col">
      <button
        onClick={handleLogout}
        className="self-end flex items-center gap-1 text-xs text-gray-400 active:text-gray-600 transition cursor-pointer"
      >
        <LogOut size={14} strokeWidth={2} />
        로그아웃
      </button>

      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 rounded-full bg-brand-soft flex items-center justify-center mb-4">
            <Heart size={26} className="text-brand-strong" strokeWidth={2.2} fill="currentColor" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">커플 연동</h1>
          <p className="text-sm text-gray-500 mt-2 text-center">
            파트너와 연동하면<br />가계부를 함께 관리할 수 있어요
          </p>
        </div>

        {/* 초대 코드 생성 */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-3">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">내 초대 코드</h2>
          {generatedCode ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-brand-soft rounded-xl px-4 py-3">
                <span className="text-xl font-mono font-bold text-brand-strong tracking-widest">{generatedCode}</span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-xs text-brand-strong font-medium active:opacity-70 cursor-pointer"
                >
                  <Copy size={14} strokeWidth={2} />
                  복사
                </button>
              </div>
              <p className="text-xs text-gray-400">파트너가 이 코드를 입력하면 연동이 완료돼요</p>
            </div>
          ) : (
            <button
              onClick={handleCreate}
              className="w-full bg-brand-strong text-white py-3 rounded-xl text-sm font-semibold active:opacity-90 transition cursor-pointer"
            >
              코드 생성하기
            </button>
          )}
        </div>

        {/* 구분선 */}
        <div className="flex items-center gap-3 my-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">또는</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* 초대 코드 입력 */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">파트너의 코드 입력</h2>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="초대 코드 8자리"
              maxLength={8}
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-center text-base font-mono tracking-widest focus:outline-none focus:border-brand-strong focus:bg-white uppercase text-gray-900 placeholder:text-gray-300 placeholder:font-sans placeholder:tracking-normal placeholder:text-sm"
            />
            <button
              onClick={handleJoin}
              className="w-full bg-white border border-brand-strong text-brand-strong py-3 rounded-xl text-sm font-semibold active:bg-brand-soft transition cursor-pointer"
            >
              연동하기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
