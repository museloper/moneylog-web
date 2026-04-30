import logo from '@/assets/images/logo.png'

export default function LoginPage() {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-10">
          <img src={logo} alt="머니로그 로고" className="w-20 h-20 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">머니로그</h1>
          <p className="text-sm text-gray-500 mt-2">파트너와 함께 똑똑하게 가계부를 관리하세요</p>
        </div>

        <button
          type="button"
          onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/google'}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 rounded-xl py-3 active:bg-gray-50 transition cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
        >
          <svg className="w-5 h-5" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
            <path fill="#FF3D00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"/>
            <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
            <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
          </svg>
          <span className="text-sm font-medium text-gray-700">Google로 계속하기</span>
        </button>

        <p className="text-xs text-center text-gray-400 mt-8">
          시작하면 <span className="underline">이용약관</span>과 <span className="underline">개인정보 처리방침</span>에 동의한 것으로 간주합니다
        </p>
      </div>
    </div>
  )
}
