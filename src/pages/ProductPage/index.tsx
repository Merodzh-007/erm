import { useMemo, useState } from 'react'
import { Plus, Package, Search, Trash2 } from 'lucide-react'
import { useDeleteProductMutation, useGetProductsQuery } from '@/features/products/api/products.api'
import { useAuth } from '@/features/auth/hooks/auth.hooks'
import { formatDateTime } from '@/shared/formatDateTime'
import DeleteModal from '@/widgets/modals/DeleteModal'
import { Loading } from '@/shared/ui/Loading'
import { CreateProductModal } from '@/widgets/modals/CreateProductModal'

const ProductsPage = () => {
  const { data: products = [], isLoading } = useGetProductsQuery()

  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation()
  const { isAdmin } = useAuth()
  const [openProductModal, setOpenProductModal] = useState(false)
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const filtered = useMemo(() => {
    return products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
  }, [products, search])

  const onDelete = async () => {
    if (!deleteId) return
    await deleteProduct(deleteId).unwrap()
    setDeleteId(null)
  }

  if (isLoading) return <Loading text="товаров" />

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-slate-800">Каталог товаров</h2>
          <p className="text-sm text-slate-500">Управление номенклатурой</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по товарам"
              className="
            w-full pl-10 pr-4 py-2.5
            rounded-xl border border-slate-300
            text-sm
            focus:ring-2 focus:ring-blue-500 focus:border-transparent
          "
            />
          </div>

          {isAdmin && (
            <button
              onClick={() => setOpenProductModal(true)}
              className="
          inline-flex items-center justify-center gap-2
          px-4 py-2.5 rounded-xl
          bg-blue-600 text-white
          text-sm font-medium
          hover:bg-blue-700 transition
          shadow-sm
        "
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Добавить товар</span>
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4 md:hidden">
        {filtered.map((p) => (
          <div key={p.id} className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 font-medium text-slate-800">
                <Package size={16} className="text-slate-400" />
                {p.name}
              </div>

              {isAdmin && (
                <button onClick={() => setDeleteId(p.id)} className="text-red-600">
                  <Trash2 size={18} />
                </button>
              )}
            </div>

            <div className="text-sm text-slate-600">
              <span className="text-slate-400">Производитель:</span> {p.manufacturer || '—'}
            </div>

            <div className="text-xs text-slate-500">Создан: {formatDateTime(p.created_at)}</div>
          </div>
        ))}

        {!filtered.length && <div className="text-center text-slate-500 py-10">Товары не найдены</div>}
      </div>

      <div className="hidden md:block bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-slate-600">ID</th>
              <th className="px-6 py-3 text-left text-slate-600">Название</th>
              <th className="px-6 py-3 text-left text-slate-600">Производитель</th>
              <th className="px-6 py-3 text-left text-slate-600">Время создания</th>
              {isAdmin && <th className="px-6 py-3 text-right text-slate-600">Действие</th>}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50 transition">
                <td className="px-6 py-4 text-slate-500">{p.id}</td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 font-medium text-slate-800">
                    <Package size={16} className="text-slate-400" />
                    {p.name}
                  </div>
                </td>

                <td className="px-6 py-4 text-slate-600">{p.manufacturer || '—'}</td>
                <td className="px-6 py-4 text-slate-600">{formatDateTime(p.created_at)}</td>

                {isAdmin && (
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => setDeleteId(p.id)} className="text-red-600 hover:text-red-800">
                      <Trash2 size={18} />
                    </button>
                  </td>
                )}
              </tr>
            ))}

            {!filtered.length && (
              <tr>
                <td colSpan={5} className="py-10 text-center text-slate-500">
                  Товары не найдены
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {deleteId && <DeleteModal isLoading={isDeleting} onClose={() => setDeleteId(null)} onDelete={onDelete} />}
      {openProductModal && <CreateProductModal onClose={() => setOpenProductModal(false)} />}
    </div>
  )
}

export default ProductsPage
