import { useEffect, useState } from 'react'

import type { Balance, Transaction } from '@/features/dashboard/types'
import { getBalanceApi, getTransactionsApi } from '@/features/dashboard/api'

import BalanceCard from '@/features/dashboard/components/BalanceCard'
import TransactionCard from '@/features/dashboard/components/TransactionCard'

export default function DashboardPage() {
  const [balance, setBalance] = useState<Balance | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [balanceData, transactionData] = await Promise.all([
          getBalanceApi(),
          getTransactionsApi(),
        ])

        setBalance(balanceData)
        setTransactions(transactionData)
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

  if (!balance) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-gray-500">데이터를 불러올 수 없습니다.</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <BalanceCard income={balance.income} expense={balance.expense} />
      <TransactionCard transactions={transactions} />
    </div>
  )
}
