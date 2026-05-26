"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import { Calendar, Clock, ArrowRight, Newspaper, User, Share2, CheckCircle2, Heart } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { articles, type Article } from "@/lib/api/articles";

const categoryColors: Record<string, string> = {
  "Energi Terbarukan": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400",
  Regulasi: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400",
  Industri: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-400",
  Teknik: "bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-400",
  Teknologi: "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-400",
};

const categoryFilters = [
  { key: "all", label: "Semua" },
  { key: "Energi Terbarukan", label: "Energi Terbarukan" },
  { key: "Regulasi", label: "Regulasi" },
  { key: "Industri", label: "Industri" },
  { key: "Teknik", label: "Teknik" },
  { key: "Teknologi", label: "Teknologi" },
];

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

const STORAGE_KEY = "dbsn-saved-articles";

function getInitialSavedIds(): Set<string> {
  if (typeof window === "undefined") return new Set<string>();
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return new Set(JSON.parse(stored) as string[]);
  } catch { /* ignore */ }
  return new Set<string>();
}

function useSavedArticles() {
  const [savedIds, setSavedIds] = useState<Set<string>>(getInitialSavedIds);
  const toggleSave = useCallback((articleId: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(articleId)) { next.delete(articleId); } else { next.add(articleId); }
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...next])); } catch { /* ignore */ }
      return next;
    });
  }, []);
  const isSaved = useCallback((articleId: string) => savedIds.has(articleId), [savedIds]);
  return { savedCount: savedIds.size, toggleSave, isSaved };
}

