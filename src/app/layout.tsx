import type { Metadata } from 'next'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

import theme from '@/theme'
import './globals.css'
import QueryProvider from './QueryProvider'

export const metadata: Metadata = {
  title: 'User List',
  description: 'take home text for crypto.com',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <AppRouterCacheProvider>
            <CssVarsProvider defaultMode="system" theme={theme}>
              <CssBaseline />
              {children}
            </CssVarsProvider>
          </AppRouterCacheProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
