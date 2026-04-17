import React from 'react'
import { FaShoppingCart } from 'react-icons/fa';
import OrderTable from './OrderTable';
import { useSelector } from 'react-redux';
import useOrderFilter from '../../hooks/useOrderFilter';
import Loader from '../../shared/Loader';

const Orders = () => {
  const { adminOrder, pagination } = useSelector((state) => state.order);
  const { isLoading } = useSelector((state) => state.errors);

  useOrderFilter();

  const emptyOrder = !adminOrder || adminOrder?.length === 0;

  return (
    <div>
      {/* ─── Header ───────────────────────────────────── */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Orders</h1>
        <p className="text-sm text-slate-400 mt-0.5">
          Track and manage customer orders
          {pagination?.totalElements > 0 && (
            <span className="ml-1 text-slate-500 font-medium">
              · {pagination.totalElements} total
            </span>
          )}
        </p>
      </div>

      {/* ─── Content ──────────────────────────────────── */}
      {isLoading ? (
        <Loader />
      ) : emptyOrder ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-20">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 mb-4">
            <FaShoppingCart className="text-3xl text-slate-400" />
          </div>
          <h2 className="text-xl font-semibold text-slate-700">
            No Orders Yet
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Orders will appear here once customers start shopping.
          </p>
        </div>
      ) : (
        <OrderTable adminOrder={adminOrder} pagination={pagination} />
      )}
    </div>
  )
}

export default Orders