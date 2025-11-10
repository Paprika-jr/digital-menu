import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, QrCode, Printer } from 'lucide-react';
import { TableQRCode } from '../components/admin/QRCode/TableQRCode';

/**
 * QR Code management page for generating table-specific QR codes
 */
function QRCodeManager() {
  const navigate = useNavigate();
  const [numberOfTables, setNumberOfTables] = useState(10);
  const [baseUrl, setBaseUrl] = useState(() => {
    // Use current origin for QR codes
    return window.location.origin;
  });

  // Generate array of table numbers
  const tables = Array.from({ length: numberOfTables }, (_, i) => i + 1);

  /**
   * Handle printing all QR codes
   */
  const handlePrintAll = () => {
    const printWindow = window.open('', '_blank');

    const qrCodesHTML = tables.map(tableNumber => {
      const qrUrl = `${baseUrl}?table=${tableNumber}`;
      return `
        <div class="print-page">
          <h1>Table ${tableNumber}</h1>
          <div class="qr-container">
            <div id="qr-placeholder-${tableNumber}">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="400" height="400">
                <!-- QR code will be rendered here -->
              </svg>
            </div>
          </div>
          <p class="instructions">Scan to view menu and place your order</p>
          <p class="url">${qrUrl}</p>
        </div>
      `;
    }).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>All Table QR Codes</title>
          <style>
            @page {
              size: A4;
              margin: 20mm;
            }
            body {
              margin: 0;
              padding: 0;
              font-family: Arial, sans-serif;
            }
            .print-page {
              page-break-after: always;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              padding: 40px;
            }
            .print-page:last-child {
              page-break-after: auto;
            }
            h1 {
              margin: 0 0 30px 0;
              font-size: 72px;
              color: #333;
              font-weight: bold;
            }
            .qr-container {
              border: 3px solid #333;
              padding: 30px;
              background: white;
              margin-bottom: 30px;
            }
            .instructions {
              margin: 20px 0 10px 0;
              text-align: center;
              font-size: 24px;
              color: #666;
            }
            .url {
              text-align: center;
              font-size: 14px;
              color: #999;
              font-family: monospace;
            }
            @media print {
              body {
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          ${qrCodesHTML}
          <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js"></script>
          <script>
            // Generate QR codes after page loads
            window.onload = function() {
              ${tables.map(tableNumber => `
                QRCode.toCanvas(document.createElement('canvas'), '${baseUrl}?table=${tableNumber}', {
                  width: 400,
                  margin: 2,
                  errorCorrectionLevel: 'H'
                }, function(error, canvas) {
                  if (!error) {
                    const container = document.getElementById('qr-placeholder-${tableNumber}');
                    container.innerHTML = '';
                    container.appendChild(canvas);
                  }
                });
              `).join('\n')}

              // Trigger print after a short delay to ensure QR codes are rendered
              setTimeout(function() {
                window.print();
              }, 1000);
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

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
              <QrCode size={32} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
              QR Code Manager
            </h1>
            <p>Generate QR codes for table-specific menu access</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="qr-manager-controls">
        <div className="qr-control-group">
          <label htmlFor="numberOfTables">Number of Tables:</label>
          <input
            id="numberOfTables"
            type="number"
            min="1"
            max="100"
            value={numberOfTables}
            onChange={(e) => setNumberOfTables(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
            className="qr-input"
          />
        </div>

        <div className="qr-control-group">
          <label htmlFor="baseUrl">Base URL:</label>
          <input
            id="baseUrl"
            type="text"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            className="qr-input"
            placeholder="https://yourdomain.com"
          />
        </div>

        <button onClick={handlePrintAll} className="btn-print-all">
          <Printer size={18} />
          Print All QR Codes
        </button>
      </div>

      {/* QR Codes Grid */}
      <div className="qr-codes-grid">
        {tables.map(tableNumber => (
          <TableQRCode
            key={tableNumber}
            tableNumber={tableNumber}
            baseUrl={baseUrl}
            showControls={true}
          />
        ))}
      </div>
    </div>
  );
}

export default QRCodeManager;
