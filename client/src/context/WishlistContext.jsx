import { createContext, useContext, useMemo, useState } from "react";
import toast from "react-hot-toast";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([]);

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => (item._id || item.id) === (productId || product.id));
  };

  const toggleWishlist = (product) => {
    setWishlistItems((currentItems) => {
      const exists = currentItems.some((item) => (item._id || item.id) === (product._id || product.id));

      if (exists) {
        toast.success("Removed from favorites");
        return currentItems.filter((item) => (item._id || item.id) !== (product._id || product.id));
      }

      toast.success("Added to favorites");
      return [...currentItems, product];
    });
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    toast.success("Favorites cleared");
  };

  const wishlistCount = useMemo(() => wishlistItems.length, [wishlistItems]);

  const value = {
    wishlistItems,
    wishlistCount,
    isInWishlist,
    toggleWishlist,
    clearWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }

  return context;
}