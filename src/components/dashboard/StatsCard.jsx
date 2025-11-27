import React from 'react';

const StatsCard = ({ title, value, subtitle, icon: Icon, trend, color = 'primary' }) => {
  const colors = {
    primary: 'bg-blue-50 text-blue-600',
    success: 'bg-green-50 text-green-600',
    warning: 'bg-yellow-50 text-yellow-600',
    danger: 'bg-red-50 text-red-600',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-textSecondary mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-textPrimary mb-1">{value}</h3>
          {subtitle && (
            <p className="text-xs text-textSecondary">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg ${colors[color]}`}>
            <Icon size={24} />
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-3 flex items-center text-xs">
          <span className={trend > 0 ? 'text-green-600' : 'text-red-600'}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
          <span className="text-textSecondary ml-2">from last month</span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;
