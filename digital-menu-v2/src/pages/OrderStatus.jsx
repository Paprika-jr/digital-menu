import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
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
    readyText: 'Your order is ready!',
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
    readyText: 'Tilauksesi on valmis!',
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
  const [error, setError] = useState(null);

  const language = (() => {
    try { return localStorage.getItem('dm_language') || 'en'; } catch { return 'en'; }
  })();
  const t = translations[language] || translations.en;

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    console.log('[OrderStatus] Setting up listener for order:', id);
    const ref = doc(db, 'orders', id);

    const unsub = onSnapshot(
      ref,
      (snap) => {
        console.log('[OrderStatus] Snapshot received. Exists:', snap.exists());
        if (snap.exists()) {
          const data = snap.data();
          console.log('[OrderStatus] Order data:', data);
          setOrder(data);
          setStatus(data.status);
          setOrderShort(snap.id.slice(-4).toUpperCase());
          setError(null);
        } else {
          console.warn('[OrderStatus] Order document does not exist:', id);
          setOrder(null);
          setError('not-found');
        }
        setLoading(false);
      },
      (err) => {
        console.error('[OrderStatus] Error in snapshot listener:', err);
        console.error('[OrderStatus] Error code:', err.code);
        console.error('[OrderStatus] Error message:', err.message);

        // Set specific error based on Firebase error code
        if (err.code === 'permission-denied') {
          setError('permission-denied');
        } else if (err.code === 'unavailable') {
          setError('network-error');
        } else {
          setError('unknown-error');
        }

        setOrder(null);
        setLoading(false);
      }
    );

    return () => {
      console.log('[OrderStatus] Cleaning up listener for order:', id);
      unsub();
    };
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

  if (!order && !loading) {
    const getErrorMessage = () => {
      switch (error) {
        case 'not-found':
          return {
            title: 'Order Not Found',
            message: 'This order does not exist or may have been removed.',
            action: 'Please check your order ID or contact staff for assistance.'
          };
        case 'permission-denied':
          return {
            title: 'Access Denied',
            message: 'Unable to access order information.',
            action: 'Please check your Firestore security rules. Orders should be readable by anyone.'
          };
        case 'network-error':
          return {
            title: 'Connection Error',
            message: 'Unable to connect to the server.',
            action: 'Please check your internet connection and try refreshing the page.'
          };
        default:
          return {
            title: 'Error Loading Order',
            message: 'Something went wrong while loading your order.',
            action: 'Please try refreshing the page or contact staff for assistance.'
          };
      }
    };

    const errorInfo = getErrorMessage();

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
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <AlertCircle size={48} style={{ color: '#e07856', marginBottom: '1rem' }} />
              <h3 style={{ color: '#2d2520', marginBottom: '0.5rem' }}>{errorInfo.title}</h3>
              <p style={{ color: '#5d4e43', marginBottom: '0.5rem' }}>{errorInfo.message}</p>
              <p style={{ color: '#8B6F47', fontSize: '0.9rem' }}>{errorInfo.action}</p>
              <button
                onClick={() => window.location.reload()}
                style={{
                  marginTop: '1.5rem',
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(135deg, #e07856 0%, #d4745f 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(224, 120, 86, 0.25)'
                }}
              >
                Retry / Refresh
              </button>
            </div>
          </div>
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


