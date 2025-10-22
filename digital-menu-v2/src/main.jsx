import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App.jsx'
import AdminDashboard from './AdminDashboard.jsx'
import OrderStatus from './OrderStatus.jsx'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './services/firebase'
import './index.css'

function ProtectedRoute({ children }) {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, () => {
      setChecking(false);
    });
    return () => unsub();
  }, []);

  if (checking) return null;
  // Let AdminDashboard handle its own auth/login UI
  return children;
}

function OrderStatusPage() {
  return (
    <div className="app" style={{ padding: '2rem' }}>
      <h2 style={{ color: '#6B4423', fontFamily: 'Georgia, serif' }}>Order Status</h2>
      <p style={{ color: '#8B6F47' }}>This page will show live status for a specific order.</p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/status/:id" element={<OrderStatus />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)