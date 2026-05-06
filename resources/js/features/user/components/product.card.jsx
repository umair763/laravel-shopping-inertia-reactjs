import React from 'react';
import { Link } from '@inertiajs/react';

export default function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      {/* Image */}
      <div className="h-48 bg-gray-200 overflow-hidden">
        <img
          src={product.image_url || 'https://via.placeholder.com/300?text=No+Image'}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform"
        />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Category Badge */}
        <div>
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
            {product.category}
          </span>
        </div>

        {/* Product Name */}
        <h3 className="font-bold text-gray-900 line-clamp-2">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-2">
          {product.description}
        </p>

        {/* Stock Status */}
        <div className="flex items-center gap-2">
          {product.quantity > 0 ? (
            <span className="text-green-600 text-sm font-medium">✓ In Stock</span>
          ) : (
            <span className="text-red-600 text-sm font-medium">Out of Stock</span>
          )}
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between pt-3 border-t">
          <div>
            <p className="text-2xl font-bold text-blue-600">${product.price}</p>
            <p className="text-xs text-gray-500">SKU: {product.sku}</p>
          </div>
          <Link
            href={`/products/${product.id}`}
            className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
