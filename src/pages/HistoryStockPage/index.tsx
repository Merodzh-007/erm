import { paths } from '@/app/routers/constants'
import { useGetHistoryStockQuery } from '@/features/remain/api/stock.api'
import { Loading } from '@/shared/ui/Loading'
import { Eye } from 'lucide-react'
import { useNavigate } from 'react-router'

const HistoryStockPage = () => {
  const { data, isLoading } = useGetHistoryStockQuery()
  const navigate = useNavigate()
  if (isLoading) {
    return <Loading text="истории изменений" />
  }

  if (!data?.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
        История изменений пуста
      </div>
    )
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-left text-slate-600">
              <th className="px-4 py-3 font-medium">Дата</th>
              <th className="px-4 py-3 font-medium">Товар</th>
              <th className="px-4 py-3 font-medium">Склад</th>
              <th className="px-4 py-3 font-medium">Изменения</th>
              <th className="px-4 py-3 font-medium">Пользователь</th>
              <th className="px-4 py-3 font-medium">Причина</th>
              <th className="px-4 py-3 font-medium text-right">Действие</th>
            </tr>
          </thead>

          <tbody>
            {data.map((h) => (
              <tr key={h.id} className="border-b last:border-b-0 hover:bg-slate-50 transition">
                <td className="px-4 py-3 text-slate-600">{new Date(h.created_at).toLocaleString('ru-RU')}</td>

                <td className="px-4 py-3">
                  <div className="font-medium text-slate-800">{h.product_name}</div>
                  <div className="text-xs text-slate-500">{h.manufacturer}</div>
                </td>

                <td className="px-4 py-3 text-slate-700">{h.warehouse_name}</td>

                <td className="px-4 py-3 text-slate-700 space-y-0.5">
                  <Change label="Коробки" from={h.old_boxes_qty} to={h.new_boxes_qty} />
                  <Change label="Штуки" from={h.old_pieces_qty} to={h.new_pieces_qty} />
                  <Change label="Вес" from={h.old_weight_kg} to={h.new_weight_kg} />
                  <Change label="Объём" from={h.old_volume_cbm} to={h.new_volume_cbm} />
                </td>

                <td className="px-4 py-3">
                  <span className="inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                    {h.user_name}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                      h.reason === 'Ошибка' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {h.reason}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => navigate(paths.stockHistoryDetails(h.id.toString()))}
                    className="text-slate-400 hover:text-blue-600 transition cursor-pointer"
                    title={h.reason}
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
  )
}

const Change = ({ label, from, to }: { label: string; from: number; to: number }) => {
  if (from === to) return null

  return (
    <div className="text-xs">
      <span className="text-slate-500">{label}:</span> <span className="text-red-600">{from}</span>
      <span className="mx-1 text-slate-400">→</span>
      <span className="text-green-600 font-medium">{to}</span>
    </div>
  )
}

export default HistoryStockPage
