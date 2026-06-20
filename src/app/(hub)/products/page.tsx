import type { Metadata } from 'next'
import ProductsClient from './products-client'

export const metadata: Metadata = {
  title: 'Produk | PT DBSN',
  description: 'Katalog lengkap produk energi terbarukan PT DBSN Sentradaya: PJU Solar Cell, panel surya, baterai lithium storage, dan alat penangkal petir.',
}

export default function ProductsPage() {
  return <ProductsClient />
}
