// Authmenu.js
import React from 'react';
import { useAuth } from './authprovider';
import UserMenu from './UserMenu';

function Authmenu() {
  const auth = useAuth();

  return (
    <div>
      {auth.user && (
        <ul>
          <li>
            <UserMenu username={auth.user.name} onLogout={auth.logout} />
          </li>
        </ul>
      )}
    </div>
  );
}

export default Authmenu;
