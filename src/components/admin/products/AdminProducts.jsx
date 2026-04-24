import React, { useState } from 'react'
import { MdAddShoppingCart, MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../shared/Loader';
import { FaBoxOpen, FaEdit, FaTrashAlt, FaImage, FaEye, FaImages } from 'react-icons/fa';
import { useDashboardProductFilter } from '../../hooks/useProductFilter';
import Modal from '../../shared/Modal';
import AddProductForm from './AddProductForm';
import DeleteModal from '../../shared/DeleteModal';
import { deleteProduct } from '../../../store/actions';
import toast from 'react-hot-toast';
import ImageUploadForm from './ImageUploadForm';
import ProductViewModal from '../../shared/ProductViewModal';
import GalleryImageModal from './GalleryImageModal';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

const AdminProducts = () => {
  const { products, pagination } = useSelector((state) => state.products);
  const { isLoading, errorMessage } = useSelector((state) => state.errors);
  const [currentPage, setCurrentPage] = useState(
    pagination?.pageNumber + 1 || 1
  );

  const dispatch = useDispatch();

  const [selectedProduct, setSelectedProduct] = useState('');
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openProductViewModal, setOpenProductViewModal] = useState(false);
  const [openImageUploadModal, setOpenImageUploadModal] = useState(false);
  const [openGalleryModal, setOpenGalleryModal] = useState(false);

  const [loader, setLoader] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const pathname = useLocation().pathname;

  const { user } = useSelector((state) => state.auth);
  const isAdmin = user && user?.roles?.includes("ROLE_ADMIN");

  useDashboardProductFilter();

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setOpenUpdateModal(true);
  };

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setOpenDeleteModal(true);
  };

  const handleImageUpload = (product) => {
    setSelectedProduct(product);
    setOpenImageUploadModal(true);
  };

  const handleProductView = (product) => {
    setSelectedProduct(product);
    setOpenProductViewModal(true);
  };

  const handleGallery = (product) => {
    setSelectedProduct(product);
    setOpenGalleryModal(true);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    params.set("page", newPage.toString());
    navigate(`${pathname}?${params}`);
  };

  const onDeleteHandler = () => {
    dispatch(deleteProduct(setLoader, selectedProduct?.id, toast, setOpenDeleteModal, isAdmin));
  };

  const emptyProduct = !products || products?.length === 0;
  const totalPages = pagination?.totalPages || 1;
  const totalElements = pagination?.totalElements || 0;
  const pageSize = pagination?.pageSize || 10;
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalElements);

  const formatPrice = (val) => {
    const num = Number(val);
    return isNaN(num) ? val : `$${num.toLocaleString('en-US', { minimumFractionDigits: 0 })}`;
  };

  return (
    <div>
      {/* ─── Header ───────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Products</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Manage your product catalog
            {totalElements > 0 && (
              <span className="ml-1 text-slate-500 font-medium">
                · {totalElements} items
              </span>
            )}
          </p>
        </div>

        <button
          onClick={() => setOpenAddModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600
            px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-200
            transition-all duration-300 hover:from-blue-600 hover:to-blue-700 hover:shadow-blue-300 hover:scale-[1.03]"
        >
          <MdAddShoppingCart className="text-lg" />
          Add Product
        </button>
      </div>

      {/* ─── Content ──────────────────────────────────── */}
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {emptyProduct ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-20">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 mb-4">
                <FaBoxOpen className="text-3xl text-slate-400" />
              </div>
              <h2 className="text-xl font-semibold text-slate-700">
                No Products Yet
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Start by adding your first product to the catalog.
              </p>
              <button
                onClick={() => setOpenAddModal(true)}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
              >
                <MdAddShoppingCart />
                Add Product
              </button>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden">
              {/* ─── Desktop Table ──────────────────────── */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/80">
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Product
                      </th>
                      <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Price
                      </th>
                      <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Qty
                      </th>
                      <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Special Price
                      </th>
                      <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products?.map((item) => {
                      const hasDiscount = item.discount > 0;
                      return (
                        <tr
                          key={item.productId}
                          className="group transition-colors duration-200 hover:bg-blue-50/40"
                        >
                          {/* Product info */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-200">
                                {item.image ? (
                                  <img
                                    src={item.image}
                                    alt={item.productName}
                                    className="h-full w-full object-cover"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      e.target.nextSibling.style.display = 'flex';
                                    }}
                                  />
                                ) : null}
                                <div
                                  className={`h-full w-full items-center justify-center text-slate-400 ${item.image ? 'hidden' : 'flex'}`}
                                >
                                  <FaBoxOpen className="text-lg" />
                                </div>
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium text-slate-800 truncate max-w-[200px]">
                                  {item.productName}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-xs text-slate-400">#{item.productId}</span>
                                  {hasDiscount && (
                                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                                      -{item.discount}%
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Price */}
                          <td className="px-5 py-4 text-center">
                            <span className="font-medium text-slate-700">{formatPrice(item.price)}</span>
                          </td>

                          {/* Quantity */}
                          <td className="px-5 py-4 text-center">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                              ${item.quantity > 10 
                                ? 'bg-emerald-50 text-emerald-700' 
                                : item.quantity > 0 
                                  ? 'bg-amber-50 text-amber-700' 
                                  : 'bg-red-50 text-red-700'
                              }`}>
                              {item.quantity} in stock
                            </span>
                          </td>

                          {/* Special Price */}
                          <td className="px-5 py-4 text-center">
                            <span className="font-semibold text-indigo-600">{formatPrice(item.specialPrice)}</span>
                          </td>

                          {/* Actions */}
                          <td className="px-5 py-4">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleProductView({
                                  id: item.productId,
                                  productName: item.productName,
                                  description: item.description,
                                  price: item.price,
                                  quantity: item.quantity,
                                  specialPrice: item.specialPrice,
                                  discount: item.discount,
                                  image: item.image,
                                })}
                                title="View"
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 
                                  transition-all hover:bg-slate-100 hover:border-slate-300"
                              >
                                <FaEye className="text-sm" />
                              </button>
                              <button
                                onClick={() => handleImageUpload({
                                  id: item.productId,
                                  productName: item.productName,
                                  image: item.image,
                                })}
                                title="Upload Image"
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-600 
                                  transition-all hover:bg-emerald-100 hover:border-emerald-300"
                              >
                                <FaImage className="text-sm" />
                              </button>
                              <button
                                onClick={() => handleGallery({
                                  id: item.productId,
                                  productName: item.productName,
                                })}
                                title="Gallery Images"
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-violet-200 bg-violet-50 text-violet-600 
                                  transition-all hover:bg-violet-100 hover:border-violet-300"
                              >
                                <FaImages className="text-sm" />
                              </button>
                              <button
                                onClick={() => handleEdit({
                                  id: item.productId,
                                  productName: item.productName,
                                  description: item.description,
                                  price: item.price,
                                  quantity: item.quantity,
                                  specialPrice: item.specialPrice,
                                  discount: item.discount,
                                  image: item.image,
                                })}
                                title="Edit"
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-600 
                                  transition-all hover:bg-indigo-100 hover:border-indigo-300"
                              >
                                <FaEdit className="text-sm" />
                              </button>
                              <button
                                onClick={() => handleDelete({
                                  id: item.productId,
                                  productName: item.productName,
                                })}
                                title="Delete"
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 
                                  transition-all hover:bg-red-100 hover:border-red-300"
                              >
                                <FaTrashAlt className="text-sm" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* ─── Mobile/Tablet Cards ──────────────── */}
              <div className="lg:hidden divide-y divide-slate-100">
                {products?.map((item) => (
                  <div
                    key={item.productId}
                    className="p-4 transition-colors hover:bg-blue-50/30"
                  >
                    <div className="flex items-start gap-3">
                      {/* Image */}
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-200">
                        {item.image ? (
                          <img src={item.image} alt={item.productName}
                            className="h-full w-full object-cover"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-slate-400">
                            <FaBoxOpen />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-slate-800 truncate">
                              {item.productName}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">#{item.productId}</p>
                          </div>
                          {item.discount > 0 && (
                            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                              -{item.discount}%
                            </span>
                          )}
                        </div>

                        {/* Price row */}
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-sm text-slate-500">{formatPrice(item.price)}</span>
                          <span className="text-sm font-semibold text-indigo-600">{formatPrice(item.specialPrice)}</span>
                          <span className={`text-xs rounded-full px-2 py-0.5
                            ${item.quantity > 10
                              ? 'bg-emerald-50 text-emerald-700'
                              : item.quantity > 0
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-red-50 text-red-700'
                            }`}>
                            {item.quantity} qty
                          </span>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1.5 mt-3">
                          <button
                            onClick={() => handleProductView({
                              id: item.productId, productName: item.productName,
                              description: item.description, price: item.price,
                              quantity: item.quantity, specialPrice: item.specialPrice,
                              discount: item.discount, image: item.image,
                            })}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100"
                          >
                            <FaEye className="text-xs" />
                          </button>
                          <button
                            onClick={() => handleImageUpload({
                              id: item.productId, productName: item.productName, image: item.image,
                            })}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-emerald-200 bg-emerald-50 text-emerald-500 hover:bg-emerald-100"
                          >
                            <FaImage className="text-xs" />
                          </button>
                          <button
                            onClick={() => handleGallery({
                              id: item.productId, productName: item.productName,
                            })}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-violet-200 bg-violet-50 text-violet-500 hover:bg-violet-100"
                          >
                            <FaImages className="text-xs" />
                          </button>
                          <button
                            onClick={() => handleEdit({
                              id: item.productId, productName: item.productName,
                              description: item.description, price: item.price,
                              quantity: item.quantity, specialPrice: item.specialPrice,
                              discount: item.discount, image: item.image,
                            })}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-indigo-200 bg-indigo-50 text-indigo-500 hover:bg-indigo-100"
                          >
                            <FaEdit className="text-xs" />
                          </button>
                          <button
                            onClick={() => handleDelete({
                              id: item.productId, productName: item.productName,
                            })}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-red-200 bg-red-50 text-red-500 hover:bg-red-100"
                          >
                            <FaTrashAlt className="text-xs" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ─── Pagination ───────────────────────── */}
              {totalPages > 0 && (
                <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-6 py-3">
                  <p className="text-sm text-slate-500">
                    Showing{' '}
                    <span className="font-medium text-slate-700">
                      {startItem}–{endItem}
                    </span>{' '}
                    of{' '}
                    <span className="font-medium text-slate-700">{totalElements}</span>{' '}
                    products
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
                            ? 'bg-blue-500 text-white shadow-sm'
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
            </div>
          )}
        </>
      )}

      <Modal
        open={openUpdateModal || openAddModal}
        setOpen={openUpdateModal ? setOpenUpdateModal : setOpenAddModal}
        title={openUpdateModal ? "Update Product" : "Add Product"}>
        <AddProductForm
          setOpen={openUpdateModal ? setOpenUpdateModal : setOpenAddModal}
          product={selectedProduct}
          update={openUpdateModal}
        />
      </Modal>

      <Modal
        open={openImageUploadModal}
        setOpen={setOpenImageUploadModal}
        title="Add Product Image">
        <ImageUploadForm
          setOpen={setOpenImageUploadModal}
          product={selectedProduct}
        />
      </Modal>

      <Modal
        open={openGalleryModal}
        setOpen={setOpenGalleryModal}
        title={`Gallery — ${selectedProduct?.productName || 'Product'}`}>
        <GalleryImageModal
          setOpen={setOpenGalleryModal}
          product={selectedProduct}
        />
      </Modal>

      <DeleteModal
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        loader={loader}
        title="Delete Product"
        onDeleteHandler={onDeleteHandler} />

      <ProductViewModal
        open={openProductViewModal}
        setOpen={setOpenProductViewModal}
        product={selectedProduct}
        isAvailable={selectedProduct?.quantity && Number(selectedProduct.quantity) > 0}
      />
    </div>
  )
}

export default AdminProducts