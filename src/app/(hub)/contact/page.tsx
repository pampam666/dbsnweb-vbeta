import type { Metadata } from 'next'
import ContactClient from './contact-client'

export const metadata: Metadata = {
  title: 'Hubungi Kami | PT DBSN',
  description: 'Hubungi tim sales engineering PT DBSN Sentradaya untuk konsultasi teknis, pengajuan RFQ B2B/B2G, dan informasi layanan instalasi energi terbarukan.',
}

export default function ContactPage() {
  return <ContactClient />
}
