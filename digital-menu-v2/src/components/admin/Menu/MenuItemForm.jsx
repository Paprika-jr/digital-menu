import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Default categories as fallback
 */
const DEFAULT_CATEGORIES = [
  { id: 'coffee', name: { en: 'Coffee', fi: 'Kahvi' }, enabled: true },
  { id: 'food', name: { en: 'Food', fi: 'Ruoka' }, enabled: true },
  { id: 'desserts', name: { en: 'Desserts', fi: 'Jälkiruoat' }, enabled: true }
];

/**
 * Form for adding/editing menu items
 */
export function MenuItemForm({ item, categories, onSubmit, onCancel }) {
  // Use provided categories or fallback to default ones
  const availableCategories = categories && categories.length > 0 ? categories : DEFAULT_CATEGORIES;
  const [formData, setFormData] = useState({
    name: { en: '', fi: '' },
    description: { en: '', fi: '' },
    price: '',
    category: '',
    prepTime: '',
    badge: '',
    available: true,
    customizable: false,
    customizationOptions: {
      sizes: [],
      extras: [],
      removals: [],
      spiceLevels: []
    }
  });

  const [errors, setErrors] = useState({});

  // Load item data when editing
  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || { en: '', fi: '' },
        description: item.description || { en: '', fi: '' },
        price: item.price || '',
        category: item.category || '',
        prepTime: item.prepTime || '',
        badge: item.badge || '',
        available: item.available ?? true,
        customizable: item.customizable || false,
        customizationOptions: item.customizationOptions || {
          sizes: [],
          extras: [],
          removals: [],
          spiceLevels: []
        }
      });
    }
  }, [item]);

  /**
   * Validate form
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.en.trim()) {
      newErrors.nameEn = 'English name is required';
    }
    if (!formData.name.fi.trim()) {
      newErrors.nameFi = 'Finnish name is required';
    }
    if (!formData.price || isNaN(formData.price) || formData.price <= 0) {
      newErrors.price = 'Valid price is required';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (!formData.prepTime || isNaN(formData.prepTime) || formData.prepTime <= 0) {
      newErrors.prepTime = 'Valid prep time is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        price: parseFloat(formData.price),
        prepTime: parseInt(formData.prepTime)
      });
    }
  };

  /**
   * Update nested name field
   */
  const updateName = (lang, value) => {
    setFormData(prev => ({
      ...prev,
      name: { ...prev.name, [lang]: value }
    }));
  };

  /**
   * Update nested description field
   */
  const updateDescription = (lang, value) => {
    setFormData(prev => ({
      ...prev,
      description: { ...prev.description, [lang]: value }
    }));
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="menu-item-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="menu-item-form-header">
          <h2>{item ? 'Edit Menu Item' : 'Add New Menu Item'}</h2>
          <button onClick={onCancel} className="btn-close">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="menu-item-form">
          {/* Name Fields */}
          <div className="form-section">
            <h3 className="form-section-title">Item Name</h3>
            <div className="form-row">
              <div className="form-field">
                <label>Name (English) *</label>
                <input
                  type="text"
                  value={formData.name.en}
                  onChange={(e) => updateName('en', e.target.value)}
                  className={`form-input ${errors.nameEn ? 'error' : ''}`}
                  placeholder="e.g., Latte"
                />
                {errors.nameEn && <span className="error-text">{errors.nameEn}</span>}
              </div>
              <div className="form-field">
                <label>Name (Finnish) *</label>
                <input
                  type="text"
                  value={formData.name.fi}
                  onChange={(e) => updateName('fi', e.target.value)}
                  className={`form-input ${errors.nameFi ? 'error' : ''}`}
                  placeholder="e.g., Latte"
                />
                {errors.nameFi && <span className="error-text">{errors.nameFi}</span>}
              </div>
            </div>
          </div>

          {/* Description Fields */}
          <div className="form-section">
            <h3 className="form-section-title">Description</h3>
            <div className="form-row">
              <div className="form-field">
                <label>Description (English)</label>
                <textarea
                  value={formData.description.en}
                  onChange={(e) => updateDescription('en', e.target.value)}
                  className="form-input"
                  rows={2}
                  placeholder="Brief description..."
                />
              </div>
              <div className="form-field">
                <label>Description (Finnish)</label>
                <textarea
                  value={formData.description.fi}
                  onChange={(e) => updateDescription('fi', e.target.value)}
                  className="form-input"
                  rows={2}
                  placeholder="Lyhyt kuvaus..."
                />
              </div>
            </div>
          </div>

          {/* Price and Category */}
          <div className="form-section">
            <h3 className="form-section-title">Basic Information</h3>
            <div className="form-row">
              <div className="form-field">
                <label>Price (€) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className={`form-input ${errors.price ? 'error' : ''}`}
                  placeholder="4.50"
                />
                {errors.price && <span className="error-text">{errors.price}</span>}
              </div>
              <div className="form-field">
                <label>Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className={`form-input ${errors.category ? 'error' : ''}`}
                >
                  <option value="">Select category...</option>
                  {availableCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name?.en || cat.id}
                    </option>
                  ))}
                </select>
                {errors.category && <span className="error-text">{errors.category}</span>}
              </div>
            </div>
          </div>

          {/* Prep Time and Badge */}
          <div className="form-section">
            <div className="form-row">
              <div className="form-field">
                <label>Prep Time (minutes) *</label>
                <input
                  type="number"
                  value={formData.prepTime}
                  onChange={(e) => setFormData({ ...formData, prepTime: e.target.value })}
                  className={`form-input ${errors.prepTime ? 'error' : ''}`}
                  placeholder="5"
                />
                {errors.prepTime && <span className="error-text">{errors.prepTime}</span>}
              </div>
              <div className="form-field">
                <label>Badge (Optional)</label>
                <select
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  className="form-input"
                >
                  <option value="">No badge</option>
                  <option value="popular">Popular</option>
                  <option value="bestseller">Bestseller</option>
                  <option value="new">New</option>
                </select>
              </div>
            </div>
          </div>

          {/* Toggles */}
          <div className="form-section">
            <h3 className="form-section-title">Settings</h3>
            <div className="form-toggles">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={formData.available}
                  onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                  className="toggle-input"
                />
                <span>Available for ordering</span>
              </label>
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={formData.customizable}
                  onChange={(e) => setFormData({ ...formData, customizable: e.target.checked })}
                  className="toggle-input"
                />
                <span>Customizable (sizes, extras, etc.)</span>
              </label>
            </div>
          </div>

          {/* Note about customization */}
          {formData.customizable && (
            <div className="form-note">
              <p>
                <strong>Note:</strong> Customization options (sizes, extras, removals, spice levels)
                can be configured in the menu data. This feature will be expanded in a future update.
              </p>
            </div>
          )}

          {/* Form Actions */}
          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              {item ? 'Update Item' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
