import FAQSection from '@/components/sections/FAQSection'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tanya Jawab (FAQ) - DBSN Sentradaya',
  description: 'Temukan jawaban atas pertanyaan umum seputar produk panel surya, PJU LED/tenaga surya, penangkal petir, serta layanan instalasi kami.',
}

export default function FAQPage() {
  return (
    <main className="pt-20 bg-slate-50">
      <FAQSection />
    </main>
  )
}
