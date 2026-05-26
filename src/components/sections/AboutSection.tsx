"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2, Eye, Target, Award, TrendingUp, Lightbulb,
  Handshake, Calendar, MapPin, CheckCircle2, Rocket,
} from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { useCounter } from "@/hooks/use-counter";

const managementTeam = [
  { name: "Ir. Darmawan B. Santoso, M.T.", position: "Direktur Utama", desc: "Berpengalaman lebih dari 20 tahun di bidang energi dan infrastruktur. Memimpin visi perusahaan menuju pertumbuhan berkelanjutan." },
  { name: "Hj. Siti Rahayu, S.E., M.M.", position: "Direktur Keuangan", desc: "Ahli manajemen keuangan korporat dengan latar belakang perbankan dan investasi infrastruktur selama 15 tahun." },
  { name: "Budi Prasetyo, S.T., M.Eng.", position: "Direktur Teknis", desc: "Insinyur senior spesialis energi terbarukan. Berpengalaman dalam proyek solar panel dan PJU skala nasional." },
  { name: "Andi Wibowo, S.H., M.H.", position: "Direktur Operasional", desc: "Memimpin operasional dan logistik perusahaan dengan jaringan distribusi yang mencakup seluruh Indonesia." },
];

const companyMilestones = [
  { year: "2009", event: "PT. DBSN Sentradaya resmi berdiri di Surabaya", icon: Rocket },
  { year: "2012", event: "Memperoleh sertifikasi SNI pertama untuk produk PJU LED", icon: Award },
  { year: "2015", event: "Ekspansi layanan ke 15 kota di Indonesia", icon: MapPin },
  { year: "2018", event: "Sertifikasi ISO 9001:2015 dari TÜV Rheinland", icon: CheckCircle2 },
  { year: "2021", event: "Menyelesaikan 300+ proyek penerangan jalan umum", icon: TrendingUp },
  { year: "2024", event: "Registrasi e-Katalog LKPP & penetrasi 30+ kota", icon: Building2 },
];

const companyStats = [
  { value: 15, suffix: "+", label: "Tahun Pengalaman", icon: Calendar },
  { value: 4, suffix: "", label: "Sertifikasi Utama", icon: Award },
  { value: 30, suffix: "+", label: "Kota Terlayani", icon: MapPin },
  { value: 500, suffix: "+", label: "Proyek Selesai", icon: TrendingUp },
];

const visiMisiItems = [
  {
    icon: Eye, title: "Visi",
    content: "Menjadi penyedia solusi energi dan infrastruktur terdepan di Indonesia yang berkomitmen pada kualitas, keberlanjutan, dan inovasi teknologi untuk kemajuan bangsa.",
    items: null,
  },
  {
    icon: Target, title: "Misi", content: null,
    items: [
      "Menyediakan produk dan layanan berkualitas tinggi yang memenuhi standar SNI dan internasional",
      "Mengembangkan teknologi energi terbarukan yang ramah lingkungan dan berkelanjutan",
      "Membangun kemitraan jangka panjang dengan pemerintah dan sektor swasta",
      "Meningkatkan TKDN (Tingkat Komponen Dalam Negeri) dalam setiap produk",
      "Memberikan pelayanan terbaik dan solusi yang tepat bagi kebutuhan pelanggan",
      "Berkontribusi pada pembangunan infrastruktur Indonesia yang merata",
    ],
  },
];

function CompanyStatCounter({ value, suffix, icon: Icon, label }: { value: number; suffix: string; icon: typeof Calendar; label: string }) {
  const count = useCounter(value, 2500, true);
  return (
    <div className="flex flex-col items-center text-center gap-2 p-5 rounded-xl bg-white dark:bg-gray-800 border border-emerald-100 dark:border-emerald-800/50 shadow-sm hover-lift group">
      <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/50 flex items-center justify-center group-hover:bg-emerald-100 dark:group-hover:bg-emerald-800 transition-colors">
        <Icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
      </div>
      <div className="text-xl sm:text-2xl font-bold text-emerald-900 dark:text-emerald-100">{count}{suffix}</div>
      <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-tight">{label}</div>
    </div>
  );
}

function getInitials(name: string): string {
  const parts = name.replace(/^(Ir\.|Hj\.|Dr\.)\s*/, "").split(" ");
  const first = parts[0]?.charAt(0) || "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.charAt(0) || "" : "";
  return (first + last).toUpperCase();
}

