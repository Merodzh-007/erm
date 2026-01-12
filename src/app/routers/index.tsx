import { createBrowserRouter, Navigate } from 'react-router'
import AppLayout from '@/widgets/layout/ui/AppLayout'
import { AuthGuard } from '@/features/auth/ui/AuthGuard'
import { paths } from './constants'
import AuthPage from '@/pages/AuthPage'
import StockPage from '@/pages/StockPage'
import WarehousesPage from '@/pages/WarehousesPage'
import ProductsPage from '@/pages/ProductPage'
import ReceiptPage from '@/pages/ReceiptPage'
import ReceiptDetailPage from '@/pages/ReceiptDetailPage'
import UsersPage from '@/pages/UsersPage'
import HistoryStockPage from '@/pages/HistoryStockPage'
import HistoryStockDetailPage from '@/pages/HistoryStockDetailPage'
import CustomersPage from '@/pages/CustomersPage'
import CustomerDetailPage from '@/pages/CustomerDetailPage'
import TransactionPage from '@/pages/TransactionPage'

export const router = createBrowserRouter([
  {
    path: paths.auth(),
    element: <AuthPage />,
  },
  {
    element: (
      <AuthGuard>
        <AppLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: paths.home(),
        element: <StockPage />,
      },
      {
        path: paths.stockHistory(),
        element: <HistoryStockPage />,
      },
      {
        path: paths.warehouse(),
        element: <WarehousesPage />,
      },
      {
        path: paths.products(),
        element: <ProductsPage />,
      },
      {
        path: paths.receipt(),
        element: <ReceiptPage />,
      },
      {
        path: paths.receiptId(':id'),
        element: <ReceiptDetailPage />,
      },
      {
        path: paths.stockHistoryDetails(':id'),
        element: <HistoryStockDetailPage />,
      },
      {
        path: paths.workers(),
        element: <UsersPage />,
      },
      {
        path: paths.customers(),
        element: <CustomersPage />,
      },
      {
        path: paths.transaction(),
        element: <TransactionPage />,
      },

      {
        path: paths.customers(':id'),
        element: <CustomerDetailPage />,
      },
      {
        path: '*',
        element: <Navigate to={paths.home()} replace />,
      },
    ],
  },
])
