import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/shared/ThemeProvider'
import GoogleAnalytics from '@/components/shared/GoogleAnalytics'
import './globals.css'

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
      <head>
        {process.env.NEXT_PUBLIC_GSC_VERIFICATION && (
          <meta name="google-site-verification" content={process.env.NEXT_PUBLIC_GSC_VERIFICATION} />
        )}
      </head>
      <body className="antialiased min-h-screen bg-background text-foreground transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <GoogleAnalytics />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
