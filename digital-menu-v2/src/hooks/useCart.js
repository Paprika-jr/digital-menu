import { useState, useEffect, useMemo } from 'react';

/**
 * Custom hook for managing shopping cart state
 * Persists cart to localStorage
 * @returns {Object} Cart state and operations
 */
export function useCart() {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('dm_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('dm_cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Failed to save cart:', error);
    }
  }, [cart]);

  /**
   * Add item to cart or increment quantity if already exists
   */
  const addToCart = (item) => {
    const existingItem = cart.find(i => i.id === item.id);
    if (existingItem) {
      setCart(cart.map(i =>
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  /**
   * Remove item from cart or decrement quantity
   */
  const removeFromCart = (itemId) => {
    const item = cart.find(i => i.id === itemId);
    if (!item) return;

    if (item.quantity > 1) {
      setCart(cart.map(i =>
        i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
      ));
    } else {
      setCart(cart.filter(i => i.id !== itemId));
    }
  };

  /**
   * Clear entire cart and localStorage immediately
   */
  const clearCart = () => {
    setCart([]);
    // Immediately clear localStorage to prevent cart from persisting
    try {
      localStorage.removeItem('dm_cart');
    } catch (error) {
      console.error('Failed to clear cart from localStorage:', error);
    }
  };

  /**
   * Get total price of all items in cart
   */
  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
  };

  /**
   * Get total number of items in cart
   */
  const getTotalItems = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  /**
   * Calculate maximum preparation time (items prepared in parallel)
   */
  const calculateTotalPrepTime = useMemo(() => {
    if (cart.length === 0) return 0;
    return Math.max(...cart.map(item => item.prepTime));
  }, [cart]);

  return {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    getTotalPrice,
    getTotalItems,
    calculateTotalPrepTime
  };
}
