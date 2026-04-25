import { Badge } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { FaShoppingCart, FaSignInAlt, FaStore, FaChevronDown,
    FaMobileAlt, FaLaptop, FaBlender, FaCouch, FaFootballBall,
    FaBook, FaMusic, FaTree, FaUtensils, FaPaintBrush, FaCubes, FaBars
} from "react-icons/fa";
import { IoIosMenu } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import UserMenu from "../UserMenu";
import SearchBar from "./SearchBar";
import { fetchCategories } from "../../store/actions";
import toast from "react-hot-toast";

const Navbar = () => {
    const path = useLocation().pathname;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [navbarOpen, setNavbarOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [megaOpen, setMegaOpen] = useState(false);
    const megaTimeout = useRef(null);
    const { cart } = useSelector((state) => state.carts);
    const { user } = useSelector((state) => state.auth);
    const { categories } = useSelector((state) => state.products);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (!categories) dispatch(fetchCategories());
    }, [dispatch, categories]);

    const iconMap = {
        mobile: FaMobileAlt, computer: FaLaptop, laptop: FaLaptop,
        appliance: FaBlender, home: FaCouch, living: FaCouch,
        sport: FaFootballBall, outdoor: FaTree, book: FaBook,
        stationery: FaBook, music: FaMusic, instrument: FaMusic,
        garden: FaTree, kitchen: FaUtensils, dining: FaUtensils,
        art: FaPaintBrush, craft: FaPaintBrush, sewing: FaPaintBrush,
    };

    const getCategoryIcon = (name) => {
        const lower = name.toLowerCase();
        for (const [key, Icon] of Object.entries(iconMap)) {
            if (lower.includes(key)) return Icon;
        }
        return FaCubes;
    };

    const handleMegaEnter = () => {
        if (megaTimeout.current) clearTimeout(megaTimeout.current);
        setMegaOpen(true);
    };
    const handleMegaLeave = () => {
        megaTimeout.current = setTimeout(() => setMegaOpen(false), 200);
    };

    const navLinks = [
        { to: "/", label: "Home" },
        { to: "/products", label: "Products" },
        { to: "/about", label: "About" },
        { to: "/contact", label: "Contact" },
    ];

    return (
        <nav className={`z-50 sticky top-0 transition-all duration-300 ${scrolled ? "bg-slate-900/95 backdrop-blur-md shadow-lg shadow-slate-900/20" : "bg-slate-900"}`}>

            {/* ═══ ROW 1: Logo + SearchBar + Cart/Auth ═══ */}
            <div className="h-[60px] lg:px-14 sm:px-8 px-4 w-full flex items-center gap-5">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 group shrink-0">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/20 group-hover:scale-105">
                            <FaStore className="text-lg text-white" />
                        </div>
                        <span className="text-xl font-bold text-white tracking-tight hidden sm:inline">
                            E-Shop
                        </span>
                    </Link>

                    {/* Search Bar */}
                    <div className="hidden sm:block flex-1 max-w-lg mx-auto">
                        <SearchBar />
                    </div>

                    {/* Cart + Auth */}
                    <div className="flex items-center gap-3 shrink-0">
                        {user && user.id ? (
                            <Link
                                to="/cart"
                                className={`relative px-3 py-2 rounded-lg transition-all duration-200 flex items-center
                                    ${path === "/cart"
                                        ? "text-white bg-white/15"
                                        : "text-slate-300 hover:text-white hover:bg-white/10"
                                    }`}
                            >
                                <Badge
                                    showZero
                                    badgeContent={cart?.length || 0}
                                    color="primary"
                                    overlap="circular"
                                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                >
                                    <FaShoppingCart size={20} />
                                </Badge>
                            </Link>
                        ) : (
                            <button
                                onClick={() => {
                                    toast((t) => (
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100">
                                                <FaShoppingCart className="text-indigo-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-800">Login Required</p>
                                                <p className="text-xs text-slate-500 mt-0.5">Sign in to access your cart</p>
                                            </div>
                                            <button
                                                onClick={() => { toast.dismiss(t.id); navigate("/login"); }}
                                                className="ml-2 shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-500 hover:bg-indigo-600 transition-colors"
                                            >
                                                Login
                                            </button>
                                        </div>
                                    ), { duration: 4000, style: { padding: '12px 16px', borderRadius: '16px', maxWidth: '420px' } });
                                }}
                                className="relative px-3 py-2 rounded-lg transition-all duration-200 flex items-center text-slate-300 hover:text-white hover:bg-white/10"
                            >
                                <FaShoppingCart size={20} />
                            </button>
                        )}

                        {(user && user.id) ? (
                            <UserMenu />
                        ) : (
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 px-5 py-2
                                    bg-gradient-to-r from-indigo-500 to-violet-500
                                    text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/25
                                    hover:from-indigo-600 hover:to-violet-600 hover:shadow-indigo-500/40
                                    transition-all duration-300 hover:scale-[1.03]"
                            >
                                <FaSignInAlt className="text-sm" />
                                <span className="hidden sm:inline">Login</span>
                            </Link>
                        )}

                        {/* Mobile Toggle */}
                        <button
                            onClick={() => setNavbarOpen(!navbarOpen)}
                            className="sm:hidden flex items-center justify-center h-9 w-9 rounded-lg bg-white/10 transition-colors hover:bg-white/20"
                        >
                            {navbarOpen ? (
                                <RxCross2 className="text-white text-xl" />
                            ) : (
                                <IoIosMenu className="text-white text-xl" />
                            )}
                        </button>
                    </div>
            </div>

            {/* ═══ ROW 2: Categories + Nav Links (seamless, same bg) ═══ */}
            <div className="hidden sm:block border-t border-white/10">
                <div className="lg:px-14 sm:px-8 px-4 flex items-center gap-2">

                    {/* Categories dropdown */}
                    <div className="relative" onMouseEnter={handleMegaEnter} onMouseLeave={handleMegaLeave}>
                        <button className="flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-indigo-600 rounded-t-lg hover:bg-indigo-700 transition-colors">
                            <FaBars className="text-xs" />
                            Categories
                            <FaChevronDown className={`text-[10px] transition-transform duration-200 ${megaOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Mega dropdown */}
                        {megaOpen && categories && (
                            <div className="absolute left-0 top-full z-50" style={{ minWidth: '420px' }}>
                                <div className="rounded-b-2xl bg-white shadow-2xl shadow-slate-900/15 border border-slate-100 border-t-0 overflow-hidden">
                                    <div className="p-3 grid grid-cols-2 gap-1">
                                        {categories.map((cat) => {
                                            const Icon = getCategoryIcon(cat.categoryName);
                                            return (
                                                <button
                                                    key={cat.categoryId}
                                                    onClick={() => {
                                                        setMegaOpen(false);
                                                        navigate(`/products?category=${encodeURIComponent(cat.categoryName)}`);
                                                    }}
                                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-left
                                                        hover:bg-indigo-50 transition-colors duration-150 group"
                                                >
                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-500
                                                        group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                                                        <Icon className="text-sm" />
                                                    </div>
                                                    <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">
                                                        {cat.categoryName}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/30">
                                        <Link
                                            to="/products"
                                            onClick={() => setMegaOpen(false)}
                                            className="text-xs font-semibold text-indigo-500 hover:text-indigo-600 transition-colors"
                                        >
                                            View All Products →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Nav Links */}
                    <ul className="flex items-center gap-2 ml-3">
                        {navLinks.map(({ to, label }) => (
                            <li key={to}>
                                <Link
                                    to={to}
                                    className={`relative px-4 py-3 text-sm font-medium transition-all duration-200
                                        ${path === to
                                            ? "text-white"
                                            : "text-slate-300 hover:text-white"
                                        }`}
                                >
                                    {label}
                                    {path === to && (
                                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-5 rounded-full bg-indigo-400" />
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* ─── Mobile Nav Dropdown ─────────────────── */}
            {navbarOpen && (
                <div className="sm:hidden absolute left-0 top-[60px] w-full bg-slate-900/98 backdrop-blur-lg shadow-xl border-t border-white/10"
                    style={{ zIndex: 9998 }}
                >
                    <ul className="flex flex-col py-2 px-4">
                        {navLinks.map(({ to, label }) => (
                            <li key={to}>
                                <Link
                                    to={to}
                                    onClick={() => setNavbarOpen(false)}
                                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                                        ${path === to
                                            ? "text-white bg-white/15"
                                            : "text-slate-300 hover:text-white hover:bg-white/10"
                                        }`}
                                >
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </nav>
    )
}

export default Navbar;