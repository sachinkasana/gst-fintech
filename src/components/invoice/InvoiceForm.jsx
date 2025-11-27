import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Select from '../common/Select';
import Modal from '../common/Modal';
import CustomerForm from '../customer/CustomerForm';
import CustomerSelect from './CustomerSelectB2B';

const InvoiceCustomerSelector = ({ invoiceType, value, onChange, error }) => {
  const [showModal, setShowModal] = useState(false);

  // For B2C - simple form without customer save
  if (invoiceType === 'B2C') {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-textPrimary mb-1">
              Customer Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={value?.name || ''}
              onChange={(e) =>
                onChange({
                  ...value,
                  name: e.target.value,
                  _id: null // Not from DB
                })
              }
              placeholder="Enter customer name"
              className={`
                w-full px-3 py-2 border rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                ${error ? 'border-red-500' : 'border-gray-300'}
              `}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-textPrimary mb-1">
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              value={value?.phone || ''}
              onChange={(e) =>
                onChange({ ...value, phone: e.target.value })
              }
              placeholder="Enter phone number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-textPrimary mb-1">
            Address (Optional)
          </label>
          <input
            type="text"
            value={value?.address || ''}
            onChange={(e) =>
              onChange({ ...value, address: e.target.value })
            }
            placeholder="Enter address"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-textPrimary mb-1">
              City (Optional)
            </label>
            <input
              type="text"
              value={value?.city || ''}
              onChange={(e) =>
                onChange({ ...value, city: e.target.value })
              }
              placeholder="Enter city"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-textPrimary mb-1">
              Pincode (Optional)
            </label>
            <input
              type="text"
              value={value?.pincode || ''}
              onChange={(e) =>
                onChange({ ...value, pincode: e.target.value })
              }
              placeholder="Enter pincode"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }

  // For B2B - customer selection from database
  return (
    <>
      <div className="space-y-2">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <CustomerSelect
              value={value}
              onChange={onChange}
              error={error}
            />
          </div>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2"
            title="Add New Customer"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">New</span>
          </button>
        </div>

        {value && value._id && (
          <div className="p-3 bg-gray-50 rounded-lg text-sm">
            <p className="font-medium text-textPrimary">{value.name}</p>
            {value.phone && <p className="text-textSecondary">Phone: {value.phone}</p>}
            {value.gstin && <p className="text-textSecondary">GSTIN: {value.gstin}</p>}
            <p className="text-textSecondary">State: {value.state}</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add New Customer"
        size="md"
      >
        <CustomerForm
          onSuccess={(newCustomer) => {
            onChange(newCustomer);
            setShowModal(false);
          }}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </>
  );
};

export default InvoiceCustomerSelector;
