import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import { StoreProvider } from './providers/store.provider.tsx'
import { RoutersProvider } from './providers/router.provider.tsx'
import { AuthProvider } from './providers/auth.provider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreProvider>
      <AuthProvider>
        <RoutersProvider />
      </AuthProvider>
    </StoreProvider>
  </StrictMode>
)