export default function ArticlesSection() {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [copied, setCopied] = useState(false);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const { savedCount, toggleSave, isSaved } = useSavedArticles();

  const filtered = useMemo(() => {
    let result = activeCategory === "all" ? articles : articles.filter((a) => a.category === activeCategory);
    if (showSavedOnly) result = result.filter((a) => isSaved(a.id));
    return result;
  }, [activeCategory, showSavedOnly, isSaved]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href + "#artikel");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  return (
    <section id="artikel" className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal delay={0}>
          <div className="text-center max-w-3xl mx-auto mb-8">
            <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 mb-4">
              <Newspaper className="w-3.5 h-3.5 mr-1.5" />Artikel &amp; Berita
            </Badge>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <h2 className="section-heading mb-0">Artikel &amp; Berita Terbaru</h2>
              {savedCount > 0 && (
                <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400 font-medium gap-1">
                  <Heart className="w-3 h-3" />Tersimpan: {savedCount}
                </Badge>
              )}
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg max-w-2xl mx-auto mt-2">
              Informasi dan wawasan terkini seputar energi terbarukan, infrastruktur, dan pengadaan barang
            </p>
          </div>
        </ScrollReveal>

        {/* Saved toggle */}
        {savedCount > 0 && (
          <ScrollReveal delay={0.03}>
            <div className="flex justify-center mb-4">
              <div className="inline-flex items-center rounded-lg border border-emerald-200 dark:border-emerald-800/50 bg-gray-50 dark:bg-gray-800 p-1">
                <button onClick={() => setShowSavedOnly(false)} className={`px-4 py-2 text-sm font-medium rounded-md transition-all min-h-[40px] ${!showSavedOnly ? "bg-white dark:bg-gray-700 text-emerald-700 dark:text-emerald-400 shadow-sm" : "text-gray-500 hover:text-gray-700 dark:text-gray-400"}`}>Semua</button>
                <button onClick={() => setShowSavedOnly(true)} className={`px-4 py-2 text-sm font-medium rounded-md transition-all min-h-[40px] flex items-center gap-1.5 ${showSavedOnly ? "bg-white dark:bg-gray-700 text-emerald-700 dark:text-emerald-400 shadow-sm" : "text-gray-500 hover:text-gray-700 dark:text-gray-400"}`}>
                  <Heart className={`w-3.5 h-3.5 ${showSavedOnly ? "fill-emerald-500 text-emerald-500" : ""}`} />Tersimpan ({savedCount})
                </button>
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Category filter */}
        <ScrollReveal delay={0.05}>
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categoryFilters.map((f) => (
              <Button key={f.key} variant={activeCategory === f.key ? "default" : "outline"} onClick={() => setActiveCategory(f.key)} size="sm"
                className={activeCategory === f.key ? "bg-emerald-700 hover:bg-emerald-800 text-white min-h-[44px] px-4 text-xs" : "border-emerald-200 text-emerald-700 hover:bg-emerald-50 min-h-[44px] px-4 text-xs"}>
                {f.label}
              </Button>
            ))}
          </div>
        </ScrollReveal>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filtered.map((article, index) => {
            const saved = isSaved(article.id);
            return (
              <ScrollReveal key={article.id} delay={index * 0.1}>
                <Card className={`relative border transition-all duration-300 group overflow-hidden cursor-pointer h-full dark:bg-gray-800 ${saved ? "border-emerald-400 dark:border-emerald-500 shadow-md" : "border-emerald-100 dark:border-emerald-800/50 shadow-sm hover:shadow-md"}`}
                  onClick={() => setSelectedArticle(article)}>
                  <button onClick={(e) => { e.stopPropagation(); toggleSave(article.id); }}
                    className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-sm border border-gray-200 dark:border-gray-600 transition-all hover:scale-110"
                    aria-label={saved ? "Hapus dari tersimpan" : "Simpan artikel"}>
                    <Heart className={`w-4 h-4 transition-colors ${saved ? "fill-emerald-500 text-emerald-500" : "text-gray-400 hover:text-emerald-500"}`} />
                  </button>
                  <div className="aspect-video bg-gradient-to-br from-emerald-100 via-emerald-50 to-amber-50 dark:from-emerald-900/30 dark:via-emerald-900/20 dark:to-amber-900/20 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Newspaper className="w-10 h-10 text-emerald-300 dark:text-emerald-600" />
                    </div>
                    <Badge className={`absolute top-3 left-3 ${categoryColors[article.category] || "bg-gray-100 text-gray-700"}`}>{article.category}</Badge>
                    <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-2.5 py-1 shadow-sm">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{article.readingTime} menit</span>
                    </div>
                  </div>
                  <CardContent className="p-5 space-y-3">
                    <h4 className="font-semibold text-emerald-900 dark:text-emerald-100 text-sm leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors min-h-[40px]">{article.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">{article.excerpt}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-emerald-50 dark:border-emerald-900/50">
                      <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(article.publishedAt)}</span>
                      </div>
                      <Button variant="ghost" size="sm" className="text-emerald-700 hover:bg-emerald-50 text-xs gap-1 min-h-[44px] px-2">
                        Baca<ArrowRight className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">{showSavedOnly ? "Belum ada artikel tersimpan." : "Belum ada artikel untuk kategori ini."}</p>
            <Button variant="outline" className="mt-4 border-emerald-200 text-emerald-700 hover:bg-emerald-50" onClick={() => { setShowSavedOnly(false); setActiveCategory("all"); }}>Tampilkan Semua</Button>
          </div>
        )}
      </div>

      {/* Article Detail Dialog */}
      <Dialog open={!!selectedArticle} onOpenChange={() => setSelectedArticle(null)}>
        {selectedArticle && (
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <Badge className={`w-fit ${categoryColors[selectedArticle.category] || "bg-gray-100 text-gray-700"} mb-2`}>{selectedArticle.category}</Badge>
              <DialogTitle className="text-emerald-900 dark:text-emerald-100 text-xl leading-snug">{selectedArticle.title}</DialogTitle>
              <DialogDescription className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-2">
                {selectedArticle.author && <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{selectedArticle.author}</span>}
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{formatDate(selectedArticle.publishedAt)}</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{selectedArticle.readingTime} menit baca</span>
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-5 mt-4">
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{selectedArticle.excerpt}</p>
              <div className="flex items-center gap-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" className={`gap-2 min-h-[44px] border-emerald-200 ${isSaved(selectedArticle.id) ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400"}`} onClick={() => toggleSave(selectedArticle.id)}>
                        <Heart className={`w-4 h-4 ${isSaved(selectedArticle.id) ? "fill-emerald-500" : ""}`} />{isSaved(selectedArticle.id) ? "Tersimpan" : "Simpan"}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="bg-gray-900 text-white"><p>{isSaved(selectedArticle.id) ? "Hapus dari artikel tersimpan" : "Simpan artikel ini"}</p></TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2 min-h-[44px] border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400" onClick={handleShare}>
                        {copied ? <><CheckCircle2 className="w-4 h-4 text-emerald-600" />Tautan Disalin!</> : <><Share2 className="w-4 h-4" />Bagikan</>}
                      </Button>
                    </TooltipTrigger>
                    {!copied && <TooltipContent side="top" className="bg-gray-900 text-white"><p>Salin tautan artikel</p></TooltipContent>}
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Link href={`/articles/${selectedArticle.slug}`} onClick={() => setSelectedArticle(null)} className="block w-full">
                <Button className="w-full bg-emerald-700 hover:bg-emerald-800 text-white min-h-[48px] gap-2">
                  Baca Selengkapnya<ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </section>
  );
}
