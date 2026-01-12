import { useMemo, useState } from 'react'
import { Plus, Package, Search } from 'lucide-react'
import {
  useDeleteProductMutation,
  useGetProductsQuery,
  usePostProductMutation,
} from '@/features/products/api/products.api'
import { useAuth } from '@/features/auth/hooks/auth.hooks'
import { formatDateTime } from '@/shared/formatDateTime'
import DeleteModal from '@/widgets/modals/DeleteModal'
import { Loading } from '@/shared/ui/Loading'

const ProductsPage = () => {
  const { data: products = [], isLoading } = useGetProductsQuery()
  const [createProduct, { isLoading: isCreating }] = usePostProductMutation()
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation()
  const { isAdmin } = useAuth()

  const [form, setForm] = useState({ name: '', manufacturer: '' })
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const filtered = useMemo(() => {
    return products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
  }, [products, search])

  const onCreate = async () => {
    if (!form.name.trim()) return
    await createProduct(form).unwrap()
    setForm({ name: '', manufacturer: '' })
  }

  const onDelete = async () => {
    if (!deleteId) return
    await deleteProduct(deleteId).unwrap()
    setDeleteId(null)
  }

  if (isLoading) return <Loading text="товаров" />

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Товары</h1>
          <p className="text-sm text-slate-500">Каталог товаров</p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search size={18} className="absolute left-3 top-3 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по продуктам"
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm
              focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {isAdmin && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-sm font-medium text-slate-700 mb-4">Добавить продукт</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Название"
              className="px-4 py-2.5 rounded-lg border border-slate-300 text-sm
                focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <input
              value={form.manufacturer}
              onChange={(e) => setForm({ ...form, manufacturer: e.target.value })}
              placeholder="Производитель"
              className="px-4 py-2.5 rounded-lg border border-slate-300 text-sm
                focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <button
              onClick={onCreate}
              disabled={isCreating}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg
                bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition
                disabled:opacity-50"
            >
              <Plus size={16} />
              Добавить
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4 md:hidden">
        {filtered.map((p) => (
          <div key={p.id} className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 font-medium text-slate-800">
                <Package size={16} className="text-slate-400" />
                {p.name}
              </div>

              {/* {isAdmin && (
                <button onClick={() => setDeleteId(p.id)} className="text-red-600">
                  <Trash2 size={18} />
                </button>
              )} */}
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

                {/* {isAdmin && (
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => setDeleteId(p.id)} className="text-red-600 hover:text-red-800">
                      <Trash2 size={18} />
                    </button>
                  </td>
                )} */}
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
    </div>
  )
}

export default ProductsPage
