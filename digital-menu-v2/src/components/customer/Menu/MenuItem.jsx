import React from 'react';
import { Clock } from 'lucide-react';

/**
 * Individual menu item card component
 */
export function MenuItem({ item, language, onAddToCart, getBadgeText }) {
  return (
    <div className="menu-item">
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
              <span>{item.prepTime} min</span>
            </div>
          </div>
        </div>
        <div className="menu-item-footer">
          <p className="menu-item-price">€{item.price.toFixed(2)}</p>
          <button onClick={() => onAddToCart(item)} className="btn-add-cart">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
