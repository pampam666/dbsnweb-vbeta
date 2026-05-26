import ProductsSection from '@/components/sections/ProductsSection'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Produk Infrastruktur Energi Terbarukan - DBSN',
  description: 'Temukan produk unggulan energi terbarukan kami: Penerangan Jalan Umum Tenaga Surya (PJUTS), Modul Panel Surya, Proteksi Sambaran Penangkal Petir, dan Baterai Storage.',
}

export default function ProductsPage() {
  return (
    <main className="pt-20 bg-slate-50">
      <ProductsSection />
    </main>
  )
}
