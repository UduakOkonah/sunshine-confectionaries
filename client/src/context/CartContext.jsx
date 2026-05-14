import { createContext, useContext, useMemo, useState } from "react";
import toast from "react-hot-toast";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) =>
          (item._id || item.id) === (product._id || product.id)
      );

      if (existingItem) {
        return currentItems.map((item) =>
          (item._id || item.id) ===
          (product._id || product.id)
            ? {
                ...item,
                quantity: item.quantity + quantity,
              }
            : item
        );
      }

      return [...currentItems, { ...product, quantity }];
    });

    toast.success(`${quantity} ${product.name} added to cart`);
  };

  const removeFromCart = (productId) => {
    setCartItems((currentItems) =>
      currentItems.filter(
        (item) =>
          (item._id || item.id) !== productId
      )
    );

    toast.success("Item removed from cart");
  };

  const increaseQuantity = (productId) => {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        (item._id || item.id) === productId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  const decreaseQuantity = (productId) => {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          (item._id || item.id) === productId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCartItems([]);
    toast.success("Cart cleared");
  };

  const cartTotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }, [cartItems]);

  const cartCount = useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }, [cartItems]);

  const value = {
    cartItems,
    cartTotal,
    cartCount,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}