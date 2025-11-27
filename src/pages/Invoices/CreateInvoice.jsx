import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowLeft } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import InvoiceCustomerSelector from '../../components/invoice/InvoiceForm';
import InvoiceItemRow from '../../components/invoice/InvoiceItemRow';
import InvoiceSummary from '../../components/invoice/InvoiceSummary';
import Card from '../../components/common/Card';
import { invoiceAPI } from '../../api/invoice.api';
import { businessAPI } from '../../api/business.api';
import { formatDateInput } from '../../utils/formatters';
import toast from 'react-hot-toast';

const CreateInvoice = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [business, setBusiness] = useState(null);
  const [invoiceType, setInvoiceType] = useState('B2B'); // B2B or B2C
  const [formData, setFormData] = useState({
    customer: null,
    items: [{
      productName: '',
      hsnCode: '',
      description: '',
      quantity: 1,
      unit: 'PCS',
      rate: 0,
      gstRate: 18,
      discount: 0
    }],
    dueDate: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchBusiness();
  }, []);

  const fetchBusiness = async () => {
    try {
      const response = await businessAPI.get();
      setBusiness(response.data);
    } catch (error) {
      console.error('Error fetching business:', error);
    }
  };

  const handleInvoiceTypeChange = (e) => {
    const newType = e.target.value;
    setInvoiceType(newType);
    
    // Reset customer when changing type
    setFormData({
      ...formData,
      customer: null
    });
    setErrors({ ...errors, customer: '' });

    // Set default GST rate based on type
    if (newType === 'B2C' && formData.items[0].gstRate === 0) {
      const newItems = [...formData.items];
      newItems[0].gstRate = 18; // Common rate for B2C
      setFormData({ ...formData, customer: null, items: newItems });
    }
  };

  const handleCustomerChange = (customer) => {
    setFormData({ ...formData, customer });
    if (errors.customer) {
      setErrors({ ...errors, customer: '' });
    }
  };

  const handleItemChange = (index, updatedItem) => {
    const newItems = [...formData.items];
    newItems[index] = updatedItem;
    setFormData({ ...formData, items: newItems });
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          productName: '',
          hsnCode: '',
          description: '',
          quantity: 1,
          unit: 'PCS',
          rate: 0,
          gstRate: invoiceType === 'B2C' ? 18 : 18,
          discount: 0
        }
      ]
    });
  };

  const handleRemoveItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.customer) {
      newErrors.customer = `Please ${invoiceType === 'B2B' ? 'select' : 'enter'} customer details`;
    }

    formData.items.forEach((item, index) => {
      if (!item.productName.trim()) {
        newErrors[`item_${index}_productName`] = 'Product name is required';
      }
      if (!item.hsnCode.trim()) {
        newErrors[`item_${index}_hsnCode`] = 'HSN/SAC code is required';
      }
      if (item.quantity <= 0) {
        newErrors[`item_${index}_quantity`] = 'Quantity must be greater than 0';
      }
      if (item.rate <= 0) {
        newErrors[`item_${index}_rate`] = 'Rate must be greater than 0';
      }
    });

    return newErrors;
  };

  const handleSubmit = async (isDraft = false) => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        customerId: formData.customer?._id || null,
        customerDetails: {
          name: formData.customer.name,
          phone: formData.customer.phone || '',
          gstin: formData.customer.gstin || '',
          address: formData.customer.address || '',
          city: formData.customer.city || '',
          state: formData.customer.state,
          pincode: formData.customer.pincode || ''
        },
        items: formData.items.map(item => ({
          productName: item.productName,
          hsnCode: item.hsnCode,
          description: item.description || '',
          quantity: parseFloat(item.quantity),
          unit: item.unit,
          rate: parseFloat(item.rate),
          gstRate: parseInt(item.gstRate),
          discount: parseFloat(item.discount) || 0
        })),
        dueDate: formData.dueDate || null,
        notes: formData.notes || '',
        isDraft
      };

      const response = await invoiceAPI.create(payload);
      toast.success('Invoice created successfully!');
      navigate(`/invoices/${response.data._id}`);
    } catch (error) {
      console.error('Error creating invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!business) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-textPrimary">Create Invoice</h1>
          <p className="text-textSecondary">Fill in the details to generate a new invoice</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Invoice Type Selection */}
          <Card title="Invoice Type">
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="invoiceType"
                  value="B2B"
                  checked={invoiceType === 'B2B'}
                  onChange={handleInvoiceTypeChange}
                  className="w-4 h-4 text-primary"
                />
                <span className="font-medium text-textPrimary">
                  B2B (Business to Business)
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="invoiceType"
                  value="B2C"
                  checked={invoiceType === 'B2C'}
                  onChange={handleInvoiceTypeChange}
                  className="w-4 h-4 text-primary"
                />
                <span className="font-medium text-textPrimary">
                  B2C (Business to Consumer)
                </span>
              </label>
            </div>
            <p className="text-sm text-textSecondary mt-3">
              {invoiceType === 'B2B' 
                ? '📌 For registered businesses. Customer details will be saved.' 
                : '📌 For individual customers. No need to save customer information.'}
            </p>
          </Card>

          {/* Customer Details */}
          <Card title={invoiceType === 'B2B' ? 'Select Customer' : 'Enter Customer Details'}>
            <InvoiceCustomerSelector
              invoiceType={invoiceType}
              value={formData.customer}
              onChange={handleCustomerChange}
              error={errors.customer}
            />
          </Card>

          {/* Invoice Items */}
          <Card title="Invoice Items">
            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <InvoiceItemRow
                  key={index}
                  item={item}
                  index={index}
                  onChange={handleItemChange}
                  onRemove={handleRemoveItem}
                />
              ))}

              <Button
                variant="outline"
                onClick={handleAddItem}
                className="w-full flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                Add Another Item
              </Button>
            </div>
          </Card>

          {/* Additional Details */}
          <Card title="Additional Details">
            <div className="space-y-4">
              <Input
                label="Due Date (Optional)"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                min={formatDateInput(new Date())}
              />

              <div>
                <label className="block text-sm font-medium text-textPrimary mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Add any notes or instructions..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          <div className="lg:sticky lg:top-6">
            <InvoiceSummary
              items={formData.items}
              businessState={business.state}
              customerState={formData.customer?.state}
            />

            <div className="mt-4 space-y-3">
              <Button
                fullWidth
                onClick={() => handleSubmit(false)}
                loading={loading}
                disabled={loading}
              >
                Generate Invoice
              </Button>
              <Button
                fullWidth
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoice;
