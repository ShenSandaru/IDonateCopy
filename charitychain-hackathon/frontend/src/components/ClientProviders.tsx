'use client'

import { ReactNode } from 'react'

interface ClientProvidersProps {
  children: ReactNode
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <div>
      {children}
    </div>
  )
}
