import { articles, getArticleBySlug } from '@/lib/api/articles'
import { Calendar, Clock, User, ArrowLeft, Heart } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) return {}
  return {
    title: `${article.title} - DBSN Sentradaya`,
    description: article.excerpt,
  }
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = getArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="container mx-auto px-4 pt-24 pb-16 max-w-3xl">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/articles"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Artikel
          </Link>
        </div>

        {/* Article Container */}
        <article className="bg-white rounded-3xl border border-emerald-100/50 shadow-sm overflow-hidden p-6 md:p-10 space-y-8">
          
          {/* Header */}
          <div className="space-y-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              {article.category}
            </span>
            
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight">
              {article.title}
            </h1>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-500 pt-2 border-y border-gray-100 py-3">
              {article.author && (
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-600" /> {article.author}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" /> {
                  new Date(article.publishedAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })
                }
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-600" /> {article.readingTime} menit baca
              </span>
            </div>
          </div>

          {/* Featured visual style card */}
          <div className="aspect-[21/9] w-full bg-gradient-to-br from-emerald-100 via-emerald-50 to-amber-50 rounded-2xl flex items-center justify-center border border-emerald-100/30">
            <NewspaperIcon className="w-16 h-16 text-emerald-200" />
          </div>

          {/* HTML Rendered Content */}
          <div 
            className="prose prose-emerald max-w-none text-slate-700 leading-relaxed space-y-4 
              [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-slate-950 [&>h3]:mt-6 [&>h3]:mb-3
              [&>p]:text-base [&>p]:mb-4
              [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1.5
              [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:space-y-1.5"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

        </article>
      </main>
    </div>
  )
}

function NewspaperIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      strokeWidth={1.5} 
      stroke="currentColor"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" 
      />
    </svg>
  )
}
