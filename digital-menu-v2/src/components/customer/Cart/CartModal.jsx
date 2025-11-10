import React from 'react';
import { X } from 'lucide-react';
import { CartItem } from './CartItem';
import { CartSummary } from './CartSummary';

/**
 * Shopping cart modal component
 */
export function CartModal({
  cart,
  language,
  t,
  totalPrice,
  totalPrepTime,
  onClose,
  onAddToCart,
  onRemoveFromCart,
  onPlaceOrder,
  formatCustomizations,
  menuData
}) {
  return (
    <div className="modal-overlay bottom">
      <div className="cart-modal">
        <div className="cart-header">
          <h2 className="cart-title">{t.cart}</h2>
          <button onClick={onClose} className="btn-close">
            <X size={24} />
          </button>
        </div>

        <div className="cart-content">
          {cart.length === 0 ? (
            <p className="empty-cart">{t.emptyCart}</p>
          ) : (
            <>
              <div className="cart-items">
                {cart.map((item, index) => (
                  <CartItem
                    key={`${item.id}-${index}`}
                    item={item}
                    language={language}
                    t={t}
                    onAdd={onAddToCart}
                    onRemove={onRemoveFromCart}
                    customizationText={formatCustomizations ? formatCustomizations(item, menuData, language) : []}
                  />
                ))}
              </div>

              <CartSummary
                totalPrice={totalPrice}
                totalPrepTime={totalPrepTime}
                t={t}
              />

              <button onClick={onPlaceOrder} className="btn-order">
                {t.orderButton}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
