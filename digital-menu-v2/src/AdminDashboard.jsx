import React, { useState } from 'react';
import { LogOut } from 'lucide-react';

// Import custom hooks
import { useAuth, useOrders } from './hooks';

// Import components
import { LoginForm } from './components/admin/Login/LoginForm';
import { OrderFilters } from './components/admin/Dashboard/OrderFilters';
import { OrderCard } from './components/admin/Dashboard/OrderCard';

function AdminDashboard() {
  const { user, loading: authLoading, error: authError, login, logout } = useAuth();
  const [filter, setFilter] = useState('all');
  const { orders, allOrders, loading: ordersLoading, updateOrderStatus } = useOrders(filter);

  // Calculate order counts for filters
  const orderCounts = {
    all: allOrders.length,
    received: allOrders.filter(o => o.status === 'received').length,
    preparing: allOrders.filter(o => o.status === 'preparing').length,
    ready: allOrders.filter(o => o.status === 'ready').length
  };

  /**
   * Handle login form submission
   */
  const handleLogin = async (email, password) => {
    await login(email, password);
  };

  /**
   * Handle logout
   */
  const handleLogout = async () => {
    const result = await logout();
    if (!result.success) {
      alert('Failed to logout. Please try again.');
    }
  };

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #6B4423 0%, #8B6F47 100%)',
        color: 'white',
        fontSize: '1.5rem'
      }}>
        Loading...
      </div>
    );
  }

  // Show login form if not authenticated
  if (!user) {
    return <LoginForm onLogin={handleLogin} error={authError} loading={authLoading} />;
  }

  // Admin Dashboard View
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f5f5 0%, #e5e5e5 100%)',
      padding: '2rem'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        background: 'white',
        padding: '1.5rem',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div>
          <h1 style={{ margin: 0, color: '#6B4423', fontSize: '2rem' }}>
            Kitchen Dashboard
          </h1>
          <p style={{ margin: '0.5rem 0 0 0', color: '#6b7280' }}>
            Welcome, {user.email}
          </p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            background: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600'
          }}
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>

      {/* Order Filters */}
      <OrderFilters
        currentFilter={filter}
        onFilterChange={setFilter}
        orderCounts={orderCounts}
      />

      {/* Orders List */}
      {ordersLoading ? (
        <div style={{ textAlign: 'center', padding: '3rem', fontSize: '1.25rem', color: '#6b7280' }}>
          Loading orders...
        </div>
      ) : orders.length === 0 ? (
        <div style={{
          background: 'white',
          padding: '3rem',
          borderRadius: '12px',
          textAlign: 'center',
          color: '#6b7280',
          fontSize: '1.25rem'
        }}>
          {filter === 'all' ? 'No orders yet' : `No ${filter} orders`}
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '1.5rem'
        }}>
          {orders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onStatusUpdate={updateOrderStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
