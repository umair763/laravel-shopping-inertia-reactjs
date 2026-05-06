import React from 'react';
import AppLayout from './app.layout';

export default function UserLayout({ children }) {
  return (
    <AppLayout
      sidebarItems={[
        { label: 'Home', href: '/' },
        { label: 'Products', href: '/products' },
        { label: 'Cart', href: '/cart' },
      ]}
    >
      {children}
    </AppLayout>
  );
}