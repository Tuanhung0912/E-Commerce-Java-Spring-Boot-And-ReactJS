import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import api from "../../api/api";
import { FaShoppingBag, FaBoxOpen, FaChevronLeft, FaChevronRight, FaArrowLeft } from "react-icons/fa";
import { MdPayment } from "react-icons/md";
import Loader from "../shared/Loader";

/* ── Status badge config ─────────────────────────────────── */
const statusStyles = {
    Accepted:   { bg: "bg-emerald-50",  text: "text-emerald-700", dot: "bg-emerald-500" },
    Processing: { bg: "bg-amber-50",    text: "text-amber-700",   dot: "bg-amber-500" },
    Shipped:    { bg: "bg-blue-50",     text: "text-blue-700",    dot: "bg-blue-500" },
    Delivered:  { bg: "bg-indigo-50",   text: "text-indigo-700",  dot: "bg-indigo-500" },
    Cancelled:  { bg: "bg-red-50",      text: "text-red-700",     dot: "bg-red-500" },
    Pending:    { bg: "bg-slate-100",   text: "text-slate-600",   dot: "bg-slate-400" },
};

const StatusBadge = ({ status }) => {
    const s = statusStyles[status] || statusStyles.Pending;
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${s.bg} ${s.text}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
            {status}
        </span>
    );
};

const MyOrders = () => {
    const { user } = useSelector((state) => state.auth);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [pagination, setPagination] = useState({});
    const [expandedOrder, setExpandedOrder] = useState(null);

    const fetchOrders = async (pageNum = 0) => {
        try {
            setLoading(true);
            const { data } = await api.get(`/users/orders?pageNumber=${pageNum}&pageSize=5&sortBy=orderDate&sortOrder=desc`);
            setOrders(data.content || []);
            setPagination({
                pageNumber: data.pageNumber,
                totalPages: data.totalPages,
                totalElements: data.totalElements,
                lastPage: data.lastPage,
            });
        } catch (error) {
            console.error("Failed to fetch orders:", error);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders(page);
    }, [page]);

    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount || 0);
    };

    return (
        <div>
            {/* ─── Hero Banner ─────────────────────────── */}
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
                <div className="absolute top-0 left-1/4 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />
                <div className="absolute bottom-0 right-1/3 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />

                <div className="relative max-w-5xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
                    <Link
                        to="/profile"
                        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-4"
                    >
                        <FaArrowLeft className="text-xs" /> Back to Profile
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl
                            bg-gradient-to-br from-indigo-400 to-violet-500
                            shadow-lg shadow-indigo-500/30">
                            <FaShoppingBag className="text-white text-xl" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-white">My Orders</h1>
                            <p className="text-slate-400 text-sm mt-0.5">
                                {pagination.totalElements || 0} order{pagination.totalElements !== 1 ? "s" : ""} placed
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Content ─────────────────────────────── */}
            <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8">
                {loading ? (
                    <div className="flex justify-center py-20"><Loader /></div>
                ) : orders.length === 0 ? (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center py-20 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 mb-4">
                            <FaBoxOpen className="text-3xl text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-700">No Orders Yet</h3>
                        <p className="text-sm text-slate-400 mt-1 mb-5">Start shopping to see your orders here.</p>
                        <Link
                            to="/products"
                            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white
                                bg-gradient-to-r from-indigo-500 to-violet-500
                                shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:scale-[1.02] transition-all"
                        >
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    /* Orders List */
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div
                                key={order.orderId}
                                className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden
                                    transition-all duration-200 hover:border-slate-300"
                            >
                                {/* Order Header */}
                                <button
                                    onClick={() => setExpandedOrder(expandedOrder === order.orderId ? null : order.orderId)}
                                    className="w-full px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3
                                        text-left hover:bg-slate-50/50 transition-colors cursor-pointer"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl
                                            bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100">
                                            <FaShoppingBag className="text-indigo-500 text-sm" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800">
                                                Order #{order.orderId}
                                            </p>
                                            <p className="text-xs text-slate-400 mt-0.5">
                                                {formatDate(order.orderDate)}
                                                {order.orderItems && (
                                                    <span className="ml-2">
                                                        · {order.orderItems.length} item{order.orderItems.length !== 1 ? "s" : ""}
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 sm:gap-6">
                                        <StatusBadge status={order.orderStatus} />
                                        <p className="text-sm font-bold text-slate-800 min-w-[80px] text-right">
                                            {formatCurrency(order.totalAmount)}
                                        </p>
                                        <svg
                                            className={`w-4 h-4 text-slate-400 transition-transform duration-200
                                                ${expandedOrder === order.orderId ? "rotate-180" : ""}`}
                                            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </button>

                                {/* Expanded Order Items */}
                                {expandedOrder === order.orderId && (
                                    <div className="border-t border-slate-100 px-5 py-4 bg-slate-50/30">
                                        {/* Payment Info */}
                                        {order.payment && (
                                            <div className="flex items-center gap-2 mb-4 text-xs text-slate-500">
                                                <MdPayment className="text-base" />
                                                <span className="font-medium">
                                                    {order.payment.paymentMethod || "N/A"}
                                                </span>
                                                {order.payment.pgStatus && (
                                                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-semibold">
                                                        {order.payment.pgStatus}
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        {/* Items */}
                                        <div className="space-y-3">
                                            {order.orderItems?.map((item) => (
                                                <div
                                                    key={item.orderItemId}
                                                    className="flex items-center gap-4 p-3 rounded-xl bg-white border border-slate-100"
                                                >
                                                    {/* Product Image */}
                                                    <div className="h-14 w-14 shrink-0 rounded-lg bg-slate-100 overflow-hidden">
                                                        {item.product?.image ? (
                                                            <img
                                                                src={item.product?.image?.startsWith('http') ? item.product.image : `${import.meta.env.VITE_BACK_END_URL}/images/${item.product?.image}`}
                                                                alt={item.product?.productName || "Product"}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="h-full w-full flex items-center justify-center text-slate-300">
                                                                <FaBoxOpen />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Product Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-slate-700 truncate">
                                                            {item.product?.productName || "Unknown Product"}
                                                        </p>
                                                        <p className="text-xs text-slate-400 mt-0.5">
                                                            Qty: {item.quantity}
                                                            {item.discount > 0 && (
                                                                <span className="ml-2 text-emerald-600">
                                                                    -{item.discount}% off
                                                                </span>
                                                            )}
                                                        </p>
                                                    </div>

                                                    {/* Price */}
                                                    <p className="text-sm font-semibold text-slate-700 shrink-0">
                                                        {formatCurrency(item.orderedProductPrice * item.quantity)}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="flex items-center justify-center gap-3 pt-4">
                                <button
                                    disabled={page === 0}
                                    onClick={() => setPage(page - 1)}
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium
                                        border border-slate-200 bg-white text-slate-600
                                        hover:bg-slate-50 transition-colors
                                        disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <FaChevronLeft className="text-xs" /> Prev
                                </button>
                                <span className="text-sm text-slate-500">
                                    Page {page + 1} / {pagination.totalPages}
                                </span>
                                <button
                                    disabled={pagination.lastPage}
                                    onClick={() => setPage(page + 1)}
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium
                                        border border-slate-200 bg-white text-slate-600
                                        hover:bg-slate-50 transition-colors
                                        disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    Next <FaChevronRight className="text-xs" />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
