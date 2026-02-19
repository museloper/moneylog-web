import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import router from '@/router'

import '@/assets/css/index.css'

const enableMocking = async () => {
  if (import.meta.env.DEV) {
    const { worker } = await import('@/mocks/browser')
    await worker.start()
  }
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  )
})
