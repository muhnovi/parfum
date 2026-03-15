'use client'

import { ReviewForm } from '@/components/ReviewForm'
import { ReviewsProvider } from '@/context/ReviewsContext'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

function AddReviewContent() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Info Parfum</h1>
          <Button variant="ghost" asChild>
            <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <ReviewForm />
      </div>
    </main>
  )
}

export default function AddReviewPage() {
  return (
    <ReviewsProvider>
      <AddReviewContent />
    </ReviewsProvider>
  )
}
