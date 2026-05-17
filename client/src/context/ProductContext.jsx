import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import toast from "react-hot-toast";
import api from "../lib/api";

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const normalizeProducts = (data) => {
    if (Array.isArray(data)) return data;

    if (Array.isArray(data?.products)) return data.products;

    if (Array.isArray(data?.product)) return data.product;

    return [];
  };

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);

      const { data } = await api.get("/products");

      setProducts(normalizeProducts(data));
    } catch (error) {
      setProducts([]);
      toast.error("Failed to load products");
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async (productData) => {
    try {
      const { data } = await api.post("/products", productData);

      const newProduct = data.product || data;

      setProducts((current) =>
        Array.isArray(current) ? [newProduct, ...current] : [newProduct]
      );

      toast.success("Product added");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add product");
    }
  };

  const updateProduct = async (updatedProduct) => {
    try {
      const productId = updatedProduct._id || updatedProduct.id;

      const { data } = await api.put(`/products/${productId}`, updatedProduct);

      const savedProduct = data.product || data;

      setProducts((current) =>
        Array.isArray(current)
          ? current.map((product) =>
              (product._id || product.id) === (savedProduct._id || savedProduct.id)
                ? savedProduct
                : product
            )
          : []
      );

      toast.success("Product updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update product");
    }
  };

  const deleteProduct = async (productId) => {
    try {
      await api.delete(`/products/${productId}`);

      setProducts((current) =>
        Array.isArray(current)
          ? current.filter((product) => (product._id || product.id) !== productId)
          : []
      );

      toast.success("Product deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete product");
    }
  };

  const featuredProducts = useMemo(() => {
    return Array.isArray(products)
      ? products.filter((product) => product.featured)
      : [];
  }, [products]);

  const value = {
    products: Array.isArray(products) ? products : [],
    featuredProducts,
    loadingProducts,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);

  if (!context) {
    throw new Error("useProducts must be used within ProductProvider");
  }

  return context;
}