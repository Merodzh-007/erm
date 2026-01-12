import { X, User, Calendar, Receipt, RotateCcw, Package } from 'lucide-react'
import { formatDateTime } from '@/shared/formatDateTime'
import { Loading } from '@/shared/ui/Loading'
import { useGetOneDetailSaleQuery } from '@/features/sales/api/sales.api'
import { useGetOneDetailReturnQuery } from '@/features/returns/api/returns.api'
import { skipToken } from '@reduxjs/toolkit/query'

type Props = {
  id: number
  type: 'sales' | 'returns'
  onClose: () => void
}

const TransactionViewModal = ({ id, type, onClose }: Props) => {
  const saleQuery = useGetOneDetailSaleQuery(type === 'sales' ? id : skipToken, {
    skip: type !== 'sales',
  })

  const returnQuery = useGetOneDetailReturnQuery(type === 'returns' ? id : skipToken, {
    skip: type !== 'returns',
  })

  const data = type === 'sales' ? saleQuery.data : returnQuery.data
  const isLoading = saleQuery.isLoading || returnQuery.isLoading

  if (isLoading) {
    return (
      <ModalLayout onClose={onClose}>
        <Loading text="документа" />
      </ModalLayout>
    )
  }

  if (!data) return null

  return (
    <ModalLayout onClose={onClose}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            {type === 'sales' ? (
              <Receipt size={20} className="text-blue-600" />
            ) : (
              <RotateCcw size={20} className="text-orange-500" />
            )}
            {type === 'sales' ? 'Продажа' : 'Возврат'} #{data.id}
          </h2>
          <p className="text-sm text-slate-500">Детали документа</p>
        </div>

        <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500">
          <X size={18} />
        </button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <MetaItem icon={<User size={18} />} label="Клиент" value={data.customer_name || 'Демо-клиент'} />
        <MetaItem icon={<User size={18} />} label="Создал" value={data.created_by_name} />
        <MetaItem icon={<Calendar size={18} />} label="Дата" value={formatDateTime(data.created_at)} />
      </div>

      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr className="text-left text-slate-600">
              <th className="px-4 py-3">Товар</th>
              <th className="px-4 py-3 text-right">Кол-во</th>
              <th className="px-4 py-3 text-right">Цена</th>
              <th className="px-4 py-3 text-right">Сумма</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {data.items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-800">
                  <div className="flex items-center gap-2">
                    <Package size={16} className="text-slate-400" />
                    {item.product_name}
                  </div>
                  <div className="text-xs text-slate-500">{item.manufacturer || '-'}</div>
                </td>

                <td className="px-4 py-3 text-right">{item.quantity}</td>
                <td className="px-4 py-3 text-right">{item.unit_price} с</td>
                <td className="px-4 py-3 text-right font-semibold">{item.total_price} сомони</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex justify-end border-t pt-4">
        <div className="text-lg font-semibold text-slate-800">Итого: {data.total_amount.toLocaleString()} с</div>
      </div>
    </ModalLayout>
  )
}

export default TransactionViewModal

const ModalLayout = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div onClick={onClose} className="absolute inset-0 bg-black/40" />
    <div className="relative bg-white w-full max-w-4xl rounded-2xl shadow-xl p-6 space-y-6">{children}</div>
  </div>
)
const MetaItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4">
    <div className="text-slate-400">{icon}</div>
    <div>
      <div className="text-xs text-slate-500">{label}</div>
      <div className="font-medium text-slate-800">{value}</div>
    </div>
  </div>
)
