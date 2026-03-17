'use client'

import { useState } from 'react'
import { useReviews, FragranceType } from '@/context/ReviewsContext'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { uploadImageToBlob, generateBlobFileName } from '@/lib/blob'
import { CheckCircle2, XCircle, X } from 'lucide-react'

interface ReviewFormProps {
  onSuccess?: () => void
  isModal?: boolean
}

type ToastType = 'success' | 'error' | null

interface Toast {
  type: ToastType
  message: string
}

export function ReviewForm({ onSuccess, isModal = false }: ReviewFormProps) {
  const { addReview } = useReviews()
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [rating, setRating] = useState(4)
  const [price, setPrice] = useState(100000)
  const [image, setImage] = useState<string>('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [fragranceType, setFragranceType] = useState<FragranceType>('versatile')
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState<Toast | null>(null)

  const showToast = (type: Exclude<ToastType, null>, message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 4000)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        showToast('error', 'Ukuran gambar terlalu besar. Maksimal 4MB.')
        return
      }
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setImage(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !name.trim() || !description.trim() || !image) {
      showToast('error', 'Mohon isi semua field dan pilih gambar.')
      return
    }

    setIsLoading(true)
    try {
      let imageUrl = image

      if (imageFile) {
        const blobFileName = generateBlobFileName(imageFile.name)
        const renamedFile = new File([imageFile], blobFileName, { type: imageFile.type })
        const blobUrl = await uploadImageToBlob(renamedFile)
        if (blobUrl) {
          imageUrl = blobUrl
        }
        // Jika blob gagal, tetap lanjut dengan preview lokal — tidak perlu peringatan
      }

      await addReview({
        username: username.trim(),
        name: name.trim(),
        description: description.trim(),
        rating: parseFloat(rating.toString()),
        price: parseFloat(price.toString()),
        image: imageUrl,
        fragranceType,
      })

      // Reset form
      setUsername('')
      setName('')
      setDescription('')
      setRating(4)
      setPrice(100000)
      setImage('')
      setImageFile(null)
      setFragranceType('versatile')

      showToast('success', `berhasil dipublish`)
      onSuccess?.() 
    } catch (error) {
      console.error('Submit error:', error)
      showToast('error', 'Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border max-w-sm w-[calc(100%-2rem)] transition-all animate-in fade-in slide-in-from-top-2 duration-300 ${
            toast.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-700 dark:text-emerald-300'
              : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300'
          }`}
        >
          {toast.type === 'success'
            ? <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
            : <XCircle className="w-5 h-5 shrink-0 text-red-500" />
          }
          <p className="text-sm font-medium flex-1">{toast.message}</p>
          <button onClick={() => setToast(null)} className="shrink-0 opacity-60 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <Card className="w-full max-w-2xl mx-auto p-4 sm:p-6 bg-card border border-border">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-5 sm:mb-6">
          Tambah Review
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Username */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-foreground">Username</label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              className="h-11 text-base sm:text-sm"
              required
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-foreground">
              Foto Parfum
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="image-input"
            />
            <label
              htmlFor="image-input"
              className="flex items-center justify-center w-full h-36 sm:h-44 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-muted/50 active:bg-muted transition-colors overflow-hidden"
            >
              {image ? (
                <img src={image} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center px-4">
                  <p className="text-2xl mb-2">📷</p>
                  <p className="text-sm text-muted-foreground">Tap untuk upload foto</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG — maks. 4MB</p>
                </div>
              )}
            </label>
          </div>

          {/* Fragrance Type */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-foreground">Tipe Wewangian</label>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { value: 'pagi' as FragranceType, label: 'Parfum Siang', emoji: '☀️' },
                { value: 'malam' as FragranceType, label: 'Parfum Malam', emoji: '🌙' },
                { value: 'versatile' as FragranceType, label: 'Versatile', emoji: '✨' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFragranceType(option.value)}
                  className={`p-2.5 sm:p-3 rounded-xl border-2 transition-all active:scale-95 ${
                    fragranceType === option.value
                      ? 'border-primary bg-primary/10 text-foreground'
                      : 'border-border bg-background text-muted-foreground hover:border-primary/50'
                  }`}
                >
                  <div className="text-xl sm:text-2xl mb-0.5">{option.emoji}</div>
                  <div className="text-xs font-medium leading-tight">{option.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-foreground">Nama Parfum</label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="parfum"
              className="h-11 text-base sm:text-sm"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-foreground">Deskripsi</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ceritakan pendapatmu tentang parfum ini..."
              className="w-full px-3 py-2.5 border border-input rounded-lg bg-background text-foreground text-base sm:text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
              rows={4}
              required
            />
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-foreground">Rating</label>
              <span className="text-sm font-bold text-primary">{rating.toFixed(1)} / 5.0</span>
            </div>
            <div className="flex gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`text-2xl ${i < Math.round(rating) ? 'text-amber-400' : 'text-muted-foreground/20'}`}>
                  ★
                </span>
              ))}
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={rating}
              onChange={(e) => setRating(parseFloat(e.target.value))}
              className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0</span>
              <span>2.5</span>
              <span>5</span>
            </div>
          </div>

          {/* Price */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-foreground">Harga (IDR)</label>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
              placeholder="contoh: 150000"
              className="h-11 text-base sm:text-sm"
              min="0"
              step="1000"
              required
            />
            {price > 0 && (
              <p className="text-xs text-muted-foreground">
                Rp {price.toLocaleString('id-ID')}
              </p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 text-base font-semibold bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 rounded-xl"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Mempublish...
              </span>
            ) : (
              'Publish Review'
            )}
          </Button>
        </form>
      </Card>
    </>
  )
}