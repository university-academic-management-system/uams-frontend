import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from './components/ui/provider.tsx'
import { RouterProvider } from 'react-router'
import appRoutes from './routes/AppRoutes.tsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={appRoutes} />
      </QueryClientProvider>
    </Provider>
  </StrictMode>
)
