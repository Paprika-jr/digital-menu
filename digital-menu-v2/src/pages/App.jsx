import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ShoppingCart, Globe } from 'lucide-react';

// Import custom hooks
import { useLanguage, useCart, useOrderSubmit, useOrderTracking } from '../hooks';

// Import menu data
import menuDataJson from '../data/menuData.json';

// Import components
import { TodaySpecial } from '../components/customer/Menu/TodaySpecial';
import { MenuCategory } from '../components/customer/Menu/MenuCategory';
import { CartModal } from '../components/customer/Cart/CartModal';
import { OrderForm } from '../components/customer/Order/OrderForm';
import { OrderStatusView } from '../components/customer/Order/OrderStatusView';

function App() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Custom hooks
  const { language, toggleLanguage, t } = useLanguage();
  const {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    getTotalPrice,
    getTotalItems,
    calculateTotalPrepTime,
    formatCustomizations
  } = useCart();
  const { submitOrder } = useOrderSubmit();

  // UI state
  const [showCart, setShowCart] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [lastOrderId, setLastOrderId] = useState(() => {
    try {
      return localStorage.getItem('dm_last_order_id') || null;
    } catch {
      // Return null if localStorage is unavailable
      return null;
    }
  });

  // Extract table number from URL query parameters
  useEffect(() => {
    const tableParam = searchParams.get('table');
    if (tableParam) {
      setTableNumber(tableParam);
    }
  }, [searchParams]);

  // Track order status for submitted orders
  const { order: trackedOrder } = useOrderTracking(lastOrderId);

  /**
   * Handle add to cart with confirmation toast
   */
  const handleAddToCart = (item) => {
    addToCart(item);
    // Show toast notification
    setToastMessage(`${item.name[language]} ${t.addedToCart || 'added to cart'}!`);
    setShowToast(true);
    // Hide toast after 2 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  /**
   * Handle order submission
   */
  const handleSubmitOrder = async (formData) => {
    const menuData = Object.values(menuDataJson.categories).flat().concat(menuDataJson.todaySpecial ? [menuDataJson.todaySpecial] : []);

    const orderData = {
      customerName: formData.name,
      tableNumber: formData.tableNumber,
      notes: formData.notes,
      items: cart.map(item => ({
        id: item.id,
        name: item.name[language],
        price: item.price,
        quantity: item.quantity,
        prepTime: item.prepTime,
        customizations: item.customizations || null,
        customizationsText: formatCustomizations(item, menuData, language)
      })),
      totalPrice: getTotalPrice(),
      estimatedPrepTime: calculateTotalPrepTime,
      language: language
    };

    const result = await submitOrder(orderData);

    if (result.success) {
      setOrderNumber(result.orderId.slice(-4).toUpperCase());
      setOrderSubmitted(true);
      clearCart();
      setShowOrderForm(false);

      // Save order ID for tracking
      try {
        localStorage.setItem('dm_last_order_id', result.orderId);
      } catch {
        // Silently fail if localStorage is unavailable
      }
      setLastOrderId(result.orderId);

      // Navigate to order status page
      navigate(`/status/${result.orderId}`);
    } else {
      alert('Failed to place order. Please try again.');
    }
  };

  /**
   * Get badge text based on language
   */
  const getBadgeText = (badge) => {
    if (!badge) return null;
    switch (badge) {
      case 'popular': return t.popular;
      case 'bestseller': return t.bestseller;
      case 'new': return t.new;
      default: return null;
    }
  };

  // Order Status View
  if (orderSubmitted && trackedOrder) {
    return (
      <OrderStatusView
        orderNumber={orderNumber}
        orderStatus={trackedOrder.status}
        estimatedPrepTime={calculateTotalPrepTime}
        t={t}
      />
    );
  }

  // Main Menu View
  return (
    <div className="app">
      {/* Header */}
      <div className="header">
        <div className="header-content">
          <h1>Café Demo</h1>
          <div className="header-buttons">
            <button onClick={toggleLanguage} className="btn btn-language">
              <Globe size={20} />
              {language === 'en' ? 'FI' : 'EN'}
            </button>
            {lastOrderId && (
              <button
                onClick={() => navigate(`/status/${lastOrderId}`)}
                className="btn btn-cart"
                style={{ background: '#10b981' }}
              >
                 {language === 'en' ? 'View my order' : 'Katso tilaukseni'}
              </button>
            )}
            <button onClick={() => setShowCart(true)} className="btn btn-cart">
              <ShoppingCart size={20} />
              {cart.length > 0 && (
                <span className="cart-badge">{getTotalItems()}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="hero-content">
          <h2 className="hero-title">{t.welcome} Café Demo</h2>
          <p className="hero-subtitle">{t.tagline}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Today's Special */}
        <TodaySpecial
          special={menuDataJson.todaySpecial}
          language={language}
          t={t}
          onAddToCart={handleAddToCart}
        />

        {/* Menu Categories */}
        {Object.entries(menuDataJson.categories).map(([category, items]) => (
          <MenuCategory
            key={category}
            category={category}
            items={items}
            language={language}
            onAddToCart={handleAddToCart}
            getBadgeText={getBadgeText}
            t={t}
          />
        ))}
      </div>

      {/* Cart Modal */}
      {showCart && (
        <CartModal
          cart={cart}
          language={language}
          t={t}
          totalPrice={getTotalPrice()}
          totalPrepTime={calculateTotalPrepTime}
          onClose={() => setShowCart(false)}
          onAddToCart={addToCart}
          onRemoveFromCart={removeFromCart}
          onPlaceOrder={() => {
            setShowCart(false);
            setShowOrderForm(true);
          }}
          formatCustomizations={formatCustomizations}
          menuData={Object.values(menuDataJson.categories).flat().concat(menuDataJson.todaySpecial ? [menuDataJson.todaySpecial] : [])}
        />
      )}

      {/* Order Form Modal */}
      {showOrderForm && (
        <OrderForm
          t={t}
          onSubmit={handleSubmitOrder}
          onCancel={() => setShowOrderForm(false)}
          initialTableNumber={tableNumber}
        />
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="toast-notification">
          <span>✓ {toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default App;
