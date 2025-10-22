import React from 'react';
import { CheckCircle, ChefHat, AlertCircle } from 'lucide-react';

/**
 * Order status tracking view component
 */
export function OrderStatusView({ orderNumber, orderStatus, estimatedPrepTime, t }) {
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
                        {t.estimatedWait}: {estimatedPrepTime} {t.minutes}
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
              <p className="status-ready-text">Your order is ready!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
