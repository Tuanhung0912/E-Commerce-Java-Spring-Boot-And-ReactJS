import { useEffect, useRef, useState } from "react";
import { FaCloudUploadAlt, FaTrashAlt, FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";
import api from "../../../api/api";
import toast from "react-hot-toast";
import Spinners from "../../shared/Spinners";

const GalleryImageModal = ({ setOpen, product }) => {
    const { user } = useSelector((state) => state.auth);
    const isAdmin = user && user?.roles?.includes("ROLE_ADMIN");

    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const fileInputRef = useRef();

    const baseEndpoint = isAdmin ? "/admin" : "/seller";

    // Fetch existing gallery images
    const fetchImages = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/public/products/${product.id}/images`);
            setImages(data || []);
        } catch (err) {
            console.error("Failed to fetch gallery images:", err);
            setImages([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    // Handle file selection
    const onFilesChange = (e) => {
        const files = Array.from(e.target.files);
        const validFiles = files.filter((f) =>
            ["image/jpeg", "image/jpg", "image/png"].includes(f.type)
        );

        if (validFiles.length !== files.length) {
            toast.error("Only .jpeg, .jpg, .png files are allowed");
        }

        setSelectedFiles(validFiles);

        // Generate previews
        const newPreviews = [];
        validFiles.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                newPreviews.push(reader.result);
                if (newPreviews.length === validFiles.length) {
                    setPreviews([...newPreviews]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const clearSelection = () => {
        setSelectedFiles([]);
        setPreviews([]);
        if (fileInputRef.current) fileInputRef.current.value = null;
    };

    // Upload
    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            toast.error("Please select at least one image");
            return;
        }
        try {
            setUploading(true);
            const formData = new FormData();
            selectedFiles.forEach((file) => formData.append("images", file));

            await api.post(`${baseEndpoint}/products/${product.id}/images`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            toast.success(`${selectedFiles.length} image(s) uploaded successfully`);
            clearSelection();
            fetchImages();
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to upload images";
            toast.error(msg);
        } finally {
            setUploading(false);
        }
    };

    // Delete
    const handleDelete = async (imageId) => {
        try {
            await api.delete(`${baseEndpoint}/products/images/${imageId}`);
            toast.success("Image deleted");
            setImages((prev) => prev.filter((img) => img.imageId !== imageId));
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to delete image";
            toast.error(msg);
        }
    };

    return (
        <div className="py-4 space-y-6 max-h-[70vh] overflow-y-auto px-1">
            {/* ─── Upload Section ──────────────────── */}
            <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-3">
                    Upload Gallery Images
                </h3>
                <label className="flex items-center gap-2 cursor-pointer border-2 border-dashed border-indigo-300
                    rounded-xl p-4 justify-center text-indigo-600 hover:bg-indigo-50 transition-colors">
                    <FaCloudUploadAlt size={22} />
                    <span className="text-sm font-medium">
                        Choose images to upload
                    </span>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={onFilesChange}
                        className="hidden"
                        accept=".jpeg,.jpg,.png"
                        multiple
                    />
                </label>

                {/* Previews */}
                {previews.length > 0 && (
                    <div className="mt-3">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-slate-500">
                                {selectedFiles.length} file(s) selected
                            </span>
                            <button
                                type="button"
                                onClick={clearSelection}
                                className="text-xs text-rose-500 hover:text-rose-600 font-medium"
                            >
                                Clear
                            </button>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            {previews.map((src, i) => (
                                <div key={i} className="aspect-square rounded-lg overflow-hidden border border-slate-200">
                                    <img src={src} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={handleUpload}
                            disabled={uploading}
                            className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-xl
                                bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white
                                shadow-lg shadow-indigo-200
                                hover:bg-indigo-600 transition-all disabled:opacity-50"
                        >
                            {uploading ? <><Spinners /> Uploading...</> : "Upload Images"}
                        </button>
                    </div>
                )}
            </div>

            {/* ─── Existing Gallery ────────────────── */}
            <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-3">
                    Gallery Images
                    {images.length > 0 && (
                        <span className="ml-1 text-xs font-normal text-slate-400">
                            ({images.length})
                        </span>
                    )}
                </h3>

                {loading ? (
                    <div className="flex justify-center py-8">
                        <Spinners />
                    </div>
                ) : images.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 rounded-xl
                        border-2 border-dashed border-slate-200 bg-slate-50/50">
                        <p className="text-sm text-slate-400">No gallery images yet</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        {images.map((img) => (
                            <div
                                key={img.imageId}
                                className="group relative aspect-square rounded-xl overflow-hidden
                                    border border-slate-200 bg-slate-50"
                            >
                                <img
                                    src={img.imageUrl}
                                    alt={`Gallery ${img.imageId}`}
                                    className="w-full h-full object-cover"
                                />
                                {/* Delete overlay */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200
                                    flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <button
                                        onClick={() => handleDelete(img.imageId)}
                                        className="flex h-9 w-9 items-center justify-center rounded-full
                                            bg-white/90 text-red-500 shadow-md
                                            hover:bg-red-500 hover:text-white transition-all"
                                        title="Delete image"
                                    >
                                        <FaTrashAlt className="text-sm" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ─── Close button ────────────────────── */}
            <div className="flex justify-end pt-2">
                <button
                    onClick={() => setOpen(false)}
                    className="px-5 py-2 rounded-xl text-sm font-semibold
                        border border-slate-200 text-slate-600
                        hover:bg-slate-50 transition-colors"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default GalleryImageModal;
