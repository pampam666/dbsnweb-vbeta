"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { MapPin, Building2, Calendar, Wrench, ArrowRight, FileText } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";

export interface PortfolioItem {
  id: string;
  title: string;
  clientCategory: string;
  location: string;
  completionYear: number;
  scopeDescription: string;
  outcome: string;
  images: string | null;
  relatedSpoke: string | null;
  image?: string;
}

interface PortfolioSectionProps {
  portfolioItems?: PortfolioItem[];
}

const defaultPortfolioItems: PortfolioItem[] = [
  { id: "p1", title: "Pemasangan PJU LED Jalan Tol Trans Jawa", clientCategory: "Government", location: "Semarang, Jawa Tengah", completionYear: 2024, scopeDescription: "Pemasangan 500 unit PJU LED 200W sepanjang ruas tol Semarang-Solo", outcome: "Peningkatan visibilitas jalan tol dan penurunan kecelakaan malam hari hingga 35%", images: null, relatedSpoke: "PJU", image: "/images/portfolio-pju-highway.png" },
  { id: "p2", title: "Pembangkit Listrik Tenaga Surya PLTS Roofmount", clientCategory: "BUMN", location: "Jakarta Selatan, DKI Jakarta", completionYear: 2024, scopeDescription: "Instalasi PLTS atap 500 kWp untuk kantor pusat BUMN", outcome: "Penghematan biaya listrik hingga 40% per tahun, setara 600 ton CO2", images: null, relatedSpoke: "Panel Surya", image: "/images/portfolio-solar-rooftop.png" },
  { id: "p3", title: "Sistem Penangkal Petir Gedung Perkantoran", clientCategory: "Private", location: "Surabaya, Jawa Timur", completionYear: 2023, scopeDescription: "Instalasi sistem proteksi petir radius 150m pada gedung 25 lantai", outcome: "Perlindungan menyeluruh sesuai standar SNI IEC 62305", images: null, relatedSpoke: "Penangkal Petir", image: "/images/portfolio-petir-building.png" },
  { id: "p4", title: "Pengadaan PJU Tenaga Surya 34 Provinsi", clientCategory: "Government", location: "Nasional (34 Provinsi)", completionYear: 2023, scopeDescription: "Pengadaan dan instalasi 3.000 unit PJU tenaga surya untuk daerah 3T", outcome: "Penerangan jalan untuk 150 desa yang belum memiliki akses listrik PLN", images: null, relatedSpoke: "PJU" },
  { id: "p5", title: "Battery Energy Storage System (BESS) Microgrid", clientCategory: "BUMN", location: "Bali", completionYear: 2024, scopeDescription: "Pemasangan BESS 2 MWh untuk stabilisasi jaringan microgrid pulau", outcome: "Stabilitas jaringan meningkat 60%, mendukung program Bali Mandiri Energi", images: null, relatedSpoke: "Baterai" },
  { id: "p6", title: "Sistem PJU Smart City Terintegrasi IoT", clientCategory: "EPC", location: "Makassar, Sulawesi Selatan", completionYear: 2023, scopeDescription: "Instalasi 200 unit PJU smart dengan sensor IoT untuk monitoring pemakaian", outcome: "Efisiensi energi meningkat 50% dengan sistem dimming otomatis", images: null, relatedSpoke: "PJU" },
  { id: "p7", title: "Grounding System Pabrik Manufaktur", clientCategory: "Private", location: "Bekasi, Jawa Barat", completionYear: 2024, scopeDescription: "Instalasi sistem grounding dan penangkal petir untuk area pabrik 5 hektar", outcome: "Memenuhi standar keamanan listrik dan proteksi petir pabrik", images: null, relatedSpoke: "Penangkal Petir" },
  { id: "p8", title: "PLTS Groundmount Kawasan Industri", clientCategory: "EPC", location: "Cikarang, Jawa Barat", completionYear: 2024, scopeDescription: "Pembangunan PLTS groundmount 2 MWp untuk kawasan industri", outcome: "Menyediakan energi bersih untuk 200 unit pabrik di kawasan", images: null, relatedSpoke: "Panel Surya" },
  { id: "p9", title: "Pengadaan Baterai UPS Data Center Pemerintah", clientCategory: "Government", location: "Bandung, Jawa Barat", completionYear: 2023, scopeDescription: "Pengadaan dan instalasi sistem baterai UPS 500 kVA untuk data center", outcome: "Backup power 24 jam untuk data center pemerintah kritis", images: null, relatedSpoke: "Baterai" },
  { id: "p10", title: "Pemasangan PJU Solar Home System", clientCategory: "BUMN", location: "Kalimantan Timur", completionYear: 2024, scopeDescription: "Pemasangan 1.000 unit PJU solar home system untuk perumahan karyawan", outcome: "Mengurangi ketergantungan genset dan emisi CO2 sebesar 200 ton/tahun", images: null, relatedSpoke: "PJU" },
  { id: "p11", title: "Sistem Proteksi Petir Bandara", clientCategory: "EPC", location: "Medan, Sumatera Utara", completionYear: 2023, scopeDescription: "Instalasi sistem proteksi petir untuk terminal bandara dan menara kontrol", outcome: "Perlindungan komprehensif sesuai standar ICAO dan SNI", images: null, relatedSpoke: "Penangkal Petir" },
  { id: "p12", title: "Pengadaan Baterai untuk Sistem PLTS Desa", clientCategory: "Government", location: "NTT (Nusa Tenggara Timur)", completionYear: 2024, scopeDescription: "Pengadaan baterai LiFePO4 untuk 50 unit PLTS desa terpencil", outcome: "Penyimpanan energi untuk 50 desa, melayani 5.000 kepala keluarga", images: null, relatedSpoke: "Baterai" },
];

