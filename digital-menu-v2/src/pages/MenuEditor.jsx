import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Search, Edit2, Trash2, Eye, EyeOff, UtensilsCrossed } from 'lucide-react';
import { useMenuEditor } from '../hooks';
import { MenuItemForm } from '../components/admin/Menu/MenuItemForm';

/**
 * Menu Editor page for managing menu items
 */
function MenuEditor() {
  const navigate = useNavigate();
  const { items, categories, loading, deleteItem, toggleAvailability, addItem, updateItem } = useMenuEditor();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  /**
   * Filter items based on search and category
   */
  const filteredItems = items.filter(item => {
    const matchesSearch =
      item.name?.en?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name?.fi?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  /**
   * Handle delete item
   */
  const handleDelete = async (itemId, itemName) => {
    if (window.confirm(`Are you sure you want to delete "${itemName}"?`)) {
      try {
        await deleteItem(itemId);
      } catch (error) {
        alert('Failed to delete item. Please try again.');
      }
    }
  };

  /**
   * Handle toggle availability
   */
  const handleToggleAvailability = async (itemId, currentStatus) => {
    try {
      await toggleAvailability(itemId, !currentStatus);
    } catch (error) {
      alert('Failed to update availability. Please try again.');
    }
  };

  /**
   * Handle edit item
   */
  const handleEdit = (item) => {
    setEditingItem(item);
    setShowItemForm(true);
  };

  /**
   * Handle add new item
   */
  const handleAddNew = () => {
    setEditingItem(null);
    setShowItemForm(true);
  };

  /**
   * Handle form submission (add or update)
   */
  const handleFormSubmit = async (formData) => {
    try {
      if (editingItem) {
        await updateItem(editingItem.id, formData);
      } else {
        await addItem(formData);
      }
      setShowItemForm(false);
      setEditingItem(null);
    } catch (error) {
      alert('Failed to save item. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="admin-loading">Loading menu...</div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-content">
          <button onClick={() => navigate('/admin')} className="btn-back">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1>
              <UtensilsCrossed size={32} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
              Menu Editor
            </h1>
            <p>Manage your menu items and categories</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="menu-editor-controls">
        <div className="menu-editor-search">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="menu-search-input"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="menu-category-filter"
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name?.en || cat.id}
            </option>
          ))}
        </select>

        <button onClick={handleAddNew} className="btn-add-item">
          <Plus size={20} />
          Add Item
        </button>
      </div>

      {/* Stats */}
      <div className="menu-stats">
        <div className="menu-stat-card">
          <div className="menu-stat-value">{items.length}</div>
          <div className="menu-stat-label">Total Items</div>
        </div>
        <div className="menu-stat-card">
          <div className="menu-stat-value">
            {items.filter(i => i.available).length}
          </div>
          <div className="menu-stat-label">Available</div>
        </div>
        <div className="menu-stat-card">
          <div className="menu-stat-value">
            {items.filter(i => !i.available).length}
          </div>
          <div className="menu-stat-label">Unavailable</div>
        </div>
        <div className="menu-stat-card">
          <div className="menu-stat-value">{categories.length}</div>
          <div className="menu-stat-label">Categories</div>
        </div>
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="menu-empty-state">
          <UtensilsCrossed size={48} />
          <h3>No items found</h3>
          <p>
            {searchQuery || categoryFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Add your first menu item to get started'}
          </p>
          {!searchQuery && categoryFilter === 'all' && (
            <button onClick={handleAddNew} className="btn-add-item">
              <Plus size={20} />
              Add First Item
            </button>
          )}
        </div>
      ) : (
        <div className="menu-items-grid">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className={`menu-item-card ${!item.available ? 'unavailable' : ''}`}
            >
              <div className="menu-item-header">
                <div className="menu-item-badge">
                  {item.category}
                </div>
                <button
                  onClick={() => handleToggleAvailability(item.id, item.available)}
                  className="btn-icon"
                  title={item.available ? 'Mark unavailable' : 'Mark available'}
                >
                  {item.available ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>

              <div className="menu-item-content">
                <h3 className="menu-item-name">
                  {item.name?.en || item.name}
                </h3>
                {item.name?.fi && (
                  <p className="menu-item-name-alt">{item.name.fi}</p>
                )}
                {item.description?.en && (
                  <p className="menu-item-description">
                    {item.description.en}
                  </p>
                )}
                <div className="menu-item-meta">
                  <span className="menu-item-price">€{item.price?.toFixed(2)}</span>
                  {item.prepTime && (
                    <span className="menu-item-time">{item.prepTime} min</span>
                  )}
                  {item.badge && (
                    <span className="menu-item-tag">{item.badge}</span>
                  )}
                </div>
              </div>

              <div className="menu-item-actions">
                <button
                  onClick={() => handleEdit(item)}
                  className="btn-edit"
                >
                  <Edit2 size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id, item.name?.en || item.name)}
                  className="btn-delete"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Item Form Modal */}
      {showItemForm && (
        <MenuItemForm
          item={editingItem}
          categories={categories}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowItemForm(false);
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
}

export default MenuEditor;
