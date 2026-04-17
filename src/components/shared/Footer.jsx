import { FaStore, FaFacebookF, FaTwitter, FaInstagram, FaGithub } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const Footer = () => {
    const location = useLocation();

    // Hide footer on admin, login, register pages
    const hiddenPaths = ["/admin", "/login", "/register"];
    const shouldHide = hiddenPaths.some(p => location.pathname.startsWith(p));
    if (shouldHide) return null;

    const currentYear = new Date().getFullYear();

    const quickLinks = [
        { to: "/", label: "Home" },
        { to: "/products", label: "Products" },
        { to: "/about", label: "About Us" },
        { to: "/contact", label: "Contact" },
    ];

    const supportLinks = [
        { to: "/cart", label: "Shopping Cart" },
        { to: "/profile", label: "My Account" },
        { to: "/contact", label: "Help Center" },
    ];

    const socials = [
        { icon: FaFacebookF, href: "#", label: "Facebook" },
        { icon: FaTwitter, href: "#", label: "Twitter" },
        { icon: FaInstagram, href: "#", label: "Instagram" },
        { icon: FaGithub, href: "#", label: "GitHub" },
    ];

    return (
        <footer className="bg-slate-900 text-slate-300">
            {/* Main */}
            <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-14 pt-14 pb-10">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">

                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <Link to="/" className="flex items-center gap-2.5 group mb-4">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg
                                bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/20
                                transition-transform group-hover:scale-105">
                                <FaStore className="text-white text-sm" />
                            </div>
                            <span className="text-xl font-bold text-white tracking-tight">E-Shop</span>
                        </Link>
                        <p className="text-sm text-slate-400 leading-relaxed mb-5 max-w-xs">
                            Your one-stop destination for premium products at unbeatable prices.
                            Shop with confidence.
                        </p>

                        {/* Socials */}
                        <div className="flex items-center gap-2">
                            {socials.map((s, i) => (
                                <a
                                    key={i}
                                    href={s.href}
                                    aria-label={s.label}
                                    className="flex h-9 w-9 items-center justify-center rounded-lg
                                        bg-white/[0.06] border border-white/10
                                        text-slate-400 text-sm
                                        transition-all duration-200
                                        hover:bg-indigo-500/20 hover:text-indigo-400 hover:border-indigo-500/30"
                                >
                                    <s.icon />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                            Quick Links
                        </h3>
                        <ul className="space-y-2.5">
                            {quickLinks.map((link, i) => (
                                <li key={i}>
                                    <Link
                                        to={link.to}
                                        className="text-sm text-slate-400 hover:text-indigo-400 transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                            Support
                        </h3>
                        <ul className="space-y-2.5">
                            {supportLinks.map((link, i) => (
                                <li key={i}>
                                    <Link
                                        to={link.to}
                                        className="text-sm text-slate-400 hover:text-indigo-400 transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                            Stay Updated
                        </h3>
                        <p className="text-sm text-slate-400 mb-3">
                            Subscribe to get special offers and updates.
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="flex-1 min-w-0 px-3.5 py-2.5 rounded-xl text-sm text-white
                                    bg-white/[0.06] border border-white/10
                                    placeholder:text-slate-500
                                    focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400
                                    transition-all duration-200"
                            />
                            <button className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white
                                bg-gradient-to-r from-indigo-500 to-violet-500
                                shadow-lg shadow-indigo-500/20
                                transition-all duration-300
                                hover:shadow-xl hover:shadow-indigo-500/30 hover:scale-[1.02]
                                shrink-0">
                                Join
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-white/[0.06]">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-14 py-5
                    flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-slate-500">
                        © {currentYear} E-Shop. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-slate-500 hover:text-slate-400 cursor-pointer transition-colors">
                            Privacy Policy
                        </span>
                        <span className="text-xs text-slate-500">•</span>
                        <span className="text-xs text-slate-500 hover:text-slate-400 cursor-pointer transition-colors">
                            Terms of Service
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
