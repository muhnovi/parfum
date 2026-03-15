'use client'

import { useState } from 'react'
import { useReviews, FragranceType } from '@/context/ReviewsContext'
import { ReviewCard } from './ReviewCard'
import { PriceFilter } from './PriceFilter'
import { Empty } from '@/components/ui/empty'
import { Input } from '@/components/ui/input'
import { Search, X, SlidersHorizontal, ChevronDown } from 'lucide-react'

export function ReviewsGrid() {
  const { reviews, isLoading, firebaseError } = useReviews()
  const [selectedType, setSelectedType] = useState<FragranceType | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(Infinity)
  // Mobile: toggle price filter panel
  const [showPriceFilter, setShowPriceFilter] = useState(false)

  const filteredReviews = reviews
    .filter(review => selectedType === 'all' ? true : review.fragranceType === selectedType)
    .filter(review =>
      searchQuery.trim() === ''
        ? true
        : review.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          review.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          review.username.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(review => review.price >= minPrice && review.price <= maxPrice)

  const filterOptions = [
    { value: 'all' as const, label: 'Semua', emoji: '🌸' },
    { value: 'pagi' as FragranceType, label: 'Siang', emoji: '☀️' },
    { value: 'malam' as FragranceType, label: 'Malam', emoji: '🌙' },
    { value: 'versatile' as FragranceType, label: 'Versatile', emoji: '✨' },
  ]

  const isPriceActive = minPrice > 0 || maxPrice < Infinity

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm">Memuat review...</p>
        </div>
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <Empty
        icon="🌸"
        title="No reviews yet"
        description="Start by adding your first perfume review to share your fragrance experience with others."
      />
    )
  }

  return (
    <div className="w-full space-y-4">
      {/* Firebase Error Banner */}
      {firebaseError && (
        <div className="p-3 bg-amber-50 border border-amber-300 rounded-lg dark:bg-amber-900/20 dark:border-amber-700">
          <p className="text-sm font-semibold text-amber-800 dark:text-amber-400 mb-1">
            ⚠️ Firebase tidak dapat diakses — menampilkan data sementara
          </p>
          <p className="text-xs text-amber-700 dark:text-amber-500 whitespace-pre-line">
            {firebaseError}
          </p>
        </div>
      )}

      {/* Search + Filter Toggle Row */}
      <div className="flex gap-2">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder="Cari parfum..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-9 h-10 text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Mobile: Price Filter Toggle Button */}
        <button
          onClick={() => setShowPriceFilter(!showPriceFilter)}
          className={`lg:hidden flex items-center gap-1.5 px-3 h-10 rounded-md border text-sm font-medium transition-colors shrink-0 ${
            isPriceActive
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-background text-muted-foreground border-border hover:bg-muted'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Harga</span>
          {isPriceActive && <span className="w-2 h-2 rounded-full bg-primary-foreground/80" />}
          <ChevronDown className={`w-3 h-3 transition-transform ${showPriceFilter ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Mobile: Collapsible Price Filter */}
      {showPriceFilter && (
        <div className="lg:hidden">
          <PriceFilter
            minPrice={minPrice}
            maxPrice={maxPrice}
            onMinChange={setMinPrice}
            onMaxChange={setMaxPrice}
            onClear={() => { setMinPrice(0); setMaxPrice(Infinity) }}
          />
        </div>
      )}

      {/* Type Filter Pills — horizontally scrollable on mobile */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-1 border-b border-border scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setSelectedType(option.value)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
              selectedType === option.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <span>{option.emoji}</span>
            <span>{option.label}</span>
            {option.value !== 'all' && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                selectedType === option.value
                  ? 'bg-primary-foreground/20 text-primary-foreground'
                  : 'bg-background/50'
              }`}>
                {reviews.filter(r => r.fragranceType === option.value).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Main layout: sidebar (desktop) + grid */}
      <div className="flex gap-6 items-start">
        {/* Desktop Price Filter Sidebar */}
        <div className="hidden lg:block w-56 shrink-0">
          <PriceFilter
            minPrice={minPrice}
            maxPrice={maxPrice}
            onMinChange={setMinPrice}
            onMaxChange={setMaxPrice}
            onClear={() => { setMinPrice(0); setMaxPrice(Infinity) }}
          />
        </div>

        {/* Reviews Grid */}
        <div className="flex-1 min-w-0">
          {filteredReviews.length === 0 ? (
            <Empty
              icon="🔍"
              title="Tidak ditemukan"
              description={
                searchQuery
                  ? `Tidak ada parfum yang cocok dengan "${searchQuery}".`
                  : `Belum ada review untuk kategori ini.`
              }
            />
          ) : (
            <>
              <p className="text-xs text-muted-foreground mb-3">
                {filteredReviews.length} parfum ditemukan
              </p>
              {/* 1 col on mobile, 2 col on sm+, 3 col on xl */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}