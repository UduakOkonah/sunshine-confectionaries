import { useMemo, useState } from "react";
import {
  Edit3,
  ImagePlus,
  Loader2,
  Plus,
  Search,
  Star,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { useProducts } from "../../context/ProductContext";
import api from "../../lib/api";

const initialFormData = {
  name: "",
  category: "",
  price: "",
  oldPrice: "",
  stock: "",
  sku: "",
  image: "",
  description: "",
  featured: false,
  available: true,
};

function AdminProducts() {
  const { products, addProduct, deleteProduct, updateProduct } = useProducts();

  const [formData, setFormData] = useState(initialFormData);
  const [editingProductId, setEditingProductId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = useMemo(() => {
    return [
      ...new Set(products.map((product) => product.category).filter(Boolean)),
    ];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        product.name?.toLowerCase().includes(search) ||
        product.category?.toLowerCase().includes(search) ||
        product.sku?.toLowerCase().includes(search);

      const matchesCategory =
        categoryFilter === "All" || product.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, categoryFilter]);

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingProductId(null);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image is too large. Please upload an image below 5MB.");
      return;
    }

    const uploadData = new FormData();
    uploadData.append("image", file);

    try {
      setIsUploading(true);

      const { data } = await api.post("/upload", uploadData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setFormData((currentData) => ({
        ...currentData,
        image: data.imageUrl,
      }));
    } catch (error) {
      alert(error.response?.data?.message || "Image upload failed");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name || !formData.category || !formData.price || !formData.image) {
      alert("Please fill product name, category, price, and upload an image.");
      return;
    }

    const productData = {
      ...formData,
      price: Number(formData.price),
      oldPrice: formData.oldPrice ? Number(formData.oldPrice) : 0,
      stock: formData.stock ? Number(formData.stock) : 0,
      sku: formData.sku || `SKU-${Date.now()}`,
    };

    try {
      setIsSubmitting(true);

      if (editingProductId) {
        await updateProduct({
          ...productData,
          _id: editingProductId,
        });
      } else {
        await addProduct(productData);
      }

      resetForm();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProductId(product._id || product.id);

    setFormData({
      name: product.name || "",
      category: product.category || "",
      price: product.price || "",
      oldPrice: product.oldPrice || "",
      stock: product.stock || "",
      sku: product.sku || "",
      image: product.image || "",
      description: product.description || "",
      featured: product.featured || false,
      available: product.available ?? true,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  return (
    <section className="min-h-screen bg-[#FFF7D6] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[36px] border border-green-100 bg-gradient-to-br from-white via-green-50 to-yellow-50 p-6 shadow-xl sm:p-8">
          <p className="inline-flex rounded-full bg-yellow-100 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-yellow-700">
            Admin Products
          </p>

          <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
            Product Management
          </h1>

          <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-slate-600">
            Add products with uploaded images, manage stock, pricing,
            availability, and featured bakery items.
          </p>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[430px_1fr]">
          <div className="rounded-[36px] bg-white p-5 shadow-xl sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900">
                {editingProductId ? "Edit Product" : "Add Product"}
              </h2>

              {editingProductId && (
                <button
                  onClick={resetForm}
                  className="rounded-full bg-red-50 p-2 text-red-500 transition hover:bg-red-100"
                  type="button"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label className="block cursor-pointer rounded-[28px] border-2 border-dashed border-green-200 bg-green-50 p-4 text-center transition hover:bg-green-100">
                {formData.image ? (
                  <div className="relative overflow-hidden rounded-[22px]">
                    <img
                      src={formData.image}
                      alt="Product preview"
                      className="h-56 w-full object-cover"
                    />

                    <div className="absolute inset-x-0 bottom-0 bg-black/50 px-4 py-3 text-sm font-black text-white">
                      {isUploading ? "Uploading..." : "Click to change image"}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-8">
                    <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-green-600 shadow-md">
                      {isUploading ? (
                        <Loader2 className="animate-spin" size={28} />
                      ) : (
                        <UploadCloud size={28} />
                      )}
                    </div>

                    <p className="mt-4 text-sm font-black text-slate-800">
                      {isUploading ? "Uploading image..." : "Upload product image"}
                    </p>

                    <p className="mt-1 text-xs font-medium text-slate-500">
                      PNG, JPG, or WEBP. Max 5MB.
                    </p>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>

              <input
                type="text"
                name="name"
                placeholder="Product name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-[22px] border border-yellow-200 bg-yellow-50 px-4 py-4 text-sm font-bold outline-none focus:border-green-400 focus:bg-white"
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  name="category"
                  placeholder="Category"
                  list="categories"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full rounded-[22px] border border-yellow-200 bg-yellow-50 px-4 py-4 text-sm font-bold outline-none focus:border-green-400 focus:bg-white"
                />

                <input
                  type="text"
                  name="sku"
                  placeholder="SKU e.g. CAKE-001"
                  value={formData.sku}
                  onChange={handleChange}
                  className="w-full rounded-[22px] border border-yellow-200 bg-yellow-50 px-4 py-4 text-sm font-bold outline-none focus:border-green-400 focus:bg-white"
                />
              </div>

              <datalist id="categories">
                {categories.map((category) => (
                  <option key={category} value={category} />
                ))}
              </datalist>

              <div className="grid gap-3 sm:grid-cols-3">
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full rounded-[22px] border border-yellow-200 bg-yellow-50 px-4 py-4 text-sm font-bold outline-none focus:border-green-400 focus:bg-white"
                />

                <input
                  type="number"
                  name="oldPrice"
                  placeholder="Old price"
                  value={formData.oldPrice}
                  onChange={handleChange}
                  className="w-full rounded-[22px] border border-yellow-200 bg-yellow-50 px-4 py-4 text-sm font-bold outline-none focus:border-green-400 focus:bg-white"
                />

                <input
                  type="number"
                  name="stock"
                  placeholder="Stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full rounded-[22px] border border-yellow-200 bg-yellow-50 px-4 py-4 text-sm font-bold outline-none focus:border-green-400 focus:bg-white"
                />
              </div>

              <textarea
                name="description"
                placeholder="Product description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                className="w-full resize-none rounded-[22px] border border-yellow-200 bg-yellow-50 px-4 py-4 text-sm font-bold outline-none focus:border-green-400 focus:bg-white"
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex items-center gap-3 rounded-[22px] bg-yellow-50 p-4">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="h-5 w-5"
                  />
                  <span className="text-sm font-black text-slate-700">
                    Featured
                  </span>
                </label>

                <label className="flex items-center gap-3 rounded-[22px] bg-green-50 p-4">
                  <input
                    type="checkbox"
                    name="available"
                    checked={formData.available}
                    onChange={handleChange}
                    className="h-5 w-5"
                  />
                  <span className="text-sm font-black text-slate-700">
                    Available
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isUploading || isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-green-500 px-6 py-4 text-sm font-black text-white shadow-lg shadow-green-200 transition hover:-translate-y-1 hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Plus size={18} />
                )}
                {editingProductId ? "Update Product" : "Add Product"}
              </button>
            </form>
          </div>

          <div>
            <div className="mb-5 flex flex-col gap-3 rounded-[28px] bg-white p-4 shadow-lg sm:flex-row">
              <div className="flex flex-1 items-center gap-3 rounded-[22px] bg-slate-50 px-4 py-3">
                <Search size={18} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Search product, category, or SKU..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="w-full bg-transparent text-sm font-bold outline-none"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                className="rounded-[22px] border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-black text-slate-700 outline-none"
              >
                <option value="All">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="rounded-[32px] bg-white p-10 text-center shadow-lg">
                <ImagePlus className="mx-auto text-yellow-500" size={42} />
                <h2 className="mt-4 text-2xl font-black text-slate-900">
                  No products found
                </h2>
                <p className="mt-2 text-sm font-medium text-slate-500">
                  Add a new product or adjust your search/filter.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <article
                    key={product._id || product.id}
                    className="overflow-hidden rounded-[34px] bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
                  >
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />

                      <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                        {product.featured && (
                          <div className="flex items-center gap-1 rounded-full bg-yellow-300 px-3 py-1 text-xs font-black text-slate-900">
                            <Star size={14} fill="currentColor" />
                            Featured
                          </div>
                        )}

                        <div
                          className={`rounded-full px-3 py-1 text-xs font-black ${
                            product.available
                              ? "bg-green-500 text-white"
                              : "bg-red-500 text-white"
                          }`}
                        >
                          {product.available ? "Available" : "Unavailable"}
                        </div>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-500">
                            {product.category}
                          </p>

                          <h2 className="mt-2 text-xl font-black text-slate-900">
                            {product.name}
                          </h2>

                          <p className="mt-1 text-xs font-bold text-slate-400">
                            SKU: {product.sku || "N/A"}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="rounded-full bg-green-50 px-3 py-1 text-sm font-black text-green-700">
                            {formatPrice(product.price)}
                          </p>

                          {product.oldPrice > 0 && (
                            <p className="mt-1 text-xs font-bold text-slate-400 line-through">
                              {formatPrice(product.oldPrice)}
                            </p>
                          )}
                        </div>
                      </div>

                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
                        {product.description || "No description provided."}
                      </p>

                      <div className="mt-4 rounded-[20px] bg-yellow-50 px-4 py-3">
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                          Stock
                        </p>
                        <p className="mt-1 text-lg font-black text-slate-900">
                          {product.stock || 0} left
                        </p>
                      </div>

                      <div className="mt-5 flex items-center gap-3">
                        <button
                          onClick={() => handleEdit(product)}
                          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-yellow-100 px-4 py-3 text-sm font-black text-yellow-700 transition hover:bg-yellow-200"
                        >
                          <Edit3 size={16} />
                          Edit
                        </button>

                        <button
                          onClick={() => deleteProduct(product._id || product.id)}
                          className="flex items-center justify-center rounded-full bg-red-100 px-4 py-3 text-red-600 transition hover:bg-red-200"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminProducts;