import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';
import * as menuService from '../services/menuService';

/**
 * Custom hook for menu editor with CRUD operations
 */
export function useMenuEditor() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Real-time listeners
  useEffect(() => {
    const itemsQuery = query(
      collection(db, 'menuItems'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeItems = onSnapshot(
      itemsQuery,
      (snapshot) => {
        const itemsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setItems(itemsData);
        setLoading(false);
      },
      (err) => {
        console.error('Error in items listener:', err);
        setError(err);
        setLoading(false);
      }
    );

    const categoriesQuery = query(
      collection(db, 'menuCategories'),
      orderBy('order', 'asc')
    );

    const unsubscribeCategories = onSnapshot(
      categoriesQuery,
      (snapshot) => {
        const categoriesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCategories(categoriesData);
      },
      (err) => {
        console.error('Error in categories listener:', err);
      }
    );

    return () => {
      unsubscribeItems();
      unsubscribeCategories();
    };
  }, []);

  // CRUD operations
  const addItem = async (itemData) => {
    try {
      return await menuService.addMenuItem(itemData);
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const updateItem = async (itemId, updates) => {
    try {
      return await menuService.updateMenuItem(itemId, updates);
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const deleteItem = async (itemId) => {
    try {
      return await menuService.deleteMenuItem(itemId);
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const toggleAvailability = async (itemId, available) => {
    try {
      return await menuService.toggleItemAvailability(itemId, available);
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  return {
    items,
    categories,
    loading,
    error,
    addItem,
    updateItem,
    deleteItem,
    toggleAvailability
  };
}
