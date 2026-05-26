"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Shield, Award, ClipboardCheck, FileCheck,
  Calendar, Building2, CheckCircle2, AlertTriangle,
} from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";

export interface CertificationItem {
  id: string;
  title: string;
  certType: string;
  certificationBody: string;
  issueDate: string;
  expiryDate: string;
  description: string | null;
}

interface CertificationsSectionProps {
  certifications?: CertificationItem[];
}

// Static fallback data for when Sanity is not yet connected
const defaultCertifications: CertificationItem[] = [
  { id: "sni-1", title: "SNI 8513:2021 - Penerangan Jalan Umum", certType: "SNI", certificationBody: "BSN (Badan Standardisasi Nasional)", issueDate: "2023-03-15", expiryDate: "2027-03-15", description: "Sertifikasi standar nasional untuk produk penerangan jalan umum (PJU) LED" },
  { id: "sni-2", title: "SNI 8396:2022 - Panel Surya Fotovoltaik", certType: "SNI", certificationBody: "BSN (Badan Standardisasi Nasional)", issueDate: "2023-06-20", expiryDate: "2027-06-20", description: "Sertifikasi untuk modul surya fotovoltaik kristal silikon" },
  { id: "sni-3", title: "SNI IEC 62305 - Sistem Proteksi Petir", certType: "SNI", certificationBody: "BSN (Badan Standardisasi Nasional)", issueDate: "2022-11-10", expiryDate: "2026-11-10", description: "Standar perlindungan terhadap petir untuk bangunan dan struktur" },
  { id: "tkdn-1", title: "TKDN PJU Tenaga Surya - 62%", certType: "TKDN", certificationBody: "Kementerian Perindustrian RI", issueDate: "2024-01-18", expiryDate: "2027-01-18", description: "Sertifikat TKDN untuk produk PJU tenaga surya dengan komponen dalam negeri 62%" },
  { id: "tkdn-2", title: "TKDN Panel Surya Monocrystalline - 55%", certType: "TKDN", certificationBody: "Kementerian Perindustrian RI", issueDate: "2024-02-22", expiryDate: "2027-02-22", description: "Sertifikat TKDN untuk panel surya monocrystalline 55%" },
  { id: "tkdn-3", title: "TKDN Baterai Lithium - 48%", certType: "TKDN", certificationBody: "Kementerian Perindustrian RI", issueDate: "2023-08-15", expiryDate: "2025-09-15", description: "Sertifikat TKDN untuk baterai lithium penyimpanan energi" },
  { id: "lkpp-1", title: "Verifikasi LKPP - Kategori PJU & Panel Surya", certType: "LKPP", certificationBody: "LKPP (Lembaga Kebijakan Pengadaan)", issueDate: "2024-01-05", expiryDate: "2025-08-05", description: "Verifikasi penyedia barang/jasa pemerintah untuk kategori PJU dan panel surya" },
  { id: "lkpp-2", title: "Registrasi e-Katalog LKPP", certType: "LKPP", certificationBody: "LKPP (Lembaga Kebijakan Pengadaan)", issueDate: "2024-03-10", expiryDate: "2027-03-10", description: "Registrasi produk di platform e-Katalog LKPP untuk pengadaan pemerintah" },
  { id: "lkpp-3", title: "Sertifikat Penyedia LKPP - Penangkal Petir", certType: "LKPP", certificationBody: "LKPP (Lembaga Kebijakan Pengadaan)", issueDate: "2022-12-01", expiryDate: "2024-12-01", description: "Sertifikat penyedia untuk produk penangkal petir dan grounding system" },
  { id: "iso-1", title: "ISO 9001:2015 - Sistem Manajemen Mutu", certType: "ISO", certificationBody: "TÜV Rheinland", issueDate: "2023-07-01", expiryDate: "2026-07-01", description: "Sertifikasi sistem manajemen mutu internasional untuk jaminan kualitas produk" },
  { id: "iso-2", title: "ISO 14001:2015 - Sistem Manajemen Lingkungan", certType: "ISO", certificationBody: "TÜV Rheinland", issueDate: "2022-07-01", expiryDate: "2025-09-01", description: "Sertifikasi sistem manajemen lingkungan untuk operasional yang ramah lingkungan" },
  { id: "iso-3", title: "ISO 45001:2018 - Kesehatan & Keselamatan Kerja", certType: "ISO", certificationBody: "TÜV Rheinland", issueDate: "2023-01-15", expiryDate: "2026-01-15", description: "Sertifikasi sistem manajemen kesehatan dan keselamatan kerja" },
];

const certTypes = [
  { key: "SNI", label: "SNI", icon: Shield },
  { key: "TKDN", label: "TKDN", icon: Award },
  { key: "LKPP", label: "LKPP", icon: ClipboardCheck },
  { key: "ISO", label: "ISO", icon: FileCheck },
];

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function getCertStatus(expiryDate: string) {
  const now = new Date();
  const expiry = new Date(expiryDate);
  const monthsUntilExpiry = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30);
  if (monthsUntilExpiry <= 0) return { status: "expired", color: "text-red-600 dark:text-red-400", bgColor: "bg-red-50 dark:bg-red-950/40", borderColor: "border-red-200 dark:border-red-800/50", label: "Kedaluwarsa", icon: AlertTriangle };
  if (monthsUntilExpiry <= 3) return { status: "expiring", color: "text-orange-600 dark:text-orange-400", bgColor: "bg-orange-50 dark:bg-orange-950/40", borderColor: "border-orange-200 dark:border-orange-800/50", label: "Segera berakhir", icon: AlertTriangle };
  return { status: "active", color: "text-emerald-600 dark:text-emerald-400", bgColor: "bg-emerald-50 dark:bg-emerald-950/40", borderColor: "border-emerald-200 dark:border-emerald-800/50", label: "Aktif", icon: CheckCircle2 };
}

