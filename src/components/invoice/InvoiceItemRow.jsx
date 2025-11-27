import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import Input from '../common/Input';
import Select from '../common/Select';
import Autocomplete from '../common/Autocomplete';
import { productAPI } from '../../api/product.api';
import { GST_RATES, UNITS } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';

const InvoiceItemRow = ({ item, index, onChange, onRemove }) => {
  const [productSearch, setProductSearch] = useState(item.productName || '');

  const fetchProducts = async (query) => {
    try {
      const response = await productAPI.search(query);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  };

  const handleProductSelect = (product) => {
    setProductSearch(product.name);
    onChange(index, {
      ...item,
      productName: product.name,
      hsnCode: product.hsnCode
    });
  };

  const handleChange = (field, value) => {
    onChange(index, { ...item, [field]: value });
  };

  const calculateLineTotal = () => {
    const subtotal = (item.quantity || 0) * (item.rate || 0);
    const discount = item.discount || 0;
    const taxableAmount = subtotal - discount;
    const gstAmount = (taxableAmount * (item.gstRate || 0)) / 100;
    return taxableAmount + gstAmount;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between">
        <h4 className="font-medium text-textPrimary">Item #{index + 1}</h4>
        {index > 0 && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="text-red-500 hover:text-red-700 p-1"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      {/* Product Name with Autocomplete */}
      <Autocomplete
        label="Product Name"
        value={productSearch}
        onChange={(val) => {
          setProductSearch(val);
          handleChange('productName', val);
        }}
        onSelect={handleProductSelect}
        fetchSuggestions={fetchProducts}
        placeholder="Type product name..."
        required
      />

      {/* HSN Code */}
      <Input
        label="HSN/SAC Code"
        value={item.hsnCode || ''}
        onChange={(e) => handleChange('hsnCode', e.target.value)}
        placeholder="Enter HSN/SAC code"
        required
      />

      {/* Description (Optional) */}
      <Input
        label="Description (Optional)"
        value={item.description || ''}
        onChange={(e) => handleChange('description', e.target.value)}
        placeholder="Item description"
      />

      {/* Quantity and Unit */}
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Quantity"
          type="number"
          value={item.quantity || ''}
          onChange={(e) => handleChange('quantity', parseFloat(e.target.value) || 0)}
          placeholder="0"
          required
          min="0"
          step="0.01"
        />
        <Select
          label="Unit"
          value={item.unit || ''}
          onChange={(e) => handleChange('unit', e.target.value)}
          options={UNITS}
          placeholder="Select unit"
          required
        />
      </div>

      {/* Rate and GST Rate */}
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Rate (₹)"
          type="number"
          value={item.rate || ''}
          onChange={(e) => handleChange('rate', parseFloat(e.target.value) || 0)}
          placeholder="0.00"
          required
          min="0"
          step="0.01"
        />
        <Select
          label="GST Rate (%)"
          value={item.gstRate || ''}
          onChange={(e) => handleChange('gstRate', parseInt(e.target.value))}
          options={GST_RATES.map(rate => ({ value: rate, label: `${rate}%` }))}
          placeholder="Select GST"
          required
        />
      </div>

      {/* Discount */}
      <Input
        label="Discount (₹)"
        type="number"
        value={item.discount || ''}
        onChange={(e) => handleChange('discount', parseFloat(e.target.value) || 0)}
        placeholder="0.00"
        min="0"
        step="0.01"
      />

      {/* Line Total */}
      <div className="pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-textSecondary">Line Total:</span>
          <span className="text-lg font-bold text-primary">
            {formatCurrency(calculateLineTotal())}
          </span>
        </div>
      </div>
    </div>
  );
};

export default InvoiceItemRow;
