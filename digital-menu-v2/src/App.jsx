import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { ShoppingCart, Globe, Clock, ChefHat, CheckCircle, AlertCircle, X, Star, TrendingUp } from 'lucide-react';

const translations = {
  en: {
    welcome: "Welcome to",
    tagline: "Fresh, Delicious, Made with Love",
    todaySpecial: "Today's Special",
    limitedOffer: "Limited Time Offer",
    chefRecommends: "Chef Recommends",
    popular: "Popular",
    bestseller: "Bestseller",
    new: "New",
    menu: "Menu",
    cart: "Cart",
    order: "Order Now",
    total: "Total",
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
    tagline: "Tuoretta, Herkullista, Rakkaudella Tehtyä",
    todaySpecial: "Päivän Erikoinen",
    limitedOffer: "Rajoitettu Tarjous",
    chefRecommends: "Kokin Suositus",
    popular: "Suosittu",
    bestseller: "Myydyin",
    new: "Uusi",
    menu: "Menu",
    cart: "Ostoskori",
    order: "Tilaa nyt",
    total: "Yhteensä",
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

// Today's Special
const todaySpecial = {
  id: 99,
  name: { en: "Grilled Salmon with Lemon Butter", fi: "Grillattu Lohi Sitruunavoin Kera" },
  description: { en: "Fresh Norwegian salmon with seasonal vegetables", fi: "Tuore norjalainen lohi kauden vihannesten kera" },
  price: 18.90,
  originalPrice: 24.90,
  prepTime: 20,
  image: "🐟"
};

const menuData = {
  coffee: [
    { 
      id: 1, 
      name: { en: "Espresso", fi: "Espresso" }, 
      description: { en: "Strong and bold", fi: "Vahva ja rohkea" },
      price: 3.50, 
      prepTime: 3, 
      image: "☕",
      badge: "popular"
    },
    { 
      id: 2, 
      name: { en: "Cappuccino", fi: "Cappuccino" }, 
      description: { en: "Creamy and smooth", fi: "Kermainen ja pehmeä" },
      price: 4.50, 
      prepTime: 4, 
      image: "☕",
      badge: "bestseller"
    },
    { 
      id: 3, 
      name: { en: "Latte", fi: "Latte" }, 
      description: { en: "Mild and milky", fi: "Mieto ja maitoa" },
      price: 4.80, 
      prepTime: 4, 
      image: "☕"
    },
    { 
      id: 4, 
      name: { en: "Mocha", fi: "Mocha" }, 
      description: { en: "Coffee meets chocolate", fi: "Kahvi kohtaa suklaan" },
      price: 5.20, 
      prepTime: 5, 
      image: "☕",
      badge: "new"
    },
  ],
  food: [
    { 
      id: 5, 
      name: { en: "Club Sandwich", fi: "Club-voileipä" }, 
      description: { en: "Triple-decker with chicken & bacon", fi: "Kolmikerroksinen kana-pekoni" },
      price: 12.90, 
      prepTime: 12, 
      image: "🥪",
      badge: "popular"
    },
    { 
      id: 6, 
      name: { en: "Caesar Salad", fi: "Caesar-salaatti" }, 
      description: { en: "Crispy romaine with parmesan", fi: "Rapeaa salaattia ja parmesania" },
      price: 11.50, 
      prepTime: 8, 
      image: "🥗"
    },
    { 
      id: 7, 
      name: { en: "Burger & Fries", fi: "Burgeri & ranskalaiset" }, 
      description: { en: "Juicy beef patty with crispy fries", fi: "Mehukas pihvi ja rapeita perunoita" },
      price: 14.90, 
      prepTime: 18, 
      image: "🍔",
      badge: "bestseller"
    },
    { 
      id: 8, 
      name: { en: "Pasta Carbonara", fi: "Pasta Carbonara" }, 
      description: { en: "Creamy Italian classic", fi: "Kermainen italialainen klassikko" },
      price: 13.50, 
      prepTime: 15, 
      image: "🍝"
    },
    { 
      id: 9, 
      name: { en: "Soup of the Day", fi: "Päivän keitto" }, 
      description: { en: "Ask our staff for today's selection", fi: "Kysy henkilökunnalta päivän keittoa" },
      price: 8.90, 
      prepTime: 5, 
      image: "🍲"
    },
  ],
  desserts: [
    { 
      id: 10, 
      name: { en: "Cheesecake", fi: "Juustokakku" }, 
      description: { en: "New York style with berry sauce", fi: "New York -tyylinen marjakastikkeella" },
      price: 6.50, 
      prepTime: 5, 
      image: "🍰",
      badge: "popular"
    },
    { 
      id: 11, 
      name: { en: "Ice Cream", fi: "Jäätelö" }, 
      description: { en: "Three scoops of your choice", fi: "Kolme palloa omasta valinnasta" },
      price: 5.00, 
      prepTime: 2, 
      image: "🍨"
    },
    { 
      id: 12, 
      name: { en: "Chocolate Brownie", fi: "Suklaabrownie" }, 
      description: { en: "Warm with vanilla ice cream", fi: "Lämmin vaniljajäätelön kera" },
      price: 5.50, 
      prepTime: 3, 
      image: "🍫",
      badge: "bestseller"
    },
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

  const handleSubmitOrder = async () => {
    if (!formData.name || !formData.tableNumber) {
      alert('Please fill in required fields');
      return;
    }
    
    try {
      const orderData = {
        customerName: formData.name,
        tableNumber: formData.tableNumber,
        notes: formData.notes,
        items: cart.map(item => ({
          id: item.id,
          name: item.name[language],
          price: item.price,
          quantity: item.quantity,
          prepTime: item.prepTime
        })),
        totalPrice: getTotalPrice(),
        estimatedPrepTime: calculateTotalPrepTime(),
        status: 'received',
        timestamp: serverTimestamp(),
        language: language
      };

      const docRef = await addDoc(collection(db, 'orders'), orderData);
      
      console.log('✅ Order saved to Firebase with ID:', docRef.id);
      
      setOrderNumber(docRef.id.slice(-4).toUpperCase());
      setOrderSubmitted(true);
      setShowOrderForm(false);
      
      setTimeout(() => setOrderStatus('preparing'), 3000);
      setTimeout(() => setOrderStatus('ready'), calculateTotalPrepTime() * 1000);
      
    } catch (error) {
      console.error('❌ Error saving order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  const getBadgeText = (badge) => {
    if (!badge) return null;
    switch(badge) {
      case 'popular': return t.popular;
      case 'bestseller': return t.bestseller;
      case 'new': return t.new;
      default: return null;
    }
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
                      <Icon size={28} />
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
        <div className="special-section">
          <div className="special-header">
            <Star size={32} />
            <h2 className="special-title">{t.todaySpecial}</h2>
          </div>
          <div className="special-item">
            <div className="special-item-info">
              <h3>{todaySpecial.image} {todaySpecial.name[language]}</h3>
              <p className="special-item-desc">{todaySpecial.description[language]}</p>
              <div className="special-item-time">
                <Clock size={16} />
                <span>{todaySpecial.prepTime} {t.minutes}</span>
                <span style={{marginLeft: '1rem'}}>⏰ {t.limitedOffer}</span>
              </div>
            </div>
            <div className="special-item-right">
              <div className="special-price">
                <span className="original-price">€{todaySpecial.originalPrice.toFixed(2)}</span>
                €{todaySpecial.price.toFixed(2)}
              </div>
              <button onClick={() => addToCart(todaySpecial)} className="btn-special">
                {t.addToCart}
              </button>
            </div>
          </div>
        </div>

        {/* Menu Categories */}
        {Object.entries(menuData).map(([category, items]) => (
          <div key={category} className="category">
            <div className="category-header">
              <div>
                <h2 className="category-title">
                  {category === 'coffee' && '☕'}
                  {category === 'food' && '🍽️'}
                  {category === 'desserts' && '🍰'}
                  {' '}
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </h2>
                {category === 'coffee' && <p className="category-subtitle">{language === 'en' ? 'Freshly brewed, always perfect' : 'Tuoretta keittoa, aina täydellistä'}</p>}
                {category === 'food' && <p className="category-subtitle">{language === 'en' ? 'Made fresh to order' : 'Tehty tuoreelta tilauksesta'}</p>}
                {category === 'desserts' && <p className="category-subtitle">{language === 'en' ? 'Sweet endings to perfect meals' : 'Makea lopetus täydelliselle aterialle'}</p>}
              </div>
              {category === 'food' && <TrendingUp size={24} color="#D2691E" />}
            </div>
            <div className="menu-grid">
              {items.map(item => (
                <div key={item.id} className="menu-item">
                  {item.badge && (
                    <div className="item-badge">
                      {getBadgeText(item.badge)}
                    </div>
                  )}
                  <div className="menu-item-content">
                    <div className="menu-item-header">
                      <span className="menu-item-emoji">{item.image}</span>
                      <div className="menu-item-details">
                        <h3 className="menu-item-name">{item.name[language]}</h3>
                        {item.description && (
                          <p className="menu-item-desc">{item.description[language]}</p>
                        )}
                        <div className="menu-item-time">
                          <Clock size={14} />
                          <span>{item.prepTime} {t.minutes}</span>
                        </div>
                      </div>
                    </div>
                    <div className="menu-item-footer">
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