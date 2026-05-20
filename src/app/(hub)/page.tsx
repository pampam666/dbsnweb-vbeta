export default function HubHomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-branded from-slate-50 to-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <nav className="container mx-auto px-6 py-4">
          <a href="/" className="text-foreground hover:text-primary">DBSN</a>
          <a href="/certifications">Certifications</a>
          <a href="/portfolio">Portfolio</a>
        </nav>
      </header>

      <section className="container mx-auto px-6 py-16">
        <h1 className="text-5xl font-bold text-foreground mb-6">
          Solusi Energi Terbarukan untuk Masa Depan Indonesia
        </h1>
      </section>

      <section className="container mx-auto px-6 py-16 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-slate-200 rounded-lg p-6 text-center">
            <div className="text-4xl font-bold text-primary mb-4">SNI</div>
            <p className="text-sm text-slate-600">Standar Nasional Indonesia</p>
          </div>
          <div className="border border-slate-200 rounded-lg p-6 text-center">
            <div className="text-4xl font-bold text-primary mb-4">TKDN</div>
            <p className="text-sm text-slate-600">Tingkat Komponen Dalam Negeri</p>
          </div>
          <div className="border border-slate-200 rounded-lg p-6 text-center">
            <div className="text-4xl font-bold text-primary mb-4">LKPP</div>
            <p className="text-sm text-slate-600">Lembaga Pengadaan Barang dan Jasa (e-Katalog)</p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-16 bg-slate-50">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Portofolio Proyek
          </h2>
          <p className="text-slate-600">
            Lebih dari 100 proyek sukses untuk pelanggan B2G dan B2B di Indonesia.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border border-slate-200 rounded-lg p-6 hover:shadow-lg">
            <div className="aspect-video w-full bg-slate-100 rounded mb-4 flex items-center justify-center">
              <span className="text-6xl font-bold text-slate-400">🏢</span>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-foreground">PJU Street Lighting</h3>
                <p className="text-sm text-slate-600">Penerangan Jalan Umum - Kota Bandung</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Client</span>
                <span className="badge badgeVariants({ variant: 'info' })">BUMN</span>
              </div>
              <div className="mt-4">
                <a href="/portfolio/pju-street-lighting" className="text-primary hover:text-accent">
                  Lihat Detail
                </a>
              </div>
            </div>
          </div>
          <div className="border border-slate-200 rounded-lg p-6 hover:shadow-lg">
            <div className="aspect-video w-full bg-slate-100 rounded mb-4 flex items-center justify-center">
              <span className="text-6xl font-bold text-slate-400">🔆</span>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-foreground">Solar Cell Installation</h3>
                <p className="text-sm text-slate-600">Instalasi Sel Surya Komersial - Jakarta</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Client</span>
                <span className="badge badgeVariants({ variant: 'success' })">Private</span>
              </div>
              <div className="mt-4">
                <a href="/portfolio/solar-installation" className="text-primary hover:text-accent">
                  Lihat Detail
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="fixed bottom-6 right-6 z-50 md:hidden">
        <a href="https://wa.me/62XXXXXXXXX" target="_blank" className="flex items-center gap-2 bg-primary text-white px-4 py-3 rounded-full">
          Chat via WhatsApp
        </a>
      </div>
    </div>
  );
}

