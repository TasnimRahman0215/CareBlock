// frontend/src/App.jsx
import React, { useEffect, useState } from 'react';
import { useAuth0 }          from '@auth0/auth0-react';
import LoginButton           from './loginButton';
import LogoutButton          from './logoutButton';
import Dashboard             from './Dashboard';
import axios                 from 'axios';

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
      <div style={{ textAlign: 'center', marginTop: 50 }}>
        <LoginButton onClick={() => loginWithRedirect()} />
        <div style={{ marginTop: '1rem' }}>
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
