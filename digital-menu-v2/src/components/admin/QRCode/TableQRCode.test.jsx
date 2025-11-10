import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TableQRCode } from './TableQRCode';

describe('TableQRCode', () => {
  const mockBaseUrl = 'https://example.com';
  const mockTableNumber = 5;

  it('should render table number correctly', () => {
    render(
      <TableQRCode
        tableNumber={mockTableNumber}
        baseUrl={mockBaseUrl}
        showControls={true}
      />
    );

    expect(screen.getByText('Table 5')).toBeInTheDocument();
  });

  it('should display correct QR code URL', () => {
    render(
      <TableQRCode
        tableNumber={mockTableNumber}
        baseUrl={mockBaseUrl}
        showControls={true}
      />
    );

    const urlElement = screen.getByText(`${mockBaseUrl}?table=${mockTableNumber}`);
    expect(urlElement).toBeInTheDocument();
  });

  it('should render QR code SVG', () => {
    const { container } = render(
      <TableQRCode
        tableNumber={mockTableNumber}
        baseUrl={mockBaseUrl}
        showControls={true}
      />
    );

    const qrCodeSvg = container.querySelector(`#qr-code-${mockTableNumber}`);
    expect(qrCodeSvg).toBeInTheDocument();
  });

  it('should show download and print buttons when showControls is true', () => {
    render(
      <TableQRCode
        tableNumber={mockTableNumber}
        baseUrl={mockBaseUrl}
        showControls={true}
      />
    );

    expect(screen.getByText('Download')).toBeInTheDocument();
    expect(screen.getByText('Print')).toBeInTheDocument();
  });

  it('should hide controls when showControls is false', () => {
    render(
      <TableQRCode
        tableNumber={mockTableNumber}
        baseUrl={mockBaseUrl}
        showControls={false}
      />
    );

    expect(screen.queryByText('Download')).not.toBeInTheDocument();
    expect(screen.queryByText('Print')).not.toBeInTheDocument();
  });

  it('should have download button that can be clicked', () => {
    render(
      <TableQRCode
        tableNumber={mockTableNumber}
        baseUrl={mockBaseUrl}
        showControls={true}
      />
    );

    const downloadButton = screen.getByText('Download').closest('button');
    expect(downloadButton).toBeInTheDocument();

    // Verify button is clickable (not disabled)
    expect(downloadButton).not.toBeDisabled();
  });

  it('should have print button that can be clicked', () => {
    render(
      <TableQRCode
        tableNumber={mockTableNumber}
        baseUrl={mockBaseUrl}
        showControls={true}
      />
    );

    const printButton = screen.getByText('Print').closest('button');
    expect(printButton).toBeInTheDocument();

    // Verify button is clickable (not disabled)
    expect(printButton).not.toBeDisabled();
  });
});
