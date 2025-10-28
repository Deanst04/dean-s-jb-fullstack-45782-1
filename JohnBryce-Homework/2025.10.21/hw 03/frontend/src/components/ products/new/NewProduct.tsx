import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import './NewProduct.css'
import type Category from '../../../models/category'
import { useNavigate } from 'react-router-dom'
import type AddProduct from '../../../models/addProductModel'
import categoriesServices from '../../../services/categoriesServices'
import productsServices from '../../../services/productsServices'

export default function NewProduct() {

    const [categories, setCategories] = useState<Category[]>([])

    const { register, reset, handleSubmit } = useForm<AddProduct>()

    const navigate = useNavigate()

    useEffect(() => {
        (async () => {
            const categories = await categoriesServices.getAllCategory()
            setCategories(categories)
        })()
    }, [])

    async function submit(draft: AddProduct) {
        try {
            await productsServices.addProduct(draft)
            alert('product added successfully')
            reset()
            navigate('/products')
        } catch(e) {
            alert(e)
        }
    }

    return (
        <div className='NewProduct'>
            <form onSubmit={handleSubmit(submit)}>
                <select {...register('categoryId')}>
                    <option value="">choose category</option>
                    {categories.map(({ id, name }) => <option key={id} value={id}>{name}</option>)}
                </select>
                <input placeholder='product name' {...register('name')} />
                <input placeholder='manufacture date' type="date" {...register('manufactureDate')} />
                <input placeholder='expiration date' type="date" {...register('expirationDate')} />
                <input placeholder='price' step="any" type="number" {...register('price')} />
                <button>add product</button>
            </form>
        </div>
    )
}