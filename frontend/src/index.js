// frontend/src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';

const root = createRoot(document.getElementById('root'));

const domain   = 'dev-04280sry4r60xnlk.us.auth0.com';
const clientId = 'oiwQdjobDw9BRLUDbmSSpQmppig2MpW6';
const audience = 'https://careblockapi/';

root.render(
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    authorizationParams={{
      redirect_uri: window.location.origin,   // ← back to “/”
      audience
    }}
    cacheLocation="localstorage"             // persist across reloads
    useRefreshTokens={true}
  >
    <App />
  </Auth0Provider>
);
