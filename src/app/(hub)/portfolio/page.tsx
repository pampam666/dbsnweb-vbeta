import { getPortfolioEntries } from '@/lib/api/sanity/queries'
import PortfolioGridClient from './PortfolioGridClient'
import type { Metadata } from 'next'

export const revalidate = 3600 // Revalidate hourly

export const metadata: Metadata = {
  title: 'Portofolio Proyek Terbarukan - DBSN',
  description: 'Jelajahi portofolio proyek energi terbarukan kami untuk sektor B2G, B2B, dan swasta di seluruh Indonesia.',
}

export default async function PortfolioPage() {
  const portfolio = await getPortfolioEntries()
  const safePortfolio = portfolio || []

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="container mx-auto px-6 pt-28 pb-20 max-w-7xl">
        {/* Banner Section */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
            Portofolio Proyek Kami
          </h1>
          <div className="h-1 w-12 bg-blue-600 mx-auto rounded-full" />
          <p className="text-lg text-slate-600 leading-relaxed">
            DBSN berkomitmen menghadirkan infrastruktur energi terbarukan berkualitas tinggi yang terintegrasi secara cerdas, andal, dan berkelanjutan untuk melayani kebutuhan nasional di berbagai pelosok Indonesia.
          </p>
        </div>

        {/* Client-Side Category Filtering and Grid */}
        <PortfolioGridClient portfolios={safePortfolio} />
      </main>
    </div>
  )
}
