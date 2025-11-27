import React, { useState } from 'react';
import Autocomplete from '../common/Autocomplete';
import { customerAPI } from '../../api/customer.api';

const CustomerSelectB2B = ({ value, onChange, error }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCustomers = async (query) => {
    try {
      const response = await customerAPI.getAll({ 
        search: query, 
        type: 'B2B',
        limit: 10 
      });
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

  return (
    <Autocomplete
      label="Select B2B Customer"
      value={searchTerm}
      onChange={setSearchTerm}
      onSelect={handleSelect}
      fetchSuggestions={fetchCustomers}
      placeholder="Search customer by name or GSTIN..."
      error={error}
      required
      displayKey="name"
      minChars={1}
    />
  );
};

export default CustomerSelectB2B;
