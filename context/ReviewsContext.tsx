'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { database } from '@/lib/firebase'
import { ref, onValue, push, remove, update, off } from 'firebase/database'

export type FragranceType = 'pagi' | 'malam' | 'versatile'

export interface Review {
  id: string
  name: string
  description: string
  image: string
  rating: number
  price: number
  fragranceType: FragranceType
  username: string
  createdAt: string // string agar kompatibel dengan Firebase JSON
}

interface ReviewsContextType {
  reviews: Review[]
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => Promise<void>
  deleteReview: (id: string) => Promise<void>
  updateReview: (id: string, review: Omit<Review, 'id' | 'createdAt'>) => Promise<void>
  isLoading: boolean
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined)

// Data fallback (hanya tampil kalau Firebase tidak terkonfigurasi)
const FALLBACK_REVIEWS: Review[] = [
  {
    id: '1',
    name: 'Dior Sauvage',
    description: 'A fresh and spicy fragrance with ambroxan. Perfect for everyday wear with a lasting projection.',
    image: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22300%22%3E%3Crect fill=%22%23f0e6d2%22 width=%22200%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2224%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22 fill=%22%23333%22%3EDior Sauvage%3C/text%3E%3C/svg%3E',
    rating: 4.8,
    price: 1500000,
    fragranceType: 'versatile',
    username: 'fragrance_lover',
    createdAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: '2',
    name: 'Creed Aventus',
    description: 'Luxurious and powerful. A masterpiece with pineapple and birch notes. Excellent longevity.',
    image: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22300%22%3E%3Crect fill=%22%23d4a574%22 width=%22200%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2224%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22 fill=%22%23fff%22%3ECreed Aventus%3C/text%3E%3C/svg%3E',
    rating: 5.0,
    price: 4500000,
    fragranceType: 'pagi',
    username: 'perfume_connoisseur',
    createdAt: new Date('2024-02-20').toISOString(),
  },
]

export function ReviewsProvider({ children }: { children: React.ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // ─── Subscribe ke Firebase realtime ───────────────────────────────────────
  useEffect(() => {
    if (!database) {
      // Firebase tidak dikonfigurasi → pakai data fallback
      setReviews(FALLBACK_REVIEWS)
      setIsLoading(false)
      return
    }

    const reviewsRef = ref(database, 'reviews')

    const unsubscribe = onValue(
      reviewsRef,
      (snapshot) => {
        const data = snapshot.val()
        if (data) {
          // Firebase menyimpan sebagai object { firebaseKey: reviewObj }
          // Kita ubah jadi array dan urutkan terbaru di atas
          const list: Review[] = Object.entries(data).map(([key, val]) => ({
            ...(val as Omit<Review, 'id'>),
            id: key,
          }))
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          setReviews(list)
        } else {
          setReviews([])
        }
        setIsLoading(false)
      },
      (error) => {
        console.error('Firebase read error:', error)
        setReviews(FALLBACK_REVIEWS)
        setIsLoading(false)
      }
    )

    return () => off(reviewsRef, 'value', unsubscribe)
  }, [])

  // ─── Add ──────────────────────────────────────────────────────────────────
  const addReview = useCallback(async (review: Omit<Review, 'id' | 'createdAt'>) => {
    const newReview = {
      ...review,
      createdAt: new Date().toISOString(),
    }

    if (!database) {
      // Fallback: simpan di state lokal saja
      setReviews((prev) => [{ ...newReview, id: Date.now().toString() }, ...prev])
      return
    }

    const reviewsRef = ref(database, 'reviews')
    await push(reviewsRef, newReview)
    // onValue listener otomatis akan update state
  }, [])

  // ─── Delete ───────────────────────────────────────────────────────────────
  const deleteReview = useCallback(async (id: string) => {
    if (!database) {
      setReviews((prev) => prev.filter((r) => r.id !== id))
      return
    }

    const reviewRef = ref(database, `reviews/${id}`)
    await remove(reviewRef)
  }, [])

  // ─── Update ───────────────────────────────────────────────────────────────
  const updateReview = useCallback(async (id: string, review: Omit<Review, 'id' | 'createdAt'>) => {
    if (!database) {
      setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, ...review } : r)))
      return
    }

    const reviewRef = ref(database, `reviews/${id}`)
    await update(reviewRef, review)
  }, [])

  return (
    <ReviewsContext.Provider value={{ reviews, addReview, deleteReview, updateReview, isLoading }}>
      {children}
    </ReviewsContext.Provider>
  )
}

export function useReviews() {
  const context = useContext(ReviewsContext)
  if (!context) {
    throw new Error('useReviews must be used within ReviewsProvider')
  }
  return context
}