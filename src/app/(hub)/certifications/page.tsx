import { getCertifications } from '@/lib/api/sanity/queries'
import CertificationsGrid from './CertificationsGrid'
import type { Metadata } from 'next'
import { Badge } from '@/components/ui/badge'
import { Award } from 'lucide-react'

export const revalidate = 3600 // Revalidate hourly

export const metadata: Metadata = {
  title: 'Daftar Sertifikasi & Kepatuhan - DBSN Sentradaya',
  description: 'Daftar sertifikasi resmi produk DBSN termasuk SNI, TKDN, LKPP, dan ISO untuk standar proyek energi terbarukan di Indonesia.',
}

export default async function CertificationsPage() {
  const certifications = await getCertifications()

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 pb-20">
      {/* Banner */}
      <section className="relative pt-32 pb-16 bg-emerald-900 dark:bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.1),transparent_45%)]" />
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.015) 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-50 dark:from-gray-950 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <Badge variant="outline" className="border-emerald-300 text-emerald-300 bg-emerald-950/50 mb-4 px-3 py-1">
            <Award className="w-3.5 h-3.5 mr-1.5" />Standardisasi & Mutu
          </Badge>
          <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl leading-tight">
            Sertifikasi & Kepatuhan
          </h1>
          <p className="mt-4 text-lg text-emerald-100 max-w-2xl mx-auto font-medium">
            Komitmen kami terhadap pemenuhan standar nasional dan internasional demi keandalan sistem energi terbarukan.
          </p>
        </div>
      </section>

      {/* Main Grid Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {certifications && certifications.length > 0 ? (
          <CertificationsGrid certifications={certifications} />
        ) : (
          <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-slate-100">
            <Award className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Belum ada sertifikasi</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">
              Belum ada sertifikasi resmi yang dipublikasikan dari Sanity CMS saat ini. Silakan kembali lagi nanti.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
