import { useEffect, useState } from 'react'

import type { Balance, Transaction } from '@/features/dashboard/types'
import { getBalanceApi, getTransactionsApi } from '@/features/dashboard/api'

import BalanceCard from '@/features/dashboard/components/BalanceCard'
import TransactionCard from '@/features/dashboard/components/TransactionCard'
import TopCategoriesCard from '@/features/dashboard/components/TopCategoriesCard'

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
      <div className="space-y-4">
        <div className="h-32 rounded-2xl bg-gray-100 animate-pulse" />
        <div className="h-48 rounded-2xl bg-gray-100 animate-pulse" />
        <div className="h-56 rounded-2xl bg-gray-100 animate-pulse" />
      </div>
    )
  }

  if (!balance) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-400">
        <p className="text-sm">데이터를 불러올 수 없어요</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <BalanceCard income={balance.income} expense={balance.expense} />
      <TransactionCard transactions={transactions} />
      <TopCategoriesCard transactions={transactions} />
    </div>
  )
}
