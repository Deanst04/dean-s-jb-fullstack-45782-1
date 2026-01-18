import { AnimatePresence, motion } from 'framer-motion'
import { Package, Loader2, AlertCircle } from 'lucide-react'
import { ProductCard } from './ProductCard'
import type { Product } from '../types/product'

interface ProductListProps {
  products: Product[]
  loading: boolean
  error: string | null
}

export function ProductList({ products, loading, error }: ProductListProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 className="h-8 w-8 text-[hsl(var(--primary))]" />
        </motion.div>
        <p className="mt-4 text-[hsl(var(--muted-foreground))]">Loading products...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="rounded-full bg-[hsl(var(--destructive))]/10 p-3">
          <AlertCircle className="h-8 w-8 text-[hsl(var(--destructive))]" />
        </div>
        <p className="mt-4 text-[hsl(var(--destructive))] font-medium">{error}</p>
        <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
          Please check your Firebase configuration
        </p>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-16"
      >
        <div className="rounded-full bg-[hsl(var(--muted))] p-4">
          <Package className="h-10 w-10 text-[hsl(var(--muted-foreground))]" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">No products yet</h3>
        <p className="mt-1 text-[hsl(var(--muted-foreground))]">
          Add your first product using the form above
        </p>
      </motion.div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence mode="popLayout">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </AnimatePresence>
    </div>
  )
}
