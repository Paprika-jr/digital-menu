import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';

/**
 * Custom hook for managing orders (admin view)
 * @param {string} filter - Filter by status ('all', 'received', 'preparing', 'ready')
 * @returns {Object} Orders state and operations
 */
export function useOrders(filter = 'all') {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const q = query(collection(db, 'orders'), orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const ordersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setOrders(ordersData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please check your connection.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  /**
   * Filter orders by status
   */
  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter(order => order.status === filter);

  /**
   * Update order status
   */
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status: newStatus });
      return { success: true };
    } catch (err) {
      console.error('Error updating order status:', err);
      return { success: false, error: 'Failed to update order status' };
    }
  };

  return {
    orders: filteredOrders,
    allOrders: orders,
    loading,
    error,
    updateOrderStatus
  };
}

/**
 * Custom hook for tracking a single order (customer view)
 * @param {string} orderId - The order ID to track
 * @returns {Object} Order state
 */
export function useOrderTracking(orderId) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    const orderRef = doc(db, 'orders', orderId);

    const unsubscribe = onSnapshot(
      orderRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setOrder({ id: docSnap.id, ...docSnap.data() });
          setError(null);
        } else {
          setError('Order not found');
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error tracking order:', err);
        setError('Failed to load order status');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [orderId]);

  return {
    order,
    loading,
    error
  };
}

/**
 * Custom hook for submitting orders
 * @returns {Object} Submit operation
 */
export function useOrderSubmit() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Submit a new order to Firestore
   */
  const submitOrder = async (orderData) => {
    setSubmitting(true);
    setError(null);

    try {
      const docRef = await addDoc(collection(db, 'orders'), {
        ...orderData,
        status: 'received',
        timestamp: serverTimestamp()
      });

      setSubmitting(false);
      return { success: true, orderId: docRef.id };
    } catch (err) {
      console.error('Error submitting order:', err);
      setError('Failed to place order. Please try again.');
      setSubmitting(false);
      return { success: false, error: err.message };
    }
  };

  return {
    submitOrder,
    submitting,
    error
  };
}
