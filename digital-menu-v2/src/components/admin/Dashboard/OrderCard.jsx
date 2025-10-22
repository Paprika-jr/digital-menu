import React from 'react';

/**
 * Individual order card component for admin dashboard
 */
export function OrderCard({ order, onStatusUpdate }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'received': return '#3b82f6';
      case 'preparing': return '#f59e0b';
      case 'ready': return '#10b981';
      default: return '#gray';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'received': return 'New Order';
      case 'preparing': return 'Cooking';
      case 'ready': return 'Ready';
      default: return status;
    }
  };

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'received': return 'preparing';
      case 'preparing': return 'ready';
      default: return null;
    }
  };

  const nextStatus = getNextStatus(order.status);

  return (
    <div style={{
      background: 'white',
      padding: '1.5rem',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      borderLeft: `4px solid ${getStatusColor(order.status)}`
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#1f2937' }}>
            {order.customerName}
          </h3>
          <p style={{ margin: '0.25rem 0', color: '#6b7280', fontSize: '0.875rem' }}>
            Table {order.tableNumber}
          </p>
        </div>
        <div style={{
          padding: '0.5rem 1rem',
          borderRadius: '20px',
          background: getStatusColor(order.status),
          color: 'white',
          fontSize: '0.875rem',
          fontWeight: 'bold'
        }}>
          {getStatusLabel(order.status)}
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <h4 style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Items:</h4>
        {order.items.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <span>{item.quantity}x {item.name}</span>
            <span style={{ fontWeight: 'bold' }}>€{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      {order.notes && (
        <div style={{
          background: '#fef3c7',
          padding: '0.75rem',
          borderRadius: '6px',
          marginBottom: '1rem',
          fontSize: '0.875rem'
        }}>
          <strong>Notes:</strong> {order.notes}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
        <div>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>
            Total: €{order.totalPrice}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Est. time: {order.estimatedPrepTime} min
          </div>
        </div>

        {nextStatus && (
          <button
            onClick={() => onStatusUpdate(order.id, nextStatus)}
            style={{
              padding: '0.5rem 1.5rem',
              background: '#6B4423',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 'bold'
            }}
          >
            {nextStatus === 'preparing' ? 'Start Cooking' : 'Mark Ready'}
          </button>
        )}
      </div>
    </div>
  );
}
