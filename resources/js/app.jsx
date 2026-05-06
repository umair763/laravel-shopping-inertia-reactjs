import React from 'react'
import { createRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react'
import '../css/app.css'


createInertiaApp({
  resolve: name => {
    const pages = import.meta.glob('./features/**/*.jsx', { eager: true })
    
    // Convert "User/Products" to "./features/user/pages/products.jsx"
    const parts = name.split('/')
    const pageName = parts[parts.length - 1].toLowerCase()
    const namespace = parts.slice(0, -1).map(p => p.toLowerCase()).join('/')
    const pagePath = `./features/${namespace}/pages/${pageName}.jsx`
    
    if (pages[pagePath]) {
      return pages[pagePath]
    }

    throw new Error(`Page not found: ${name} (${pagePath})`)
  },
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />)
  },
})
