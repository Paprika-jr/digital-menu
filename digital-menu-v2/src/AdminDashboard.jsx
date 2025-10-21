import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from './firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { Clock, CheckCircle, ChefHat, AlertCircle, User, Hash, StickyNote, LogOut } from 'lucide-react';

// Login Component
const AdminLogin = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Admin logged in');
      onLoginSuccess();
    } catch (error) {
      console.error('❌ Login failed:', error);
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #6B4423 0%, #8B6F47 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '2rem',
        maxWidth: '400px',
        width: '100%',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
      }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#6B4423',
          marginBottom: '0.5rem',
          fontFamily: 'Georgia, serif',
          textAlign: 'center'
        }}>
          🔐 Admin Login
        </h1>
        <p style={{
          color: '#8B6F47',
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          Kitchen Dashboard Access
        </p>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#6B4423',
              fontWeight: '600'
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #f0e8dc',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#6B4423',
              fontWeight: '600'
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #f0e8dc',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            />
          </div>

          {error && (
            <div style={{
              background: '#fee2e2',
              color: '#dc2626',
              padding: '0.75rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              fontSize: '0.9rem'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '1rem',
              background: loading ? '#8B6F47' : '#D2691E',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s'
            }}
          >
            {loading ? 'Logging in...' : 'Login to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
};

// Main Admin Dashboard Component
const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // Check authentication status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  // Fetch orders from Firebase
  useEffect(() => {
    if (!isAuthenticated) return;

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
      
      const newOrders = ordersData.filter(o => o.status === 'received');
      if (newOrders.length > 0) {
        console.log('🔔 New orders:', newOrders.length);
      }
    }, (error) => {
      console.error('Error fetching orders:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAuthenticated]);

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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('👋 Admin logged out');
    } catch (error) {
      console.error('❌ Logout failed:', error);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'received': return '#2563eb';
      case 'preparing': return '#f59e0b';
      case 'ready': return '#10b981';
      default: return '#6b7280';
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

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div style={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8f5f0'
      }}>
        <div style={{ textAlign: 'center', fontSize: '1.2rem', color: '#6B4423' }}>
          Loading... 🔄
        </div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  // Show loading while fetching orders
  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', fontSize: '1.2rem' }}>
        Loading orders... 🔄
      </div>
    );
  }

  // Main Dashboard
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
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', fontFamily: 'Georgia, serif' }}>
              🍽️ Kitchen Dashboard
            </h1>
            <p style={{ opacity: 0.9 }}>Real-time order management</p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '25px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
            onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
          >
            <LogOut size={20} />
            Logout
          </button>
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