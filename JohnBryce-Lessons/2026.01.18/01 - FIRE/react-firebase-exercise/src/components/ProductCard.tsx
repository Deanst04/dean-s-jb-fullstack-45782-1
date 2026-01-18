import { motion } from 'framer-motion'
import { DollarSign, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import type { Product } from '../types/product'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(product.price)

  const formattedDate = product.createdAt
    ? new Date(product.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : ''

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <Card className="h-full transition-shadow duration-300 hover:shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-[hsl(var(--muted-foreground))] line-clamp-2 min-h-[2.5rem]">
            {product.description}
          </p>
          <div className="flex items-center justify-between pt-2 border-t border-[hsl(var(--border))]">
            <div className="flex items-center gap-1.5 text-[hsl(var(--primary))] font-semibold">
              <DollarSign className="h-4 w-4" />
              <span>{formattedPrice}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))]">
              <Clock className="h-3 w-3" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
