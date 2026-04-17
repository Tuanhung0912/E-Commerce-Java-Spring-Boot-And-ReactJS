import React, { useState } from "react";
import { useSelector } from "react-redux";
import { MdPersonAdd, MdPeople } from "react-icons/md";

import SellerTable from "./SellerTable";
import ErrorPage from "../../shared/ErrorPage";
import Loader from "../../shared/Loader";
import Modal from "../../shared/Modal";
import AddSellerForm from "./AddSellerForm";
import useSellerFilter from "../../hooks/useSellerFilter";

const Sellers = () => {
  const [openModal, setOpenModal] = useState(false);
  const { sellers, pagination } = useSelector((state) => state.seller);
  const { isLoading, errorMessage } = useSelector((state) => state.errors);

  // Calling the `useSellerFilter` custom hook to fetch sellers and pagination based on the current URL parameters.
  useSellerFilter();

  const emptySellers = !sellers || sellers?.length === 0;

  if (errorMessage) {
    return <ErrorPage message={errorMessage} />;
  }

  return (
    <React.Fragment>
      {/* ─── Header ───────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Sellers</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Manage all seller accounts
            {pagination?.totalElements > 0 && (
              <span className="ml-1 text-slate-500 font-medium">
                · {pagination.totalElements} total
              </span>
            )}
          </p>
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 
            px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 
            transition-all duration-300 hover:from-indigo-600 hover:to-indigo-700 hover:shadow-indigo-300 hover:scale-[1.03]"
        >
          <MdPersonAdd className="text-lg" />
          Add Seller
        </button>
      </div>

      {/* ─── Content ──────────────────────────────────── */}
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {emptySellers ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-20">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 mb-4">
                <MdPeople className="text-3xl text-slate-400" />
              </div>
              <h2 className="text-xl font-semibold text-slate-700">
                No Sellers Yet
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Get started by adding your first seller account.
              </p>
              <button
                onClick={() => setOpenModal(true)}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600 transition-colors"
              >
                <MdPersonAdd />
                Add Seller
              </button>
            </div>
          ) : (
            <SellerTable sellers={sellers} pagination={pagination} />
          )}
        </>
      )}

      <Modal open={openModal} setOpen={setOpenModal} title="Add New Seller">
        <AddSellerForm setOpen={setOpenModal} />
      </Modal>
    </React.Fragment>
  );
};

export default Sellers;