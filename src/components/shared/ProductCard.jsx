import { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import ProductViewModal from "./ProductViewModal";
import truncateText from "../utils/truncateText";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/actions";
import toast from "react-hot-toast";

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

    const handleProductView = (product) => {
        if (!about) {
            setSelectedViewProduct(product);
            setOpenProductViewModal(true);
        }
    };

    const addToCartHandler = (cartItems) => {
        dispatch(addToCart(cartItems, 1, toast));
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

            {/* Image */}
            <div
                onClick={() => handleProductView(productData)}
                className="w-full overflow-hidden aspect-[3/2] bg-slate-50 cursor-pointer"
            >
                <img
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    src={image}
                    alt={productName}
                />
            </div>

            {/* Content */}
            <div className="p-5">
                <h2
                    onClick={() => handleProductView(productData)}
                    className="text-base font-semibold text-slate-800 cursor-pointer hover:text-indigo-600 transition-colors duration-200 leading-tight"
                >
                    {truncateText(productName, 50)}
                </h2>

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

                        {/* Cart button */}
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
                            {isAvailable ? "Add to Cart" : "Stock Out"}
                        </button>
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