import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Printer } from 'lucide-react';

/**
 * QR Code display component for a specific table
 */
export function TableQRCode({ tableNumber, baseUrl, showControls = true }) {
  const qrUrl = `${baseUrl}?table=${tableNumber}`;

  /**
   * Download QR code as PNG
   */
  const handleDownload = () => {
    const svg = document.getElementById(`qr-code-${tableNumber}`);
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = 512;
    canvas.height = 512;

    img.onload = () => {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, 512, 512);

      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `table-${tableNumber}-qr-code.png`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      });
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  /**
   * Print QR code
   */
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const svg = document.getElementById(`qr-code-${tableNumber}`);
    const svgData = new XMLSerializer().serializeToString(svg);

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Table ${tableNumber} QR Code</title>
          <style>
            body {
              margin: 0;
              padding: 20px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              font-family: Arial, sans-serif;
            }
            h1 {
              margin: 0 0 20px 0;
              font-size: 48px;
              color: #333;
            }
            .qr-container {
              border: 2px solid #333;
              padding: 20px;
              background: white;
            }
            .instructions {
              margin-top: 20px;
              text-align: center;
              font-size: 18px;
              color: #666;
            }
            @media print {
              body {
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          <h1>Table ${tableNumber}</h1>
          <div class="qr-container">
            ${svgData}
          </div>
          <p class="instructions">Scan to view menu and place your order</p>
        </body>
      </html>
    `);

    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <div className="table-qr-card">
      <div className="table-qr-header">
        <h3 className="table-qr-number">Table {tableNumber}</h3>
      </div>

      <div className="table-qr-code">
        <QRCodeSVG
          id={`qr-code-${tableNumber}`}
          value={qrUrl}
          size={200}
          level="H"
          includeMargin={true}
        />
      </div>

      <div className="table-qr-url">
        <code>{qrUrl}</code>
      </div>

      {showControls && (
        <div className="table-qr-actions">
          <button onClick={handleDownload} className="btn-qr-action">
            <Download size={18} />
            Download
          </button>
          <button onClick={handlePrint} className="btn-qr-action">
            <Printer size={18} />
            Print
          </button>
        </div>
      )}
    </div>
  );
}
