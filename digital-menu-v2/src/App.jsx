import React, { useState } from 'react';
import { ShoppingCart, Globe, Clock, ChefHat, CheckCircle, AlertCircle, X } from 'lucide-react';

const translations = {
  en: {
    welcome: "Welcome to",
    menu: "Menu",
    cart: "Cart",
    order: "Order Now",
    total: "Total",
    items: "items",
    addToCart: "Add to Cart",
    emptyCart: "Your cart is empty",
    orderButton: "Place Order",
    contactInfo: "Contact Information",
    name: "Name",
    tableNumber: "Table Number",
    notes: "Special requests",
    submitOrder: "Submit Order",
    cancel: "Cancel",
    prepTime: "Prep time",
    minutes: "min",
    estimatedWait: "Estimated total time",
    orderStatus: "Order Status",
    orderReceived: "Order Received",
    preparing: "Preparing",
    ready: "Ready",
    orderNumber: "Order #",
    thankYou: "Thank you for your order!",
  },
  fi: {
    welcome: "Tervetuloa",
    menu: "Menu",
    cart: "Ostoskori",
    order: "Tilaa nyt",
    total: "Yhteensä",
    items: "tuotetta",
    addToCart: "Lisää koriin",
    emptyCart: "Ostoskorisi on tyhjä",
    orderButton: "Tee tilaus",
    contactInfo: "Yhteystiedot",
    name: "Nimi",
    tableNumber: "Pöytänumero",
    notes: "Erityistoiveet",
    submitOrder: "Lähetä tilaus",
    cancel: "Peruuta",
    prepTime: "Valmistusaika",
    minutes: "min",
    estimatedWait: "Arvioitu kokonaisaika",
    orderStatus: "Tilauksen tila",
    orderReceived: "Tilaus vastaanotettu",
    preparing: "Valmisteilla",
    ready: "Valmis",
    orderNumber: "Tilaus #",
    thankYou: "Kiitos tilauksestasi!",
  }
};

const menuData = {
  coffee: [
    { id: 1, name: { en: "Espresso", fi: "Espresso" }, price: 3.50, prepTime: 3, image: "☕" },
    { id: 2, name: { en: "Cappuccino", fi: "Cappuccino" }, price: 4.50, prepTime: 4, image: "☕" },
    { id: 3, name: { en: "Latte", fi: "Latte" }, price: 4.80, prepTime: 4, image: "☕" },
  ],
  food: [
    { id: 4, name: { en: "Club Sandwich", fi: "Club-voileipä" }, price: 12.90, prepTime: 12, image: "🥪" },
    { id: 5, name: { en: "Caesar Salad", fi: "Caesar-salaatti" }, price: 11.50, prepTime: 8, image: "🥗" },
    { id: 6, name: { en: "Burger & Fries", fi: "Burgeri & ranskalaiset" }, price: 14.90, prepTime: 18, image: "🍔" },
  ],
  desserts: [
    { id: 7, name: { en: "Cheesecake", fi: "Juustokakku" }, price: 6.50, prepTime: 5, image: "🍰" },
    { id: 8, name: { en: "Ice Cream", fi: "Jäätelö" }, price: 5.00, prepTime: 2, image: "🍨" },
  ]
};

