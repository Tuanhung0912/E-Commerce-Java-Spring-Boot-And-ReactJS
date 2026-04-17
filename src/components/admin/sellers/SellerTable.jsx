import React, { useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { MdOutlineEmail, MdChevronLeft, MdChevronRight } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";

const SellerTable = ({ sellers, pagination }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pathname = useLocation().pathname;
  const params = new URLSearchParams(searchParams);
  const [currentPage, setCurrentPage] = useState(pagination?.pageNumber || 1);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    params.set("page", newPage.toString());
    navigate(`${pathname}?${params}`);
  };

  const totalPages = pagination?.totalPages || 1;
  const totalElements = pagination?.totalElements || 0;
  const pageSize = pagination?.pageSize || 10;
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalElements);

  /* ── Color palette for avatar backgrounds ─────── */
  const avatarColors = [
    "from-indigo-400 to-indigo-600",
    "from-emerald-400 to-emerald-600",
    "from-amber-400 to-orange-500",
    "from-pink-400 to-rose-500",
    "from-cyan-400 to-teal-500",
    "from-violet-400 to-purple-600",
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden">
      {/* ─── Desktop Table ────────────────────────────── */}
      <div className="hidden md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80">
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Seller
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Email
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sellers?.map((seller, idx) => (
              <tr
                key={seller.userId}
                className="group transition-colors duration-200 hover:bg-indigo-50/40"
              >
                {/* Seller name + avatar */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${
                        avatarColors[idx % avatarColors.length]
                      } text-white text-sm font-bold shadow-sm`}
                    >
                      {seller.username?.charAt(0).toUpperCase() || "S"}
                    </div>
                    <span className="font-medium text-slate-800">
                      {seller.username}
                    </span>
                  </div>
                </td>

                {/* ID */}
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                    #{seller.userId}
                  </span>
                </td>

                {/* Email */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-slate-600">
                    <MdOutlineEmail className="text-lg text-slate-400" />
                    <span className="text-sm">{seller.email}</span>
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-4 text-right">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ─── Mobile Cards ─────────────────────────────── */}
      <div className="md:hidden divide-y divide-slate-100">
        {sellers?.map((seller, idx) => (
          <div
            key={seller.userId}
            className="flex items-center gap-4 p-4 transition-colors hover:bg-indigo-50/40"
          >
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${
                avatarColors[idx % avatarColors.length]
              } text-white text-base font-bold shadow-sm`}
            >
              {seller.username?.charAt(0).toUpperCase() || "S"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-slate-800 truncate">
                {seller.username}
              </p>
              <p className="text-sm text-slate-500 truncate flex items-center gap-1">
                <MdOutlineEmail className="text-slate-400" />
                {seller.email}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-xs text-slate-400">#{seller.userId}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Active
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Pagination ───────────────────────────────── */}
      {totalPages > 0 && (
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-6 py-3">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-medium text-slate-700">
              {startItem}–{endItem}
            </span>{" "}
            of{" "}
            <span className="font-medium text-slate-700">{totalElements}</span>{" "}
            sellers
          </p>
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage <= 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 
                transition-colors hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <MdChevronLeft className="text-xl" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-all duration-200
                  ${
                    page === currentPage
                      ? "bg-indigo-500 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-200"
                  }`}
              >
                {page}
              </button>
            ))}

            <button
              disabled={currentPage >= totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 
                transition-colors hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <MdChevronRight className="text-xl" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerTable;