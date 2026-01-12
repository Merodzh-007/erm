import { useMemo, useState } from 'react'
import { Plus, Search, Eye, RotateCcw, Receipt } from 'lucide-react'
import { Loading } from '@/shared/ui/Loading'
import { formatDateTime } from '@/shared/formatDateTime'
import { useAuth } from '@/features/auth/hooks/auth.hooks'
import { useGetSalesQuery } from '@/features/sales/api/sales.api'
import { useGetReturnsQuery } from '@/features/returns/api/returns.api'
import { CreateSaleModal } from '@/widgets/modals/CreateSaleModal'
import { CreateReturnModal } from '@/widgets/modals/CreateReturnModal'
import TransactionViewModal from '@/widgets/modals/TransactionViewModal'

type Tab = 'sales' | 'returns'

const TransactionPage = () => {
  const { isAdmin } = useAuth()
  const [createOpen, setCreateOpen] = useState(false)
  const [tab, setTab] = useState<Tab>('sales')
  const [search, setSearch] = useState('')
  const [viewId, setViewId] = useState<number | null>(null)
  const [viewType, setViewType] = useState<Tab>('sales')
  const { data: sales = [], isLoading: isSalesLoading } = useGetSalesQuery()
  const { data: returns = [], isLoading: isReturnsLoading } = useGetReturnsQuery()

  const isLoading = tab === 'sales' ? isSalesLoading : isReturnsLoading

  const filtered = useMemo(() => {
    const source = tab === 'sales' ? sales : returns

    return source.filter(
      (i) =>
        i.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
        i.created_by_name?.toLowerCase().includes(search.toLowerCase())
    )
  }, [sales, returns, search, tab])

  if (isLoading) {
    return <Loading text={tab === 'sales' ? 'продаж' : 'возвратов'} />
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Транзакции</h1>
          <p className="text-sm text-slate-500">{tab === 'sales' ? 'Все продажи' : 'Все возвраты'}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search size={18} className="absolute left-3 top-3 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по клиенту или сотруднику"
              className="
                w-full pl-10 pr-4 py-2.5 rounded-lg
                border border-slate-300 text-sm
                focus:ring-2 focus:ring-blue-500 focus:border-transparent
              "
            />
          </div>

          {isAdmin && (
            <button
              onClick={() => setCreateOpen(true)}
              className="
                inline-flex items-center justify-center gap-2
                px-4 py-2.5 rounded-lg
                bg-blue-600 text-white text-sm font-medium
                hover:bg-blue-700 transition
              "
            >
              <Plus size={16} />
              {tab === 'sales' ? 'Продажа' : 'Возврат'}
            </button>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <TabButton active={tab === 'sales'} onClick={() => setTab('sales')}>
          Продажи
        </TabButton>
        <TabButton active={tab === 'returns'} onClick={() => setTab('returns')}>
          Возвраты
        </TabButton>
      </div>
      {!filtered.length && (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
          {tab === 'sales' ? 'Продаж пока нет' : 'Возвратов пока нет'}
        </div>
      )}
      {!!filtered.length && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr className="text-left text-slate-600">
                  <th className="px-4 py-3">№</th>
                  <th className="px-4 py-3">Клиент</th>
                  <th className="px-4 py-3">Создал</th>
                  <th className="px-4 py-3">Дата</th>
                  <th className="px-4 py-3 text-right">Сумма</th>
                  <th className="px-4 py-3 text-right">Действие</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filtered.map((i) => (
                  <tr key={i.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 font-medium text-slate-700">#{i.id}</td>

                    <td className="px-4 py-3 font-medium text-slate-800">
                      <div className="flex items-center gap-2">
                        {tab === 'sales' ? (
                          <Receipt size={16} className="text-slate-400" />
                        ) : (
                          <RotateCcw size={16} className="text-slate-400" />
                        )}
                        {i.customer_name || 'Демо-клиент'}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                        {i.created_by_name}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-slate-600">{formatDateTime(i.created_at)}</td>

                    <td className="px-4 py-3 text-right font-semibold text-slate-800">
                      {Number(i.total_amount).toLocaleString()} с
                    </td>

                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => {
                          setViewId(i.id)
                          setViewType(tab)
                        }}
                        className="text-slate-500 hover:text-blue-600"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {tab === 'sales' ? (
        <CreateSaleModal
          onSuccess={() => setCreateOpen(false)}
          open={createOpen}
          onClose={() => setCreateOpen(false)}
        />
      ) : (
        <CreateReturnModal
          onSuccess={() => setCreateOpen(false)}
          open={createOpen}
          onClose={() => setCreateOpen(false)}
        />
      )}
      {viewId && <TransactionViewModal id={viewId} type={viewType} onClose={() => setViewId(null)} />}
    </div>
  )
}

export default TransactionPage

const TabButton = ({
  active,
  children,
  onClick,
}: {
  active: boolean
  children: React.ReactNode
  onClick: () => void
}) => (
  <button
    onClick={onClick}
    className={`
      px-4 py-2 rounded-lg text-sm font-medium transition
      ${active ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}
    `}
  >
    {children}
  </button>
)
