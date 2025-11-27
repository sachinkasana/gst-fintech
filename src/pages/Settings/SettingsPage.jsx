import React, { useState, useEffect } from 'react';
import { Save, Building, FileText, Lock } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { businessAPI } from '../../api/business.api';
import { authAPI } from '../../api/auth.api';
import { INDIAN_STATES } from '../../utils/constants';
import { validateGSTIN } from '../../utils/validators';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('business');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [businessData, setBusinessData] = useState({
    name: '',
    gstin: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    invoicePrefix: '',
    termsConditions: '',
    bankDetails: {
      accountName: '',
      accountNumber: '',
      bankName: '',
      ifscCode: '',
      branch: ''
    }
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchBusiness();
  }, []);

  const fetchBusiness = async () => {
    try {
      const response = await businessAPI.get();
      setBusinessData(response.data);
    } catch (error) {
      console.error('Error fetching business:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateBusiness = () => {
    const newErrors = {};

    if (!businessData.name.trim()) {
      newErrors.name = 'Business name is required';
    }

    if (!businessData.state) {
      newErrors.state = 'State is required';
    }

    if (businessData.gstin && !validateGSTIN(businessData.gstin)) {
      newErrors.gstin = 'Invalid GSTIN format';
    }

    return newErrors;
  };

  const validatePassword = () => {
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleBusinessSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateBusiness();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);
    try {
      await businessAPI.update(businessData);
      toast.success('Business details updated successfully');
    } catch (error) {
      console.error('Error updating business:', error);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validatePassword();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);
    try {
      await authAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      toast.success('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setErrors({});
    } catch (error) {
      console.error('Error changing password:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  const tabs = [
    { id: 'business', label: 'Business Details', icon: Building },
    { id: 'invoice', label: 'Invoice Settings', icon: FileText },
    { id: 'security', label: 'Security', icon: Lock }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-textPrimary">Settings</h1>
        <p className="text-textSecondary mt-1">
          Manage your business and account settings
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'text-primary border-b-2 border-primary'
                : 'text-textSecondary hover:text-textPrimary'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Business Details Tab */}
      {activeTab === 'business' && (
        <form onSubmit={handleBusinessSubmit} className="space-y-6">
          <Card title="Business Information">
            <div className="space-y-4">
              <Input
                label="Business Name"
                value={businessData.name}
                onChange={(e) => setBusinessData({ ...businessData, name: e.target.value })}
                error={errors.name}
                required
              />
              <Input
                label="GSTIN (Optional)"
                value={businessData.gstin || ''}
                onChange={(e) => setBusinessData({ ...businessData, gstin: e.target.value })}
                placeholder="27AABCU1234C1ZX"
                error={errors.gstin}
              />
              <Input
                label="Phone Number"
                value={businessData.phone || ''}
                onChange={(e) => setBusinessData({ ...businessData, phone: e.target.value })}
                placeholder="Enter phone number"
              />
            </div>
          </Card>

          <Card title="Business Address">
            <div className="space-y-4">
              <Input
                label="Address"
                value={businessData.address || ''}
                onChange={(e) => setBusinessData({ ...businessData, address: e.target.value })}
                placeholder="Enter address"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="City"
                  value={businessData.city || ''}
                  onChange={(e) => setBusinessData({ ...businessData, city: e.target.value })}
                  placeholder="Enter city"
                />
                <Input
                  label="Pincode"
                  value={businessData.pincode || ''}
                  onChange={(e) => setBusinessData({ ...businessData, pincode: e.target.value })}
                  placeholder="Enter pincode"
                />
              </div>
              <Select
                label="State"
                value={businessData.state}
                onChange={(e) => setBusinessData({ ...businessData, state: e.target.value })}
                options={INDIAN_STATES}
                error={errors.state}
                required
              />
            </div>
          </Card>

          <Card title="Bank Details">
            <div className="space-y-4">
              <Input
                label="Account Name"
                value={businessData.bankDetails?.accountName || ''}
                onChange={(e) =>
                  setBusinessData({
                    ...businessData,
                    bankDetails: { ...businessData.bankDetails, accountName: e.target.value }
                  })
                }
                placeholder="Enter account name"
              />
              <Input
                label="Account Number"
                value={businessData.bankDetails?.accountNumber || ''}
                onChange={(e) =>
                  setBusinessData({
                    ...businessData,
                    bankDetails: { ...businessData.bankDetails, accountNumber: e.target.value }
                  })
                }
                placeholder="Enter account number"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Bank Name"
                  value={businessData.bankDetails?.bankName || ''}
                  onChange={(e) =>
                    setBusinessData({
                      ...businessData,
                      bankDetails: { ...businessData.bankDetails, bankName: e.target.value }
                    })
                  }
                  placeholder="Enter bank name"
                />
                <Input
                  label="IFSC Code"
                  value={businessData.bankDetails?.ifscCode || ''}
                  onChange={(e) =>
                    setBusinessData({
                      ...businessData,
                      bankDetails: { ...businessData.bankDetails, ifscCode: e.target.value }
                    })
                  }
                  placeholder="Enter IFSC code"
                />
              </div>
            </div>
          </Card>

          <Button type="submit" loading={saving} disabled={saving} className="flex items-center gap-2">
            <Save size={18} />
            Save Changes
          </Button>
        </form>
      )}

      {/* Invoice Settings Tab */}
      {activeTab === 'invoice' && (
        <form onSubmit={handleBusinessSubmit} className="space-y-6">
          <Card title="Invoice Configuration">
            <div className="space-y-4">
              <Input
                label="Invoice Prefix"
                value={businessData.invoicePrefix}
                onChange={(e) => setBusinessData({ ...businessData, invoicePrefix: e.target.value })}
                placeholder="INV"
                helperText="This will be used as prefix for invoice numbers (e.g., INV-2025-0001)"
              />
              <div>
                <label className="block text-sm font-medium text-textPrimary mb-1">
                  Terms & Conditions
                </label>
                <textarea
                  value={businessData.termsConditions || ''}
                  onChange={(e) => setBusinessData({ ...businessData, termsConditions: e.target.value })}
                  placeholder="Enter default terms and conditions for invoices..."
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </Card>

          <Button type="submit" loading={saving} disabled={saving} className="flex items-center gap-2">
            <Save size={18} />
            Save Changes
          </Button>
        </form>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <form onSubmit={handlePasswordSubmit} className="space-y-6">
          <Card title="Change Password">
            <div className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => {
                  setPasswordData({ ...passwordData, currentPassword: e.target.value });
                  if (errors.currentPassword) setErrors({ ...errors, currentPassword: '' });
                }}
                placeholder="Enter current password"
                error={errors.currentPassword}
                required
              />
              <Input
                label="New Password"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => {
                  setPasswordData({ ...passwordData, newPassword: e.target.value });
                  if (errors.newPassword) setErrors({ ...errors, newPassword: '' });
                }}
                placeholder="Enter new password"
                error={errors.newPassword}
                required
              />
              <Input
                label="Confirm New Password"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => {
                  setPasswordData({ ...passwordData, confirmPassword: e.target.value });
                  if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                }}
                placeholder="Confirm new password"
                error={errors.confirmPassword}
                required
              />
            </div>
          </Card>

          <Button type="submit" loading={saving} disabled={saving} className="flex items-center gap-2">
            <Lock size={18} />
            Change Password
          </Button>
        </form>
      )}
    </div>
  );
};

export default SettingsPage;
