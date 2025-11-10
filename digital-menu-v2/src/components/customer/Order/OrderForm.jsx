import React, { useState } from 'react';

/**
 * Order form modal for customer information
 */
export function OrderForm({ t, onSubmit, onCancel, initialTableNumber = '' }) {
  const [formData, setFormData] = useState({
    name: '',
    tableNumber: initialTableNumber,
    notes: ''
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.tableNumber) {
      newErrors.tableNumber = 'Table number is required';
    } else if (isNaN(formData.tableNumber) || formData.tableNumber < 1) {
      newErrors.tableNumber = 'Please enter a valid table number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="form-modal">
        <h2 className="form-title">{t.contactInfo}</h2>
        <div className="form-fields">
          <div>
            <input
              type="text"
              placeholder={t.name}
              className={`form-input ${errors.name ? 'error' : ''}`}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>

          <div>
            {initialTableNumber ? (
              <div className="form-input-with-label">
                <label className="form-label">{t.tableNumber}</label>
                <input
                  type="number"
                  className={`form-input ${errors.tableNumber ? 'error' : ''}`}
                  value={formData.tableNumber}
                  onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })}
                />
              </div>
            ) : (
              <input
                type="number"
                placeholder={t.tableNumber}
                className={`form-input ${errors.tableNumber ? 'error' : ''}`}
                value={formData.tableNumber}
                onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })}
              />
            )}
            {errors.tableNumber && <p className="error-text">{errors.tableNumber}</p>}
          </div>

          <textarea
            placeholder={t.notes}
            className="form-input"
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />

          <div className="form-buttons">
            <button onClick={onCancel} className="btn-cancel">
              {t.cancel}
            </button>
            <button onClick={handleSubmit} className="btn-submit">
              {t.submitOrder}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
