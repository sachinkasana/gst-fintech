import React, { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import { customerAPI } from '../../api/customer.api';
import { INDIAN_STATES } from '../../utils/constants';
import { validateGSTIN } from '../../utils/validators';
import toast from 'react-hot-toast';

const CustomerForm = ({ customer = null, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: customer?.name || '',
    phone: customer?.phone || '',
    gstin: customer?.gstin || '',
    address: customer?.address || '',
    city: customer?.city || '',
    state: customer?.state || '',
    pincode: customer?.pincode || '',
    type: customer?.type || 'B2C'
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }

    // Auto-set type based on GSTIN
    if (name === 'gstin' && value.trim()) {
      setFormData(prev => ({ ...prev, type: 'B2B' }));
    } else if (name === 'gstin' && !value.trim()) {
      setFormData(prev => ({ ...prev, type: 'B2C' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Customer name is required';
    }

    if (!formData.state) {
      newErrors.state = 'State is required';
    }

    if (formData.gstin && !validateGSTIN(formData.gstin)) {
      newErrors.gstin = 'Invalid GSTIN format';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      let response;
      if (customer) {
        response = await customerAPI.update(customer._id, formData);
        toast.success('Customer updated successfully');
      } else {
        response = await customerAPI.create(formData);
        toast.success('Customer added successfully');
      }
      onSuccess(response.data);
    } catch (error) {
      console.error('Error saving customer:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Customer Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Enter customer name"
        error={errors.name}
        required
      />

      <Input
        label="Phone Number"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Enter phone number"
      />

      <Input
        label="GSTIN (Optional)"
        name="gstin"
        value={formData.gstin}
        onChange={handleChange}
        placeholder="27AABCU1234C1ZX"
        error={errors.gstin}
      />

      <Input
        label="Address"
        name="address"
        value={formData.address}
        onChange={handleChange}
        placeholder="Enter address"
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="City"
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="Enter city"
        />
        <Input
          label="Pincode"
          name="pincode"
          value={formData.pincode}
          onChange={handleChange}
          placeholder="Enter pincode"
        />
      </div>

      <Select
        label="State"
        name="state"
        value={formData.state}
        onChange={handleChange}
        options={INDIAN_STATES}
        placeholder="Select state"
        error={errors.state}
        required
      />

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          fullWidth
          loading={loading}
          disabled={loading}
        >
          {customer ? 'Update Customer' : 'Add Customer'}
        </Button>
        <Button
          type="button"
          variant="outline"
          fullWidth
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default CustomerForm;
