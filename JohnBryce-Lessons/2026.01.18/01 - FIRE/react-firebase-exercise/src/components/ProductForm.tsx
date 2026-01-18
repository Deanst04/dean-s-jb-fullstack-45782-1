import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Loader2 } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import type { ProductFormData, ProductFormErrors } from '../types/product'

interface ProductFormProps {
  onSubmit: (data: ProductFormData) => Promise<void>
}

const initialFormData: ProductFormData = {
  name: '',
  price: '',
  description: '',
}

function validateForm(data: ProductFormData): ProductFormErrors {
  const errors: ProductFormErrors = {}

  if (!data.name.trim()) {
    errors.name = 'Product name is required'
  } else if (data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters'
  }

  if (!data.price) {
    errors.price = 'Price is required'
  } else {
    const price = parseFloat(data.price)
    if (isNaN(price) || price <= 0) {
      errors.price = 'Price must be a positive number'
    }
  }

  if (!data.description.trim()) {
    errors.description = 'Description is required'
  } else if (data.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters'
  }

  return errors
}

export function ProductForm({ onSubmit }: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>(initialFormData)
  const [errors, setErrors] = useState<ProductFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof ProductFormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
    setSubmitError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationErrors = validateForm(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      await onSubmit(formData)
      setFormData(initialFormData)
      setErrors({})
    } catch (err) {
      console.error('Error adding product:', err)
      setSubmitError('Failed to add product. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add New Product
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter product name"
              value={formData.name}
              onChange={handleChange}
              disabled={isSubmitting}
              className={errors.name ? 'border-[hsl(var(--destructive))]' : ''}
            />
            <AnimatePresence mode="wait">
              {errors.name && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-sm text-[hsl(var(--destructive))]"
                >
                  {errors.name}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (USD)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.price}
              onChange={handleChange}
              disabled={isSubmitting}
              className={errors.price ? 'border-[hsl(var(--destructive))]' : ''}
            />
            <AnimatePresence mode="wait">
              {errors.price && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-sm text-[hsl(var(--destructive))]"
                >
                  {errors.price}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter product description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              disabled={isSubmitting}
              className={errors.description ? 'border-[hsl(var(--destructive))]' : ''}
            />
            <AnimatePresence mode="wait">
              {errors.description && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-sm text-[hsl(var(--destructive))]"
                >
                  {errors.description}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            {submitError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="rounded-md bg-[hsl(var(--destructive))]/10 p-3 text-sm text-[hsl(var(--destructive))]"
              >
                {submitError}
              </motion.div>
            )}
          </AnimatePresence>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding Product...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
