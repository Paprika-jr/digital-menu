import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MenuItem } from './MenuItem';

describe('MenuItem', () => {
  const mockItem = {
    id: 1,
    name: { en: 'Espresso', fi: 'Espresso' },
    description: { en: 'Strong and bold', fi: 'Vahva ja rohkea' },
    price: 3.50,
    prepTime: 3,
    image: '☕',
    badge: 'popular'
  };

  const mockGetBadgeText = (badge) => {
    return badge === 'popular' ? 'Popular' : null;
  };

  it('should render item details correctly', () => {
    const mockOnAddToCart = vi.fn();

    render(
      <MenuItem
        item={mockItem}
        language="en"
        onAddToCart={mockOnAddToCart}
        getBadgeText={mockGetBadgeText}
      />
    );

    expect(screen.getByText('Espresso')).toBeInTheDocument();
    expect(screen.getByText('Strong and bold')).toBeInTheDocument();
    expect(screen.getByText('€3.50')).toBeInTheDocument();
    expect(screen.getByText('3 min')).toBeInTheDocument();
    expect(screen.getByText('☕')).toBeInTheDocument();
  });

  it('should display badge when present', () => {
    const mockOnAddToCart = vi.fn();

    render(
      <MenuItem
        item={mockItem}
        language="en"
        onAddToCart={mockOnAddToCart}
        getBadgeText={mockGetBadgeText}
      />
    );

    expect(screen.getByText('Popular')).toBeInTheDocument();
  });

  it('should render in Finnish when language is fi', () => {
    const mockOnAddToCart = vi.fn();

    render(
      <MenuItem
        item={mockItem}
        language="fi"
        onAddToCart={mockOnAddToCart}
        getBadgeText={mockGetBadgeText}
      />
    );

    expect(screen.getByText('Espresso')).toBeInTheDocument();
    expect(screen.getByText('Vahva ja rohkea')).toBeInTheDocument();
  });

  it('should call onAddToCart when button is clicked', () => {
    const mockOnAddToCart = vi.fn();

    render(
      <MenuItem
        item={mockItem}
        language="en"
        onAddToCart={mockOnAddToCart}
        getBadgeText={mockGetBadgeText}
      />
    );

    const addButton = screen.getByRole('button');
    fireEvent.click(addButton);

    expect(mockOnAddToCart).toHaveBeenCalledWith(mockItem);
    expect(mockOnAddToCart).toHaveBeenCalledTimes(1);
  });

  it('should render without description if not provided', () => {
    const itemWithoutDesc = { ...mockItem, description: null };
    const mockOnAddToCart = vi.fn();

    render(
      <MenuItem
        item={itemWithoutDesc}
        language="en"
        onAddToCart={mockOnAddToCart}
        getBadgeText={mockGetBadgeText}
      />
    );

    expect(screen.queryByText('Strong and bold')).not.toBeInTheDocument();
  });
});
