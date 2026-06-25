"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";

interface Testimonial {
  id: number;
  quote: string;
  name: string;
  position: string;
  organization: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  { id: 1, quote: "DBSN Sentradaya berhasil menyelesaikan proyek pemasangan PJU LED di 12 ruas jalan utama Kota Surabaya tepat waktu dan sesuai spesifikasi. Kualitas produk dan layanan after-sales mereka sangat memuaskan.", name: "Ir. Bambang Susanto, M.T.", position: "Kepala Dinas PU", organization: "Pemerintah Kota Surabaya", rating: 5 },
  { id: 2, quote: "Instalasi panel surya rooftop di kantor pusat kami berjalan dengan sangat profesional. DBSN Sentradaya menunjukkan keahlian tinggi dalam perencanaan dan eksekusi proyek energi terbarukan.", name: "Dewi Pratiwi, S.T., MBA", position: "Direktur Operasional", organization: "PT PLN (Persero)", rating: 5 },
  { id: 3, quote: "Sistem penangkal petir yang dipasang di gedung kantor kami memenuhi standar SNI dan IEC sepenuhnya. Tim teknis DBSN sangat kompeten dan responsif dalam setiap tahap pekerjaan.", name: "Hendro Wibowo, S.E.", position: "Manager EPC", organization: "PT Wijaya Karya (Persero) Tbk", rating: 5 },
  { id: 4, quote: "Solusi baterai penyimpanan energi dari DBSN Sentradaya mendukung program Bali Mandiri Energi secara signifikan. Kualitas produk LiFePO4 mereka terbukti andal dalam kondisi iklim tropis.", name: "Dr. Made Sudiarta, M.Si.", position: "Kepala Bappeda", organization: "Provinsi Jawa Timur", rating: 5 },
  { id: 5, quote: "Sistem PJU smart city dengan IoT yang diimplementasikan DBSN Sentradaya di Makassar meningkatkan efisiensi energi hingga 50%. Monitoring real-time sangat membantu pengelolaan infrastruktur.", name: "Ratna Megawati, S.Kom.", position: "Procurement Head", organization: "Telkom Indonesia", rating: 5 },
  { id: 6, quote: "Kami mempercayakan kebutuhan solusi energi dan proteksi petir proyek-proyek kami kepada DBSN Sentradaya karena konsistensi kualitas dan profesionalisme kerja yang tinggi.", name: "Agus Purnomo, Ir.", position: "Direktur", organization: "PT Adhi Karya (Persero) Tbk", rating: 5 },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`} />
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <Card className="border-emerald-100 dark:border-emerald-800/50 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/40 flex items-center justify-center mb-4">
          <Quote className="w-5 h-5 text-emerald-600" />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex-1 mb-4">
          &ldquo;{testimonial.quote}&rdquo;
        </p>
        <div className="h-px bg-emerald-100 dark:bg-emerald-800/50 mb-4" />
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-sm text-emerald-900 dark:text-emerald-100">{testimonial.name}</p>
            <StarRating rating={testimonial.rating} />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{testimonial.position}</p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{testimonial.organization}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (!isMobile) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section id="testimonial" className="py-12 sm:py-16 lg:py-20 bg-emerald-50/50 dark:bg-emerald-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal delay={0}>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 mb-4">
              <Quote className="w-3.5 h-3.5 mr-1.5" />Testimoni
            </Badge>
            <h2 className="section-heading">Dipercaya oleh Berbagai Instansi</h2>
            <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
              Apa kata mitra dan klien kami tentang pengalaman bekerja sama dengan DBSN Sentradaya
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.05}>
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-4 shadow-sm max-w-md mx-auto mb-10">
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-1">
                <span className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">4.9</span>
                <span className="text-sm text-gray-400">/5</span>
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <div className="h-6 w-px bg-gray-200 dark:bg-gray-600" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Dari 50+ pelanggan</span>
            </div>
          </div>
        </ScrollReveal>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {testimonials.map((testimonial, index) => (
            <ScrollReveal key={testimonial.id} delay={index * 0.1}>
              <TestimonialCard testimonial={testimonial} />
            </ScrollReveal>
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden">
          <div className="relative">
            <TestimonialCard testimonial={testimonials[currentIndex]!} />
          </div>
          <div className="flex items-center justify-center gap-4 mt-6">
            <Button
              variant="outline"
              size="icon"
              className="w-11 h-11 rounded-full border-emerald-200 text-emerald-700 hover:bg-emerald-100 min-w-[44px] min-h-[44px]"
              onClick={prev}
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className="group min-w-6 min-h-6 flex items-center justify-center cursor-pointer"
                  aria-label={`Go to testimonial ${i + 1}`}
                  aria-current={i === currentIndex ? "true" : "false"}
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      i === currentIndex ? "bg-emerald-600 w-6" : "bg-emerald-200 group-hover:bg-emerald-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="w-11 h-11 rounded-full border-emerald-200 text-emerald-700 hover:bg-emerald-100 min-w-[44px] min-h-[44px]"
              onClick={next}
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-center text-xs text-gray-400 mt-3">{currentIndex + 1} / {testimonials.length}</p>
        </div>
      </div>
    </section>
  );
}
