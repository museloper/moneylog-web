import { useState, useEffect } from 'react'
import { toast } from 'sonner'

import { getCoupleStatus, createCouple, joinCouple } from '@/features/couple/api'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store'
import logo from '@/assets/images/logo.png'

export default function CouplePage() {
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="머니로그 로고" className="w-12 h-12 mb-3" />
          <h1 className="text-xl font-bold text-gray-800">커플 연동</h1>
          <p className="text-sm text-gray-400 mt-1">파트너와 연동하면 가계부를 함께 관리할 수 있어요</p>
        </div>

        {/* 초대 코드 생성 */}
        <div className="bg-white rounded-2xl shadow-md p-5 mb-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">초대 코드 생성</h2>
          {generatedCode ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
                <span className="text-lg font-mono font-bold text-brand-strong tracking-widest">{generatedCode}</span>
                <button
                  onClick={handleCopy}
                  className="text-xs text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  복사
                </button>
              </div>
              <p className="text-xs text-gray-400">파트너가 이 코드를 입력하면 연동이 완료돼요</p>
            </div>
          ) : (
            <button
              onClick={handleCreate}
              className="w-full bg-brand-strong text-white py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition cursor-pointer"
            >
              코드 생성하기
            </button>
          )}
        </div>

        {/* 초대 코드 입력 */}
        <div className="bg-white rounded-2xl shadow-md p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">초대 코드 입력</h2>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="파트너의 초대 코드 8자리"
              maxLength={8}
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              className="w-full border rounded-lg px-4 py-2 text-center text-sm tracking-widest focus:outline-none focus:ring-2 focus:ring-brand-strong uppercase text-gray-500"
            />
            <button
              onClick={handleJoin}
              className="w-full border border-brand-strong text-brand-strong py-2 rounded-lg text-sm font-semibold hover:bg-brand-strong hover:text-white transition cursor-pointer"
            >
              연동하기
            </button>
          </div>
        </div>

        {/* 로그아웃 */}
        <button
          onClick={handleLogout}
          className="w-full mt-4 py-2 rounded-lg text-sm font-semibold text-gray-500 bg-white border border-gray-200 hover:bg-gray-100 transition cursor-pointer shadow-md"
        >
          로그아웃
        </button>
      </div>
    </div>
  )
}
