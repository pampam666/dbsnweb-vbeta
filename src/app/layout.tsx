import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import './globals.css'

export const runtime = 'edge'

export const metadata: Metadata = {
  title: 'DBSN Digital Ecosystem',
  description: 'Solusi Energi Terbarukan untuk Masa Depan Indonesia',
  metadataBase: new URL('https://sentradaya.com'),
  openGraph: {
    locale: 'id_ID',
    siteName: 'DBSN Sentradaya',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-background text-foreground transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
