// frontend/src/App.jsx
import React, { useEffect, useState } from 'react';
import { useAuth0 }          from '@auth0/auth0-react';
import LoginButton           from './loginButton';
import LogoutButton          from './logoutButton';
import Dashboard             from './Dashboard';
import axios                 from 'axios';
import './App.css';

export default function App() {
  const {
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    getAccessTokenSilently
  } = useAuth0();

  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      (async () => {
        const token = await getAccessTokenSilently();
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setReady(true);
      })();
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  if (isLoading) {
    return <div>Loading…</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="login-container">
        {/* Moving circles in the background */}
        <div class="moving-cube">
    <div class="front"></div>
    <div class="back"></div>
    <div class="right"></div>
    <div class="left"></div>
    <div class="top"></div>
    <div class="bottom"></div>
  </div>
  <div class="moving-cube">
    <div class="front"></div>
    <div class="back"></div>
    <div class="right"></div>
    <div class="left"></div>
    <div class="top"></div>
    <div class="bottom"></div>
  </div>
  <div class="moving-cube">
    <div class="front"></div>
    <div class="back"></div>
    <div class="right"></div>
    <div class="left"></div>
    <div class="top"></div>
    <div class="bottom"></div>
  </div>
  <div class="moving-cube">
    <div class="front"></div>
    <div class="back"></div>
    <div class="right"></div>
    <div class="left"></div>
    <div class="top"></div>
    <div class="bottom"></div>
  </div>
  <div class="moving-cube">
    <div class="front"></div>
    <div class="back"></div>
    <div class="right"></div>
    <div class="left"></div>
    <div class="top"></div>
    <div class="bottom"></div>
  </div>  <div class="moving-cube">
    <div class="front"></div>
    <div class="back"></div>
    <div class="right"></div>
    <div class="left"></div>
    <div class="top"></div>
    <div class="bottom"></div>
  </div>
      <div className="login-box">
      <img src="./CareBlock_logo.png" alt="Logo" className="logo" />
        <h1>Welcome to CareBlock</h1>
        <p style={{ marginBottom: '1.5rem', color: '#555' }}>
          Revolutionizing healthcare with blockchain technology.
        </p>
        <button className="login-button" onClick={() => loginWithRedirect()}>
          Login/Register
        </button>
        <LogoutButton />
      </div>
    </div>
    );
  }

  if (!ready) {
    return <div>Preparing your dashboard…</div>;
  }

  // <-- THIS RETURN WAS MISSING
  return (
    <div>
      <div style={{ textAlign: 'right', padding: '1rem' }}>
        <LogoutButton />
      </div>
      <Dashboard />
    </div>
  );
}
