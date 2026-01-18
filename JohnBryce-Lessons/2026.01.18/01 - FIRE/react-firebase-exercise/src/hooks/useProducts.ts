import { useState, useEffect, useCallback } from 'react'
import { ref, onValue, push, serverTimestamp } from 'firebase/database'
import { db } from '../firebase/firebase'
import type { Product, ProductFormData } from '../types/product'

const COLLECTION_NAME = 'products'

interface UseProductsReturn {
  products: Product[]
  loading: boolean
  error: string | null
  addProduct: (data: ProductFormData) => Promise<void>
}

export function useProducts(): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const productsRef = ref(db, COLLECTION_NAME)

    const unsubscribe = onValue(
      productsRef,
      (snapshot) => {
        const data = snapshot.val()
        if (data) {
          const productsData: Product[] = Object.entries(data).map(
            ([id, value]) => ({
              id,
              ...(value as Omit<Product, 'id'>),
            })
          )
          // Sort by createdAt descending (newest first)
          productsData.sort((a, b) => b.createdAt - a.createdAt)
          setProducts(productsData)
        } else {
          setProducts([])
        }
        setLoading(false)
        setError(null)
      },
      (err) => {
        console.error('Error fetching products:', err)
        setError('Failed to load products. Please check your connection.')
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  const addProduct = useCallback(async (data: ProductFormData): Promise<void> => {
    const productsRef = ref(db, COLLECTION_NAME)

    await push(productsRef, {
      name: data.name.trim(),
      price: parseFloat(data.price),
      description: data.description.trim(),
      createdAt: serverTimestamp(),
    })
  }, [])

  return { products, loading, error, addProduct }
}
