import { useGetProductsQuery } from '@/features/products/api/products.api'
import { useGetWarehousesQuery } from '@/features/warehouses/api/warehouses.api'
import { usePostReceiptMutation } from '../api/receipt.api'
import { useMemo, useState } from 'react'
import { PackagePlus, Trash2, Plus } from 'lucide-react'
import type { TReceiptItem } from '../model/receipt.types'

const num = (v: string) => (v ? Number(v) : 0)

const calcSellingPrice = (purchase: string, percent: string) => {
  const p = num(purchase)
  const m = num(percent)
  if (!p) return ''
  return m ? (p + (p * m) / 100).toFixed(2) : p.toFixed(2)
}

const calcAmount = (price: string, pieces: string) => {
  const p = num(price)
  const q = num(pieces)
  if (!p || !q) return ''
  return (p * q).toFixed(2)
}

const emptyItem: TReceiptItem = {
  product_id: null,
  product_query: '',

  boxes_qty: '',
  pieces_qty: '',
  weight_kg: '',
  volume_cbm: '',

  purchase_cost: '',
  markup_percent: '',
  selling_price: '',

  amount: '',
}

const AdminReceiptForm = () => {
  const { data: warehouses = [] } = useGetWarehousesQuery()
  const { data: products = [] } = useGetProductsQuery()
  const [createReceipt, { isLoading }] = usePostReceiptMutation()

  const [warehouseId, setWarehouseId] = useState('')
  const [items, setItems] = useState<TReceiptItem[]>([emptyItem])
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)

  const updateItem = <K extends keyof TReceiptItem>(index: number, field: K, value: TReceiptItem[K]) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)))
  }

  const addItem = () => setItems((p) => [...p, emptyItem])
  const removeItem = (i: number) => setItems((p) => p.filter((_, idx) => idx !== i))

  const getSuggestions = (item: TReceiptItem) => {
    if (item.product_id) return []
    const q = item.product_query.toLowerCase().trim()
    return q ? products.filter((p) => p.name.toLowerCase().includes(q)) : products
  }

  const isInvalid = useMemo(
    () => !warehouseId || items.some((i) => !i.product_id || !i.pieces_qty || !i.purchase_cost || !i.selling_price),
    [warehouseId, items]
  )

  const onSubmit = async () => {
    if (isInvalid) return

    await createReceipt({
      warehouse_id: Number(warehouseId),
      items: items.map((i) => ({
        product_id: i.product_id!,
        boxes_qty: i.boxes_qty,
        pieces_qty: i.pieces_qty,
        weight_kg: i.weight_kg,
        volume_cbm: i.volume_cbm,
        amount: i.amount,
        purchase_cost: i.purchase_cost,
        selling_price: i.selling_price,
      })),
    }).unwrap()

    setWarehouseId('')
    setItems([emptyItem])
  }

  return (
    <div className="bg-white border rounded-2xl p-6 space-y-6">
      <div className="space-y-1">
        <label className="text-xs text-slate-500">Склад</label>
        <select
          value={warehouseId}
          onChange={(e) => setWarehouseId(e.target.value)}
          className="w-full rounded-lg border px-3 py-2 text-sm"
        >
          <option value="">Выберите склад</option>
          {warehouses.map((w) => (
            <option key={w.id} value={w.id}>
              {w.name}
            </option>
          ))}
        </select>
      </div>

      {items.map((item, i) => {
        const suggestions = getSuggestions(item)

        return (
          <div key={i} className="grid grid-cols-12 gap-3 border p-4 rounded-xl">
            {/* Товар */}
            <div className="col-span-12 lg:col-span-3 relative space-y-1">
              <label className="text-xs text-slate-500">Товар</label>
              <input
                value={item.product_query}
                onFocus={() => setFocusedIndex(i)}
                onBlur={() => setTimeout(() => setFocusedIndex(null), 150)}
                onChange={(e) => {
                  updateItem(i, 'product_query', e.target.value)
                  updateItem(i, 'product_id', null)
                }}
                placeholder="Товар"
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
              {focusedIndex === i && suggestions.length > 0 && (
                <div className="absolute z-10 w-full bg-white border rounded-lg">
                  {suggestions.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onMouseDown={() => {
                        updateItem(i, 'product_query', p.name)
                        updateItem(i, 'product_id', p.id)
                        setFocusedIndex(null)
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-100"
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {[
              { key: 'boxes_qty', label: 'Коробки' },
              { key: 'pieces_qty', label: 'Штуки' },
              { key: 'weight_kg', label: 'Вес, кг' },
              { key: 'volume_cbm', label: 'Объём, м³' },
            ].map(({ key, label }) => (
              <div key={key} className="col-span-6 lg:col-span-2 space-y-1">
                <label className="text-xs text-slate-500">{label}</label>
                <input
                  placeholder={label}
                  value={item[key as keyof TReceiptItem] ?? undefined}
                  onChange={(e) => {
                    const v = e.target.value
                    if (!/^\d*(\.\d*)?$/.test(v)) return
                    updateItem(i, key as keyof TReceiptItem, v)
                  }}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
            ))}

            <div className="col-span-6 lg:col-span-2 space-y-1">
              <label className="text-xs text-slate-500">Цена закупки</label>
              <input
                placeholder="Цена за единицу"
                value={item.purchase_cost}
                onChange={(e) => {
                  const v = e.target.value
                  if (!/^\d*(\.\d*)?$/.test(v)) return
                  updateItem(i, 'purchase_cost', v)

                  const sell = calcSellingPrice(v, item.markup_percent)
                  updateItem(i, 'selling_price', sell)
                  updateItem(i, 'amount', calcAmount(sell, item.pieces_qty))
                }}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div className="col-span-6 lg:col-span-2 space-y-1">
              <label className="text-xs text-slate-500">Наценка, %</label>
              <input
                placeholder="% наценки"
                value={item.markup_percent}
                onChange={(e) => {
                  const v = e.target.value
                  if (!/^\d*(\.\d*)?$/.test(v)) return
                  updateItem(i, 'markup_percent', v)

                  const sell = calcSellingPrice(item.purchase_cost, v)
                  updateItem(i, 'selling_price', sell)
                }}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div className="col-span-6 lg:col-span-2 space-y-1">
              <label className="text-xs text-slate-500">Цена продажи</label>
              <input
                placeholder="Цена продажи за единицу"
                value={item.selling_price}
                onChange={(e) => {
                  const v = e.target.value
                  if (!/^\d*(\.\d*)?$/.test(v)) return
                  updateItem(i, 'selling_price', v)
                }}
                className="w-full bg-slate-100 border rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div className="col-span-6 lg:col-span-2 space-y-1">
              <label className="text-xs text-slate-500">Сумма</label>
              <input
                placeholder="Общая сумма по позиции"
                value={item.amount}
                className="w-full bg-slate-100 border rounded-lg px-3 py-2 text-sm"
              />
            </div>

            {items.length > 1 && (
              <button onClick={() => removeItem(i)}>
                <Trash2 size={18} />
              </button>
            )}
          </div>
        )
      })}

      <button onClick={addItem} className="flex items-center gap-2 text-blue-600">
        <Plus size={18} /> Добавить
      </button>

      <button
        disabled={isLoading || isInvalid}
        onClick={onSubmit}
        className="bg-blue-600 text-white px-6 py-3 rounded-xl"
      >
        <PackagePlus size={18} /> Оформить приход
      </button>
    </div>
  )
}

export default AdminReceiptForm
