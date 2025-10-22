import React from 'react';
import { Clock } from 'lucide-react';

/**
 * Cart summary with total price and prep time
 */
export function CartSummary({ totalPrice, totalPrepTime, t }) {
  return (
    <div className="cart-summary">
      <div className="cart-total">
        <span className="total-label">{t.total}:</span>
        <span className="total-price">€{totalPrice}</span>
      </div>
      <div className="estimated-time">
        <Clock size={16} />
        <span>{t.estimatedWait}: {totalPrepTime} {t.minutes}</span>
      </div>
    </div>
  );
}
