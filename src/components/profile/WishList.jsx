import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import api from "../../api/api";
import toast from "react-hot-toast";
import { FaHeart, FaArrowLeft, FaShoppingCart, FaTrash, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { addToCart, removeFromWishlist, fetchWishlist } from "../../store/actions";
import Loader from "../shared/Loader";

const WishList = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { products } = useSelector((state) => state.products);

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [pagination, setPagination] = useState({});

    const fetchItems = async (pageNum = 0) => {
        try {
            setLoading(true);
            const { data } = await api.get(
                `/wishlist?pageNumber=${pageNum}&pageSize=8&sortBy=createdAt&sortOrder=desc`
            );
            setItems(data.content || []);
            setPagination({
                pageNumber: data.pageNumber,
                totalPages: data.totalPages,
                totalElements: data.totalElements,
                lastPage: data.lastPage,
            });
        } catch (error) {
            console.error("Failed to fetch wishlist:", error);
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems(page);
    }, [page]);

    const handleRemove = async (wishlistItemId, productId) => {
        await dispatch(removeFromWishlist(wishlistItemId, productId, toast));
        // Re-fetch current page
        fetchItems(page);
    };

    const handleAddToCart = (item) => {
        dispatch(addToCart({
            image: item.productImage,
            productName: item.productName,
            description: "",
            specialPrice: item.productSpecialPrice,
            price: item.productPrice,
            productId: item.productId,
            quantity: 1,
        }, 1, toast));
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    };

    return (
        <div>
            {/* ─── Hero Banner ─────────────────────────── */}
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900">
                <div className="absolute top-0 left-1/4 h-48 w-48 rounded-full bg-rose-500/10 blur-3xl" />
                <div className="absolute bottom-0 right-1/3 h-40 w-40 rounded-full bg-pink-500/10 blur-3xl" />

                <div className="relative max-w-5xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
                    <Link
                        to="/profile"
                        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-4"
                    >
                        <FaArrowLeft className="text-xs" /> Back to Profile
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl
                            bg-gradient-to-br from-rose-400 to-pink-500
                            shadow-lg shadow-rose-500/30">
                            <FaHeart className="text-white text-xl" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-white">My Wishlist</h1>
                            <p className="text-slate-400 text-sm mt-0.5">
                                {pagination.totalElements || 0} item{pagination.totalElements !== 1 ? "s" : ""} saved
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Content ─────────────────────────────── */}
            <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8">
                {loading ? (
                    <div className="flex justify-center py-20"><Loader /></div>
                ) : items.length === 0 ? (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center py-20 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 mb-4">
                            <FaHeart className="text-3xl text-rose-300" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-700">Your Wishlist is Empty</h3>
                        <p className="text-sm text-slate-400 mt-1 mb-5">
                            Save items you love by clicking the heart icon on any product.
                        </p>
                        <Link
                            to="/products"
                            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white
                                bg-gradient-to-r from-rose-500 to-pink-500
                                shadow-lg shadow-rose-500/25 hover:shadow-xl hover:scale-[1.02] transition-all"
                        >
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    /* Wishlist Grid */
                    <div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {items.map((item) => (
                                <div
                                    key={item.wishlistItemId}
                                    className="group rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden
                                        transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1"
                                >
                                    {/* Clickable area → Product Detail */}
                                    <Link to={`/products/${item.productId}`} className="block">
                                        {/* Image */}
                                        <div className="w-full overflow-hidden aspect-[3/2] bg-slate-50">
                                            <img
                                                src={item.productImage?.startsWith('http') ? item.productImage : `${import.meta.env.VITE_BACK_END_URL}/images/${item.productImage}`}
                                                alt={item.productName}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="p-4">
                                            <h3 className="text-sm font-semibold text-slate-800 leading-tight line-clamp-2 group-hover:text-indigo-600 transition-colors">
                                                {item.productName}
                                            </h3>

                                        <div className="flex items-baseline gap-2 mt-2">
                                            {item.productSpecialPrice ? (
                                                <>
                                                    <span className="text-lg font-bold text-slate-800">
                                                        ${Number(item.productSpecialPrice).toFixed(2)}
                                                    </span>
                                                    <span className="text-xs text-slate-400 line-through">
                                                        ${Number(item.productPrice).toFixed(2)}
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="text-lg font-bold text-slate-800">
                                                    ${Number(item.productPrice).toFixed(2)}
                                                </span>
                                            )}
                                        </div>

                                        {item.createdAt && (
                                            <p className="text-[11px] text-slate-400 mt-1.5">
                                                Saved {formatDate(item.createdAt)}
                                            </p>
                                        )}
                                        </div>
                                    </Link>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 px-4 pb-4 pt-3 border-t border-slate-100">
                                        <button
                                            onClick={() => handleAddToCart(item)}
                                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl
                                                text-xs font-semibold text-white
                                                bg-indigo-500 shadow-sm shadow-indigo-200
                                                hover:bg-indigo-600 hover:shadow-md transition-all duration-200"
                                        >
                                            <FaShoppingCart className="text-[10px]" />
                                            Add to Cart
                                        </button>
                                        <button
                                            onClick={() => handleRemove(item.wishlistItemId, item.productId)}
                                            className="flex h-9 w-9 items-center justify-center rounded-xl
                                                border border-slate-200 text-slate-400
                                                hover:border-red-200 hover:bg-red-50 hover:text-red-500
                                                transition-all duration-200"
                                            aria-label="Remove from wishlist"
                                        >
                                            <FaTrash className="text-xs" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="flex items-center justify-center gap-3 pt-8">
                                <button
                                    disabled={page === 0}
                                    onClick={() => setPage(page - 1)}
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium
                                        border border-slate-200 bg-white text-slate-600
                                        hover:bg-slate-50 transition-colors
                                        disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <FaChevronLeft className="text-xs" /> Prev
                                </button>
                                <span className="text-sm text-slate-500">
                                    Page {page + 1} / {pagination.totalPages}
                                </span>
                                <button
                                    disabled={pagination.lastPage}
                                    onClick={() => setPage(page + 1)}
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium
                                        border border-slate-200 bg-white text-slate-600
                                        hover:bg-slate-50 transition-colors
                                        disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    Next <FaChevronRight className="text-xs" />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WishList;
