import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Firestore Menu Service
 * Handles all menu CRUD operations
 */

const MENU_COLLECTION = 'menuItems';
const CATEGORIES_COLLECTION = 'menuCategories';
const SPECIAL_DOC = 'menuSpecial';

// ==================== Menu Items ====================

/**
 * Get all menu items
 */
export const getAllMenuItems = async () => {
  try {
    const q = query(collection(db, MENU_COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching menu items:', error);
    throw error;
  }
};

/**
 * Get single menu item by ID
 */
export const getMenuItem = async (itemId) => {
  try {
    const docRef = doc(db, MENU_COLLECTION, itemId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching menu item:', error);
    throw error;
  }
};

/**
 * Add new menu item
 */
export const addMenuItem = async (itemData) => {
  try {
    const newItem = {
      ...itemData,
      available: itemData.available ?? true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    const docRef = await addDoc(collection(db, MENU_COLLECTION), newItem);
    return { id: docRef.id, ...newItem };
  } catch (error) {
    console.error('Error adding menu item:', error);
    throw error;
  }
};

/**
 * Update existing menu item
 */
export const updateMenuItem = async (itemId, updates) => {
  try {
    const docRef = doc(db, MENU_COLLECTION, itemId);
    const updatedData = {
      ...updates,
      updatedAt: Timestamp.now()
    };

    await updateDoc(docRef, updatedData);
    return { id: itemId, ...updatedData };
  } catch (error) {
    console.error('Error updating menu item:', error);
    throw error;
  }
};

/**
 * Delete menu item
 */
export const deleteMenuItem = async (itemId) => {
  try {
    const docRef = doc(db, MENU_COLLECTION, itemId);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting menu item:', error);
    throw error;
  }
};

/**
 * Toggle item availability
 */
export const toggleItemAvailability = async (itemId, available) => {
  try {
    return await updateMenuItem(itemId, { available });
  } catch (error) {
    console.error('Error toggling availability:', error);
    throw error;
  }
};

// ==================== Categories ====================

/**
 * Get all categories
 */
export const getAllCategories = async () => {
  try {
    const q = query(collection(db, CATEGORIES_COLLECTION), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

/**
 * Add new category
 */
export const addCategory = async (categoryData) => {
  try {
    const newCategory = {
      ...categoryData,
      enabled: categoryData.enabled ?? true,
      createdAt: Timestamp.now()
    };

    const docRef = await addDoc(collection(db, CATEGORIES_COLLECTION), newCategory);
    return { id: docRef.id, ...newCategory };
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
};

/**
 * Update category
 */
export const updateCategory = async (categoryId, updates) => {
  try {
    const docRef = doc(db, CATEGORIES_COLLECTION, categoryId);
    await updateDoc(docRef, updates);
    return { id: categoryId, ...updates };
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

/**
 * Delete category
 */
export const deleteCategory = async (categoryId) => {
  try {
    const docRef = doc(db, CATEGORIES_COLLECTION, categoryId);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

// ==================== Today's Special ====================

/**
 * Get today's special
 */
export const getTodaySpecial = async () => {
  try {
    const docRef = doc(db, 'settings', SPECIAL_DOC);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error('Error fetching today\'s special:', error);
    throw error;
  }
};

/**
 * Set today's special
 */
export const setTodaySpecial = async (specialData) => {
  try {
    const docRef = doc(db, 'settings', SPECIAL_DOC);
    await updateDoc(docRef, specialData);
    return specialData;
  } catch (error) {
    console.error('Error setting today\'s special:', error);
    throw error;
  }
};
