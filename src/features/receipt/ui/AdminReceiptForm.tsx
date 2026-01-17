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
    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 space-y-6 shadow-sm">
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Склад</label>
        <select
          value={warehouseId}
          onChange={(e) => setWarehouseId(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <option value="" className="text-gray-500">
            Выберите склад
          </option>
          {warehouses.map((w) => (
            <option key={w.id} value={w.id} className="text-gray-900">
              {w.name}
            </option>
          ))}
        </select>
      </div>

      {items.map((item, i) => {
        const suggestions = getSuggestions(item)

        return (
          <div key={i} className="grid grid-cols-12 gap-4 border border-gray-200 bg-white p-5 rounded-xl shadow-sm">
            {/* Товар */}
            <div className="col-span-12 lg:col-span-3 relative space-y-1">
              <label className="text-sm font-medium text-gray-700">Товар</label>
              <input
                value={item.product_query}
                onFocus={() => setFocusedIndex(i)}
                onBlur={() => setTimeout(() => setFocusedIndex(null), 150)}
                onChange={(e) => {
                  updateItem(i, 'product_query', e.target.value)
                  updateItem(i, 'product_id', null)
                }}
                placeholder="Введите название товара"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              {focusedIndex === i && suggestions.length > 0 && (
                <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
                  {suggestions.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onMouseDown={() => {
                        updateItem(i, 'product_query', p.name)
                        updateItem(i, 'product_id', p.id)
                        setFocusedIndex(null)
                      }}
                      className="w-full text-left px-4 py-3 text-gray-800 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors"
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
                <label className="text-sm font-medium text-gray-700">{label}</label>
                <input
                  placeholder={label}
                  value={item[key as keyof TReceiptItem] ?? undefined}
                  onChange={(e) => {
                    const v = e.target.value
                    if (!/^\d*(\.\d*)?$/.test(v)) return
                    updateItem(i, key as keyof TReceiptItem, v)
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
            ))}

            <div className="col-span-6 lg:col-span-2 space-y-1">
              <label className="text-sm font-medium text-gray-700">Цена закупки</label>
              <input
                placeholder="0.00"
                value={item.purchase_cost}
                onChange={(e) => {
                  const v = e.target.value
                  if (!/^\d*(\.\d*)?$/.test(v)) return
                  updateItem(i, 'purchase_cost', v)

                  const sell = calcSellingPrice(v, item.markup_percent)
                  updateItem(i, 'selling_price', sell)
                  updateItem(i, 'amount', calcAmount(sell, item.pieces_qty))
                }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div className="col-span-6 lg:col-span-2 space-y-1">
              <label className="text-sm font-medium text-gray-700">Наценка, %</label>
              <input
                placeholder="0"
                value={item.markup_percent}
                onChange={(e) => {
                  const v = e.target.value
                  if (!/^\d*(\.\d*)?$/.test(v)) return
                  updateItem(i, 'markup_percent', v)

                  const sell = calcSellingPrice(item.purchase_cost, v)
                  updateItem(i, 'selling_price', sell)
                }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div className="col-span-6 lg:col-span-2 space-y-1">
              <label className="text-sm font-medium text-gray-700">Цена продажи</label>
              <input
                placeholder="0.00"
                value={item.selling_price}
                onChange={(e) => {
                  const v = e.target.value
                  if (!/^\d*(\.\d*)?$/.test(v)) return
                  updateItem(i, 'selling_price', v)
                }}
                className="w-full border border-gray-300 bg-gray-100 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-500"
              />
            </div>

            <div className="col-span-6 lg:col-span-2 space-y-1">
              <label className="text-sm font-medium text-gray-700">Сумма</label>
              <input
                placeholder="0.00"
                value={item.amount}
                className="w-full border border-gray-300 bg-gray-100 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-500"
              />
            </div>

            {items.length > 1 && (
              <button
                onClick={() => removeItem(i)}
                className="flex items-center justify-center h-10 w-10 rounded-lg hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors self-end"
              >
                <Trash2 size={20} />
              </button>
            )}
          </div>
        )
      })}

      <button
        onClick={addItem}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
      >
        <Plus size={18} /> Добавить товар
      </button>

      <button
        disabled={isLoading || isInvalid}
        onClick={onSubmit}
        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
          isLoading || isInvalid
            ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
        }`}
      >
        <PackagePlus size={18} /> Оформить приход
      </button>
    </div>
  )
}

export default AdminReceiptForm
