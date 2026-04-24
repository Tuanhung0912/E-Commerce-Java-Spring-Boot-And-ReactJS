import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import api from "../../api/api";
import { addToCart, addToWishlist, removeFromWishlist, fetchWishlist } from "../../store/actions";
import toast from "react-hot-toast";
import {
    FaStar, FaRegStar, FaStarHalfAlt,
    FaShoppingCart, FaHeart, FaRegHeart,
    FaArrowLeft, FaMinus, FaPlus,
    FaBoxOpen, FaChevronLeft, FaChevronRight,
    FaUserCircle, FaShoppingBag
} from "react-icons/fa";
import Loader from "../shared/Loader";

/* ── Star rating display ─────────────────────────── */
const StarRating = ({ rating, size = "text-sm" }) => {
    const stars = [];
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    for (let i = 0; i < full; i++) stars.push(<FaStar key={`f${i}`} className={`${size} text-amber-400`} />);
    if (half) stars.push(<FaStarHalfAlt key="h" className={`${size} text-amber-400`} />);
    for (let i = stars.length; i < 5; i++) stars.push(<FaRegStar key={`e${i}`} className={`${size} text-amber-400`} />);
    return <div className="flex items-center gap-0.5">{stars}</div>;
};

const ProductDetails = () => {
    const { productId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { wishlist, wishlistIds } = useSelector((state) => state.wishlist);

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);

    // Reviews
    const [reviews, setReviews] = useState([]);
    const [reviewPagination, setReviewPagination] = useState({});
    const [reviewPage, setReviewPage] = useState(0);
    const [reviewLoading, setReviewLoading] = useState(true);
    const [reviewStats, setReviewStats] = useState({ averageRating: 0, totalReviews: 0 });

    const isAvailable = product && product.quantity > 0;
    const isWishlisted = wishlistIds.includes(Number(productId));

    useEffect(() => {
        if (user && wishlist.length === 0 && wishlistIds.length === 0) {
            dispatch(fetchWishlist());
        }
    }, [user]);

    // Fetch product
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const { data } = await api.get(`/public/products?pageSize=100`);
                const found = data.content?.find((p) => p.productId === Number(productId));
                if (found) setProduct(found);
            } catch (err) {
                console.error("Failed to fetch product:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);

    // Fetch reviews
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setReviewLoading(true);
                const { data } = await api.get(
                    `/public/products/${productId}/reviews?pageNumber=${reviewPage}&pageSize=5&sortBy=createdAt&sortOrder=desc`
                );
                setReviews(data.content || []);
                setReviewStats({
                    averageRating: data.averageRating || 0,
                    totalReviews: data.totalReviews || 0,
                });
                setReviewPagination({
                    pageNumber: data.pageNumber,
                    totalPages: data.totalPages,
                    totalElements: data.totalElements,
                    lastPage: data.lastPage,
                });
            } catch (err) {
                console.error("Failed to fetch reviews:", err);
                setReviews([]);
            } finally {
                setReviewLoading(false);
            }
        };
        fetchReviews();
    }, [productId, reviewPage]);

    const handleAddToCart = () => {
        if (!user) {
            toast((t) => (
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100">
                        <FaShoppingCart className="text-indigo-600" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-800">Login Required</p>
                        <p className="text-xs text-slate-500 mt-0.5">Please sign in to add items to your cart</p>
                    </div>
                    <button
                        onClick={() => { toast.dismiss(t.id); navigate("/login"); }}
                        className="ml-2 shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-500 hover:bg-indigo-600 transition-colors"
                    >
                        Login
                    </button>
                </div>
            ), { duration: 4000, style: { padding: '12px 16px', borderRadius: '16px', maxWidth: '420px' } });
            return;
        }
        dispatch(addToCart({
            image: product.image,
            productName: product.productName,
            description: product.description,
            specialPrice: product.specialPrice,
            price: product.price,
            productId: product.productId,
            quantity: product.quantity,
        }, qty, toast));
    };

    const handleWishlistToggle = () => {
        if (!user) {
            toast((t) => (
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100">
                        <FaHeart className="text-rose-500" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-800">Login Required</p>
                        <p className="text-xs text-slate-500 mt-0.5">Please sign in to save items</p>
                    </div>
                    <button
                        onClick={() => { toast.dismiss(t.id); navigate("/login"); }}
                        className="ml-2 shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600 transition-colors"
                    >
                        Login
                    </button>
                </div>
            ), { duration: 4000, style: { padding: '12px 16px', borderRadius: '16px', maxWidth: '420px' } });
            return;
        }
        if (isWishlisted) {
            const item = wishlist.find((w) => w.productId === Number(productId));
            if (item) dispatch(removeFromWishlist(item.wishlistItemId, Number(productId), toast));
        } else {
            dispatch(addToWishlist(Number(productId), toast));
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    };

    const imgSrc = product?.image?.startsWith('http')
        ? product.image
        : `${import.meta.env.VITE_BACK_END_URL}/images/${product?.image}`;

    if (loading) {
        return <div className="flex justify-center py-32"><Loader /></div>;
    }

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center py-32">
                <FaBoxOpen className="text-5xl text-slate-300 mb-4" />
                <h2 className="text-xl font-semibold text-slate-700">Product Not Found</h2>
                <Link to="/products" className="mt-4 text-sm text-indigo-600 hover:underline">← Back to Products</Link>
            </div>
        );
    }

    return (
        <div className="lg:px-14 sm:px-8 px-4 py-8 2xl:w-[90%] 2xl:mx-auto">
            {/* Breadcrumb */}
            <Link
                to="/products"
                className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors mb-6"
            >
                <FaArrowLeft className="text-xs" /> Back to Products
            </Link>

            {/* ─── Main Product Section ────────────────── */}
            <div className="grid lg:grid-cols-2 gap-10">
                {/* Image */}
                <div className="relative rounded-2xl overflow-hidden bg-slate-50 border border-slate-200">
                    {product.discount > 0 && (
                        <span className="absolute top-4 left-4 z-10 inline-flex items-center rounded-full bg-rose-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg shadow-rose-200">
                            -{product.discount}%
                        </span>
                    )}
                    <img
                        src={imgSrc}
                        alt={product.productName}
                        className="w-full aspect-square object-cover"
                    />
                </div>

                {/* Info */}
                <div className="flex flex-col">
                    <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 leading-tight">
                        {product.productName}
                    </h1>

                    {/* Rating summary */}
                    <div className="flex items-center gap-3 mt-3">
                        <StarRating rating={reviewStats.averageRating || product.averageRating || 0} size="text-base" />
                        <span className="text-sm font-semibold text-slate-700">
                            {(reviewStats.averageRating || product.averageRating || 0).toFixed(1)}
                        </span>
                        <span className="text-sm text-slate-400">
                            ({reviewStats.totalReviews || product.reviewCount || 0} review{(reviewStats.totalReviews || product.reviewCount || 0) !== 1 ? "s" : ""})
                        </span>
                    </div>

                    {/* Price */}
                    <div className="mt-5">
                        {product.specialPrice ? (
                            <div className="flex items-baseline gap-3">
                                <span className="text-3xl font-bold text-slate-800">
                                    ${Number(product.specialPrice).toFixed(2)}
                                </span>
                                <span className="text-lg text-slate-400 line-through">
                                    ${Number(product.price).toFixed(2)}
                                </span>
                                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                                    Save ${(product.price - product.specialPrice).toFixed(2)}
                                </span>
                            </div>
                        ) : (
                            <span className="text-3xl font-bold text-slate-800">
                                ${Number(product.price).toFixed(2)}
                            </span>
                        )}
                    </div>

                    {/* Stock & Sold */}
                    <div className="flex items-center gap-4 mt-4">
                        {isAvailable ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                In Stock · {product.quantity} left
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 text-red-600 text-xs font-semibold">
                                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                                Out of Stock
                            </span>
                        )}
                    </div>

                    {/* Description */}
                    <div className="mt-6 pt-6 border-t border-slate-100">
                        <h3 className="text-sm font-semibold text-slate-700 mb-2">Description</h3>
                        <p className="text-slate-500 text-sm leading-relaxed whitespace-pre-line">
                            {product.description}
                        </p>
                    </div>

                    {/* Quantity + Actions */}
                    {isAvailable && (
                        <div className="mt-8 pt-6 border-t border-slate-100">
                            {/* Quantity selector */}
                            <div className="flex items-center gap-4 mb-5">
                                <span className="text-sm font-medium text-slate-600">Quantity</span>
                                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                                    <button
                                        onClick={() => setQty((q) => Math.max(1, q - 1))}
                                        disabled={qty <= 1}
                                        className="flex h-10 w-10 items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        <FaMinus className="text-xs" />
                                    </button>
                                    <span className="flex h-10 w-12 items-center justify-center text-sm font-semibold text-slate-800 border-x border-slate-200">
                                        {qty}
                                    </span>
                                    <button
                                        onClick={() => setQty((q) => Math.min(product.quantity, q + 1))}
                                        disabled={qty >= product.quantity}
                                        className="flex h-10 w-10 items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        <FaPlus className="text-xs" />
                                    </button>
                                </div>
                                <span className="text-xs text-slate-400">{product.quantity} available</span>
                            </div>

                            {/* Action buttons */}
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl
                                        text-sm font-semibold text-white
                                        bg-indigo-500 shadow-lg shadow-indigo-200
                                        hover:bg-indigo-600 hover:shadow-indigo-300 hover:scale-[1.01]
                                        transition-all duration-300"
                                >
                                    <FaShoppingCart />
                                    Add to Cart
                                </button>
                                <button
                                    onClick={handleWishlistToggle}
                                    className={`flex h-[52px] w-[52px] items-center justify-center rounded-xl
                                        border-2 transition-all duration-300
                                        ${isWishlisted
                                            ? "border-rose-200 bg-rose-50 text-rose-500 hover:bg-rose-100"
                                            : "border-slate-200 text-slate-400 hover:border-rose-200 hover:text-rose-500 hover:bg-rose-50"
                                        }`}
                                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                                >
                                    {isWishlisted ? <FaHeart className="text-lg" /> : <FaRegHeart className="text-lg" />}
                                </button>
                            </div>
                        </div>
                    )}

                    {!isAvailable && (
                        <div className="mt-8 pt-6 border-t border-slate-100">
                            <button
                                disabled
                                className="w-full py-3.5 rounded-xl text-sm font-semibold bg-slate-100 text-slate-400 cursor-not-allowed"
                            >
                                Out of Stock
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* ─── Reviews Section ─────────────────────── */}
            <div className="mt-16 pt-10 border-t border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Customer Reviews</h2>
                        <div className="flex items-center gap-3 mt-1">
                            <StarRating rating={reviewStats.averageRating} size="text-base" />
                            <span className="text-sm font-semibold text-slate-700">
                                {reviewStats.averageRating.toFixed(1)} out of 5
                            </span>
                            <span className="text-sm text-slate-400">
                                · {reviewStats.totalReviews} review{reviewStats.totalReviews !== 1 ? "s" : ""}
                            </span>
                        </div>
                    </div>
                </div>

                {reviewLoading ? (
                    <div className="flex justify-center py-12"><Loader /></div>
                ) : reviews.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50">
                        <FaStar className="text-3xl text-slate-300 mb-3" />
                        <h3 className="text-base font-semibold text-slate-600">No reviews yet</h3>
                        <p className="text-sm text-slate-400 mt-1">Be the first to review this product.</p>
                    </div>
                ) : (
                    <div>
                        <div className="space-y-4">
                            {reviews.map((review) => (
                                <div
                                    key={review.reviewId}
                                    className="rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:border-slate-300"
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Avatar */}
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full
                                            bg-gradient-to-br from-indigo-400 to-violet-500 text-white text-sm font-bold">
                                            {review.userName?.charAt(0)?.toUpperCase() || <FaUserCircle />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <h4 className="text-sm font-semibold text-slate-800">
                                                    {review.userName || "Anonymous"}
                                                </h4>
                                                <span className="text-xs text-slate-400 shrink-0">
                                                    {formatDate(review.createdAt)}
                                                </span>
                                            </div>
                                            <div className="mt-1">
                                                <StarRating rating={review.rating} />
                                            </div>
                                            {review.comment && (
                                                <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
                                                    {review.comment}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Review pagination */}
                        {reviewPagination.totalPages > 1 && (
                            <div className="flex items-center justify-center gap-3 pt-6">
                                <button
                                    disabled={reviewPage === 0}
                                    onClick={() => setReviewPage(reviewPage - 1)}
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium
                                        border border-slate-200 bg-white text-slate-600
                                        hover:bg-slate-50 transition-colors
                                        disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <FaChevronLeft className="text-xs" /> Prev
                                </button>
                                <span className="text-sm text-slate-500">
                                    Page {reviewPage + 1} / {reviewPagination.totalPages}
                                </span>
                                <button
                                    disabled={reviewPagination.lastPage}
                                    onClick={() => setReviewPage(reviewPage + 1)}
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

export default ProductDetails;
