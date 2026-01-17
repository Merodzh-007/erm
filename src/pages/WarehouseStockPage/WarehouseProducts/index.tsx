import { useAuth } from '@/features/auth/hooks/auth.hooks'
import { useDeleteWarehouseMutation, useGetWarehouseProductsQuery } from '@/features/warehouses/api/warehouses.api'
import ButtonBack from '@/shared/ui/ButtonBack'
import AdminReceiptModal from '@/widgets/modals/AdminReceiptModal'
import DeleteModal from '@/widgets/modals/DeleteModal'
import { Plus, Search, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'

export const WarehouseProducts = ({
  warehouseId,
  onBack,
  onSelectProduct,
}: {
  warehouseId: number
  onBack: () => void
  onSelectProduct: (id: number) => void
}) => {
  const { data, isLoading } = useGetWarehouseProductsQuery(warehouseId)
  const [search, setSearch] = useState('')
  const isAdmin = useAuth()
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [openReceipt, setOpenReceipt] = useState(false)

  const products = useMemo(() => {
    if (!data) return []
    return data.products.filter((p) => p.product_name.toLowerCase().includes(search.toLowerCase()))
  }, [data, search])

  const [deleteWarehouse, { isLoading: isDeleting }] = useDeleteWarehouseMutation()

  const onDelete = async () => {
    if (!deleteId) return
    await deleteWarehouse(deleteId).unwrap()
    setDeleteId(null)
  }

  if (isLoading) {
    return <div className="text-sm text-slate-500">Загрузка…</div>
  }

  if (!data) return null

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <ButtonBack onBack={onBack} />

        <div className="text-sm text-slate-500 sm:text-center">
          Склад: <span className="font-medium text-slate-700">{data.warehouse.name}</span>
        </div>

        {isAdmin && (
          <div className="flex items-center gap-2 justify-end">
            <button
              onClick={() => setOpenReceipt(true)}
              className="
                    inline-flex items-center gap-2
                    px-4 py-2.5 rounded-xl
                    bg-blue-600 text-white text-sm font-medium
                    hover:bg-blue-700 transition
                  "
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Добавить</span>
            </button>

            <button
              onClick={() => setDeleteId(data.warehouse.id)}
              className="
                    p-2.5 rounded-xl
                    text-red-600
                    hover:bg-red-50 hover:text-red-700
                    transition
                  "
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>

      <div className="relative max-w-sm w-full">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск товара…"
          className="
                w-full rounded-xl border border-slate-300
                pl-9 pr-3 py-2.5 text-sm
                focus:ring-2 focus:ring-blue-500 focus:border-transparent
              "
        />
      </div>

      <div className="hidden sm:block overflow-hidden border border-slate-200 rounded-xl">
        <div className="grid grid-cols-3 bg-slate-50 px-4 py-2 text-xs font-medium text-slate-500">
          <div>Товар</div>
          <div>Производитель</div>
          <div className="text-right">Штуки</div>
        </div>

        {products.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelectProduct(p.product_id)}
            className="
                  w-full grid grid-cols-3 items-center
                  px-4 py-3 text-sm text-left
                  border-t border-slate-100
                  hover:bg-blue-50 transition
                "
          >
            <div className="font-medium text-slate-800 truncate">{p.product_name}</div>
            <div className="text-slate-500 truncate">{p.manufacturer || '—'}</div>
            <div className="text-right font-semibold text-slate-700">{p.pieces_qty}</div>
          </button>
        ))}

        {!products.length && <div className="px-4 py-6 text-sm text-slate-400 text-center">Товары не найдены</div>}
      </div>

      <div className="sm:hidden space-y-3">
        {products.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelectProduct(p.product_id)}
            className="
                  w-full rounded-xl border border-slate-200
                  p-4 text-left
                  hover:bg-blue-50 transition
                "
          >
            <div className="font-medium text-slate-800">{p.product_name}</div>
            <div className="text-xs text-slate-500 mt-1">{p.manufacturer || '—'}</div>

            <div className="mt-3 text-sm font-semibold text-slate-700">Штук: {p.pieces_qty}</div>
          </button>
        ))}

        {!products.length && <div className="py-6 text-sm text-slate-400 text-center">Товары не найдены</div>}
      </div>

      {deleteId && <DeleteModal isLoading={isDeleting} onClose={() => setDeleteId(null)} onDelete={onDelete} />}

      <AdminReceiptModal open={openReceipt} onClose={() => setOpenReceipt(false)} />
    </div>
  )
}
