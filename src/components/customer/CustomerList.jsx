import React from 'react';
import { Edit2, Trash2, Phone, MapPin } from 'lucide-react';

const CustomerList = ({ customers, onEdit, onDelete }) => {
  return (
    <div className="space-y-3">
      {/* Desktop View */}
      <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-textPrimary">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-textPrimary">Contact</th>
                <th className="text-left py-3 px-4 font-semibold text-textPrimary">GSTIN</th>
                <th className="text-left py-3 px-4 font-semibold text-textPrimary">State</th>
                <th className="text-left py-3 px-4 font-semibold text-textPrimary">Type</th>
                <th className="text-right py-3 px-4 font-semibold text-textPrimary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <p className="font-medium text-textPrimary">{customer.name}</p>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm text-textSecondary">
                      {customer.phone && <p>{customer.phone}</p>}
                      {customer.email && <p>{customer.email}</p>}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-textSecondary">
                    {customer.gstin || '-'}
                  </td>
                  <td className="py-3 px-4 text-textSecondary">
                    {customer.state}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      customer.type === 'B2B' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {customer.type}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(customer)}
                        className="p-2 text-primary hover:bg-primary hover:text-white rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => onDelete(customer._id, customer.name)}
                        className="p-2 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-3">
        {customers.map((customer) => (
          <div key={customer._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-textPrimary">{customer.name}</h3>
                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${
                  customer.type === 'B2B' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  {customer.type}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(customer)}
                  className="p-2 text-primary hover:bg-gray-100 rounded-lg"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => onDelete(customer._id, customer.name)}
                  className="p-2 text-red-500 hover:bg-gray-100 rounded-lg"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              {customer.phone && (
                <div className="flex items-center gap-2 text-textSecondary">
                  <Phone size={14} />
                  <span>{customer.phone}</span>
                </div>
              )}
              {customer.state && (
                <div className="flex items-center gap-2 text-textSecondary">
                  <MapPin size={14} />
                  <span>{customer.state}</span>
                </div>
              )}
              {customer.gstin && (
                <p className="text-textSecondary">GSTIN: {customer.gstin}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerList;
