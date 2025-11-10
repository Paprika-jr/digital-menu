/**
 * Individual order card component for admin dashboard
 */
export function OrderCard({ order, onStatusUpdate }) {
  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'received': return 'preparing';
      case 'preparing': return 'ready';
      default: return null;
    }
  };

  const nextStatus = getNextStatus(order.status);

  return (
    <div className="order-card">
      <div className="order-card-header">
        <div className="order-number">
          Order #{order.id.slice(-4).toUpperCase()}
        </div>
        <span className={`order-status-badge ${order.status}`}>
          {order.status}
        </span>
      </div>

      <div className="order-details">
        <div className="order-info-row">
          <span className="order-info-label">Customer:</span>
          <span>{order.customerName}</span>
        </div>
        <div className="order-info-row">
          <span className="order-info-label">Table:</span>
          <span>{order.tableNumber}</span>
        </div>
        <div className="order-info-row">
          <span className="order-info-label">Total:</span>
          <span>€{order.totalPrice}</span>
        </div>
        <div className="order-info-row">
          <span className="order-info-label">Prep Time:</span>
          <span>{order.estimatedPrepTime} min</span>
        </div>
      </div>

      <div className="order-items">
        <div className="order-items-title">Items:</div>
        {order.items.map((item, idx) => (
          <div key={idx} className="order-item">
            <div className="order-item-main">
              <span>{item.quantity}x {item.name}</span>
              <span>€{(item.price * item.quantity).toFixed(2)}</span>
            </div>
            {item.customizationsText && item.customizationsText.length > 0 && (
              <div className="order-item-customizations">
                {item.customizationsText.join(', ')}
              </div>
            )}
          </div>
        ))}
      </div>

      {order.notes && (
        <div className="order-notes">
          <strong>Notes:</strong> {order.notes}
        </div>
      )}

      <div className="order-actions">
        {nextStatus ? (
          <button
            onClick={() => onStatusUpdate(order.id, nextStatus)}
            className={`btn-action ${nextStatus === 'preparing' ? 'btn-start-cooking' : 'btn-mark-ready'}`}
          >
            {nextStatus === 'preparing' ? 'Start Cooking' : 'Mark Ready'}
          </button>
        ) : (
          <button className="btn-action btn-complete" disabled>
            Completed
          </button>
        )}
      </div>
    </div>
  );
}
