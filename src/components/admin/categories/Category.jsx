import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  FaFolderOpen,
  FaThList,
  FaEdit,
  FaTrashAlt,
} from "react-icons/fa";
import {
  MdChevronLeft,
  MdChevronRight,
  MdCategory,
} from "react-icons/md";
import toast from "react-hot-toast";

import Modal from "../../shared/Modal";
import AddCategoryForm from "./AddCategoryForm";
import Loader from "../../shared/Loader";
import { DeleteModal } from "../../../components/shared/DeleteModal";
import useCategoryFilter from "../../hooks/useCategoryFilter";
import ErrorPage from "../../shared/ErrorPage";
import { deleteCategoryDashboardAction } from "../../../store/actions";

/* ── Color palette for category icons ────────────────────── */
const iconColors = [
  "from-violet-400 to-purple-600",
  "from-sky-400 to-blue-600",
  "from-emerald-400 to-teal-600",
  "from-amber-400 to-orange-500",
  "from-pink-400 to-rose-500",
  "from-cyan-400 to-cyan-600",
];

const Category = () => {
  const [searchParams] = useSearchParams();
  const pathname = useLocation().pathname;
  const params = new URLSearchParams(searchParams);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const { categoryLoader, errorMessage } = useSelector((state) => state.errors);
  const { categories, pagination } = useSelector((state) => state.products);
  const [currentPage, setCurrentPage] = useState(
    pagination?.pageNumber + 1 || 1
  );

  // Calling the `useCategoryFilter` custom hook to handle category fetching and pagination based on the current URL parameters.
  useCategoryFilter();

  const handleEdit = (category) => {
    setOpenUpdateModal(true);
    setSelectedCategory(category);
  };

  const handleDelete = (category) => {
    setSelectedCategory(category);
    setOpenDeleteModal(true);
  };

  const onDeleteHandler = () => {
    dispatch(
      deleteCategoryDashboardAction(setOpenDeleteModal, selectedCategory?.id, toast)
    );
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    params.set("page", newPage.toString());
    navigate(`${pathname}?${params}`);
  };

  const emptyCategories = !categories || categories?.length === 0;

  const totalPages = pagination?.totalPages || 1;
  const totalElements = pagination?.totalElements || 0;
  const pageSize = pagination?.pageSize || 10;
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalElements);

  if (errorMessage) return <ErrorPage message={errorMessage} />;

  return (
    <div>
      {/* ─── Header ───────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Categories</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Manage product categories
            {totalElements > 0 && (
              <span className="ml-1 text-slate-500 font-medium">
                · {totalElements} total
              </span>
            )}
          </p>
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600
            px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-200
            transition-all duration-300 hover:from-violet-600 hover:to-purple-700 hover:shadow-violet-300 hover:scale-[1.03]"
        >
          <FaThList className="text-base" />
          Add Category
        </button>
      </div>

      {/* ─── Content ──────────────────────────────────── */}
      {categoryLoader ? (
        <Loader />
      ) : (
        <>
          {emptyCategories ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-20">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 mb-4">
                <FaFolderOpen className="text-3xl text-slate-400" />
              </div>
              <h2 className="text-xl font-semibold text-slate-700">
                No Categories Yet
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Get started by creating your first product category.
              </p>
              <button
                onClick={() => setOpenModal(true)}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-violet-500 px-4 py-2 text-sm font-medium text-white hover:bg-violet-600 transition-colors"
              >
                <FaThList />
                Add Category
              </button>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden">
              {/* ─── Desktop Table ──────────────────────── */}
              <div className="hidden md:block">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/80">
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Category
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        ID
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {categories?.map((cat, idx) => (
                      <tr
                        key={cat.categoryId}
                        className="group transition-colors duration-200 hover:bg-violet-50/40"
                      >
                        {/* Category name + icon */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${
                                iconColors[idx % iconColors.length]
                              } text-white shadow-sm`}
                            >
                              <MdCategory className="text-lg" />
                            </div>
                            <span className="font-medium text-slate-800">
                              {cat.categoryName}
                            </span>
                          </div>
                        </td>

                        {/* ID */}
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                            #{cat.categoryId}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() =>
                                handleEdit({
                                  id: cat.categoryId,
                                  categoryName: cat.categoryName,
                                })
                              }
                              className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3.5 py-1.5
                                text-xs font-medium text-indigo-700 transition-all duration-200
                                hover:bg-indigo-100 hover:border-indigo-300"
                            >
                              <FaEdit className="text-sm" />
                              Edit
                            </button>
                            <button
                              onClick={() =>
                                handleDelete({
                                  id: cat.categoryId,
                                  categoryName: cat.categoryName,
                                })
                              }
                              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-1.5
                                text-xs font-medium text-red-700 transition-all duration-200
                                hover:bg-red-100 hover:border-red-300"
                            >
                              <FaTrashAlt className="text-sm" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ─── Mobile Cards ─────────────────────── */}
              <div className="md:hidden divide-y divide-slate-100">
                {categories?.map((cat, idx) => (
                  <div
                    key={cat.categoryId}
                    className="flex items-center gap-4 p-4 transition-colors hover:bg-violet-50/40"
                  >
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${
                        iconColors[idx % iconColors.length]
                      } text-white shadow-sm`}
                    >
                      <MdCategory className="text-xl" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-slate-800 truncate">
                        {cat.categoryName}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        ID: #{cat.categoryId}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() =>
                          handleEdit({
                            id: cat.categoryId,
                            categoryName: cat.categoryName,
                          })
                        }
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                      >
                        <FaEdit className="text-sm" />
                      </button>
                      <button
                        onClick={() =>
                          handleDelete({
                            id: cat.categoryId,
                            categoryName: cat.categoryName,
                          })
                        }
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                      >
                        <FaTrashAlt className="text-sm" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* ─── Pagination ───────────────────────── */}
              {totalPages > 0 && (
                <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-6 py-3">
                  <p className="text-sm text-slate-500">
                    Showing{" "}
                    <span className="font-medium text-slate-700">
                      {startItem}–{endItem}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-slate-700">
                      {totalElements}
                    </span>{" "}
                    categories
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

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-all duration-200
                          ${
                            page === currentPage
                              ? "bg-violet-500 text-white shadow-sm"
                              : "text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}

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
          )}
        </>
      )}

      <Modal
        open={openUpdateModal || openModal}
        setOpen={openUpdateModal ? setOpenUpdateModal : setOpenModal}
        title={openUpdateModal ? "Update Category" : "Add Category"}
      >
        <AddCategoryForm
          setOpen={openUpdateModal ? setOpenUpdateModal : setOpenModal}
          open={categoryLoader}
          category={selectedCategory}
          update={openUpdateModal}
        />
      </Modal>

      <DeleteModal
        open={openDeleteModal}
        loader={categoryLoader}
        setOpen={setOpenDeleteModal}
        title="Are you want to delete this category"
        onDeleteHandler={onDeleteHandler}
      />
    </div>
  );
};

export default Category;