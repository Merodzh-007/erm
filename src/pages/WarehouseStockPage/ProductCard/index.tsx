import { useGetWarehouseProductsDetailQuery } from '@/features/warehouses/api/warehouses.api'
import { formatDateTime } from '@/shared/formatDateTime'
import ButtonBack from '@/shared/ui/ButtonBack'
import EditStockModal from '@/widgets/modals/EditStockModal'
import MoveStockModal from '@/widgets/modals/MoveStockModal'
import { Edit2, Move } from 'lucide-react'
import { useState } from 'react'

export const ProductCard = ({
  warehouseId,
  productId,
  onBack,
}: {
  warehouseId: number
  productId: number
  onBack: () => void
}) => {
  const { data, isLoading } = useGetWarehouseProductsDetailQuery({
    warehouseId,
    productId,
  })

  const [editOpen, setEditOpen] = useState(false)
  const [moveOpen, setMoveOpen] = useState(false)

  if (isLoading) {
    return <div className="text-sm text-slate-500">Загрузка товара…</div>
  }

  if (!data) return null

  const { product, stock, warehouse } = data

  return (
    <div className="space-y-6">
      <ButtonBack onBack={onBack} />

      <div className="rounded-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="aspect-square rounded-xl border bg-slate-50 flex items-center justify-center overflow-hidden">
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="text-sm text-slate-400">Нет изображения</div>
              )}
            </div>

            <span className="inline-flex justify-center px-3 py-1 rounded-full bg-slate-100 text-xs text-slate-600">
              Склад: {warehouse.name}
            </span>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-800">{product.name}</h3>
              <p className="text-sm text-slate-500">Производитель: {product.manufacturer || '—'}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Stat label="Коробки" value={stock.boxes_qty} />
              <Stat label="Штуки" value={stock.pieces_qty} />
              <Stat label="Вес (кг)" value={stock.weight_kg} />
              <Stat label="Объём (м³)" value={stock.volume_cbm} />
            </div>

            <div className="flex flex-wrap gap-3">
              <ActionButton icon={<Edit2 size={16} />} label="Редактировать" onClick={() => setEditOpen(true)} />
              <ActionButton icon={<Move size={16} />} label="Переместить" onClick={() => setMoveOpen(true)} />
            </div>

            <div className="text-xs text-slate-400">Обновлено: {formatDateTime(stock.updated_at)}</div>
          </div>
        </div>
      </div>

      {editOpen && <EditStockModal stock={stock} onClose={() => setEditOpen(false)} />}

      {moveOpen && <MoveStockModal stock={stock} onClose={() => setMoveOpen(false)} />}
    </div>
  )
}
const Stat = ({ label, value }: { label: string; value: number | string }) => (
  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
    <div className="text-xs text-slate-500">{label}</div>
    <div className="text-lg font-semibold text-slate-800">{value}</div>
  </div>
)
const ActionButton = ({
  icon,
  label,
  onClick,
  disabled,
}: {
  icon: React.ReactNode
  label: string
  onClick?: () => void
  disabled?: boolean
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="
        inline-flex items-center gap-2
        px-4 py-2 rounded-xl
        border border-slate-200
        text-sm font-medium text-slate-700
        hover:bg-slate-50
        transition
        disabled:opacity-50 disabled:cursor-not-allowed
      "
  >
    {icon}
    {label}
  </button>
)
