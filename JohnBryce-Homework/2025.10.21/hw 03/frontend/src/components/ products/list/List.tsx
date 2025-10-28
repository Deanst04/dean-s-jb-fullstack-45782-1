import { useEffect, useState, type ChangeEvent } from 'react'
import './List.css'
import type Category from '../../../models/category'
import categoriesServices from '../../../services/categoriesServices'
import productsServices from '../../../services/productsServices'
import type Product from '../../../models/product'

export default function List() {

    const [categories, setCategories] = useState<Category[]>([])
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>('')
    const [products, setProducts] = useState<Product[]>([])

    useEffect(() => {
        (async () => {
            try {
                const categories = await categoriesServices.getAllCategory()
                setCategories(categories)
            } catch(e) {
                alert(e)
            }
        })()
    }, [])

    useEffect(() => {
        (async () => {
            try {
                if(selectedCategoryId) {
                    const products = await productsServices.getAllProductsByCategory(selectedCategoryId)
                    setProducts(products)
                }
            } catch(e) {
                alert(e)
            }
        })()
    }, [selectedCategoryId])

    function categoryChanged(event: ChangeEvent<HTMLSelectElement>) {
        setSelectedCategoryId(event.currentTarget.value)
    }

    async function removeProduct(productId: string) {
        await productsServices.removeProduct(productId)
        const productsAfterRemove = products.filter(p => p.id !== productId)
        setProducts(productsAfterRemove)
    }

    return (
        <div className="List">
            <div>
                <select onChange={categoryChanged}>
                    <option value="" selected disabled>choose category</option>
                    {categories.map(({ id, name }) => <option key={id} value={id}>{name}</option>)}
                </select>
            </div>

            <ul>
                {products.map(({ id, name }) => <li key={id}>{name} <button onClick={() => removeProduct(id)}>remove product</button></li>)}
            </ul>

        </div>
    )
}