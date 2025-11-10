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
   * Deep compare two customization objects
   */
  const areCustomizationsEqual = (custom1, custom2) => {
    if (!custom1 && !custom2) return true;
    if (!custom1 || !custom2) return false;
    return JSON.stringify(custom1) === JSON.stringify(custom2);
  };

  /**
   * Add item to cart or increment quantity if already exists
   * Handles customizations by comparing them deeply
   */
  const addToCart = (item) => {
    // For customized items, use finalPrice if available
    const itemPrice = item.finalPrice || item.price;

    // Find existing item with same ID and customizations
    const existingItem = cart.find(i =>
      i.id === item.id && areCustomizationsEqual(i.customizations, item.customizations)
    );

    if (existingItem) {
      // Increment quantity of existing item
      setCart(cart.map(i =>
        i === existingItem ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      // Add new item to cart
      setCart([...cart, {
        ...item,
        quantity: 1,
        price: itemPrice,
        basePrice: item.price,
        customizations: item.customizations || null
      }]);
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

  /**
   * Format customizations for display
   * Returns array of human-readable customization strings
   */
  const formatCustomizations = (item, menuData, language = 'en') => {
    if (!item.customizations || !menuData) return [];

    const formatted = [];
    const itemData = menuData.find(i => i.id === item.id);
    if (!itemData || !itemData.customizations) return [];

    Object.entries(item.customizations).forEach(([categoryKey, selectedValue]) => {
      const category = itemData.customizations[categoryKey];
      if (!category) return;

      if (category.type === 'single' && selectedValue) {
        // Single selection
        const option = category.options.find(opt => opt.id === selectedValue);
        if (option && !option.default) {
          formatted.push(option.label[language]);
        }
      } else if (category.type === 'multiple' && Array.isArray(selectedValue) && selectedValue.length > 0) {
        // Multiple selections
        selectedValue.forEach(optionId => {
          const option = category.options.find(opt => opt.id === optionId);
          if (option) {
            formatted.push(option.label[language]);
          }
        });
      }
    });

    return formatted;
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    getTotalPrice,
    getTotalItems,
    calculateTotalPrepTime,
    formatCustomizations
  };
}
