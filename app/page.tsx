'use client'

import { ReviewsProvider } from '@/context/ReviewsContext'
import { ReviewsGrid } from '@/components/ReviewsGrid'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'

function HomeContent() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
                Info Parfum
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Temukan dan bagikan ulasan autentik tentang parfum terbaik. Unggah foto, tulis deskripsi rinci, dan beri peringkat parfum favorit Anda.
              </p>
            </div>
            <Button
              asChild
              className="bg-primary text-primary-foreground hover:opacity-90 whitespace-nowrap"
            >
              <Link href="/add" className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add Review
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Reviews Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <ReviewsGrid />
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-12 md:mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>Info Parfum - Temukan dan Bagikan Ulasan Parfum Terbaik</p>
          <p className="text-sm mt-2">© {new Date().getFullYear()} Info Parfum. All rights reserved. Powered by Muhfi</p>
        </div>
      </footer>
    </main>
  )
}

export default function Home() {
  return (
    <ReviewsProvider>
      <HomeContent />
    </ReviewsProvider>
  )
}
