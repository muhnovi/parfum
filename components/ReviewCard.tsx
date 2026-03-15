'use client'

import { Review, useReviews } from '@/context/ReviewsContext'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { Trash2, ChevronRight } from 'lucide-react'

interface ReviewCardProps {
  review: Review
}

export function ReviewCard({ review }: ReviewCardProps) {
  const { deleteReview } = useReviews()

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (confirm('Yakin ingin menghapus review ini?')) {
      deleteReview(review.id)
    }
  }

  const badgeConfig = {
    pagi: { label: '☀️ Parfum Siang', className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' },
    malam: { label: '🌙 Parfum Malam', className: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300' },
    versatile: { label: '✨ Versatile', className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' },
  }

  const badge = badgeConfig[review.fragranceType]

  return (
    <Link href={`/review/${review.id}`} className="block h-full">
      <Card className="overflow-hidden hover:shadow-md active:scale-[0.99] transition-all duration-200 cursor-pointer h-full flex flex-col bg-card border border-border group">

        {/* Image — shorter on mobile (aspect-[4/3]), square on sm+ */}
        <div className="relative w-full aspect-[4/3] sm:aspect-square overflow-hidden bg-muted shrink-0">
          <img
            src={review.image}
            alt={review.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Badge overlaid on image for cleaner mobile look */}
          <div className="absolute top-2 left-2">
            <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full backdrop-blur-sm ${badge.className}`}>
              {badge.label}
            </span>
          </div>
          {/* Delete button overlaid top-right */}
          <button
            onClick={handleDelete}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 backdrop-blur-sm text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors opacity-0 group-hover:opacity-100 sm:opacity-100"
            aria-label="Hapus review"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-3 sm:p-4 flex flex-col gap-2 min-w-0">

          {/* Name + Rating row */}
          <div>
            <h3 className="text-sm sm:text-base font-bold text-foreground line-clamp-2 leading-tight mb-1">
              {review.name}
            </h3>
            <div className="flex items-center gap-1.5">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-sm ${
                      i < Math.round(review.rating) ? 'text-amber-400' : 'text-muted-foreground/30'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-xs font-semibold text-foreground">
                {review.rating.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 flex-1">
            {review.description}
          </p>

          {/* Price + meta row */}
          <div className="flex items-center justify-between gap-2 mt-auto pt-2 border-t border-border">
            <span className="text-sm font-bold text-foreground">
              Rp {review.price.toLocaleString('id-ID')}
            </span>
            <span className="text-xs text-muted-foreground truncate max-w-[120px] text-right">
              @{review.username}
            </span>
          </div>

          {/* View button — full width, compact */}
          <div className="flex items-center justify-center gap-1 w-full py-2 rounded-md border border-border text-xs font-medium text-foreground hover:bg-muted transition-colors mt-1">
            Lihat Detail <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </Card>
    </Link>
  )
}