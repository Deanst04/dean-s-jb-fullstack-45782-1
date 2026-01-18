import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Package, Home } from 'lucide-react'
import { ProductForm } from '../components/ProductForm'
import { ProductList } from '../components/ProductList'
import { useProducts } from '../hooks/useProducts'
import { Button } from '../components/ui/button'

export function Products() {
  const { products, loading, error, addProduct } = useProducts()

  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(var(--background))] to-[hsl(var(--muted))]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-[hsl(var(--primary))] p-2.5">
                <Package className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Products
              </h1>
            </div>
            <Link to="/">
              <Button variant="outline" size="sm" className="gap-2">
                <Home className="h-4 w-4" />
                Home
              </Button>
            </Link>
          </div>
          <p className="text-[hsl(var(--muted-foreground))]">
            Add and manage your products in real-time
          </p>
        </motion.header>

        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <ProductForm onSubmit={addProduct} />
          </motion.aside>

          <motion.main
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Product List</h2>
              {!loading && !error && (
                <span className="text-sm text-[hsl(var(--muted-foreground))]">
                  {products.length} {products.length === 1 ? 'product' : 'products'}
                </span>
              )}
            </div>
            <ProductList products={products} loading={loading} error={error} />
          </motion.main>
        </div>
      </div>
    </div>
  )
}
