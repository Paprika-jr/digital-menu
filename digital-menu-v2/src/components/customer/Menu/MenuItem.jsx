import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import { CustomizationModal } from './CustomizationModal';

/**
 * Individual menu item card component
 */
export function MenuItem({ item, language, onAddToCart, getBadgeText, t }) {
  const [showCustomization, setShowCustomization] = useState(false);

  const handleButtonClick = () => {
    if (item.customizations) {
      // Item has customizations - show modal
      setShowCustomization(true);
    } else {
      // No customizations - add directly to cart
      onAddToCart(item);
    }
  };

  const handleAddToCart = (customizedItem) => {
    onAddToCart(customizedItem);
    setShowCustomization(false);
  };

  return (
    <>
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
            <button onClick={handleButtonClick} className="btn-add-cart">
              {item.customizations ? t.customize : t.addToCart}
            </button>
          </div>
        </div>
      </div>

      {showCustomization && (
        <CustomizationModal
          item={item}
          language={language}
          onClose={() => setShowCustomization(false)}
          onAddToCart={handleAddToCart}
        />
      )}
    </>
  );
}
