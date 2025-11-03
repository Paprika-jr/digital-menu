import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './pages/App.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import OrderStatus from './pages/OrderStatus.jsx'
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