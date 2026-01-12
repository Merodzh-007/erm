import { useGetProductsQuery } from '@/features/products/api/products.api'
import { useGetWarehousesQuery } from '@/features/warehouses/api/warehouses.api'
import { usePostReceiptMutation } from '../api/receipt.api'
import { useState } from 'react'
import { PackagePlus, Trash2, Plus } from 'lucide-react'
import type { TReceiptItem } from '../model/receipt.types'

const emptyItem: TReceiptItem = {
  product_id: '',
  boxes_qty: '',
  pieces_qty: '',
  weight_kg: '',
  volume_cbm: '',
  amount: '',
}

const AdminReceiptForm = () => {
  const { data: warehouses = [] } = useGetWarehousesQuery()
  const { data: products = [] } = useGetProductsQuery()
  const [createReceipt, { isLoading }] = usePostReceiptMutation()

  const [warehouseId, setWarehouseId] = useState('')
  const [items, setItems] = useState<TReceiptItem[]>([emptyItem])

  const updateItem = (i: number, field: keyof TReceiptItem, value: string) =>
    setItems((prev) => prev.map((item, idx) => (idx === i ? { ...item, [field]: value } : item)))

  const addItem = () => setItems((p) => [...p, emptyItem])
  const removeItem = (i: number) => setItems((p) => p.filter((_, idx) => idx !== i))

  const disabled = !warehouseId || items.some((i) => !i.product_id)
  const onSubmit = async () => {
    if (disabled) return

    await createReceipt({
      warehouse_id: Number(warehouseId),
      items: items.map((i) => ({
        product_id: i.product_id,
        boxes_qty: i.boxes_qty,
        pieces_qty: i.pieces_qty,
        weight_kg: i.weight_kg,
        volume_cbm: i.volume_cbm,
        amount: i.amount,
      })),
    }).unwrap()

    setWarehouseId('')
    setItems([emptyItem])
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6">
      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-600">Склад</label>
        <select
          value={warehouseId}
          onChange={(e) => setWarehouseId(e.target.value)}
          className="
            w-full rounded-lg border border-slate-300 bg-white
            px-3 py-2 text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition
          "
        >
          <option value="">Выберите склад</option>
          {warehouses.map((w) => (
            <option key={w.id} value={w.id}>
              {w.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {items.map((item, i) => (
          <div
            key={i}
            className="
              border border-slate-200 rounded-xl p-4
              grid grid-cols-12 gap-3
              bg-slate-50
            "
          >
            <select
              value={item.product_id}
              onChange={(e) => updateItem(i, 'product_id', e.target.value)}
              className="
                col-span-12 lg:col-span-3
                rounded-lg border border-slate-300 bg-white
                px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500
              "
            >
              <option value="">Товар</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            {[
              ['boxes_qty', 'Коробки'],
              ['pieces_qty', 'Штуки'],
              ['weight_kg', 'Вес'],
              ['amount', 'Сумма'],
            ].map(([field, label]) => (
              <input
                key={field}
                placeholder={label}
                type="string"
                value={item[field as keyof typeof item]}
                onChange={(e) => {
                  const v = e.target.value.trim()
                  if (!/^\d*(\.\d*)?$/.test(v)) return
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  updateItem(i, field as any, v)
                }}
                className="
                  col-span-6 lg:col-span-2
                  rounded-lg border border-slate-300 bg-white
                  px-3 py-2 text-sm
                  placeholder:text-slate-400
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                "
              />
            ))}

            {items.length > 1 && (
              <button
                onClick={() => removeItem(i)}
                className="
                  col-span-12 lg:col-span-1
                  flex items-center justify-center
                  rounded-lg border border-slate-200
                  text-slate-400 hover:text-red-500 hover:border-red-300
                  transition
                "
                title="Удалить товар"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        ))}

        <button
          onClick={addItem}
          className="
            inline-flex items-center gap-2
            text-sm font-medium text-blue-600
            hover:text-blue-700 transition
          "
        >
          <Plus size={18} />
          Добавить товар
        </button>
      </div>

      <div className="flex justify-end pt-4 border-t border-slate-100">
        <button
          onClick={onSubmit}
          disabled={isLoading || disabled}
          className="
            inline-flex items-center gap-2
            px-6 py-3 rounded-xl
            bg-blue-600 text-white text-sm font-medium
            hover:bg-blue-700
            disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed
            transition
          "
        >
          <PackagePlus size={18} />
          Оформить приход
        </button>
      </div>
    </div>
  )
}

export default AdminReceiptForm
