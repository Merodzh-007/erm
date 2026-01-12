import type { THistoryStock } from '../model/stock.types'

export const CHANGE_TYPE_MAP: Record<
  THistoryStock['change_type'],
  {
    label: string
    badge: string
    fromColor: string
    toColor: string
  }
> = {
  IN: {
    label: 'Приход на склад',
    badge: 'bg-green-100 text-green-700',
    fromColor: 'text-slate-400',
    toColor: 'text-green-600',
  },
  OUT: {
    label: 'Расход со склада',
    badge: 'bg-red-100 text-red-700',
    fromColor: 'text-red-600',
    toColor: 'text-slate-400',
  },
  ADJUSTMENT: {
    label: 'Корректировка',
    badge: 'bg-blue-100 text-blue-700',
    fromColor: 'text-red-600',
    toColor: 'text-green-600',
  },
}
