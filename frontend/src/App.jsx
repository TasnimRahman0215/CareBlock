import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from './loginButton';
import LogoutButton from './logoutButton';

function App() {
  const {
    loginWithRedirect,
    logout,
    user,
    isAuthenticated,
    isLoading,
  } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <LoginButton />
      <LogoutButton />
    </div>
  );
}

export default App;

