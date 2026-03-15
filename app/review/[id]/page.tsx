'use client'

import { useReviews, ReviewsProvider } from '@/context/ReviewsContext'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft, Trash2, Edit2 } from 'lucide-react'
import { useParams } from 'next/navigation'

function ReviewDetailContent() {
  const params = useParams()
  const { reviews, deleteReview } = useReviews()
  const id = params?.id as string

  const review = reviews.find((r) => r.id === id)

  if (!review) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center max-w-md bg-card border border-border">
          <h1 className="text-2xl font-bold text-foreground mb-4">Review Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The review you are looking for does not exist or has been deleted.
          </p>
          <Button asChild>
            <Link href="/">Back to Reviews</Link>
          </Button>
        </Card>
      </main>
    )
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this review?')) {
      deleteReview(review.id)
      window.location.href = '/'
    }
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Parfum Reviews</h1>
          <Button variant="ghost" asChild>
            <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <Card className="overflow-hidden bg-card border border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Image */}
            <div className="flex items-center justify-center">
              <div className="w-full aspect-square rounded-lg overflow-hidden bg-muted">
                <img
                  src={review.image}
                  alt={review.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Details */}
            <div className="flex flex-col justify-center space-y-6">
              {/* Name */}
              <div>
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Perfume Name
                </p>
                <h1 className="text-4xl font-bold text-foreground">{review.name}</h1>
              </div>

              {/* Rating */}
              <div>
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Rating
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-4xl ${
                          i < Math.round(review.rating)
                            ? 'text-accent'
                            : 'text-muted'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-3xl font-bold text-foreground">
                    {review.rating.toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Date */}
              <div>
                <p className="text-sm text-muted-foreground">
                  {new Date(review.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  asChild
                  className="flex-1 border-border hover:bg-muted"
                >
                  <Link href="/" className="flex items-center justify-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Reviews
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDelete}
                  className="text-destructive border-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="border-t border-border p-8">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
              Review Description
            </p>
            <p className="text-lg text-foreground leading-relaxed whitespace-pre-wrap">
              {review.description}
            </p>
          </div>
        </Card>
      </div>
    </main>
  )
}

export default function ReviewDetailPage() {
  return (
    <ReviewsProvider>
      <ReviewDetailContent />
    </ReviewsProvider>
  )
}
