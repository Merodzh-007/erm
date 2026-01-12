import { usePostMoveStockMutation } from '@/features/remain/api/stock.api'
import type { TPutWarehouseStock } from '@/features/remain/model/stock.types'
import { useState } from 'react'
import { X } from 'lucide-react'
import { Field } from './ui/Field'
import { useGetWarehousesQuery } from '@/features/warehouses/api/warehouses.api'

type Props = {
  stock: TPutWarehouseStock | null
  onClose: () => void
}

const MoveStockModal = ({ stock, onClose }: Props) => {
  const [moveStock, { isLoading }] = usePostMoveStockMutation()
  const { data: warehouses, isLoading: isLoadingWarehouses } = useGetWarehousesQuery()

  const [form, setForm] = useState({
    to_warehouse_id: 0,
    boxes_qty: stock?.boxes_qty ?? 0,
    pieces_qty: stock?.pieces_qty ?? 0,
    weight_kg: Number(stock?.weight_kg),
    volume_cbm: Number(stock?.volume_cbm),
    reason: '',
  })
  if (!stock) return null

  const onSubmit = async () => {
    if (!form.to_warehouse_id) return

    await moveStock({
      from_warehouse_id: stock.warehouse_id,
      to_warehouse_id: form.to_warehouse_id,
      product_id: stock.product_id,
      boxes_qty: Number(form.boxes_qty),
      pieces_qty: Number(form.pieces_qty),
      weight_kg: Number(form.weight_kg),
      volume_cbm: Number(form.volume_cbm),
      reason: form.reason,
    }).unwrap()

    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-lg font-semibold">Перемещение товара</h2>
            <p className="text-sm text-slate-500">
              {stock.product_name} · {stock.warehouse_name}
            </p>
          </div>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-5">
          {/* To warehouse */}
          <div>
            <label className="block text-sm font-medium mb-1">Склад назначения</label>
            <select
              value={form.to_warehouse_id}
              onChange={(e) => setForm({ ...form, to_warehouse_id: Number(e.target.value) })}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            >
              <option value={0}>Выберите склад</option>
              {isLoadingWarehouses && <option disabled>Загрузка...</option>}
              {!isLoadingWarehouses &&
                warehouses &&
                warehouses
                  .filter((w) => w.id !== stock.warehouse_id)
                  .map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
            </select>
          </div>

          {/* Quantities */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Коробки" value={form.boxes_qty} onChange={(v) => setForm({ ...form, boxes_qty: v })} />
            <Field label="Штуки" value={form.pieces_qty} onChange={(v) => setForm({ ...form, pieces_qty: v })} />
            <Field label="Вес, кг" value={form.weight_kg} onChange={(v) => setForm({ ...form, weight_kg: v })} />
            <Field label="Объём, м³" value={form.volume_cbm} onChange={(v) => setForm({ ...form, volume_cbm: v })} />
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium mb-1">Причина</label>
            <textarea
              rows={3}
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-slate-50 rounded-b-2xl">
          <button onClick={onClose} className="px-4 py-2 text-sm">
            Отмена
          </button>

          <button
            onClick={onSubmit}
            disabled={isLoading || !form.to_warehouse_id}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm disabled:opacity-60"
          >
            {isLoading ? 'Перемещение…' : 'Переместить'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default MoveStockModal
