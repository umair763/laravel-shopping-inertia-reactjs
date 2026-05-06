import React from 'react';
import AppLayout from './app.layout';

export default function AdminLayout({ children }) {
  return (
    <AppLayout
      sidebarItems={[
        { label: 'Dashboard', href: '/admin/dashboard' },
        { label: 'Products', href: '/admin/products' },
        { label: 'Orders', href: '/admin/orders' },
        { label: 'Users', href: '/admin/users' },
      ]}
    >
      {children}
    </AppLayout>
  );
}