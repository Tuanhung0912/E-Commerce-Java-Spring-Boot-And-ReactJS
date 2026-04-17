import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserAddresses } from "../../store/actions";
import { BiUser } from "react-icons/bi";
import { FaEnvelope, FaShieldAlt, FaMapMarkerAlt, FaPlus, FaShoppingCart } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { Link } from "react-router-dom";
import Loader from "../shared/Loader";

const Profile = () => {
    const dispatch = useDispatch();
    const { user, address } = useSelector((state) => state.auth);
    const { isLoading } = useSelector((state) => state.errors);

    useEffect(() => {
        dispatch(getUserAddresses());
    }, [dispatch]);

    const initial = user?.username?.charAt(0)?.toUpperCase() || "U";
    const isAdmin = user?.roles?.includes("ROLE_ADMIN");
    const isSeller = user?.roles?.includes("ROLE_SELLER");

    const roleBadge = isAdmin ? "Admin" : isSeller ? "Seller" : "Customer";
    const roleColor = isAdmin
        ? "from-rose-500 to-pink-500"
        : isSeller
        ? "from-amber-500 to-orange-500"
        : "from-emerald-500 to-teal-500";

    return (
        <div>
            {/* ─── Hero Banner ─────────────────────────── */}
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
                <div className="absolute top-0 left-1/3 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
                <div className="absolute bottom-0 right-1/4 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />

                <div className="relative max-w-5xl mx-auto px-4 sm:px-8 py-16 sm:py-20">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        {/* Avatar */}
                        <div className="flex h-24 w-24 items-center justify-center rounded-2xl
                            bg-gradient-to-br from-indigo-400 to-violet-500 text-white text-4xl font-bold
                            ring-4 ring-white/20 shadow-2xl shadow-indigo-500/30">
                            {initial}
                        </div>

                        {/* User info */}
                        <div className="text-center sm:text-left">
                            <h1 className="text-2xl sm:text-3xl font-bold text-white">
                                {user?.username}
                            </h1>
                            <p className="text-slate-400 mt-1 flex items-center justify-center sm:justify-start gap-2">
                                <FaEnvelope className="text-sm" />
                                {user?.email || "No email set"}
                            </p>
                            <span className={`inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full
                                bg-gradient-to-r ${roleColor} text-white text-xs font-semibold shadow-lg`}>
                                <FaShieldAlt className="text-[10px]" />
                                {roleBadge}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Content ─────────────────────────────── */}
            <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10">
                <div className="grid lg:grid-cols-3 gap-6">

                    {/* ─── Account Info Card ──────────── */}
                    <div className="lg:col-span-1">
                        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
                            <h2 className="text-lg font-bold text-slate-800 mb-4">Account Details</h2>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50">
                                        <BiUser className="text-indigo-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 uppercase tracking-wider">Username</p>
                                        <p className="text-sm font-medium text-slate-700">{user?.username}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50">
                                        <FaEnvelope className="text-indigo-500 text-sm" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 uppercase tracking-wider">Email</p>
                                        <p className="text-sm font-medium text-slate-700">{user?.email || "—"}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50">
                                        <FaShieldAlt className="text-indigo-500 text-sm" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 uppercase tracking-wider">Roles</p>
                                        <div className="flex flex-wrap gap-1.5 mt-1">
                                            {user?.roles?.map((role, i) => (
                                                <span key={i} className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-xs font-medium text-slate-600">
                                                    {role.replace("ROLE_", "")}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick links */}
                            <div className="mt-6 pt-5 border-t border-slate-100 space-y-2">
                                <Link
                                    to="/profile/orders"
                                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600
                                        transition-colors hover:bg-indigo-50 hover:text-indigo-700"
                                >
                                    <FaShoppingCart className="text-slate-400" />
                                    My Orders
                                </Link>
                                {(isAdmin || isSeller) && (
                                    <Link
                                        to={isAdmin ? "/admin" : "/admin/orders"}
                                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600
                                            transition-colors hover:bg-indigo-50 hover:text-indigo-700"
                                    >
                                        <FaShieldAlt className="text-slate-400" />
                                        {isAdmin ? "Admin Panel" : "Seller Panel"}
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ─── Addresses Card ──────────────── */}
                    <div className="lg:col-span-2">
                        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-lg font-bold text-slate-800">
                                    Saved Addresses
                                    {address?.length > 0 && (
                                        <span className="ml-2 text-sm font-normal text-slate-400">
                                            ({address.length})
                                        </span>
                                    )}
                                </h2>
                            </div>

                            {isLoading ? (
                                <Loader />
                            ) : !address || address.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 mb-3">
                                        <FaMapMarkerAlt className="text-2xl text-slate-400" />
                                    </div>
                                    <h3 className="text-base font-semibold text-slate-700">No Addresses Saved</h3>
                                    <p className="text-sm text-slate-400 mt-1">Add an address during checkout.</p>
                                </div>
                            ) : (
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {address.map((addr, i) => (
                                        <div
                                            key={addr.addressId || i}
                                            className="group rounded-xl border border-slate-200 bg-slate-50/50 p-4
                                                transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-50/30"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white border border-slate-200">
                                                    <FaMapMarkerAlt className="text-indigo-500 text-xs" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium text-slate-700 truncate">
                                                        {addr.street || addr.buildingName}
                                                    </p>
                                                    <p className="text-xs text-slate-500 mt-0.5">
                                                        {[addr.city, addr.state].filter(Boolean).join(", ")}
                                                    </p>
                                                    <p className="text-xs text-slate-400 mt-0.5">
                                                        {[addr.country, addr.pincode || addr.pinCode].filter(Boolean).join(" – ")}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
