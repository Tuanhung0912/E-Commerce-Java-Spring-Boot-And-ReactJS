import React, { useState, useRef, useEffect } from 'react'
import { BiUser } from 'react-icons/bi';
import { FaShoppingCart, FaUserShield } from 'react-icons/fa';
import { IoExitOutline } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logOutUser } from '../store/actions';

const UserMenu = () => {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isAdmin = user && user?.roles.includes("ROLE_ADMIN");
    const isSeller = user && user?.roles.includes("ROLE_SELLER");

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close on Escape
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, []);

    const logOutHandler = () => {
        setOpen(false);
        dispatch(logOutUser(navigate));
    };

    const handleLinkClick = () => {
        setOpen(false);
    };

    const initial = user?.username?.charAt(0)?.toUpperCase() || "U";

    return (
        <div className="relative" ref={menuRef}>
            {/* ─── Avatar trigger ──────────────────────── */}
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="flex h-9 w-9 items-center justify-center rounded-full
                    bg-gradient-to-br from-indigo-400 to-violet-500 text-white text-sm font-bold
                    ring-2 ring-white/20 shadow-lg shadow-indigo-500/20
                    transition-all duration-300
                    hover:ring-white/40 hover:shadow-indigo-500/30 hover:scale-105
                    focus:outline-none"
            >
                {initial}
            </button>

            {/* ─── Dropdown ────────────────────────────── */}
            {open && (
                <div
                    className="absolute right-0 mt-2
                        w-56 rounded-xl border border-slate-200 bg-white
                        shadow-xl shadow-slate-900/10
                        overflow-hidden"
                    style={{ zIndex: 9999 }}
                >
                    {/* User info header */}
                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/80">
                        <p className="text-sm font-semibold text-slate-800 truncate">
                            {user?.username}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5 truncate">
                            {user?.email || (isAdmin ? "Administrator" : isSeller ? "Seller" : "Customer")}
                        </p>
                    </div>

                    {/* Menu items */}
                    <div className="py-1">
                        <Link
                            to="/profile"
                            onClick={handleLinkClick}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700
                                transition-colors duration-150 hover:bg-indigo-50 hover:text-indigo-700"
                        >
                            <BiUser className="text-lg text-slate-400" />
                            Profile
                        </Link>

                        <Link
                            to="/profile/orders"
                            onClick={handleLinkClick}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700
                                transition-colors duration-150 hover:bg-indigo-50 hover:text-indigo-700"
                        >
                            <FaShoppingCart className="text-lg text-slate-400" />
                            My Orders
                        </Link>

                        {(isAdmin || isSeller) && (
                            <Link
                                to={isAdmin ? "/admin" : "/admin/orders"}
                                onClick={handleLinkClick}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700
                                    transition-colors duration-150 hover:bg-indigo-50 hover:text-indigo-700"
                            >
                                <FaUserShield className="text-lg text-slate-400" />
                                {isAdmin ? "Admin Panel" : "Seller Panel"}
                            </Link>
                        )}
                    </div>

                    {/* Logout */}
                    <div className="border-t border-slate-100 p-1.5">
                        <button
                            type="button"
                            onClick={logOutHandler}
                            className="flex w-full items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium
                                text-red-600 transition-colors duration-150
                                hover:bg-red-50"
                        >
                            <IoExitOutline className="text-lg" />
                            Log Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserMenu