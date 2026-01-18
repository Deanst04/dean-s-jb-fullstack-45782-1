import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Package, ArrowRight } from 'lucide-react'
import { Button } from '../components/ui/button'

export function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(var(--background))] to-[hsl(var(--muted))] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center px-4"
      >
        <div className="inline-flex items-center justify-center gap-3 mb-6">
          <div className="rounded-xl bg-[hsl(var(--primary))] p-3">
            <Package className="h-10 w-10 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
          Product Manager
        </h1>
        <p className="text-lg text-[hsl(var(--muted-foreground))] mb-8 max-w-md mx-auto">
          Real-time product inventory management powered by Firebase
        </p>
        <Link to="/products">
          <Button size="lg" className="gap-2">
            Go to Products
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </motion.div>
    </div>
  )
}
