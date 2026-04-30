'use client';

import { createContext, useEffect, useState } from 'react';

export const CartContext = createContext(null);

const storageKey = 'clothing-store-cart';

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const storedItems = window.localStorage.getItem(storageKey);

      if (storedItems) {
        setCartItems(JSON.parse(storedItems));
      }
    } catch (error) {
      console.error('Failed to load cart', error);
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    window.localStorage.setItem(storageKey, JSON.stringify(cartItems));
  }, [cartItems, isReady]);

  function addToCart(product, selectedSize) {
    setCartItems((currentItems) => {
      const size = selectedSize || product.sizes?.[0] || 'ONE SIZE';
      const existingItem = currentItems.find(
        (item) => item.id === product.id && item.selectedSize === size
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id && item.selectedSize === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...currentItems,
        {
          id: product.id,
          name: product.name,
          price: Number(product.price),
          image_url: product.image_url,
          selectedSize: size,
          quantity: 1
        }
      ];
    });
  }

  function updateQuantity(id, size, quantity) {
    if (quantity <= 0) {
      removeFromCart(id, size);
      return;
    }

    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id && item.selectedSize === size ? { ...item, quantity } : item
      )
    );
  }

  function removeFromCart(id, size) {
    setCartItems((currentItems) =>
      currentItems.filter((item) => !(item.id === id && item.selectedSize === size))
    );
  }

  function clearCart() {
    setCartItems([]);
  }

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const value = {
    cartItems,
    isReady,
    subtotal,
    itemCount,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
