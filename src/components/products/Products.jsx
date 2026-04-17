import { FaExclamationTriangle, FaBoxOpen } from "react-icons/fa";
import ProductCard from "../shared/ProductCard";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchCategories } from "../../store/actions";
import Filter from "./Filter";
import useProductFilter from "../hooks/useProductFilter";
import Loader from "../shared/Loader";
import Paginations from "../shared/Paginations";

const Products = () => {
    const { isLoading, errorMessage } = useSelector(
        (state) => state.errors
    );
    const { products, categories, pagination } = useSelector(
        (state) => state.products
    )
    const dispatch = useDispatch();
    useProductFilter();

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const emptyProducts = !products || products.length === 0;

    return (
        <div className="lg:px-14 sm:px-8 px-4 py-10 2xl:w-[90%] 2xl:mx-auto">
            {/* ─── Page Header ────────────────────────── */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Products</h1>
                <p className="text-slate-500 mt-1">
                    Browse our collection
                    {pagination?.totalElements > 0 && (
                        <span className="text-slate-600 font-medium"> · {pagination.totalElements} items</span>
                    )}
                </p>
            </div>

            {/* ─── Filter Bar ─────────────────────────── */}
            <Filter categories={categories ? categories : []} />

            {/* ─── Content ────────────────────────────── */}
            {isLoading ? (
                <div className="mt-10">
                    <Loader />
                </div>
            ) : errorMessage ? (
                <div className="flex justify-center items-center h-[200px] mt-10 rounded-2xl bg-red-50 border border-red-100">
                    <FaExclamationTriangle className="text-red-400 text-2xl mr-3" />
                    <span className="text-red-600 text-lg font-medium">
                        {errorMessage}
                    </span>
                </div>
            ) : emptyProducts ? (
                <div className="flex flex-col items-center justify-center py-20 mt-10 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 mb-4">
                        <FaBoxOpen className="text-3xl text-slate-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-slate-700">No Products Found</h2>
                    <p className="mt-1 text-sm text-slate-400">Try adjusting your filters or search terms.</p>
                </div>
            ) : (
                <div className="min-h-[700px]">
                    <div className="pt-10 grid 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-6">
                        {products.map((item, i) => <ProductCard key={i} {...item} />)}
                    </div>

                    {/* Pagination */}
                    {pagination?.totalPages > 1 && (
                        <div className="flex justify-center pt-12">
                            <Paginations
                                numberOfPage={pagination?.totalPages}
                                totalProducts={pagination?.totalElements}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default Products;