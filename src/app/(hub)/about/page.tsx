import AboutSection from '@/components/sections/AboutSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tentang Kami - DBSN Sentradaya',
  description: 'Kenali lebih dekat PT DBSN Sentradaya, visi misi kami, dan dedikasi kami dalam solusi energi terbarukan terintegrasi di Indonesia.',
}

export default function AboutPage() {
  return (
    <main className="pt-20 bg-slate-50">
      <AboutSection />
      <div className="bg-white py-6">
        <TestimonialsSection />
      </div>
    </main>
  )
}
