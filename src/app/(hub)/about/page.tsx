import type { Metadata } from 'next'
import AboutClient from './about-client'

export const metadata: Metadata = {
  title: 'Tentang Kami | PT DBSN',
  description: 'Profil PT DBSN Sentradaya, visi misi, jajaran manajemen, serta sejarah perjalanan kami dalam menghadirkan solusi energi terbarukan di Indonesia.',
}

export default function AboutPage() {
  return <AboutClient />
}
