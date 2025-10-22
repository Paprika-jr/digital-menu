import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLanguage } from './useLanguage';

describe('useLanguage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with English by default', () => {
    const { result } = renderHook(() => useLanguage());
    expect(result.current.language).toBe('en');
    expect(result.current.t).toBeDefined();
    expect(result.current.t.welcome).toBe('Welcome to');
  });

  it('should toggle between English and Finnish', () => {
    const { result } = renderHook(() => useLanguage());

    act(() => {
      result.current.toggleLanguage();
    });

    expect(result.current.language).toBe('fi');
    expect(result.current.t.welcome).toBe('Tervetuloa');

    act(() => {
      result.current.toggleLanguage();
    });

    expect(result.current.language).toBe('en');
    expect(result.current.t.welcome).toBe('Welcome to');
  });

  it('should set specific language', () => {
    const { result } = renderHook(() => useLanguage());

    act(() => {
      result.current.setLanguage('fi');
    });

    expect(result.current.language).toBe('fi');
    expect(result.current.t.menu).toBe('Menu');
  });

  it('should persist language to localStorage', () => {
    const { result } = renderHook(() => useLanguage());

    act(() => {
      result.current.setLanguage('fi');
    });

    expect(localStorage.getItem('dm_language')).toBe('fi');
  });

  it('should restore language from localStorage', () => {
    localStorage.setItem('dm_language', 'fi');

    const { result } = renderHook(() => useLanguage());

    expect(result.current.language).toBe('fi');
    expect(result.current.t.cart).toBe('Ostoskori');
  });

  it('should provide all required translation keys', () => {
    const { result } = renderHook(() => useLanguage());

    const requiredKeys = [
      'welcome', 'tagline', 'menu', 'cart', 'order', 'total',
      'addToCart', 'emptyCart', 'orderButton', 'contactInfo',
      'name', 'tableNumber', 'notes', 'submitOrder', 'cancel'
    ];

    requiredKeys.forEach(key => {
      expect(result.current.t[key]).toBeDefined();
      expect(result.current.t[key]).not.toBe('');
    });
  });
});
