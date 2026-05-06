import React from 'react';

export default function AppLayout({ children, sidebarItems = [] }) {
  return (
    <div className="min-h-screen flex flex-col">

      {/* NAVBAR */}
      <nav className="h-14 bg-gray-900 text-white flex items-center px-4">
        My Shop
      </nav>

      <div className="flex flex-1">

        {/* SIDEBAR */}
        <aside className="w-64 bg-gray-100 p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="text-sm hover:underline">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        {/* CONTENT GRID */}
        <main className="flex-1 p-6">
          {children}
        </main>

      </div>

      {/* FOOTER */}
      <footer className="h-12 bg-gray-900 text-white text-center flex items-center justify-center">
        © 2026 Shop
      </footer>

    </div>
  );
}