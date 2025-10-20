import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Clock, CheckCircle, ChefHat, AlertCircle, User, Hash, StickyNote } from 'lucide-react';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, received, preparing, ready

  useEffect(() => {
    // Listen to orders in real-time
    const q = query(
      collection(db, 'orders'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()
      }));
      setOrders(ordersData);
      setLoading(false);
      
      // Play sound for new orders (optional)
      const newOrders = ordersData.filter(o => o.status === 'received');
      if (newOrders.length > 0) {
        console.log('🔔 New orders:', newOrders.length);
      }
    }, (error) => {
      console.error('Error fetching orders:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: newStatus
      });
      console.log('✅ Order status updated:', orderId, newStatus);
    } catch (error) {
      console.error('❌ Error updating status:', error);
      alert('Failed to update order status');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'received': return '#2563eb'; // Blue
      case 'preparing': return '#f59e0b'; // Orange
      case 'ready': return '#10b981'; // Green
      default: return '#6b7280'; // Gray
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'received': return CheckCircle;
      case 'preparing': return ChefHat;
      case 'ready': return AlertCircle;
      default: return CheckCircle;
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const orderCounts = {
    all: orders.length,
    received: orders.filter(o => o.status === 'received').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    ready: orders.filter(o => o.status === 'ready').length,
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', fontSize: '1.2rem' }}>
        Loading orders... 🔄
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f5f0' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #6B4423 0%, #8B6F47 100%)',
        color: 'white',
        padding: '1.5rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', fontFamily: 'Georgia, serif' }}>
            🍽️ Kitchen Dashboard
          </h1>
          <p style={{ opacity: 0.9 }}>Real-time order management</p>
        </div>
      </div>

      {/* Stats Bar */}
      <div style={{
        background: 'white',
        borderBottom: '2px solid #f0e8dc',
        padding: '1rem'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          {[
            { key: 'all', label: 'All Orders', color: '#6B4423' },
            { key: 'received', label: 'New', color: '#2563eb' },
            { key: 'preparing', label: 'Cooking', color: '#f59e0b' },
            { key: 'ready', label: 'Ready', color: '#10b981' }
          ].map(stat => (
            <button
              key={stat.key}
              onClick={() => setFilter(stat.key)}
              style={{
                flex: '1',
                minWidth: '150px',
                padding: '1rem',
                background: filter === stat.key ? stat.color : 'white',
                color: filter === stat.key ? 'white' : stat.color,
                border: `2px solid ${stat.color}`,
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '1rem',
                transition: 'all 0.3s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>{orderCounts[stat.key]}</span>
              <span style={{ fontSize: '0.9rem' }}>{stat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '1.5rem'
      }}>
        {filteredOrders.length === 0 ? (
          <div style={{
            background: 'white',
            padding: '3rem',
            borderRadius: '16px',
            textAlign: 'center',
            color: '#8B6F47'
          }}>
            <p style={{ fontSize: '1.2rem' }}>
              {filter === 'all' 
                ? '📭 No orders yet. Orders will appear here in real-time!' 
                : `📭 No ${filter} orders`}
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {filteredOrders.map(order => {
              const StatusIcon = getStatusIcon(order.status);
              
              return (
                <div
                  key={order.id}
                  style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    border: `3px solid ${getStatusColor(order.status)}`,
                    transition: 'all 0.3s'
                  }}
                >
                  {/* Order Header */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    marginBottom: '1.5rem',
                    paddingBottom: '1rem',
                    borderBottom: '2px solid #f0e8dc'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <h2 style={{
                          fontSize: '1.8rem',
                          fontWeight: 'bold',
                          color: '#6B4423',
                          fontFamily: 'Georgia, serif'
                        }}>
                          Table {order.tableNumber}
                        </h2>
                        <div style={{
                          background: getStatusColor(order.status),
                          color: 'white',
                          padding: '0.4rem 1rem',
                          borderRadius: '20px',
                          fontSize: '0.9rem',
                          fontWeight: 'bold',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          <StatusIcon size={18} />
                          {order.status.toUpperCase()}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '1.5rem', color: '#8B6F47', fontSize: '0.95rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <User size={16} />
                          {order.customerName}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Hash size={16} />
                          {order.id.slice(-6).toUpperCase()}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Clock size={16} />
                          {order.timestamp?.toLocaleTimeString('fi-FI', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        color: '#6B4423'
                      }}>
                        €{order.totalPrice}
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: '#D2691E',
                        fontSize: '0.9rem',
                        marginTop: '0.25rem'
                      }}>
                        <Clock size={16} />
                        {order.estimatedPrepTime} min
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      marginBottom: '1rem',
                      color: '#6B4423'
                    }}>
                      Order Items:
                    </h3>
                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '0.75rem',
                            background: '#f8f5f0',
                            borderRadius: '8px',
                            fontSize: '1rem'
                          }}
                        >
                          <span style={{ fontWeight: '600', color: '#6B4423' }}>
                            {item.quantity}x {item.name}
                          </span>
                          <span style={{ color: '#8B6F47' }}>
                            €{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  {order.notes && (
                    <div style={{
                      background: '#FFF4E6',
                      border: '2px solid #FFD700',
                      borderRadius: '8px',
                      padding: '1rem',
                      marginBottom: '1.5rem'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'start',
                        gap: '0.5rem',
                        color: '#8B6F47'
                      }}>
                        <StickyNote size={20} style={{ marginTop: '0.1rem', color: '#D2691E' }} />
                        <div>
                          <strong style={{ color: '#6B4423' }}>Special Request:</strong>
                          <p style={{ marginTop: '0.25rem' }}>{order.notes}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div style={{
                    display: 'flex',
                    gap: '1rem',
                    paddingTop: '1rem',
                    borderTop: '2px solid #f0e8dc'
                  }}>
                    {order.status === 'received' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                        style={{
                          flex: 1,
                          padding: '1rem',
                          background: '#f59e0b',
                          color: 'white',
                          border: 'none',
                          borderRadius: '12px',
                          fontSize: '1.1rem',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          transition: 'all 0.3s'
                        }}
                        onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                        onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                      >
                        <ChefHat size={24} />
                        Start Cooking
                      </button>
                    )}
                    {order.status === 'preparing' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'ready')}
                        style={{
                          flex: 1,
                          padding: '1rem',
                          background: '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '12px',
                          fontSize: '1.1rem',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          transition: 'all 0.3s'
                        }}
                        onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                        onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                      >
                        <AlertCircle size={24} />
                        Mark as Ready
                      </button>
                    )}
                    {order.status === 'ready' && (
                      <div style={{
                        flex: 1,
                        padding: '1rem',
                        background: '#d1fae5',
                        color: '#065f46',
                        border: '2px solid #10b981',
                        borderRadius: '12px',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        textAlign: 'center'
                      }}>
                        ✅ Order Complete
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;