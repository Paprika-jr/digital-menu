import React from 'react';

/**
 * Individual cart item row component
 */
export function CartItem({ item, language, t, onAdd, onRemove }) {
  return (
    <div className="cart-item">
      <div className="cart-item-info">
        <p className="cart-item-name">{item.name[language]}</p>
        <p className="cart-item-time">{item.prepTime} {t.minutes}</p>
        <p className="cart-item-price">€{item.price.toFixed(2)} × {item.quantity}</p>
      </div>
      <div className="cart-item-controls">
        <button onClick={() => onRemove(item.id)} className="btn-quantity btn-minus">
          −
        </button>
        <span className="quantity">{item.quantity}</span>
        <button onClick={() => onAdd(item)} className="btn-quantity btn-plus">
          +
        </button>
      </div>
    </div>
  );
}
