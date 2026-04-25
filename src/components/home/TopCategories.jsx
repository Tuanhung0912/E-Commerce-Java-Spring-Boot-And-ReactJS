import { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import api from "../../api/api";
import { fetchCategories } from "../../store/actions";
import {
    FaMobileAlt, FaLaptop, FaBlender, FaCouch, FaFootballBall,
    FaBook, FaMusic, FaTree, FaUtensils, FaPaintBrush, FaCubes, FaArrowRight
} from "react-icons/fa";

/* ── Icon map ───────────────────────────────── */
const iconMap = {
    mobile: FaMobileAlt, phone: FaMobileAlt,
    computer: FaLaptop, laptop: FaLaptop, pc: FaLaptop,
    appliance: FaBlender, electronic: FaBlender,
    home: FaCouch, living: FaCouch, furniture: FaCouch,
    sport: FaFootballBall, fitness: FaFootballBall,
    book: FaBook, stationery: FaBook,
    music: FaMusic, instrument: FaMusic, audio: FaMusic,
    garden: FaTree, outdoor: FaTree, plant: FaTree,
    kitchen: FaUtensils, dining: FaUtensils, cook: FaUtensils,
    art: FaPaintBrush, craft: FaPaintBrush, sewing: FaPaintBrush,
};

/* ── Gradient palette per card ─────────────── */
const gradients = [
    "from-indigo-500 to-purple-600",
    "from-rose-500 to-orange-500",
    "from-emerald-500 to-teal-600",
    "from-amber-500 to-yellow-500",
];

const getCategoryIcon = (name) => {
    const lower = name.toLowerCase();
    for (const [key, Icon] of Object.entries(iconMap)) {
        if (lower.includes(key)) return Icon;
    }
    return FaCubes;
};

const TopCategories = () => {
    const dispatch = useDispatch();
    const { categories } = useSelector((state) => state.products);
    const [topCats, setTopCats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!categories) dispatch(fetchCategories());
    }, [dispatch, categories]);

    useEffect(() => {
        if (!categories || categories.length === 0) return;

        const fetchCounts = async () => {
            setLoading(true);
            try {
                // Fetch product count for each category (lightweight: pageSize=1, only read totalElements)
                const promises = categories.map(async (cat) => {
                    try {
                        const { data } = await api.get(
                            `/public/products?category=${encodeURIComponent(cat.categoryName)}&pageSize=1`
                        );
                        return { ...cat, productCount: data.totalElements || 0 };
                    } catch {
                        return { ...cat, productCount: 0 };
                    }
                });
                const withCounts = await Promise.all(promises);

                // Sort by productCount desc, randomize ties
                withCounts.sort((a, b) => {
                    if (b.productCount !== a.productCount) return b.productCount - a.productCount;
                    return Math.random() - 0.5; // randomize equal counts
                });

                setTopCats(withCounts.slice(0, 4));
            } catch (err) {
                console.error("Failed to fetch category counts:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCounts();
    }, [categories]);

    if (loading || topCats.length === 0) return null;

    return (
        <div className="lg:px-14 sm:px-8 px-4 py-12">
            {/* Header */}
            <div className="flex flex-col items-center mb-10">
                <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold uppercase tracking-wider mb-4">
                    Shop by Category
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 text-center">
                    Top Categories
                </h2>
                <p className="text-slate-500 mt-2 text-center max-w-md">
                    Explore our most popular collections
                </p>
                <div className="mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
            </div>

            {/* Category Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {topCats.map((cat, i) => {
                    const Icon = getCategoryIcon(cat.categoryName);
                    return (
                        <Link
                            key={cat.categoryId}
                            to={`/products?category=${encodeURIComponent(cat.categoryName)}`}
                            className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-300
                                hover:shadow-xl hover:-translate-y-1"
                        >
                            {/* Gradient background */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${gradients[i % gradients.length]} opacity-90 group-hover:opacity-100 transition-opacity`} />

                            {/* Decorative circles */}
                            <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-white/10" />
                            <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-white/10" />

                            {/* Content */}
                            <div className="relative z-10">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm mb-4
                                    group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300">
                                    <Icon className="text-2xl text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-1">
                                    {cat.categoryName}
                                </h3>
                                <p className="text-sm text-white/70">
                                    {cat.productCount} {cat.productCount === 1 ? "product" : "products"}
                                </p>
                                <div className="flex items-center gap-1.5 mt-4 text-xs font-semibold text-white/80 group-hover:text-white transition-colors">
                                    Browse Now
                                    <FaArrowRight className="text-[10px] transition-transform duration-300 group-hover:translate-x-1" />
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default TopCategories;
