import { createContext, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../lib/api";

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const { data } = await api.get("/products");
      setProducts(data);
    } catch (error) {
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
      setProducts((current) => [data.product, ...current]);
      toast.success("Product added");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add product");
    }
  };

  const updateProduct = async (updatedProduct) => {
    try {
      const { data } = await api.put(
        `/products/${updatedProduct._id || updatedProduct.id}`,
        updatedProduct
      );

      setProducts((current) =>
        current.map((product) =>
          product._id === data.product._id ? data.product : product
        )
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
        current.filter((product) => product._id !== productId)
      );

      toast.success("Product deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete product");
    }
  };

  const featuredProducts = useMemo(() => {
    return products.filter((product) => product.featured);
  }, [products]);

  const value = {
    products,
    featuredProducts,
    loadingProducts,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);

  if (!context) {
    throw new Error("useProducts must be used within ProductProvider");
  }

  return context;
}