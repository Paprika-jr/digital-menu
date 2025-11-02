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
    <div className="order-filters">
      {filters.map(filter => (
        <button
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
          className={`filter-btn ${currentFilter === filter.key ? 'active' : ''}`}
        >
          <div className="filter-label">{filter.label}</div>
          <div className="filter-count">{orderCounts[filter.key]}</div>
        </button>
      ))}
    </div>
  );
}
