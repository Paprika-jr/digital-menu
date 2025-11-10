import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Modal for customizing menu items with options
 * Displays customization categories (sizes, extras, removals, etc.)
 * Calculates real-time price based on selections
 */
export function CustomizationModal({ item, language, onClose, onAddToCart }) {
  const [selections, setSelections] = useState({});
  const [finalPrice, setFinalPrice] = useState(item.price);

  // Initialize default selections
  useEffect(() => {
    if (!item.customizations) return;

    const defaults = {};
    Object.entries(item.customizations).forEach(([categoryKey, category]) => {
      if (category.type === 'single') {
        // Find default option or first option
        const defaultOption = category.options.find(opt => opt.default);
        if (defaultOption) {
          defaults[categoryKey] = defaultOption.id;
        } else if (category.required && category.options.length > 0) {
          defaults[categoryKey] = category.options[0].id;
        }
      } else if (category.type === 'multiple') {
        // Initialize as empty array for multiple selections
        defaults[categoryKey] = [];
      }
    });

    setSelections(defaults);
  }, [item]);

  // Calculate final price whenever selections change
  useEffect(() => {
    let total = item.price;

    Object.entries(selections).forEach(([categoryKey, selectedValue]) => {
      const category = item.customizations[categoryKey];
      if (!category) return;

      if (category.type === 'single') {
        // Single selection - add the price of selected option
        const option = category.options.find(opt => opt.id === selectedValue);
        if (option) {
          total += option.price;
        }
      } else if (category.type === 'multiple') {
        // Multiple selections - add prices of all selected options
        selectedValue.forEach(optionId => {
          const option = category.options.find(opt => opt.id === optionId);
          if (option) {
            total += option.price;
          }
        });
      }
    });

    setFinalPrice(total);
  }, [selections, item]);

  // Handle single selection change (radio buttons)
  const handleSingleChange = (categoryKey, optionId) => {
    setSelections(prev => ({
      ...prev,
      [categoryKey]: optionId
    }));
  };

  // Handle multiple selection change (checkboxes)
  const handleMultipleChange = (categoryKey, optionId) => {
    setSelections(prev => {
      const currentSelections = prev[categoryKey] || [];
      const isSelected = currentSelections.includes(optionId);

      return {
        ...prev,
        [categoryKey]: isSelected
          ? currentSelections.filter(id => id !== optionId)
          : [...currentSelections, optionId]
      };
    });
  };

  // Validate that all required selections are made
  const isValid = () => {
    if (!item.customizations) return true;

    return Object.entries(item.customizations).every(([categoryKey, category]) => {
      if (!category.required) return true;

      if (category.type === 'single') {
        return selections[categoryKey] !== undefined && selections[categoryKey] !== null;
      } else if (category.type === 'multiple') {
        return true; // Multiple selections are never truly required (can be empty array)
      }

      return true;
    });
  };

  // Handle add to cart with customizations
  const handleAddToCart = () => {
    if (!isValid()) {
      alert('Please complete all required selections');
      return;
    }

    // Create customized item object
    const customizedItem = {
      ...item,
      customizations: selections,
      finalPrice: finalPrice
    };

    onAddToCart(customizedItem);
    onClose();
  };

  if (!item.customizations) {
    // If no customizations, just add to cart directly
    onAddToCart(item);
    onClose();
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="customization-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="customization-modal-header">
          <div>
            <h2 className="customization-modal-title">
              {item.name[language]}
            </h2>
            <p className="customization-modal-subtitle">
              Base price: €{item.price.toFixed(2)}
            </p>
          </div>
          <button onClick={onClose} className="customization-modal-close" aria-label="Close">
            <X size={24} />
          </button>
        </div>

        {/* Customization Categories */}
        <div className="customization-modal-body">
          {Object.entries(item.customizations).map(([categoryKey, category]) => (
            <div key={categoryKey} className="customization-category">
              <h3 className="customization-category-title">
                {category.label[language]}
                {category.required && <span className="required-indicator"> *</span>}
              </h3>

              {category.type === 'single' ? (
                // Radio buttons for single selection
                <div className="customization-options">
                  {category.options.map(option => (
                    <label key={option.id} className="customization-option">
                      <input
                        type="radio"
                        name={categoryKey}
                        value={option.id}
                        checked={selections[categoryKey] === option.id}
                        onChange={() => handleSingleChange(categoryKey, option.id)}
                      />
                      <span className="customization-option-label">
                        {option.label[language]}
                      </span>
                      {option.price !== 0 && (
                        <span className="customization-option-price">
                          {option.price > 0 ? '+' : ''}€{option.price.toFixed(2)}
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              ) : (
                // Checkboxes for multiple selection
                <div className="customization-options">
                  {category.options.map(option => (
                    <label key={option.id} className="customization-option">
                      <input
                        type="checkbox"
                        value={option.id}
                        checked={(selections[categoryKey] || []).includes(option.id)}
                        onChange={() => handleMultipleChange(categoryKey, option.id)}
                      />
                      <span className="customization-option-label">
                        {option.label[language]}
                      </span>
                      {option.price !== 0 && (
                        <span className="customization-option-price">
                          {option.price > 0 ? '+' : ''}€{option.price.toFixed(2)}
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer with price and add button */}
        <div className="customization-modal-footer">
          <div className="customization-modal-total">
            <span className="customization-modal-total-label">Total:</span>
            <span className="customization-modal-total-price">€{finalPrice.toFixed(2)}</span>
          </div>
          <button
            onClick={handleAddToCart}
            className="btn-add-customized"
            disabled={!isValid()}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
