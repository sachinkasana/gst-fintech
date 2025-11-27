import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Eye, Trash2 } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { invoiceAPI } from '../../api/invoice.api';
import { formatCurrency, formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

const InvoicesList = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    paymentStatus: '',
    startDate: '',
    endDate: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0
  });

  useEffect(() => {
    fetchInvoices();
  }, [filters, pagination.page]);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        page: pagination.page,
        limit: pagination.limit
      };
      const response = await invoiceAPI.getAll(params);
      setInvoices(response.data);
      setPagination(prev => ({
        ...prev,
        total: response.pagination.total
      }));
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, invoiceNumber) => {
    if (!window.confirm(`Are you sure you want to delete invoice ${invoiceNumber}?`)) {
      return;
    }

    try {
      await invoiceAPI.delete(id);
      toast.success('Invoice deleted successfully');
      fetchInvoices();
    } catch (error) {
      console.error('Error deleting invoice:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      paid: 'bg-green-100 text-green-700 border-green-200',
      unpaid: 'bg-red-100 text-red-700 border-red-200',
      partial: 'bg-yellow-100 text-yellow-700 border-yellow-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getStatusText = (status) => {
    const texts = {
      paid: 'Paid',
      unpaid: 'Unpaid',
      partial: 'Partial'
    };
    return texts[status] || status;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary">Invoices</h1>
          <p className="text-textSecondary mt-1">
            Manage all your invoices
          </p>
        </div>
        <Button
          onClick={() => navigate('/invoices/create')}
          className="flex items-center gap-2"
        >
          <Plus size={20} />
          <span>Create Invoice</span>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search invoices..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <Select
            value={filters.paymentStatus}
            onChange={(e) => setFilters({ ...filters, paymentStatus: e.target.value })}
            options={[
              { value: '', label: 'All Status' },
              { value: 'paid', label: 'Paid' },
              { value: 'unpaid', label: 'Unpaid' },
              { value: 'partial', label: 'Partial' }
            ]}
            placeholder="Payment Status"
          />

          <Input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            placeholder="Start Date"
          />

          <Input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            placeholder="End Date"
          />
        </div>
      </Card>

      {/* Invoice List */}
      {loading ? (
        <Loader />
      ) : invoices.length > 0 ? (
        <div className="space-y-3">
          {/* Desktop View */}
          <div className="hidden md:block">
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-textPrimary">Invoice #</th>
                      <th className="text-left py-3 px-4 font-semibold text-textPrimary">Customer</th>
                      <th className="text-left py-3 px-4 font-semibold text-textPrimary">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-textPrimary">Amount</th>
                      <th className="text-left py-3 px-4 font-semibold text-textPrimary">Status</th>
                      <th className="text-right py-3 px-4 font-semibold text-textPrimary">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice) => (
                      <tr key={invoice._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-textPrimary">
                          {invoice.invoiceNumber}
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-textPrimary">{invoice.customerDetails.name}</p>
                            <p className="text-sm text-textSecondary">{invoice.customerDetails.phone}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-textSecondary">
                          {formatDate(invoice.invoiceDate)}
                        </td>
                        <td className="py-3 px-4 font-semibold text-textPrimary">
                          {formatCurrency(invoice.grandTotal)}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(invoice.paymentStatus)}`}>
                            {getStatusText(invoice.paymentStatus)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => navigate(`/invoices/${invoice._id}`)}
                              className="p-2 text-primary hover:bg-primary hover:text-white rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye size={18} />
                            </button>
                            {invoice.paymentStatus !== 'paid' && (
                              <button
                                onClick={() => handleDelete(invoice._id, invoice.invoiceNumber)}
                                className="p-2 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Mobile View */}
          <div className="md:hidden space-y-3">
            {invoices.map((invoice) => (
              <Card key={invoice._id}>
                <div
                  onClick={() => navigate(`/invoices/${invoice._id}`)}
                  className="cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-textPrimary">{invoice.invoiceNumber}</p>
                      <p className="text-sm text-textSecondary">{invoice.customerDetails.name}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(invoice.paymentStatus)}`}>
                      {getStatusText(invoice.paymentStatus)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-textSecondary">{formatDate(invoice.invoiceDate)}</span>
                    <span className="font-semibold text-primary">{formatCurrency(invoice.grandTotal)}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {pagination.total > pagination.limit && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button
                variant="outline"
                disabled={pagination.page === 1}
                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
              >
                Previous
              </Button>
              <span className="text-sm text-textSecondary">
                Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
              </span>
              <Button
                variant="outline"
                disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      ) : (
        <Card>
          <div className="text-center py-12">
            <p className="text-textSecondary mb-4">No invoices found</p>
            <Button onClick={() => navigate('/invoices/create')}>
              Create Your First Invoice
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default InvoicesList;
