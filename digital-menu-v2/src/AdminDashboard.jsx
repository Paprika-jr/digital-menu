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
      <div className="admin-loading">
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
    <div className="admin-container">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-content">
          <h1>Kitchen Dashboard</h1>
          <p>Welcome, {user.email}</p>
        </div>
        <button onClick={handleLogout} className="btn-logout">
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
        <div className="orders-loading">
          Loading orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="orders-empty">
          {filter === 'all' ? 'No orders yet' : `No ${filter} orders`}
        </div>
      ) : (
        <div className="orders-grid">
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
