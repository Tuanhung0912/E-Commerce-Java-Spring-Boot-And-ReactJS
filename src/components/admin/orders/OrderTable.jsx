import { useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import { MdOutlineEmail, MdChevronLeft, MdChevronRight } from 'react-icons/md';
import Modal from '../../shared/Modal';
import UpdateOrderForm from './UpdateOrderForm';

/* ── Status badge config ─────────────────────────────────── */
const statusStyles = {
  Accepted:   { bg: 'bg-emerald-50',  text: 'text-emerald-700', dot: 'bg-emerald-500' },
  Processing: { bg: 'bg-amber-50',    text: 'text-amber-700',   dot: 'bg-amber-500' },
  Shipped:    { bg: 'bg-blue-50',     text: 'text-blue-700',    dot: 'bg-blue-500' },
  Delivered:  { bg: 'bg-indigo-50',   text: 'text-indigo-700',  dot: 'bg-indigo-500' },
  Cancelled:  { bg: 'bg-red-50',      text: 'text-red-700',     dot: 'bg-red-500' },
  Pending:    { bg: 'bg-slate-100',   text: 'text-slate-600',   dot: 'bg-slate-400' },
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

const OrderTable = ({ adminOrder, pagination }) => {
  const [updateOpenModal, setUpdateOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(
    pagination?.pageNumber + 1 || 1
  );

  const [searchParams] = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const pathname = useLocation().pathname;

  const totalPages = pagination?.totalPages || 1;
  const totalElements = pagination?.totalElements || 0;
  const pageSize = pagination?.pageSize || 10;
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalElements);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    params.set("page", newPage.toString());
    navigate(`${pathname}?${params}`);
  };

  const handleEdit = (order) => {
    setSelectedItem(order);
    setUpdateOpenModal(true);
  };

  const formatPrice = (val) => {
    const num = Number(val);
    return isNaN(num) ? val : `$${num.toLocaleString('en-US')}`;
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden">

      {/* ─── Desktop Table ────────────────────────────── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80">
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Order
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Customer
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                Amount
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                Status
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                Date
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {adminOrder?.map((item) => (
              <tr
                key={item.orderId}
                className="group transition-colors duration-200 hover:bg-sky-50/40"
              >
                {/* Order ID */}
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                    #{item.orderId}
                  </span>
                </td>

                {/* Email */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-slate-600">
                    <MdOutlineEmail className="text-lg text-slate-400 shrink-0" />
                    <span className="text-sm truncate max-w-[200px]">{item.email}</span>
                  </div>
                </td>

                {/* Amount */}
                <td className="px-6 py-4 text-center">
                  <span className="font-semibold text-slate-800">{formatPrice(item.totalAmount)}</span>
                </td>

                {/* Status */}
                <td className="px-6 py-4 text-center">
                  <StatusBadge status={item.orderStatus} />
                </td>

                {/* Date */}
                <td className="px-6 py-4 text-center">
                  <span className="text-sm text-slate-500">{item.orderDate}</span>
                </td>

                {/* Action */}
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleEdit({
                      id: item.orderId,
                      email: item.email,
                      totalAmount: item.totalAmount,
                      status: item.orderStatus,
                      date: item.orderDate,
                    })}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3.5 py-1.5
                      text-xs font-medium text-indigo-700 transition-all duration-200
                      hover:bg-indigo-100 hover:border-indigo-300"
                  >
                    <FaEdit className="text-sm" />
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ─── Mobile Cards ─────────────────────────────── */}
      <div className="md:hidden divide-y divide-slate-100">
        {adminOrder?.map((item) => (
          <div
            key={item.orderId}
            className="p-4 transition-colors hover:bg-sky-50/30"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                  #{item.orderId}
                </span>
                <p className="text-sm text-slate-600 mt-1 flex items-center gap-1">
                  <MdOutlineEmail className="text-slate-400" />
                  {item.email}
                </p>
              </div>
              <StatusBadge status={item.orderStatus} />
            </div>

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-4">
                <span className="font-semibold text-slate-800">{formatPrice(item.totalAmount)}</span>
                <span className="text-xs text-slate-400">{item.orderDate}</span>
              </div>
              <button
                onClick={() => handleEdit({
                  id: item.orderId,
                  email: item.email,
                  totalAmount: item.totalAmount,
                  status: item.orderStatus,
                  date: item.orderDate,
                })}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
              >
                <FaEdit className="text-sm" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Pagination ───────────────────────────────── */}
      {totalPages > 0 && (
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-6 py-3">
          <p className="text-sm text-slate-500">
            Showing{' '}
            <span className="font-medium text-slate-700">
              {startItem}–{endItem}
            </span>{' '}
            of{' '}
            <span className="font-medium text-slate-700">{totalElements}</span>{' '}
            orders
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
                  ${page === currentPage
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-200'
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

      {/* ─── Update Modal (unchanged) ─────────────────── */}
      <Modal
        open={updateOpenModal}
        setOpen={setUpdateOpenModal}
        title='Update Order Status'>
        <UpdateOrderForm
          setOpen={setUpdateOpenModal}
          open={updateOpenModal}
          loader={loader}
          setLoader={setLoader}
          selectedId={selectedItem.id}
          selectedItem={selectedItem}
        />
      </Modal>
    </div>
  )
}

export default OrderTable