function CertBadge({ cert, index }: { cert: CertificationItem; index: number }) {
  const statusInfo = getCertStatus(cert.expiryDate);
  const StatusIcon = statusInfo.icon;
  const isAmber = cert.certType === "TKDN" || cert.certType === "LKPP";
  return (
    <ScrollReveal delay={index * 0.05}>
      <div className={`group relative rounded-2xl border ${statusInfo.borderColor} ${statusInfo.bgColor} p-5 sm:p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`}>
        <div className="flex items-center justify-between mb-3">
          <Badge variant="outline" className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 ${isAmber ? "border-amber-300 text-amber-700 bg-amber-50 dark:border-amber-700 dark:text-amber-400 dark:bg-amber-950/60" : "border-emerald-300 text-emerald-700 bg-emerald-50 dark:border-emerald-700 dark:text-emerald-400 dark:bg-emerald-950/60"}`}>
            {cert.certType}
          </Badge>
          <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full ${statusInfo.color} ${statusInfo.bgColor}`}>
            <StatusIcon className="w-3 h-3" />{statusInfo.label}
          </span>
        </div>
        <h4 className="font-semibold text-emerald-900 dark:text-emerald-100 text-sm leading-snug mb-2">{cert.title}</h4>
        {cert.description && <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-3">{cert.description}</p>}
        <div className="flex items-center gap-4 mt-auto pt-3 border-t border-gray-200/60 dark:border-gray-700/40">
          <span className="inline-flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
            <Building2 className="w-3 h-3" />
            <span className="truncate max-w-[180px]">{cert.certificationBody}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400 shrink-0">
            <Calendar className="w-3 h-3" />{formatDate(cert.expiryDate)}
          </span>
        </div>
      </div>
    </ScrollReveal>
  );
}

export default function CertificationsSection({ certifications = defaultCertifications }: CertificationsSectionProps) {
  const totalCerts = certifications.length;
  const activeCerts = certifications.filter((c) => getCertStatus(c.expiryDate).status === "active").length;
  const expiringCerts = certifications.filter((c) => { const s = getCertStatus(c.expiryDate).status; return s === "expiring" || s === "expired"; }).length;

  const summaryStats = [
    { label: "Total Sertifikasi", value: totalCerts, icon: FileCheck, color: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/40", border: "border-emerald-100 dark:border-emerald-800/50" },
    { label: "Aktif", value: activeCerts, icon: CheckCircle2, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/40", border: "border-emerald-100 dark:border-emerald-800/50" },
    { label: "Perlu Diperpanjang", value: expiringCerts, icon: AlertTriangle, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-950/40", border: "border-orange-100 dark:border-orange-800/50" },
  ];

  return (
    <section id="sertifikasi" className="py-12 sm:py-16 lg:py-20 bg-gray-50/50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal delay={0}>
          <div className="text-center max-w-3xl mx-auto mb-10">
            <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 mb-4">
              <FileCheck className="w-3.5 h-3.5 mr-1.5" />Legalitas & Sertifikasi
            </Badge>
            <h2 className="section-heading">Pusat Sertifikasi & Legalitas</h2>
            <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
              Produk dan layanan kami telah tersertifikasi sesuai standar nasional dan internasional
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.05}>
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-10">
            {summaryStats.map((stat) => (
              <div key={stat.label} className={`flex items-center gap-3 p-4 sm:p-5 rounded-xl ${stat.bg} border ${stat.border} shadow-sm`}>
                <stat.icon className={`w-6 h-6 ${stat.color} shrink-0`} />
                <div>
                  <div className={`text-xl sm:text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <Tabs defaultValue="SNI" className="w-full">
          <ScrollReveal delay={0.1}>
            <TabsList className="grid w-full grid-cols-4 mb-8 bg-transparent p-0 h-auto border-b border-gray-200 dark:border-gray-700">
              {certTypes.map((ct) => (
                <TabsTrigger key={ct.key} value={ct.key}
                  className="data-[state=active]:border-emerald-600 data-[state=active]:text-emerald-700 data-[state=active]:font-semibold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 dark:data-[state=active]:text-emerald-400 border-b-2 border-transparent min-h-[44px] rounded-none text-xs sm:text-sm font-medium gap-1.5 transition-all duration-200">
                  <ct.icon className="w-4 h-4" /><span className="hidden sm:inline">{ct.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </ScrollReveal>
          {certTypes.map((ct) => (
            <TabsContent key={ct.key} value={ct.key}>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {certifications.filter((c) => c.certType === ct.key).map((cert, idx) => (
                  <CertBadge key={cert.id} cert={cert} index={idx} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
