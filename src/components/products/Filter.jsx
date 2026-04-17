import { useEffect, useState } from "react";
import { FiArrowDown, FiArrowUp, FiRefreshCw, FiSearch, FiChevronDown } from "react-icons/fi";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const Filter = ({ categories }) => {
    const [searchParams] = useSearchParams();
    const params = new URLSearchParams(searchParams);
    const pathname = useLocation().pathname;
    const navigate = useNavigate();

    const [category, setCategory] = useState("all");
    const [sortOrder, setSortOrder] = useState("asc");
    const [searchTerm, setSearchTerm] = useState("");
    const [searchFocused, setSearchFocused] = useState(false);

    useEffect(() => {
        const currentCategory = searchParams.get("category") || "all";
        const currentSortOrder = searchParams.get("sortby") || "asc";
        const currentSearchTerm = searchParams.get("keyword") || "";

        setCategory(currentCategory);
        setSortOrder(currentSortOrder);
        setSearchTerm(currentSearchTerm);
    }, [searchParams]);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchTerm) {
                searchParams.set("keyword", searchTerm);
            } else {
                searchParams.delete("keyword");
            }
            navigate(`${pathname}?${searchParams.toString()}`);
        }, 700);

        return () => {
            clearTimeout(handler);
        };
    }, [searchParams, searchTerm, navigate, pathname]);

    const handleCategoryChange = (event) => {
        const selectedCategory = event.target.value;

        if (selectedCategory === "all") {
            params.delete("category");
        } else {
            params.set("category", selectedCategory);
        }
        navigate(`${pathname}?${params}`);
        setCategory(event.target.value);
    };

    const toggleSortOrder = () => {
        setSortOrder((prevOrder) => {
            const newOrder = (prevOrder === "asc") ? "desc" : "asc";
            params.set("sortby", newOrder);
            navigate(`${pathname}?${params}`);
            return newOrder;
        })
    };

    const handleClearFilters = () => {
        navigate({ pathname: window.location.pathname });
    };

    const hasActiveFilters = searchParams.get("category") || searchParams.get("sortby") || searchParams.get("keyword");

    return (
        <div className="flex lg:flex-row flex-col gap-4 items-stretch lg:items-center justify-between
            p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">

            {/* ─── Search ─────────────────────────────── */}
            <div className={`relative flex items-center 2xl:w-[400px] sm:w-[360px] w-full transition-all duration-300
                ${searchFocused ? 'ring-2 ring-indigo-200' : ''} rounded-xl`}>
                <FiSearch className={`absolute left-3.5 text-lg transition-colors duration-200
                    ${searchFocused ? 'text-indigo-500' : 'text-slate-400'}`} />
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    className="w-full border border-slate-200 text-slate-700 rounded-xl py-2.5 pl-10 pr-4
                        text-sm placeholder:text-slate-400
                        focus:outline-none focus:border-indigo-300
                        transition-colors duration-200"
                />
            </div>

            {/* ─── Controls ───────────────────────────── */}
            <div className="flex sm:flex-row flex-col gap-2.5 items-stretch sm:items-center">
                {/* Category Select */}
                <div className="relative">
                    <select
                        value={category}
                        onChange={handleCategoryChange}
                        className="appearance-none w-full sm:w-auto min-w-[140px] border border-slate-200 rounded-xl
                            py-2.5 pl-4 pr-9 text-sm text-slate-700 font-medium
                            bg-white cursor-pointer
                            focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300
                            transition-all duration-200"
                    >
                        <option value="all">All Categories</option>
                        {categories.map((item) => (
                            <option key={item.categoryId} value={item.categoryName}>
                                {item.categoryName}
                            </option>
                        ))}
                    </select>
                    <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>

                {/* Sort */}
                <button
                    onClick={toggleSortOrder}
                    title={`Sort by price: ${sortOrder === 'asc' ? 'Low → High' : 'High → Low'}`}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
                        border border-slate-200 bg-white text-sm font-medium text-slate-700
                        transition-all duration-200
                        hover:bg-slate-50 hover:border-slate-300
                        focus:outline-none focus:ring-2 focus:ring-indigo-200"
                >
                    Price
                    {sortOrder === "asc" ? (
                        <FiArrowUp className="text-indigo-500" size={16} />
                    ) : (
                        <FiArrowDown className="text-indigo-500" size={16} />
                    )}
                </button>

                {/* Clear */}
                {hasActiveFilters && (
                    <button
                        onClick={handleClearFilters}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl
                            border border-red-200 bg-red-50 text-sm font-medium text-red-600
                            transition-all duration-200
                            hover:bg-red-100 hover:border-red-300
                            focus:outline-none focus:ring-2 focus:ring-red-200"
                    >
                        <FiRefreshCw size={14} />
                        Clear
                    </button>
                )}
            </div>
        </div>
    );
}

export default Filter;