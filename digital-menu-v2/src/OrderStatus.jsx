import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { CheckCircle, ChefHat, AlertCircle, Clock, ArrowLeft } from 'lucide-react';

const translations = {
  en: {
    thankYou: 'Thank you for your order!',
    orderNumber: 'Order #',
    orderReceived: 'Order Received',
    preparing: 'Preparing',
    ready: 'Ready',
    estimatedWait: 'Estimated total time',
    minutes: 'min',
    header: 'Café Demo',
    readyText: 'Your order is ready! 🎉',
    backToMenu: 'Back to Menu',
  },
  fi: {
    thankYou: 'Kiitos tilauksestasi!',
    orderNumber: 'Tilaus #',
    orderReceived: 'Tilaus vastaanotettu',
    preparing: 'Valmisteilla',
    ready: 'Valmis',
    estimatedWait: 'Arvioitu kokonaisaika',
    minutes: 'min',
    header: 'Café Demo',
    readyText: 'Tilauksesi on valmis! 🎉',
    backToMenu: 'Takaisin menuun',
  }
};

export default function OrderStatus() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('received');
  const [loading, setLoading] = useState(true);
  const [orderShort, setOrderShort] = useState('');

  const language = (() => {
    try { return localStorage.getItem('dm_language') || 'en'; } catch { return 'en'; }
  })();
  const t = translations[language] || translations.en;

  useEffect(() => {
    if (!id) return;
    const ref = doc(db, 'orders', id);
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setOrder(data);
        setStatus(data.status);
        setOrderShort(snap.id.slice(-4).toUpperCase());
      }
      setLoading(false);
    }, () => setLoading(false));
    return () => unsub();
  }, [id]);

  if (loading) {
    return (
      <div className="app">
        <div className="status-container">
          <div className="status-header"><h1>{t.header}</h1></div>
          <div className="status-card"><p>Loading...</p></div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="app">
        <div className="status-container">
          <div className="status-header"><h1>{t.header}</h1></div>
          <div className="status-card"><p>Order not found.</p></div>
        </div>
      </div>
    );
  }

  const statuses = [
    { key: 'received', icon: CheckCircle, label: t.orderReceived },
    { key: 'preparing', icon: ChefHat, label: t.preparing },
    { key: 'ready', icon: AlertCircle, label: t.ready },
  ];
  const currentIndex = statuses.findIndex(s => s.key === status);

  return (
    <div className="app">
      <div className="status-container">
        <div className="status-header">
          <button 
            onClick={() => navigate('/')} 
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '25px',
              color: 'white',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: '600',
              transition: 'all 0.3s',
              marginBottom: '1rem'
            }}
            onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
            onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
          >
            <ArrowLeft size={16} />
            {t.backToMenu}
          </button>
          <h1>{t.header}</h1>
        </div>
        <div className="status-card">
          <h3 className="status-thank-you">{t.thankYou}</h3>
          <p className="status-order-number">{t.orderNumber}{orderShort}</p>

          <div className="status-steps">
            {statuses.map((s, idx) => {
              const Icon = s.icon;
              const isActive = idx <= currentIndex;
              const isCurrent = idx === currentIndex;
              return (
                <div key={s.key} className="status-step">
                  <div className={`status-icon ${isActive ? 'active' : 'inactive'} ${isCurrent ? 'current' : ''}`}>
                    <Icon size={28} />
                  </div>
                  <div className="status-label">
                    <p className={`status-label-text ${isActive ? 'active' : 'inactive'}`}>{s.label}</p>
                    {isCurrent && status === 'preparing' && (
                      <p className="status-time">
                        {t.estimatedWait}: {order.estimatedPrepTime} {t.minutes}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {status === 'ready' && (
            <div className="status-ready">
              <AlertCircle className="status-ready-icon" />
              <p className="status-ready-text">{t.readyText}</p>
            </div>
          )}

          {order.items?.length > 0 && (
            <div style={{ marginTop: '1.5rem', borderTop: '1px solid #f0e8dc', paddingTop: '1rem' }}>
              <h4 style={{ color: '#6B4423', marginBottom: '0.5rem' }}>Items</h4>
              {order.items.map((it, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', color: '#8B6F47', marginBottom: '0.25rem' }}>
                  <span>{it.quantity}x {it.name}</span>
                  <span>€{(it.price * it.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontWeight: 700, color: '#6B4423' }}>
                <span>Total</span>
                <span>€{order.totalPrice}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#A0522D', marginTop: '0.25rem' }}>
                <Clock size={16} />
                <span>{t.estimatedWait}: {order.estimatedPrepTime} {t.minutes}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


