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

    // Glass-morph on scroll
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
            <div className="lg:px-14 sm:px-8 px-4 w-full flex justify-between items-center">
                {/* ─── Logo ─────────────────────────────── */}
                <Link to="/" className="flex items-center gap-2.5 group">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/20 group-hover:scale-105">
                        <FaStore className="text-lg text-white" />
                    </div>
                    <span className="text-xl font-bold text-white tracking-tight">
                        E-Shop
                    </span>
                </Link>

                {/* ─── Desktop + Mobile Links ──────────── */}
                <ul
                    className={`flex sm:gap-1 gap-1 sm:items-center text-slate-800 sm:static absolute left-0 top-[70px] sm:shadow-none shadow-xl
                        ${navbarOpen ? "h-fit sm:pb-0 pb-5" : "h-0 overflow-hidden"}
                        transition-all duration-300 sm:h-fit
                        sm:bg-transparent bg-slate-900/98 backdrop-blur-lg
                        text-white sm:w-fit w-full sm:flex-row flex-col px-4 sm:px-0`}
                >
                    {navLinks.map(({ to, label }) => (
                        <li key={to}>
                            <Link
                                to={to}
                                className={`relative px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 block
                                    ${path === to
                                        ? "text-white bg-white/15"
                                        : "text-slate-300 hover:text-white hover:bg-white/10"
                                    }`}
                            >
                                {label}
                                {path === to && (
                                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-5 rounded-full bg-indigo-400 hidden sm:block" />
                                )}
                            </Link>
                        </li>
                    ))}

                    {/* Cart */}
                    <li>
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
                    </li>

                    {/* Auth */}
                    {(user && user.id) ? (
                        <li className="sm:ml-1">
                            <UserMenu />
                        </li>
                    ) : (
                        <li className="sm:ml-1">
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 px-5 py-2
                                    bg-gradient-to-r from-indigo-500 to-violet-500
                                    text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/25
                                    hover:from-indigo-600 hover:to-violet-600 hover:shadow-indigo-500/40
                                    transition-all duration-300 hover:scale-[1.03]"
                            >
                                <FaSignInAlt className="text-sm" />
                                Login
                            </Link>
                        </li>
                    )}
                </ul>

                {/* ─── Mobile Toggle ───────────────────── */}
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
        </nav>
    )
}

export default Navbar;