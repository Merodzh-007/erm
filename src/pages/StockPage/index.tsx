import { Edit2, Move, Search, Warehouse } from 'lucide-react'
import { useState, useMemo } from 'react'
import { useGetWarehouseStockQuery } from '@/features/remain/api/stock.api'
import EditStockModal from '@/widgets/modals/EditStockModal'
import type { TPutWarehouseStock } from '@/features/remain/model/stock.types'
import { formatDateTime } from '@/shared/formatDateTime'
import MoveStockModal from '@/widgets/modals/MoveStockModal'
import { Loading } from '@/shared/ui/Loading'

const StockPage = () => {
  const { data, isLoading } = useGetWarehouseStockQuery()
  const [search, setSearch] = useState('')
  const [selectedStock, setSelectedStock] = useState<TPutWarehouseStock | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false)

  const filtered = useMemo(() => {
    if (!data) return []
    return data.filter(
      (item) =>
        item.product_name.toLowerCase().includes(search.toLowerCase()) ||
        item.warehouse_name.toLowerCase().includes(search.toLowerCase())
    )
  }, [data, search])

  if (isLoading) return <Loading text="остатков" />

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-800">Остатки на складах</h1>
          <p className="text-sm text-slate-500">Актуальное количество товаров по каждому складу</p>
        </div>

        <div className="relative w-full sm:w-80">
          <Search size={18} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Поиск по товару или складу"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full pl-10 pr-4 py-2 rounded-lg
              border border-slate-300
              focus:ring-2 focus:ring-blue-500 focus:border-transparent
            "
          />
        </div>
      </div>

      <div className="space-y-4 md:hidden">
        {filtered.map((item) => (
          <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 text-slate-800 font-medium">
              <Warehouse size={16} className="text-slate-400" />
              {item.warehouse_name}
            </div>

            <div className="mt-1 text-sm text-slate-600">{item.product_name}</div>

            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <Info label="Коробки" value={item.boxes_qty} />
              <Info label="Штуки" value={item.pieces_qty} />
              <Info label="Вес" value={`${item.weight_kg} кг`} />
              <Info label="Объём" value={`${item.volume_cbm} м³`} />
            </div>

            <div className="mt-4 flex items-center justify-between border-t pt-3">
              <span className="text-xs text-slate-500">{formatDateTime(item.updated_at)}</span>

              <div className="flex gap-1">
                <ActionButton
                  icon={<Edit2 size={16} />}
                  onClick={() => {
                    setSelectedStock(item)
                    setIsEditModalOpen(true)
                  }}
                />
                <ActionButton
                  icon={<Move size={16} />}
                  onClick={() => {
                    setSelectedStock(item)
                    setIsMoveModalOpen(true)
                  }}
                />
                {/* <ActionButton icon={<Trash2 size={16} />} danger disabled /> */}
              </div>
            </div>
          </div>
        ))}

        {!filtered.length && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 text-center text-slate-500">
            Остатки не найдены
          </div>
        )}
      </div>

      <div className="hidden md:block bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Склад</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Товар</th>
              <th className="px-4 py-3 text-right font-medium text-slate-600">Коробки</th>
              <th className="px-4 py-3 text-right font-medium text-slate-600">Штуки</th>
              <th className="px-4 py-3 text-right font-medium text-slate-600">Вес</th>
              <th className="px-4 py-3 text-right font-medium text-slate-600">Объём</th>
              <th className="px-4 py-3 text-right font-medium text-slate-600">Обновлено</th>
              <th className="px-4 py-3 text-right font-medium text-slate-600">Действия</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Warehouse size={16} className="text-slate-400" />
                    {item.warehouse_name}
                  </div>
                </td>

                <td className="px-4 py-3 font-medium text-slate-800">{item.product_name}</td>

                <td className="px-4 py-3 text-right">{item.boxes_qty}</td>
                <td className="px-4 py-3 text-right">{item.pieces_qty}</td>
                <td className="px-4 py-3 text-right">{item.weight_kg}</td>
                <td className="px-4 py-3 text-right">{item.volume_cbm}</td>

                <td className="px-4 py-3 text-right text-xs text-slate-500">{formatDateTime(item.updated_at)}</td>

                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <ActionButton
                      icon={<Edit2 size={16} />}
                      onClick={() => {
                        setSelectedStock(item)
                        setIsEditModalOpen(true)
                      }}
                    />
                    <ActionButton
                      icon={<Move size={16} />}
                      onClick={() => {
                        setSelectedStock(item)
                        setIsMoveModalOpen(true)
                      }}
                    />
                    {/* <ActionButton icon={<Trash2 size={16} />} danger disabled /> */}
                  </div>
                </td>
              </tr>
            ))}

            {!filtered.length && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-slate-500">
                  Остатки не найдены
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isEditModalOpen && <EditStockModal stock={selectedStock} onClose={() => setIsEditModalOpen(false)} />}

      {isMoveModalOpen && <MoveStockModal stock={selectedStock} onClose={() => setIsMoveModalOpen(false)} />}
    </div>
  )
}

export default StockPage

const Info = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex justify-between">
    <span className="text-slate-500">{label}</span>
    <span className="font-medium text-slate-800">{value}</span>
  </div>
)

const ActionButton = ({
  icon,
  onClick,
  danger,
  disabled,
}: {
  icon: React.ReactNode
  onClick?: () => void
  danger?: boolean
  disabled?: boolean
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      p-2 rounded-lg transition
      ${danger ? 'text-red-600 hover:bg-red-50' : 'text-blue-600 hover:bg-blue-50'}
      ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
    `}
  >
    {icon}
  </button>
)
