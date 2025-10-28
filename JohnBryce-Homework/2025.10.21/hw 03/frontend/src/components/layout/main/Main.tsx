import { useState } from "react"
import type Category from "../../../models/category"

export default function Main() {

    const [categories, setCategories] = useState<Category[]>([])
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
    

    return (
        <div className="Main">
            main
        </div>
    )
}
