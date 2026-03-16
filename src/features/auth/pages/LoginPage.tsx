import logo from '@/assets/images/logo.png'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-md">
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="머니로그 로고" className="w-16 h-16 mb-3" />
          <h1 className="text-2xl font-bold text-gray-800">머니로그</h1>
          <p className="text-sm text-gray-400 mt-1">내 소비를 한눈에 관리하세요</p>
        </div>

        <p className="text-xs text-center text-gray-400 mb-3">소셜 계정으로 빠르게 시작하세요</p>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/google'}
            className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-lg py-2 hover:bg-gray-50 transition cursor-pointer"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            <span className="text-sm font-medium text-gray-700">Google로 계속하기</span>
          </button>

        </div>
      </div>
    </div>
  )
}
