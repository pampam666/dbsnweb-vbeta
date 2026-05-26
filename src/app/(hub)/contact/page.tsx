import ContactSection from '@/components/sections/ContactSection'
import ProjectMapSection from '@/components/sections/ProjectMapSection'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hubungi Kami - DBSN Sentradaya',
  description: 'Hubungi PT DBSN Sentradaya untuk informasi kemitraan, pertanyaan produk energi terbarukan, atau mengajukan permintaan penawaran harga.',
}

export default function ContactPage() {
  return (
    <main className="pt-20 bg-slate-50">
      <ContactSection />
      <ProjectMapSection />
    </main>
  )
}
