import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CartItem } from './CartItem';

describe('CartItem', () => {
  const mockItem = {
    id: 1,
    name: { en: 'Espresso', fi: 'Espresso' },
    price: 3.50,
    prepTime: 3,
    quantity: 2
  };

  const mockT = {
    minutes: 'min'
  };

  it('should render cart item details', () => {
    const mockOnAdd = vi.fn();
    const mockOnRemove = vi.fn();

    render(
      <CartItem
        item={mockItem}
        language="en"
        t={mockT}
        onAdd={mockOnAdd}
        onRemove={mockOnRemove}
      />
    );

    expect(screen.getByText('Espresso')).toBeInTheDocument();
    expect(screen.getByText('3 min')).toBeInTheDocument();
    expect(screen.getByText('€3.50 × 2')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should call onAdd when plus button is clicked', () => {
    const mockOnAdd = vi.fn();
    const mockOnRemove = vi.fn();

    render(
      <CartItem
        item={mockItem}
        language="en"
        t={mockT}
        onAdd={mockOnAdd}
        onRemove={mockOnRemove}
      />
    );

    const plusButton = screen.getByText('+');
    fireEvent.click(plusButton);

    expect(mockOnAdd).toHaveBeenCalledWith(mockItem);
  });

  it('should call onRemove when minus button is clicked', () => {
    const mockOnAdd = vi.fn();
    const mockOnRemove = vi.fn();

    render(
      <CartItem
        item={mockItem}
        language="en"
        t={mockT}
        onAdd={mockOnAdd}
        onRemove={mockOnRemove}
      />
    );

    const minusButton = screen.getByText('−');
    fireEvent.click(minusButton);

    expect(mockOnRemove).toHaveBeenCalledWith(1);
  });
});
