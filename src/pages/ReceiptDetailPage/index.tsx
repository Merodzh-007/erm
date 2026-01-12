import { useGetOneReceiptQuery } from '@/features/receipt/api/receipt.api'
import { skipToken } from '@reduxjs/toolkit/query'
import { useParams } from 'react-router'
import { Warehouse, User, Calendar, Package } from 'lucide-react'
import { formatDateTime } from '@/shared/formatDateTime'
import { Loading } from '@/shared/ui/Loading'

const ReceiptDetailPage = () => {
  const { id } = useParams<{ id?: string }>()
  const { data, isLoading } = useGetOneReceiptQuery(id ?? skipToken)

  if (isLoading) {
    return <Loading text="документа" />
  }

  if (!data) {
    return <div className="text-slate-500">Документ не найден</div>
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-800">Приход #{data.id}</h1>
          <p className="text-sm text-slate-500">Детали документа поступления</p>
        </div>

        <div className="sm:text-right">
          <div className="text-sm text-slate-500">Итого</div>
          <div className="text-xl sm:text-2xl font-semibold text-slate-800">{data.total_amount.toLocaleString()} с</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetaCard icon={<Warehouse size={20} />} label="Склад" value={data.warehouse_name} />
        <MetaCard icon={<User size={20} />} label="Создал" value={data.created_by_name} />
        <MetaCard icon={<Calendar size={20} />} label="Дата" value={formatDateTime(data.created_at)} />
      </div>

      <div className="space-y-4 md:hidden">
        {data.items?.map((item) => (
          <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 font-medium text-slate-800">
              <Package size={16} className="text-slate-400" />
              {item.product_name}
            </div>

            <div className="mt-1 text-xs text-slate-500">{item.manufacturer ?? '—'}</div>

            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <Info label="Коробки" value={item.boxes_qty} />
              <Info label="Штуки" value={item.pieces_qty} />
              <Info label="Вес" value={`${item.weight_kg} кг`} />
              <Info label="Объём" value={`${item.volume_cbm} м³`} />
            </div>

            <div className="mt-4 flex justify-between items-center border-t pt-3">
              <span className="text-slate-500 text-sm">Сумма</span>
              <span className="font-semibold text-slate-800">{item?.amount?.toLocaleString()} сомони</span>
            </div>
          </div>
        ))}

        {!data.items?.length && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 text-center text-slate-500">
            Позиции отсутствуют
          </div>
        )}
      </div>

      <div className="hidden md:block bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-sm font-semibold text-slate-700">Позиции прихода</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-left text-slate-600">
                <th className="px-4 py-3">Товар</th>
                <th className="px-4 py-3">Производитель</th>
                <th className="px-4 py-3 text-right">Коробки</th>
                <th className="px-4 py-3 text-right">Шт.</th>
                <th className="px-4 py-3 text-right">Вес</th>
                <th className="px-4 py-3 text-right">Объём</th>
                <th className="px-4 py-3 text-right">Сумма</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {data.items?.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3 font-medium text-slate-800">
                    <div className="flex items-center gap-2">
                      <Package size={16} className="text-slate-400" />
                      {item.product_name}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-slate-600">{item.manufacturer ?? '—'}</td>

                  <td className="px-4 py-3 text-right">{item.boxes_qty}</td>
                  <td className="px-4 py-3 text-right">{item.pieces_qty}</td>
                  <td className="px-4 py-3 text-right">{item.weight_kg} кг</td>
                  <td className="px-4 py-3 text-right">{item.volume_cbm} м³</td>
                  <td className="px-4 py-3 text-right font-semibold">{item?.amount?.toLocaleString()} сомони</td>
                </tr>
              ))}

              {!data.items?.length && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500">
                    Позиции отсутствуют
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ReceiptDetailPage

const MetaCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3">
    <div className="text-slate-400">{icon}</div>
    <div>
      <div className="text-xs text-slate-500">{label}</div>
      <div className="font-medium text-slate-800">{value}</div>
    </div>
  </div>
)

const Info = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex justify-between">
    <span className="text-slate-500">{label}</span>
    <span className="font-medium text-slate-800">{value}</span>
  </div>
)
