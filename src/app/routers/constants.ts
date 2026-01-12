export const paths = {
  home: () => `/`,
  auth: () => `/auth`,

  // Warehouses
  warehouse: () => `/warehouses`,

  // Products
  products: () => `/products`,

  // Inventory
  receipt: () => `/inventory/receipt`,
  transaction: () => `/inventory/transaction`,
  returns: () => `/inventory/returns`,
  receiptId: (id: string) => `/inventory/receipt/${id}`,

  // Stock
  stock: () => `/stock`,
  stockHistory: () => `/stock/history`,
  stockHistoryDetails: (id: string) => `/stock/history/${id}`,

  workers: () => `/workers`,
  customers: (id: string = '') => `/customers/${id}`,
}
