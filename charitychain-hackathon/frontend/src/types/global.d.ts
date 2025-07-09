// Global type declarations for Cardano wallet extensions

declare global {
  interface Window {
    cardano?: {
      eternl?: any
      nami?: any
      flint?: any
      typhon?: any
      lace?: any
      gerowallet?: any
      [key: string]: any
    }
  }
}

export {}
