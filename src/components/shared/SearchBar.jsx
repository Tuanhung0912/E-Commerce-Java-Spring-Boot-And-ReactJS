import { useState, useEffect, useRef } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

const SearchBar = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);
    const inputRef = useRef(null);
    const debounceRef = useRef(null);
    const navigate = useNavigate();

    // Close on outside click
    useEffect(() => {
        const handleClick = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    // Debounced search — uses /public/products?keyword= (returns 200 OK)
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (!query.trim()) {
            setResults([]);
            setOpen(false);
            return;
        }
        debounceRef.current = setTimeout(async () => {
            try {
                setLoading(true);
                const { data } = await api.get(
                    `/public/products?keyword=${encodeURIComponent(query.trim())}&pageSize=6`
                );
                setResults(data.content || []);
                setOpen(true);
            } catch {
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, 350);
        return () => clearTimeout(debounceRef.current);
    }, [query]);

    const handleSelect = (productId) => {
        setOpen(false);
        setQuery("");
        navigate(`/products/${productId}`);
    };

    const resolveImg = (src) =>
        src?.startsWith("http") ? src : `${import.meta.env.VITE_BACK_END_URL}/images/${src}`;

    const formatPrice = (val) => `$${Number(val).toFixed(2)}`;

    return (
        <div ref={wrapperRef} className="relative w-full">
            {/* Input bar */}
            <div className="flex items-center rounded-xl bg-white/10 border border-white/10 focus-within:border-indigo-400/50 focus-within:bg-white/15 focus-within:ring-1 focus-within:ring-indigo-400/30 transition-all duration-300">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center text-slate-400">
                    <FaSearch className="text-sm" />
                </span>
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search products..."
                    className="flex-1 bg-transparent text-sm text-white placeholder-slate-400 outline-none py-2.5 pr-2"
                    onFocus={() => query.trim() && results.length > 0 && setOpen(true)}
                    onKeyDown={(e) => {
                        if (e.key === "Escape") { setOpen(false); inputRef.current?.blur(); }
                    }}
                />
                {query && (
                    <button
                        onClick={() => { setQuery(""); setResults([]); setOpen(false); }}
                        className="flex h-10 w-8 shrink-0 items-center justify-center text-slate-400 hover:text-white transition-colors"
                    >
                        <FaTimes className="text-xs" />
                    </button>
                )}
            </div>

            {/* Dropdown results */}
            {open && (
                <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl bg-white shadow-2xl shadow-slate-900/20 border border-slate-100 overflow-hidden z-50">
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="h-5 w-5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                            <span className="ml-2 text-sm text-slate-400">Searching...</span>
                        </div>
                    ) : results.length === 0 ? (
                        <div className="py-8 text-center">
                            <p className="text-sm text-slate-400">No products found for &ldquo;{query}&rdquo;</p>
                        </div>
                    ) : (
                        <div className="max-h-[360px] overflow-y-auto">
                            <div className="px-4 py-2.5 border-b border-slate-100">
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Results ({results.length})
                                </span>
                            </div>
                            {results.map((item) => {
                                const hasDiscount = item.specialPrice && item.specialPrice < item.price;
                                return (
                                    <button
                                        key={item.productId}
                                        onClick={() => handleSelect(item.productId)}
                                        className="flex items-center gap-3 w-full px-4 py-3 text-left
                                            hover:bg-indigo-50/50 transition-colors duration-150 border-b border-slate-50 last:border-0"
                                    >
                                        {/* Image */}
                                        <div className="h-14 w-14 shrink-0 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                                            {item.image ? (
                                                <img
                                                    src={resolveImg(item.image)}
                                                    alt={item.productName}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-slate-300">
                                                    <FaSearch />
                                                </div>
                                            )}
                                        </div>
                                        {/* Info */}
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-slate-800 truncate">
                                                {item.productName}
                                            </p>
                                            <div className="flex items-baseline gap-2 mt-0.5">
                                                {hasDiscount ? (
                                                    <>
                                                        <span className="text-sm font-bold text-indigo-600">
                                                            {formatPrice(item.specialPrice)}
                                                        </span>
                                                        <span className="text-xs text-slate-400 line-through">
                                                            {formatPrice(item.price)}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="text-sm font-bold text-slate-700">
                                                        {formatPrice(item.price)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        {/* Arrow */}
                                        <svg className="w-4 h-4 text-slate-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
