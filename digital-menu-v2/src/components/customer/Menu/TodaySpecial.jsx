import React from 'react';
import { Star, Clock } from 'lucide-react';

/**
 * Today's special offer banner component
 */
export function TodaySpecial({ special, language, t, onAddToCart }) {
  return (
    <div className="special-section">
      <div className="special-header">
        <Star size={32} />
        <h2 className="special-title">{t.todaySpecial}</h2>
      </div>
      <div className="special-item">
        <div className="special-item-info">
          <h3>{special.image} {special.name[language]}</h3>
          <p className="special-item-desc">{special.description[language]}</p>
          <div className="special-item-time">
            <Clock size={16} />
            <span>{special.prepTime} {t.minutes}</span>
            <span style={{ marginLeft: '1rem' }}>⏰ {t.limitedOffer}</span>
          </div>
        </div>
        <div className="special-item-right">
          <div className="special-price">
            <span className="original-price">€{special.originalPrice.toFixed(2)}</span>
            €{special.price.toFixed(2)}
          </div>
          <button onClick={() => onAddToCart(special)} className="btn-special">
            {t.addToCart}
          </button>
        </div>
      </div>
    </div>
  );
}
