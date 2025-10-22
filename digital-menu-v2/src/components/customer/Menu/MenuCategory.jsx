import React from 'react';
import { TrendingUp } from 'lucide-react';
import { MenuItem } from './MenuItem';

/**
 * Menu category section with items grid
 */
export function MenuCategory({ category, items, language, onAddToCart, getBadgeText }) {
  const categoryIcons = {
    coffee: '☕',
    food: '🍽️',
    desserts: '🍰'
  };

  const categorySubtitles = {
    coffee: {
      en: 'Freshly brewed, always perfect',
      fi: 'Tuoretta keittoa, aina täydellistä'
    },
    food: {
      en: 'Made fresh to order',
      fi: 'Tehty tuoreelta tilauksesta'
    },
    desserts: {
      en: 'Sweet endings to perfect meals',
      fi: 'Makea lopetus täydelliselle aterialle'
    }
  };

  return (
    <div className="category">
      <div className="category-header">
        <div>
          <h2 className="category-title">
            {categoryIcons[category]}{' '}
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </h2>
          {categorySubtitles[category] && (
            <p className="category-subtitle">
              {categorySubtitles[category][language]}
            </p>
          )}
        </div>
        {category === 'food' && <TrendingUp size={24} color="#D2691E" />}
      </div>
      <div className="menu-grid">
        {items.map(item => (
          <MenuItem
            key={item.id}
            item={item}
            language={language}
            onAddToCart={onAddToCart}
            getBadgeText={getBadgeText}
          />
        ))}
      </div>
    </div>
  );
}