const filters = [
  { key: "all", label: "Semua" },
  { key: "Government", label: "Pemerintah" },
  { key: "BUMN", label: "BUMN" },
  { key: "Private", label: "Swasta" },
  { key: "EPC", label: "EPC" },
];

const categoryColors: Record<string, string> = {
  Government: "bg-emerald-100 text-emerald-700",
  BUMN: "bg-amber-100 text-amber-700",
  Private: "bg-blue-100 text-blue-700",
  EPC: "bg-purple-100 text-purple-700",
};

const categoryAccentColors: Record<string, string> = {
  Government: "bg-emerald-600", BUMN: "bg-amber-600", Private: "bg-blue-600", EPC: "bg-purple-600",
};

const categoryLabels: Record<string, string> = {
  Government: "Pemerintah", BUMN: "BUMN", Private: "Swasta", EPC: "EPC",
};

export default function PortfolioSection({ portfolioItems = defaultPortfolioItems }: PortfolioSectionProps) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  const filtered = activeFilter === "all" ? portfolioItems : portfolioItems.filter((item) => item.clientCategory === activeFilter);

  return (
    <section id="portofolio" className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal delay={0}>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 mb-4">
              <Building2 className="w-3.5 h-3.5 mr-1.5" />Portofolio
            </Badge>
            <h2 className="section-heading">Portofolio Proyek</h2>
            <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
              Jejak rekam proyek kami di seluruh Indonesia dengan berbagai mitra terpercaya
            </p>
            <div className="mt-4 inline-flex items-center gap-2">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                Menampilkan {filtered.length} dari {portfolioItems.length} Proyek
              </span>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {filters.map((f) => (
              <Button key={f.key} variant={activeFilter === f.key ? "default" : "outline"} onClick={() => setActiveFilter(f.key)}
                className={activeFilter === f.key ? "bg-emerald-700 hover:bg-emerald-800 text-white min-h-[44px] px-4 text-sm" : "border-emerald-200 text-emerald-700 hover:bg-emerald-50 min-h-[44px] px-4 text-sm"}>
                {f.label}
              </Button>
            ))}
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filtered.map((item, index) => (
            <Card key={item.id} className="border-emerald-100 dark:border-emerald-800/50 shadow-sm hover:shadow-md hover:scale-[1.02] hover:border-emerald-300 transition-all duration-300 group overflow-hidden cursor-pointer rounded-xl" onClick={() => setSelectedItem(item)}>
              <div className="aspect-video bg-gradient-to-br from-emerald-100 via-emerald-50 to-amber-50 relative overflow-hidden">
                <div className="absolute top-3 left-3 z-10 w-8 h-8 rounded-full bg-emerald-600/90 text-white text-xs font-bold flex items-center justify-center shadow-md hidden sm:flex">
                  {String(index + 1).padStart(2, "0")}
                </div>
                {item.image ? (
                  <Image src={item.image} alt={item.title || "Portfolio item"} fill className="object-cover" />
                ) : (
                  <>
                    <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, #047857 10px, #047857 11px)` }} />
                    <div className="absolute inset-0 flex items-center justify-center"><Building2 className="w-10 h-10 text-emerald-300" /></div>
                  </>
                )}
                <Badge className={`absolute top-3 left-3 ${categoryColors[item.clientCategory]}`}>{categoryLabels[item.clientCategory]}</Badge>
                <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot" />
                  <MapPin className="w-3 h-3 text-gray-500" />
                </div>
              </div>
              <CardContent className="p-4 space-y-3 min-w-0">
                <h4 className="font-semibold text-emerald-900 dark:text-emerald-100 text-sm leading-tight line-clamp-2 group-hover:text-emerald-700 transition-colors">{item.title}</h4>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-gray-500"><MapPin className="w-3.5 h-3.5 shrink-0" /><span className="truncate">{item.location}</span></div>
                  <div className="flex items-center gap-2 text-xs text-gray-500"><Calendar className="w-3.5 h-3.5 shrink-0" /><span>{item.completionYear}</span></div>
                  <div className="flex items-center gap-2 text-xs text-gray-500"><Wrench className="w-3.5 h-3.5 shrink-0" /><span>{item.relatedSpoke}</span></div>
                </div>
                <Button variant="ghost" className="w-full text-emerald-700 hover:bg-emerald-50 text-xs gap-1 min-h-[44px] mt-1 px-4">
                  Lihat Detail <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          {selectedItem && (
            <DialogContent className="max-w-lg p-0 overflow-hidden">
              <div className={`h-1.5 ${categoryAccentColors[selectedItem.clientCategory]}`} />
              {selectedItem.image && (
                <div className="relative aspect-video w-full overflow-hidden">
                  <Image src={selectedItem.image} alt={selectedItem.title || "Portfolio item"} fill className="object-cover" />
                  <Badge className={`absolute top-3 left-3 ${categoryColors[selectedItem.clientCategory]}`}>{categoryLabels[selectedItem.clientCategory]}</Badge>
                </div>
              )}
              <div className="p-6">
                <DialogHeader>
                  {!selectedItem.image && <Badge className={`w-fit ${categoryColors[selectedItem.clientCategory]} mb-2`}>{categoryLabels[selectedItem.clientCategory]}</Badge>}
                  <DialogTitle className="text-emerald-900 dark:text-emerald-100 text-xl">{selectedItem.title}</DialogTitle>
                  <DialogDescription className="flex flex-wrap gap-4 text-sm text-gray-500 mt-1">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{selectedItem.location}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{selectedItem.completionYear}</span>
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <h4 className="font-semibold text-emerald-800 text-sm mb-1">Lingkup Pekerjaan</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{selectedItem.scopeDescription}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-emerald-800 text-sm mb-1">Hasil & Dampak</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{selectedItem.outcome}</p>
                  </div>
                  {selectedItem.relatedSpoke && (
                    <Badge variant="outline" className="border-emerald-200 text-emerald-700">
                      <Wrench className="w-3.5 h-3.5 mr-1" />{selectedItem.relatedSpoke}
                    </Badge>
                  )}
                  <Button className="w-full bg-emerald-700 hover:bg-emerald-800 text-white gap-2 min-h-[48px] mt-2"
                    onClick={() => { setSelectedItem(null); setTimeout(() => { document.getElementById("permintaan-penawaran")?.scrollIntoView({ behavior: "smooth" }); }, 300); }}>
                    <FileText className="w-4 h-4" />Ajukan Penawaran Serupa
                  </Button>
                </div>
              </div>
            </DialogContent>
          )}
        </Dialog>
      </div>
    </section>
  );
}
