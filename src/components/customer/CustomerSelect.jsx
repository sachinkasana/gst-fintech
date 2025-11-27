import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Autocomplete from '../common/Autocomplete';
import Modal from '../common/Modal';
import CustomerForm from './CustomerForm';
import { customerAPI } from '../../api/customer.api';

const CustomerSelect = ({ value, onChange, error }) => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCustomers = async (query) => {
    try {
      const response = await customerAPI.getAll({ search: query, limit: 10 });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching customers:', error);
      return [];
    }
  };

  const handleSelect = (customer) => {
    onChange(customer);
    setSearchTerm(customer.name);
  };

  const handleNewCustomer = (newCustomer) => {
    onChange(newCustomer);
    setSearchTerm(newCustomer.name);
    setShowModal(false);
  };

  return (
    <>
      <div className="space-y-2">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Autocomplete
              label="Customer"
              value={searchTerm}
              onChange={setSearchTerm}
              onSelect={handleSelect}
              fetchSuggestions={fetchCustomers}
              placeholder="Search customer by name or phone..."
              error={error}
              required
              displayKey="name"
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

        {value && (
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
          onSuccess={handleNewCustomer}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </>
  );
};

export default CustomerSelect;
