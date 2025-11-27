import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, formatDate } from '../../utils/formatters';

const RecentInvoices = ({ invoices }) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    const colors = {
      paid: 'bg-green-100 text-green-700',
      unpaid: 'bg-red-100 text-red-700',
      partial: 'bg-yellow-100 text-yellow-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-textPrimary">Recent Invoices</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {invoices && invoices.length > 0 ? (
          invoices.map((invoice) => (
            <div
              key={invoice._id}
              onClick={() => navigate(`/invoices/${invoice._id}`)}
              className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-textPrimary truncate">
                    {invoice.invoiceNumber}
                  </p>
                  <p className="text-sm text-textSecondary truncate">
                    {invoice.customerDetails?.name}
                  </p>
                  <p className="text-xs text-textSecondary mt-1">
                    {formatDate(invoice.invoiceDate)}
                  </p>
                </div>
                <div className="ml-4 text-right">
                  <p className="font-semibold text-textPrimary">
                    {formatCurrency(invoice.grandTotal)}
                  </p>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${getStatusColor(invoice.paymentStatus)}`}>
                    {getStatusText(invoice.paymentStatus)}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="px-4 py-8 text-center text-textSecondary">
            No invoices yet
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentInvoices;