export default function AboutSection() {
  return (
    <section id="tentang-kami" className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: `radial-gradient(circle, #047857 1px, transparent 1px)`, backgroundSize: '24px 24px', opacity: 0.02 }} />
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-500" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal delay={0}>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 mb-4">
              <Building2 className="w-3.5 h-3.5 mr-1.5" />Tentang Kami
            </Badge>
            <h2 className="section-heading">Mengenal DBSN Sentradaya</h2>
            <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
              Mitra terpercaya dalam solusi energi dan infrastruktur untuk Indonesia
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.05}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
            {companyStats.map((stat) => <CompanyStatCounter key={stat.label} {...stat} />)}
          </div>
        </ScrollReveal>

        <Tabs defaultValue="profil" className="w-full">
          <ScrollReveal delay={0.1}>
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-transparent p-0 h-auto border-b border-gray-200 dark:border-gray-700">
              {[{ value: "profil", label: "Profil Perusahaan" }, { value: "visi-misi", label: "Visi & Misi" }, { value: "tim", label: "Tim Manajemen" }].map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}
                  className="data-[state=active]:border-emerald-600 data-[state=active]:text-emerald-700 data-[state=active]:font-semibold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 dark:data-[state=active]:text-emerald-400 border-b-2 border-transparent min-h-[44px] rounded-none text-sm font-medium transition-all duration-200">
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <TabsContent value="profil">
              <div className="space-y-8">
                <Card className="border-emerald-100 dark:border-emerald-800/50 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden dark:bg-gray-800">
                  <div className="h-1 bg-gradient-to-r from-emerald-600 via-emerald-500 to-amber-500" />
                  <CardContent className="p-6 md:p-10">
                    <div className="grid md:grid-cols-2 gap-10">
                      <div className="space-y-5">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100">
                          <Building2 className="w-4 h-4 text-emerald-600" />
                          <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Profil Perusahaan</span>
                        </div>
                        <h3 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">PT. DBSN Sentradaya</h3>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                          DBSN Sentradaya adalah perusahaan terkemuka di Indonesia yang bergerak di bidang penyediaan solusi energi dan infrastruktur. Berdiri sejak tahun 2009, kami telah melayani berbagai instansi pemerintah, BUMN, dan perusahaan swasta di seluruh Indonesia.
                        </p>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                          Dengan komitmen terhadap kualitas dan inovasi, kami menghadirkan produk-produk unggulan seperti Penerangan Jalan Umum (PJU), Panel Surya, Penangkal Petir, dan Baterai yang telah memenuhi standar SNI, TKDN, LKPP, dan sertifikasi ISO internasional.
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { icon: Award, title: "Sertifikasi Lengkap", desc: "SNI, TKDN, LKPP, ISO" },
                          { icon: TrendingUp, title: "500+ Proyek", desc: "Di seluruh Indonesia" },
                          { icon: Lightbulb, title: "Energi Terbarukan", desc: "Solusi ramah lingkungan" },
                          { icon: Handshake, title: "Kemitraan Kuat", desc: "Pemerintah & Swasta" },
                        ].map((item) => (
                          <div key={item.title} className="p-5 rounded-xl bg-gradient-to-br from-emerald-50/80 to-white dark:from-emerald-900/30 dark:to-gray-800 border border-emerald-100 dark:border-emerald-800/50 hover:border-emerald-200 hover:shadow-md transition-all duration-300 group">
                            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-800/50 flex items-center justify-center mb-3 group-hover:bg-emerald-200 transition-colors">
                              <item.icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <h4 className="font-semibold text-emerald-900 dark:text-emerald-100 text-sm">{item.title}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <ScrollReveal delay={0.3}>
                  <div className="mt-8">
                    <h3 className="text-xl sm:text-2xl font-bold text-emerald-900 dark:text-emerald-100 mb-6 text-center">Perjalanan Kami</h3>
                    <div className="relative">
                      <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-500 via-amber-400 to-emerald-300 sm:-translate-x-px" />
                      <div className="space-y-6 sm:space-y-8">
                        {companyMilestones.map((milestone, i) => (
                          <div key={milestone.year} className={`relative flex items-start gap-4 sm:gap-0 ${i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"}`}>
                            <div className="absolute left-4 sm:left-1/2 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-gray-900 shadow-sm -translate-x-1.5 sm:-translate-x-1.5 mt-1.5 z-10" />
                            <div className={`ml-10 sm:ml-0 sm:w-[calc(50%-2rem)] ${i % 2 === 0 ? "sm:pr-8 sm:text-right" : "sm:pl-8"}`}>
                              <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 rounded-lg p-4 shadow-sm hover:shadow-md hover:border-emerald-200 hover:scale-[1.02] transition-all duration-300 border-l-2 border-l-emerald-500">
                                <div className={`flex items-center gap-2 mb-1 ${i % 2 === 0 ? "sm:justify-end" : ""}`}>
                                  <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">{milestone.year}</span>
                                  <milestone.icon className="w-3.5 h-3.5 text-amber-500" />
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{milestone.event}</p>
                              </div>
                            </div>
                            <div className="hidden sm:block sm:w-[calc(50%-2rem)]" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </TabsContent>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <TabsContent value="visi-misi">
              <Card className="border-emerald-100 dark:border-emerald-800/50 shadow-sm overflow-hidden dark:bg-gray-800">
                <div className="h-1 bg-gradient-to-r from-emerald-600 via-amber-500 to-emerald-600" />
                <CardContent className="p-6 md:p-10 space-y-8">
                  {visiMisiItems.map((item) => (
                    <div key={item.title}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center">
                          <item.icon className="w-5 h-5 text-emerald-700" />
                        </div>
                        <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-100">{item.title}</h3>
                      </div>
                      {item.content && <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed ml-[52px]">{item.content}</p>}
                      {item.items && (
                        <ul className="space-y-3 ml-[52px]">
                          {item.items.map((mission, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                              <span className="leading-relaxed">{mission}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <TabsContent value="tim">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {managementTeam.map((member) => {
                  const initials = getInitials(member.name);
                  return (
                    <Card key={member.name} className="border-emerald-100 dark:border-emerald-800/50 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group overflow-hidden dark:bg-gray-800">
                      <div className="h-0.5 bg-gradient-to-r from-emerald-500 to-amber-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                      <CardContent className="p-6 text-center">
                        <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
                          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-800" />
                          <span className="relative text-2xl font-bold text-white tracking-wide drop-shadow-sm">{initials}</span>
                        </div>
                        <h4 className="font-bold text-emerald-900 dark:text-emerald-100 text-sm leading-tight">{member.name}</h4>
                        <p className="text-amber-600 font-medium text-sm mt-1.5">{member.position}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs mt-3 leading-relaxed">{member.desc}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </ScrollReveal>
        </Tabs>
      </div>
    </section>
  );
}
