import React from 'react';

/**
 * Order status filter buttons component
 */
export function OrderFilters({ currentFilter, onFilterChange, orderCounts }) {
  const filters = [
    { key: 'all', label: 'All Orders' },
    { key: 'received', label: 'New' },
    { key: 'preparing', label: 'Cooking' },
    { key: 'ready', label: 'Ready' }
  ];

  return (
    <div style={{
      display: 'flex',
      gap: '1rem',
      marginBottom: '2rem',
      flexWrap: 'wrap'
    }}>
      {filters.map(filter => (
        <button
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            border: 'none',
            background: currentFilter === filter.key ? '#6B4423' : 'white',
            color: currentFilter === filter.key ? 'white' : '#1f2937',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            transition: 'all 0.2s'
          }}
        >
          {filter.label}
          {orderCounts[filter.key] > 0 && (
            <span style={{
              marginLeft: '0.5rem',
              padding: '0.25rem 0.5rem',
              borderRadius: '12px',
              background: currentFilter === filter.key ? 'rgba(255,255,255,0.3)' : '#6B4423',
              color: currentFilter === filter.key ? 'white' : 'white',
              fontSize: '0.75rem'
            }}>
              {orderCounts[filter.key]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
