import { useState, useEffect } from "react";
import { FaShoppingCart, FaHeart, FaRegHeart, FaEye } from "react-icons/fa";
import ProductViewModal from "./ProductViewModal";
import truncateText from "../utils/truncateText";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, addToWishlist, removeFromWishlist, fetchWishlist } from "../../store/actions";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

const ProductCard = ({
        productId,
        productName,
        image,
        description,
        quantity,
        price,
        discount,
        specialPrice,
        about = false,
}) => {
    const [openProductViewModal, setOpenProductViewModal] = useState(false);
    const btnLoader = false;
    const [selectedViewProduct, setSelectedViewProduct] = useState("");
    const isAvailable = quantity && Number(quantity) > 0;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { wishlist, wishlistIds } = useSelector((state) => state.wishlist);

    const isWishlisted = wishlistIds.includes(productId);

    useEffect(() => {
        if (user && wishlist.length === 0 && wishlistIds.length === 0) {
            dispatch(fetchWishlist());
        }
    }, [user]);

    const handleProductView = (product) => {
        if (!about) {
            setSelectedViewProduct(product);
            setOpenProductViewModal(true);
        }
    };

    const addToCartHandler = (cartItems) => {
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
        dispatch(addToCart(cartItems, 1, toast));
    };

    const handleWishlistToggle = (e) => {
        e.stopPropagation();
        if (!user) {
            toast((t) => (
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100">
                        <FaHeart className="text-rose-500" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-800">Login Required</p>
                        <p className="text-xs text-slate-500 mt-0.5">Please sign in to save items to your wishlist</p>
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
            const wishlistItem = wishlist.find((item) => item.productId === productId);
            if (wishlistItem) {
                dispatch(removeFromWishlist(wishlistItem.wishlistItemId, productId, toast));
            }
        } else {
            dispatch(addToWishlist(productId, toast));
        }
    };

    const productData = {
        id: productId,
        productName,
        image,
        description,
        quantity,
        price,
        discount,
        specialPrice,
    };

    return (
        <div className="group relative rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1">
            {/* Discount badge */}
            {discount > 0 && !about && (
                <span className="absolute top-3 left-3 z-10 inline-flex items-center rounded-full bg-rose-500 px-2.5 py-1 text-xs font-bold text-white shadow-lg shadow-rose-200">
                    -{discount}%
                </span>
            )}

            {/* Wishlist heart button */}
            {!about && (
                <button
                    onClick={handleWishlistToggle}
                    className={`absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full
                        shadow-md backdrop-blur-sm transition-all duration-300
                        ${isWishlisted
                            ? "bg-rose-500 text-white shadow-rose-300 hover:bg-rose-600 scale-100"
                            : "bg-white/80 text-slate-400 hover:bg-white hover:text-rose-500 hover:shadow-lg"
                        }
                        hover:scale-110 active:scale-95`}
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                    {isWishlisted ? (
                        <FaHeart className="text-sm" />
                    ) : (
                        <FaRegHeart className="text-sm" />
                    )}
                </button>
            )}

            {/* Image */}
            <Link
                to={about ? '#' : `/products/${productId}`}
                className="block w-full overflow-hidden aspect-[3/2] bg-slate-50 cursor-pointer"
            >
                <img
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    src={image}
                    alt={productName}
                />
            </Link>

            {/* Content */}
            <div className="p-5">
                <Link
                    to={about ? '#' : `/products/${productId}`}
                    className="block text-base font-semibold text-slate-800 hover:text-indigo-600 transition-colors duration-200 leading-tight"
                >
                    {truncateText(productName, 50)}
                </Link>

                <div className="min-h-[56px] mt-2">
                    <p className="text-slate-500 text-sm leading-relaxed">
                        {truncateText(description, 80)}
                    </p>
                </div>

                {!about && (
                    <div className="flex items-end justify-between mt-4 pt-4 border-t border-slate-100">
                        {/* Price */}
                        <div>
                            {specialPrice ? (
                                <div className="flex flex-col">
                                    <span className="text-xs text-slate-400 line-through">
                                        ${Number(price).toFixed(2)}
                                    </span>
                                    <span className="text-xl font-bold text-slate-800">
                                        ${Number(specialPrice).toFixed(2)}
                                    </span>
                                </div>
                            ) : (
                                <span className="text-xl font-bold text-slate-800">
                                    ${Number(price).toFixed(2)}
                                </span>
                            )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2">
                            <Link
                                to={`/products/${productId}`}
                                className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-semibold
                                    border border-slate-200 text-slate-600
                                    hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50
                                    transition-all duration-300"
                            >
                                <FaEye className="text-xs" />
                                Details
                            </Link>
                            <button
                                disabled={!isAvailable || btnLoader}
                                onClick={() => addToCartHandler({
                                    image,
                                    productName,
                                    description,
                                    specialPrice,
                                    price,
                                    productId,
                                    quantity,
                                })}
                                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300
                                    ${isAvailable
                                        ? "bg-indigo-500 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-600 hover:shadow-indigo-300 hover:scale-[1.03]"
                                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                                    }`}
                            >
                                <FaShoppingCart className="text-sm" />
                                {isAvailable ? "Cart" : "Stock Out"}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <ProductViewModal
                open={openProductViewModal}
                setOpen={setOpenProductViewModal}
                product={selectedViewProduct}
                isAvailable={isAvailable}
            />
        </div>
    )
}

export default ProductCard;