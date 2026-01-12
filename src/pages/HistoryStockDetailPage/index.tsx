import { useGetHistoryStickDetailQuery } from '@/features/remain/api/stock.api'
import type { TStockChangeType } from '@/features/remain/model/stock.types'
import { CHANGE_TYPE_MAP } from '@/features/remain/ui/colors'
import { formatDateTime } from '@/shared/formatDateTime'
import { Loading } from '@/shared/ui/Loading'
import { skipToken } from '@reduxjs/toolkit/query'
import { useParams } from 'react-router'

const HistoryStockDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading } = useGetHistoryStickDetailQuery(id ?? skipToken)

  if (isLoading) {
    return <Loading text="истории" />
  }

  if (!data) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
        Запись истории не найдена
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-slate-800">Изменение остатка</h1>
            <p className="text-sm text-slate-500">{formatDateTime(data.created_at)}</p>
          </div>

          <ChangeTypeBadge type={data.change_type} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoCard title="Товар">
          <InfoRow label="Название" value={data.product_name} />
          <InfoRow label="Производитель" value={data.manufacturer} />
        </InfoCard>

        <InfoCard title="Склад">
          <InfoRow label="Склад" value={data.warehouse_name} />
          <InfoRow label="Пользователь" value={data.user_name} />
        </InfoCard>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h2 className="text-sm font-semibold text-slate-700 mb-4">Изменения</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ChangeRow label="Коробки" from={data.old_boxes_qty} to={data.new_boxes_qty} type={data.change_type} />
          <ChangeRow label="Штуки" from={data.old_pieces_qty} to={data.new_pieces_qty} type={data.change_type} />
          <ChangeRow label="Вес, кг" from={data.old_weight_kg} to={data.new_weight_kg} type={data.change_type} />
          <ChangeRow label="Объём, м³" from={data.old_volume_cbm} to={data.new_volume_cbm} type={data.change_type} />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h2 className="text-sm font-semibold text-slate-700 mb-2">Причина изменения</h2>
        <p className="text-sm text-slate-600 whitespace-pre-line">{data.reason}</p>
      </div>
    </div>
  )
}

const InfoCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white border border-slate-200 rounded-xl p-6">
    <h2 className="text-sm font-semibold text-slate-700 mb-4">{title}</h2>
    <div className="space-y-2">{children}</div>
  </div>
)

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 text-sm">
    <span className="text-slate-500">{label}</span>
    <span className="font-medium text-slate-800 sm:text-right break-words">{value}</span>
  </div>
)

const ChangeRow = ({ label, from, to, type }: { label: string; from: number; to: number; type: TStockChangeType }) => {
  const cfg = CHANGE_TYPE_MAP[type]

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-sm">
      <span className="text-slate-600">{label}</span>

      <div className="font-mono">
        {type === 'IN' && (
          <>
            <span className={cfg.fromColor}>{from}</span>
            <span className="mx-2 text-slate-400">+</span>
            <span className={`${cfg.toColor} font-semibold`}>{to - from}</span>
          </>
        )}

        {type === 'OUT' && (
          <>
            <span className={cfg.fromColor}>{from}</span>
            <span className="mx-2 text-slate-400">−</span>
            <span className={`${cfg.toColor} font-semibold`}>{from - to}</span>
          </>
        )}

        {type === 'ADJUSTMENT' && (
          <>
            <span className={cfg.fromColor}>{from}</span>
            <span className="mx-2 text-slate-400">→</span>
            <span className={`${cfg.toColor} font-semibold`}>{to}</span>
          </>
        )}
      </div>
    </div>
  )
}

const ChangeTypeBadge = ({ type }: { type: TStockChangeType }) => {
  const cfg = CHANGE_TYPE_MAP[type]

  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${cfg.badge}`}>{cfg.label}</span>
}

export default HistoryStockDetailPage
