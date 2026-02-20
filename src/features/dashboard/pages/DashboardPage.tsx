import { useEffect, useState } from 'react'

import type { DashboardSummary } from '@/features/dashboard/types'
import { getDashboardSummaryApi } from '@/features/dashboard/api'

import BalanceCard from '@/features/dashboard/components/BalanceCard'

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDashboardSummaryApi()
        setSummary(data)
      } catch (error) {
        console.error('대시보드 조회 실패', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-gray-500">로딩 중...</span>
      </div>
    )
  }

  if (!summary) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-gray-500">데이터를 불러올 수 없습니다.</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <BalanceCard income={summary.income} expense={summary.expense} />
    </div>
  )
}
