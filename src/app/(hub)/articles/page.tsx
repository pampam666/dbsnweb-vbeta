import ArticlesSection from '@/components/sections/ArticlesSection'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Artikel & Kabar Energi Terbarukan - DBSN',
  description: 'Temukan artikel, wawasan teknis, regulasi TKDN, panduan e-Katalog LKPP, dan tren teknologi panel surya terbaru di Indonesia.',
}

export default function ArticlesPage() {
  return (
    <main className="pt-20 bg-slate-50">
      <ArticlesSection />
    </main>
  )
}
