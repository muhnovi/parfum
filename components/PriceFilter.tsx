'use client'

import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { X } from 'lucide-react'

interface PriceFilterProps {
  minPrice: number
  maxPrice: number
  onMinChange: (value: number) => void
  onMaxChange: (value: number) => void
  onClear: () => void
}

export function PriceFilter({
  minPrice,
  maxPrice,
  onMinChange,
  onMaxChange,
  onClear,
}: PriceFilterProps) {
  const isActive = minPrice > 0 || maxPrice < Infinity

  const handleMinChange = (value: string) => {
    onMinChange(value === '' ? 0 : parseFloat(value))
  }

  const handleMaxChange = (value: string) => {
    onMaxChange(value === '' ? Infinity : parseFloat(value))
  }

  // Hanya untuk display label di bawah, bukan untuk value input
  const displayPrice = (price: number) => {
    if (price === Infinity || price === 0) return null
    return price.toLocaleString('id-ID')
  }

  return (
    <Card className="p-3 sm:p-4 bg-card border border-border">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">Filter Harga</h3>
        {isActive && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Reset
          </button>
        )}
      </div>

      {/* On mobile: side-by-side inputs. On desktop: stacked */}
      <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Min (IDR)</label>
          <Input
            type="number"
            value={minPrice === 0 ? '' : minPrice}
            onChange={(e) => handleMinChange(e.target.value)}
            placeholder="0"
            className="h-9 text-sm"
            min="0"
            step="10000"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Max (IDR)</label>
          <Input
            type="number"
            value={maxPrice === Infinity ? '' : maxPrice}
            onChange={(e) => handleMaxChange(e.target.value)}
            placeholder="Tanpa batas"
            className="h-9 text-sm"
            min="0"
            step="10000"
          />
        </div>
      </div>

      {isActive && (
        <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border">
          Rp {displayPrice(minPrice) ?? '0'} — {maxPrice === Infinity ? '∞' : `Rp ${displayPrice(maxPrice)}`}
        </p>
      )}
    </Card>
  )
}