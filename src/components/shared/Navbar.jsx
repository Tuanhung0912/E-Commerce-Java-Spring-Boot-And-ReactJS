import { Badge } from "@mui/material";
import { useState, useEffect } from "react";
import { FaShoppingCart, FaSignInAlt, FaStore } from "react-icons/fa";
import { IoIosMenu } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import UserMenu from "../UserMenu";

const Navbar = () => {
    const path = useLocation().pathname;
    const [navbarOpen, setNavbarOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { cart } = useSelector((state) => state.carts);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { to: "/", label: "Home" },
        { to: "/products", label: "Products" },
        { to: "/about", label: "About" },
        { to: "/contact", label: "Contact" },
    ];

    return (
        <nav
            className={`h-[70px] z-50 flex items-center sticky top-0 transition-all duration-300
                ${scrolled
                    ? "bg-slate-900/95 backdrop-blur-md shadow-lg shadow-slate-900/20"
                    : "bg-custom-gradient"
                }`}
        >
            <div className="lg:px-14 sm:px-8 px-4 w-full flex items-center justify-between">

                {/* ─── Left: Logo ──────────────────────── */}
                <Link to="/" className="flex items-center gap-2.5 group shrink-0">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/20 group-hover:scale-105">
                        <FaStore className="text-lg text-white" />
                    </div>
                    <span className="text-xl font-bold text-white tracking-tight hidden sm:inline">
                        E-Shop
                    </span>
                </Link>

                {/* ─── Center: Nav Links (desktop) ─────── */}
                <ul className="hidden sm:flex items-center gap-1">
                    {navLinks.map(({ to, label }) => (
                        <li key={to}>
                            <Link
                                to={to}
                                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                                    ${path === to
                                        ? "text-white bg-white/15"
                                        : "text-slate-300 hover:text-white hover:bg-white/10"
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

                {/* ─── Right: Cart + Auth (OUTSIDE nav links) ── */}
                <div className="flex items-center gap-3 shrink-0">
                    {/* Cart */}
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

                    {/* User Menu or Login — completely separate */}
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

            {/* ─── Mobile Nav Dropdown ─────────────────── */}
            {navbarOpen && (
                <div className="sm:hidden absolute left-0 top-[70px] w-full bg-slate-900/98 backdrop-blur-lg shadow-xl border-t border-white/10"
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