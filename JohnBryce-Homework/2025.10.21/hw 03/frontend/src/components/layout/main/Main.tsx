import { Navigate, Route, Routes } from "react-router-dom"
import NotFound from "../not-found/NotFound"
import List from "../../ products/list/List"
import NewProduct from "../../ products/new/NewProduct"

export default function Main() {
    return (
        <Routes>
            {/* <Route path="/" element={<Profile />} /> */}
            <Route path="/" element={<Navigate to={"/products"} />} />
            <Route path="/products" element={<List />} />
            <Route path="/add-product" element={<NewProduct />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}
