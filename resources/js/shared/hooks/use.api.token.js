import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';

export default function useApiToken() {
  const page = usePage();
  const user = page?.props?.auth?.user;

  useEffect(() => {
    // When user is authenticated, get the API token from the backend
    if (user && user.id) {
      const storedToken = localStorage.getItem('api_token');
      
      // If no token in localStorage, fetch it from the backend
      if (!storedToken) {
        fetch('/account/api-token', {
          method: 'GET',
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json',
          },
          credentials: 'include', // Include session cookie
        })
          .then((res) => {
            if (res.ok) {
              return res.json();
            }
            throw new Error('Failed to fetch token: ' + res.status);
          })
          .then((data) => {
            if (data.token) {
              localStorage.setItem('api_token', data.token);
              console.log('✓ API token stored in localStorage');
              // Trigger a custom event so other components know the token is set
              window.dispatchEvent(new CustomEvent('api_token_ready', { detail: { token: data.token } }));
            }
          })
          .catch((err) => {
            console.warn('Could not fetch API token:', err);
          });
      }
    } else {
      // Clear token when user logs out
      localStorage.removeItem('api_token');
    }
  }, [user?.id]);

  return localStorage.getItem('api_token') || null;
}
