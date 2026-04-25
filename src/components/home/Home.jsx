import { useDispatch, useSelector } from "react-redux";
import HeroBanner from "./HeroBanner";
import TopCategories from "./TopCategories";
import { useEffect } from "react";
import { fetchProducts } from "../../store/actions";
import ProductCard from "../shared/ProductCard";
import Loader from "../shared/Loader";
import {
    FaExclamationTriangle, FaArrowRight, FaShippingFast,
    FaMoneyBillWave, FaHeadset, FaPercent, FaShieldAlt
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Home = () => {
    const dispatch = useDispatch();
    const { products } = useSelector((state) => state.products);
    const { isLoading, errorMessage } = useSelector(
        (state) => state.errors
    );

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    return (
        <div>
            {/* ─── Hero Banner ─────────────────────────── */}
            <div className="lg:px-14 sm:px-8 px-4 pt-6">
                <div className="rounded-xl overflow-hidden">
                    <HeroBanner />
                </div>
            </div>

            {/* ─── Feature Icons Strip ────────────────── */}
            <div className="lg:px-14 sm:px-8 px-4 py-6">
                <div className="border border-slate-200 bg-white rounded-xl">
                    <div className="px-6 py-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:divide-x lg:divide-slate-200">
                        {[
                            { icon: FaShippingFast, title: "Free Shipping", desc: "Free Shipping On All Orders" },
                            { icon: FaMoneyBillWave, title: "Money Guarantee", desc: "30 Day Money Back Guarantee" },
                            { icon: FaHeadset, title: "Online Support 24/7", desc: "Technical Support 24/7" },
                            { icon: FaPercent, title: "Member Discount", desc: "Upto 40% Discount All Products" },
                            { icon: FaShieldAlt, title: "Secure Payment", desc: "All Cards Accepted" },
                        ].map(({ icon: Icon, title, desc }) => (
                            <div key={title} className="flex items-center gap-3 pl-4 first:pl-0">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
                                    <Icon className="text-lg" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-slate-800 truncate">{title}</p>
                                    <p className="text-xs text-slate-500 truncate">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ─── Top Categories ─────────────────────── */}
            <TopCategories />

            {/* ─── Featured Products ───────────────────── */}
            <div className="lg:px-14 sm:px-8 px-4 py-16">
                <div className="flex flex-col items-center mb-12">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold uppercase tracking-wider mb-4">
                        Curated for You
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 text-center">
                        Featured Products
                    </h2>
                    <p className="text-slate-500 mt-2 text-center max-w-md">
                        Discover our handpicked selection of top-rated items just for you
                    </p>
                    <div className="mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
                </div>

                {isLoading ? (
                    <Loader />
                ) : errorMessage ? (
                    <div className="flex justify-center items-center h-[200px] rounded-2xl bg-red-50 border border-red-100">
                        <FaExclamationTriangle className="text-red-400 text-2xl mr-3" />
                        <span className="text-red-600 text-lg font-medium">
                            {errorMessage}
                        </span>
                    </div>
                ) : (
                    <>
                        <div className="grid 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-6">
                            {products &&
                                products?.slice(0, 4)
                                    .map((item, i) => <ProductCard key={i} {...item} />)
                            }
                        </div>

                        {/* View All button */}
                        <div className="flex justify-center mt-12">
                            <Link
                                to="/products"
                                className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-slate-200
                                    text-slate-700 font-semibold text-sm
                                    transition-all duration-300
                                    hover:border-indigo-300 hover:text-indigo-600 hover:shadow-lg hover:shadow-indigo-100"
                            >
                                View All Products
                                <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default Home;