function App() {
  const [language, setLanguage] = useState('en');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  const [orderStatus, setOrderStatus] = useState('received');
  const [formData, setFormData] = useState({ name: '', tableNumber: '', notes: '' });

  const t = translations[language];

  const calculateTotalPrepTime = () => {
    if (cart.length === 0) return 0;
    return Math.max(...cart.map(item => item.prepTime));
  };

  const addToCart = (item) => {
    const existingItem = cart.find(i => i.id === item.id);
    if (existingItem) {
      setCart(cart.map(i => 
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    const item = cart.find(i => i.id === itemId);
    if (item.quantity > 1) {
      setCart(cart.map(i => 
        i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
      ));
    } else {
      setCart(cart.filter(i => i.id !== itemId));
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
  };

  const handleSubmitOrder = () => {
    if (!formData.name || !formData.tableNumber) {
      alert('Please fill in required fields');
      return;
    }
    
    const newOrderNumber = Math.floor(1000 + Math.random() * 9000);
    setOrderNumber(newOrderNumber);
    setOrderSubmitted(true);
    setShowOrderForm(false);
    
    setTimeout(() => setOrderStatus('preparing'), 3000);
    setTimeout(() => setOrderStatus('ready'), calculateTotalPrepTime() * 1000);
  };

  // Order Status View
  if (orderSubmitted) {
    const statuses = [
      { key: 'received', icon: CheckCircle, label: t.orderReceived },
      { key: 'preparing', icon: ChefHat, label: t.preparing },
      { key: 'ready', icon: AlertCircle, label: t.ready }
    ];

    const currentIndex = statuses.findIndex(s => s.key === orderStatus);

    return (
      <div className="app">
        <div className="status-container">
          <div className="status-header">
            <h1>Café Demo</h1>
          </div>
          
          <div className="status-card">
            <h3 className="status-thank-you">{t.thankYou}</h3>
            <p className="status-order-number">{t.orderNumber}{orderNumber}</p>
            
            <div className="status-steps">
              {statuses.map((status, index) => {
                const Icon = status.icon;
                const isActive = index <= currentIndex;
                const isCurrent = index === currentIndex;
                
                return (
                  <div key={status.key} className="status-step">
                    <div className={`status-icon ${isActive ? 'active' : 'inactive'} ${isCurrent ? 'current' : ''}`}>
                      <Icon size={24} />
                    </div>
                    <div className="status-label">
                      <p className={`status-label-text ${isActive ? 'active' : 'inactive'}`}>
                        {status.label}
                      </p>
                      {isCurrent && orderStatus === 'preparing' && (
                        <p className="status-time">
                          {t.estimatedWait}: {calculateTotalPrepTime()} {t.minutes}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {orderStatus === 'ready' && (
              <div className="status-ready">
                <AlertCircle className="status-ready-icon" />
                <p className="status-ready-text">Your order is ready! 🎉</p>
              </div>
            )}
          </div>
        </div>
      </div>
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
            <button onClick={() => setLanguage(language === 'en' ? 'fi' : 'en')} className="btn btn-language">
              <Globe size={20} />
              {language === 'en' ? 'FI' : 'EN'}
            </button>
            <button onClick={() => setShowCart(true)} className="btn btn-cart">
              <ShoppingCart size={20} />
              {cart.length > 0 && (
                <span className="cart-badge">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="main-content">
        {Object.entries(menuData).map(([category, items]) => (
          <div key={category} className="category">
            <h2 className="category-title">
              {category === 'coffee' && '☕'}
              {category === 'food' && '🍽️'}
              {category === 'desserts' && '🍰'}
              {' '}
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </h2>
            <div className="menu-grid">
              {items.map(item => (
                <div key={item.id} className="menu-item">
                  <div className="menu-item-content">
                    <div className="menu-item-info">
                      <div className="menu-item-header">
                        <span className="menu-item-emoji">{item.image}</span>
                        <div>
                          <h3 className="menu-item-name">{item.name[language]}</h3>
                          <div className="menu-item-time">
                            <Clock size={14} />
                            <span>{item.prepTime} {t.minutes}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="menu-item-price-section">
                      <p className="menu-item-price">€{item.price.toFixed(2)}</p>
                      <button onClick={() => addToCart(item)} className="btn-add-cart">
                        {t.addToCart}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Cart Modal */}
      {showCart && (
        <div className="modal-overlay bottom">
          <div className="cart-modal">
            <div className="cart-header">
              <h2 className="cart-title">{t.cart}</h2>
              <button onClick={() => setShowCart(false)} className="btn-close">
                <X size={24} />
              </button>
            </div>

            <div className="cart-content">
              {cart.length === 0 ? (
                <p className="empty-cart">{t.emptyCart}</p>
              ) : (
                <>
                  <div className="cart-items">
                    {cart.map(item => (
                      <div key={item.id} className="cart-item">
                        <div className="cart-item-info">
                          <p className="cart-item-name">{item.name[language]}</p>
                          <p className="cart-item-time">{item.prepTime} {t.minutes}</p>
                          <p className="cart-item-price">€{item.price.toFixed(2)} × {item.quantity}</p>
                        </div>
                        <div className="cart-item-controls">
                          <button onClick={() => removeFromCart(item.id)} className="btn-quantity btn-minus">
                            −
                          </button>
                          <span className="quantity">{item.quantity}</span>
                          <button onClick={() => addToCart(item)} className="btn-quantity btn-plus">
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="cart-summary">
                    <div className="cart-total">
                      <span className="total-label">{t.total}:</span>
                      <span className="total-price">€{getTotalPrice()}</span>
                    </div>
                    <div className="estimated-time">
                      <Clock size={16} />
                      <span>{t.estimatedWait}: {calculateTotalPrepTime()} {t.minutes}</span>
                    </div>
                  </div>

                  <button onClick={() => { setShowCart(false); setShowOrderForm(true); }} className="btn-order">
                    {t.orderButton}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Order Form Modal */}
      {showOrderForm && (
        <div className="modal-overlay">
          <div className="form-modal">
            <h2 className="form-title">{t.contactInfo}</h2>
            <div className="form-fields">
              <input
                type="text"
                placeholder={t.name}
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              <input
                type="number"
                placeholder={t.tableNumber}
                className="form-input"
                value={formData.tableNumber}
                onChange={(e) => setFormData({...formData, tableNumber: e.target.value})}
              />
              <textarea
                placeholder={t.notes}
                className="form-input"
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
              />
              <div className="form-buttons">
                <button onClick={() => setShowOrderForm(false)} className="btn-cancel">
                  {t.cancel}
                </button>
                <button onClick={handleSubmitOrder} className="btn-submit">
                  {t.submitOrder}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;