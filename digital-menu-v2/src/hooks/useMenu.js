import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';
import menuDataJson from '../data/menuData.json';

/**
 * Custom hook for fetching menu data with real-time updates
 * Falls back to JSON if Firestore is empty (migration not done yet)
 */
export function useMenu() {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [todaySpecial, setTodaySpecial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingFirestore, setUsingFirestore] = useState(false);

  useEffect(() => {
    let unsubscribeItems;
    let unsubscribeCategories;
    let unsubscribeSpecial;

    try {
      // Listen to menu items
      const itemsQuery = query(
        collection(db, 'menuItems'),
        orderBy('createdAt', 'desc')
      );

      unsubscribeItems = onSnapshot(
        itemsQuery,
        (snapshot) => {
          const items = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          if (items.length > 0) {
            setMenuItems(items);
            setUsingFirestore(true);
          } else {
            // Fallback to JSON if Firestore is empty
            loadFromJSON();
          }
          setLoading(false);
        },
        (err) => {
          console.error('Error fetching menu items:', err);
          setError(err);
          loadFromJSON();
          setLoading(false);
        }
      );

      // Listen to categories
      const categoriesQuery = query(
        collection(db, 'menuCategories'),
        orderBy('order', 'asc')
      );

      unsubscribeCategories = onSnapshot(
        categoriesQuery,
        (snapshot) => {
          const cats = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          if (cats.length > 0) {
            setCategories(cats);
          }
        },
        (err) => {
          console.error('Error fetching categories:', err);
        }
      );

      // Listen to today's special
      unsubscribeSpecial = onSnapshot(
        collection(db, 'settings'),
        (snapshot) => {
          const specialDoc = snapshot.docs.find(doc => doc.id === 'menuSpecial');
          if (specialDoc) {
            setTodaySpecial(specialDoc.data());
          }
        },
        (err) => {
          console.error('Error fetching special:', err);
        }
      );
    } catch (err) {
      console.error('Error setting up listeners:', err);
      setError(err);
      loadFromJSON();
      setLoading(false);
    }

    return () => {
      if (unsubscribeItems) unsubscribeItems();
      if (unsubscribeCategories) unsubscribeCategories();
      if (unsubscribeSpecial) unsubscribeSpecial();
    };
  }, []);

  /**
   * Fallback: Load menu from JSON file
   */
  const loadFromJSON = () => {
    try {
      // Convert JSON format to Firestore format
      const items = [];
      Object.entries(menuDataJson.categories).forEach(([category, categoryItems]) => {
        categoryItems.forEach(item => {
          items.push({
            ...item,
            category,
            available: true,
            customizable: !!item.customizationOptions
          });
        });
      });

      setMenuItems(items);
      setTodaySpecial(menuDataJson.todaySpecial || null);
      setUsingFirestore(false);
    } catch (err) {
      console.error('Error loading from JSON:', err);
      setError(err);
    }
  };

  /**
   * Get items by category
   */
  const getItemsByCategory = (category) => {
    return menuItems.filter(item => item.category === category && item.available);
  };

  /**
   * Get all unique categories from items
   */
  const getCategories = () => {
    if (categories.length > 0) {
      return categories.filter(cat => cat.enabled);
    }

    // Fallback: extract categories from items
    const uniqueCategories = [...new Set(menuItems.map(item => item.category))];
    return uniqueCategories.map(cat => ({
      id: cat,
      name: { en: cat.charAt(0).toUpperCase() + cat.slice(1), fi: cat },
      enabled: true
    }));
  };

  return {
    menuItems,
    categories: getCategories(),
    todaySpecial,
    loading,
    error,
    usingFirestore,
    getItemsByCategory
  };
}
