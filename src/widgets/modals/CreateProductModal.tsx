import { usePostProductMutation } from '@/features/products/api/products.api'
import { Plus, X } from 'lucide-react'
import { useState } from 'react'

export const CreateProductModal = ({ onClose }: { onClose: () => void }) => {
  const [form, setForm] = useState({
    name: '',
    manufacturer: '',
    image: '',
  })

  const [createProduct, { isLoading }] = usePostProductMutation()

  const onCreate = async () => {
    if (!form.name.trim()) return

    await createProduct({
      name: form.name,
      manufacturer: form.manufacturer,
      image: form.image,
    }).unwrap()
    setForm({ name: '', manufacturer: '', image: '' })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div
        className="
          relative z-10 w-full max-w-lg
          bg-white rounded-2xl
          shadow-xl border border-slate-200
          p-6 sm:p-8
        "
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-800">Добавить продукт</h2>

          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 transition">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Название продукта"
            className="
              w-full px-4 py-2.5 rounded-xl
              border border-slate-300 text-sm
              focus:ring-2 focus:ring-blue-500 focus:border-transparent
            "
          />

          <input
            value={form.manufacturer}
            onChange={(e) => setForm({ ...form, manufacturer: e.target.value })}
            placeholder="Производитель"
            className="
              w-full px-4 py-2.5 rounded-xl
              border border-slate-300 text-sm
              focus:ring-2 focus:ring-blue-500 focus:border-transparent
            "
          />
          <input
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            placeholder="Ссылка на картинку товара"
            className="
              w-full px-4 py-2.5 rounded-xl
              border border-slate-300 text-sm
              focus:ring-2 focus:ring-blue-500 focus:border-transparent
            "
          />
        </div>

        <div className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <button
            onClick={onClose}
            className="
              px-4 py-2.5 rounded-xl
              text-sm font-medium
              text-slate-600
              hover:bg-slate-100 transition
            "
          >
            Отмена
          </button>

          <button
            onClick={onCreate}
            disabled={isLoading}
            className="
              inline-flex items-center justify-center gap-2
              px-5 py-2.5 rounded-xl
              bg-blue-600 text-white
              text-sm font-medium
              hover:bg-blue-700 transition
              disabled:opacity-50
            "
          >
            <Plus size={16} />
            Добавить
          </button>
        </div>
      </div>
    </div>
  )
}
