'use client'

import { ReactNode } from 'react'
import { MeshProvider } from '@meshsdk/react'

interface ClientProvidersProps {
  children: ReactNode
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <MeshProvider>
      {children}
    </MeshProvider>
  )
}
