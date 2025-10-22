import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useCart } from './useCart';

describe('useCart', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with empty cart', () => {
    const { result } = renderHook(() => useCart());
    expect(result.current.cart).toEqual([]);
    expect(result.current.getTotalItems()).toBe(0);
    expect(result.current.getTotalPrice()).toBe('0.00');
  });

  it('should add item to cart', async () => {
    const { result } = renderHook(() => useCart());
    const item = {
      id: 1,
      name: { en: 'Coffee', fi: 'Kahvi' },
      price: 3.50,
      prepTime: 5
    };

    await act(async () => {
      result.current.addToCart(item);
    });

    await waitFor(() => {
      expect(result.current.cart).toHaveLength(1);
    });

    expect(result.current.cart[0]).toMatchObject({ ...item, quantity: 1 });
    expect(result.current.getTotalItems()).toBe(1);
    expect(result.current.getTotalPrice()).toBe('3.50');
  });

  it('should increment quantity when adding existing item', async () => {
    const { result } = renderHook(() => useCart());
    const item = {
      id: 1,
      name: { en: 'Coffee', fi: 'Kahvi' },
      price: 3.50,
      prepTime: 5
    };

    await act(async () => {
      result.current.addToCart(item);
    });

    await act(async () => {
      result.current.addToCart(item);
    });

    await waitFor(() => {
      expect(result.current.cart[0].quantity).toBe(2);
    });

    expect(result.current.cart).toHaveLength(1);
    expect(result.current.getTotalItems()).toBe(2);
    expect(result.current.getTotalPrice()).toBe('7.00');
  });

  it('should remove item from cart', async () => {
    const { result } = renderHook(() => useCart());
    const item = {
      id: 1,
      name: { en: 'Coffee', fi: 'Kahvi' },
      price: 3.50,
      prepTime: 5
    };

    await act(async () => {
      result.current.addToCart(item);
    });

    await act(async () => {
      result.current.addToCart(item);
    });

    await waitFor(() => {
      expect(result.current.cart[0].quantity).toBe(2);
    });

    await act(async () => {
      result.current.removeFromCart(1);
    });

    await waitFor(() => {
      expect(result.current.cart[0].quantity).toBe(1);
    });

    await act(async () => {
      result.current.removeFromCart(1);
    });

    await waitFor(() => {
      expect(result.current.cart).toHaveLength(0);
    });
  });

  it('should clear entire cart', async () => {
    const { result } = renderHook(() => useCart());
    const item1 = { id: 1, name: { en: 'Coffee' }, price: 3.50, prepTime: 5 };
    const item2 = { id: 2, name: { en: 'Tea' }, price: 2.50, prepTime: 3 };

    await act(async () => {
      result.current.addToCart(item1);
    });

    await act(async () => {
      result.current.addToCart(item2);
    });

    await waitFor(() => {
      expect(result.current.cart).toHaveLength(2);
    });

    await act(async () => {
      result.current.clearCart();
    });

    await waitFor(() => {
      expect(result.current.cart).toHaveLength(0);
    });

    expect(result.current.getTotalPrice()).toBe('0.00');
  });

  it('should calculate total prep time as maximum', async () => {
    const { result } = renderHook(() => useCart());
    const item1 = { id: 1, name: { en: 'Coffee' }, price: 3.50, prepTime: 5 };
    const item2 = { id: 2, name: { en: 'Burger' }, price: 12.50, prepTime: 18 };

    await act(async () => {
      result.current.addToCart(item1);
    });

    await act(async () => {
      result.current.addToCart(item2);
    });

    await waitFor(() => {
      expect(result.current.calculateTotalPrepTime).toBe(18);
    });
  });

  it('should persist cart to localStorage', async () => {
    const { result } = renderHook(() => useCart());
    const item = { id: 1, name: { en: 'Coffee' }, price: 3.50, prepTime: 5 };

    await act(async () => {
      result.current.addToCart(item);
    });

    await waitFor(() => {
      const saved = JSON.parse(localStorage.getItem('dm_cart'));
      expect(saved).toHaveLength(1);
      expect(saved[0].id).toBe(1);
    });
  });

  it('should restore cart from localStorage', () => {
    const savedCart = [
      { id: 1, name: { en: 'Coffee' }, price: 3.50, prepTime: 5, quantity: 2 }
    ];
    localStorage.setItem('dm_cart', JSON.stringify(savedCart));

    const { result } = renderHook(() => useCart());

    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].quantity).toBe(2);
    expect(result.current.getTotalPrice()).toBe('7.00');
  });
});
