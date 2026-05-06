import React from 'react';

export default function StatCard({ title, value, icon, color }) {
  return (
    <div className={`${color.split(' ')[0]} rounded-lg shadow p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className="text-4xl opacity-25">
          {icon}
        </div>
      </div>
    </div>
  );
}
