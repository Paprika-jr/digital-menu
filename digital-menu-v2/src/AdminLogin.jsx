import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';

const AdminLogin = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Admin logged in');
      onLoginSuccess();
    } catch (error) {
      console.error('❌ Login failed:', error);
      setError('Invalid email or password');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #6B4423 0%, #8B6F47 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '2rem',
        maxWidth: '400px',
        width: '100%',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
      }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#6B4423',
          marginBottom: '0.5rem',
          fontFamily: 'Georgia, serif',
          textAlign: 'center'
        }}>
          🔐 Admin Login
        </h1>
        <p style={{
          color: '#8B6F47',
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          Kitchen Dashboard Access
        </p>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#6B4423',
              fontWeight: '600'
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #f0e8dc',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#6B4423',
              fontWeight: '600'
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #f0e8dc',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            />
          </div>

          {error && (
            <div style={{
              background: '#fee2e2',
              color: '#dc2626',
              padding: '0.75rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              fontSize: '0.9rem'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '1rem',
              background: '#D2691E',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            Login to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;