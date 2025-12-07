import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Share2, Trash2, DollarSign } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import { invoiceAPI } from '../../api/invoice.api';
import { paymentAPI } from '../../api/payment.api';
import { PAYMENT_MODES, INVOICE_TEMPLATES } from '../../utils/constants';
import { formatCurrency, formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

const InvoiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [templateOptions, setTemplateOptions] = useState(INVOICE_TEMPLATES);
  const [selectedTemplate, setSelectedTemplate] = useState(INVOICE_TEMPLATES[0].value);
  const [isUpdatingTemplate, setIsUpdatingTemplate] = useState(false);
  const [paymentData, setPaymentData] = useState({
    amount: '',
    paymentMode: 'CASH',
    paymentDate: new Date().toISOString().split('T')[0],
    referenceNumber: '',
    notes: ''
  });

  useEffect(() => {
    fetchInvoice();
    fetchTemplates();
  }, [id]);

  const fetchInvoice = async () => {
    try {
      const response = await invoiceAPI.getById(id);
      setInvoice(response.data);
      setSelectedTemplate(response.data.invoiceTemplate || INVOICE_TEMPLATES[0].value);
      setPaymentData({ ...paymentData, amount: response.data.amountDue });
    } catch (error) {
      console.error('Error fetching invoice:', error);
      navigate('/invoices');
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await invoiceAPI.getTemplates();
      setTemplateOptions(response.data || INVOICE_TEMPLATES);
    } catch (error) {
      console.error('Error fetching templates:', error);
      setTemplateOptions(INVOICE_TEMPLATES);
    }
  };

  const handleRecordPayment = async () => {
    try {
      await paymentAPI.record({
        invoiceId: invoice._id,
        ...paymentData,
        amount: parseFloat(paymentData.amount)
      });
      toast.success('Payment recorded successfully');
      setShowPaymentModal(false);
      fetchInvoice();
    } catch (error) {
      console.error('Error recording payment:', error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this invoice?')) {
      return;
    }

    try {
      await invoiceAPI.delete(invoice._id);
      toast.success('Invoice deleted successfully');
      navigate('/invoices');
    } catch (error) {
      console.error('Error deleting invoice:', error);
    }
  };

  const fetchInvoicePdf = async () => {
    const blob = await invoiceAPI.downloadPdf(invoice._id);
    return new File([blob], `${invoice.invoiceNumber}.pdf`, {
      type: 'application/pdf',
    });
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const pdfFile = await fetchInvoicePdf();
      const url = window.URL.createObjectURL(pdfFile);
      const link = document.createElement('a');
      link.href = url;
      link.download = pdfFile.name;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Invoice PDF downloaded');
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast.error('Unable to download invoice PDF');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    try {
      setIsSharing(true);
      const pdfFile = await fetchInvoicePdf();

      if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
        await navigator.share({
          title: `Invoice ${invoice.invoiceNumber}`,
          text: 'Please find the invoice PDF attached.',
          files: [pdfFile],
        });
        toast.success('Invoice shared');
        return;
      }

      if (navigator.share) {
        await navigator.share({
          title: `Invoice ${invoice.invoiceNumber}`,
          text: 'Invoice details',
          url: window.location.href,
        });
        toast.success('Invoice link shared');
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Invoice link copied to clipboard');
        return;
      }

      toast.error('Sharing is not supported on this device');
    } catch (error) {
      if (error?.name !== 'AbortError') {
        console.error('Error sharing invoice:', error);
        toast.error('Unable to share invoice');
      }
    } finally {
      setIsSharing(false);
    }
  };

  const handleTemplateUpdate = async () => {
    try {
      setIsUpdatingTemplate(true);
      await invoiceAPI.update(invoice._id, { invoiceTemplate: selectedTemplate });
      toast.success('Invoice template updated');
      fetchInvoice();
    } catch (error) {
      console.error('Error updating template:', error);
    } finally {
      setIsUpdatingTemplate(false);
    }
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  if (!invoice) {
    return null;
  }

  const getStatusColor = (status) => {
    const colors = {
      paid: 'bg-green-100 text-green-700',
      unpaid: 'bg-red-100 text-red-700',
      partial: 'bg-yellow-100 text-yellow-700'
    };
    return colors[status];
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/invoices')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-textPrimary">{invoice.invoiceNumber}</h1>
            <p className="text-textSecondary">
              Created on {formatDate(invoice.invoiceDate)}
            </p>
          </div>
        </div>
        <span className={`px-4 py-2 text-sm font-medium rounded-full ${getStatusColor(invoice.paymentStatus)}`}>
          {invoice.paymentStatus.toUpperCase()}
        </span>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          onClick={handleShare}
          loading={isSharing}
          disabled={isDownloading}
          className="flex items-center gap-2"
        >
          <Share2 size={18} />
          Share
        </Button>
        <Button
          variant="outline"
          onClick={handleDownload}
          loading={isDownloading}
          disabled={isSharing}
          className="flex items-center gap-2"
        >
          <Download size={18} />
          Download PDF
        </Button>
        {invoice.paymentStatus !== 'paid' && (
          <>
            <Button onClick={() => setShowPaymentModal(true)} className="flex items-center gap-2">
              <DollarSign size={18} />
              Record Payment
            </Button>
            <Button variant="danger" onClick={handleDelete} className="flex items-center gap-2">
              <Trash2 size={18} />
              Delete
            </Button>
          </>
        )}
      </div>

      <Card title="Invoice Template">
        <div className="flex flex-col md:flex-row md:items-end gap-3">
          <Select
            label="Choose Template"
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            options={templateOptions.map((option) => ({
              value: option.value || option.id || option,
              label: option.label || option.name || option.value || option
            }))}
          />
          <div className="flex gap-2">
            <Button
              onClick={handleTemplateUpdate}
              loading={isUpdatingTemplate}
              disabled={isDownloading || isSharing}
            >
              Apply Template
            </Button>
          </div>
        </div>
        <p className="text-sm text-textSecondary mt-2">
          Template is used for PDF download and share. Change it to regenerate with a different style.
        </p>
      </Card>

      {/* Customer Details */}
      <Card title="Customer Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-textSecondary">Name</p>
            <p className="font-medium text-textPrimary">{invoice.customerDetails.name}</p>
          </div>
          {invoice.customerDetails.phone && (
            <div>
              <p className="text-sm text-textSecondary">Phone</p>
              <p className="font-medium text-textPrimary">{invoice.customerDetails.phone}</p>
            </div>
          )}
          {invoice.customerDetails.gstin && (
            <div>
              <p className="text-sm text-textSecondary">GSTIN</p>
              <p className="font-medium text-textPrimary">{invoice.customerDetails.gstin}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-textSecondary">State</p>
            <p className="font-medium text-textPrimary">{invoice.customerDetails.state}</p>
          </div>
        </div>
      </Card>

      {/* Invoice Items */}
      <Card title="Invoice Items">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 text-sm font-semibold text-textPrimary">Item</th>
                <th className="text-right py-2 text-sm font-semibold text-textPrimary">Qty</th>
                <th className="text-right py-2 text-sm font-semibold text-textPrimary">Rate</th>
                <th className="text-right py-2 text-sm font-semibold text-textPrimary">GST</th>
                <th className="text-right py-2 text-sm font-semibold text-textPrimary">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3">
                    <p className="font-medium text-textPrimary">{item.productName}</p>
                    <p className="text-xs text-textSecondary">HSN: {item.hsnCode}</p>
                  </td>
                  <td className="py-3 text-right text-textSecondary">
                    {item.quantity} {item.unit}
                  </td>
                  <td className="py-3 text-right text-textSecondary">
                    {formatCurrency(item.rate)}
                  </td>
                  <td className="py-3 text-right text-textSecondary">
                    {item.gstRate}%
                  </td>
                  <td className="py-3 text-right font-semibold text-textPrimary">
                    {formatCurrency(item.totalAmount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Invoice Summary */}
      <Card title="Invoice Summary">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-textSecondary">Subtotal</span>
            <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
          </div>
          {invoice.totalDiscount > 0 && (
            <div className="flex justify-between text-sm text-red-600">
              <span>Discount</span>
              <span>- {formatCurrency(invoice.totalDiscount)}</span>
            </div>
          )}
          {invoice.totalCGST > 0 && (
            <>
              <div className="flex justify-between text-sm text-textSecondary">
                <span>CGST</span>
                <span>{formatCurrency(invoice.totalCGST)}</span>
              </div>
              <div className="flex justify-between text-sm text-textSecondary">
                <span>SGST</span>
                <span>{formatCurrency(invoice.totalSGST)}</span>
              </div>
            </>
          )}
          {invoice.totalIGST > 0 && (
            <div className="flex justify-between text-sm text-textSecondary">
              <span>IGST</span>
              <span>{formatCurrency(invoice.totalIGST)}</span>
            </div>
          )}
          <div className="border-t-2 pt-2 mt-2 flex justify-between">
            <span className="text-lg font-semibold text-textPrimary">Grand Total</span>
            <span className="text-2xl font-bold text-primary">{formatCurrency(invoice.grandTotal)}</span>
          </div>
          {invoice.paymentStatus !== 'paid' && (
            <>
              <div className="flex justify-between text-sm text-green-600">
                <span>Amount Paid</span>
                <span>{formatCurrency(invoice.amountPaid)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-textPrimary">Amount Due</span>
                <span className="text-lg font-bold text-red-600">{formatCurrency(invoice.amountDue)}</span>
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Record Payment Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Record Payment"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Amount"
            type="number"
            value={paymentData.amount}
            onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
            placeholder="0.00"
            required
            max={invoice.amountDue}
          />
          <Select
            label="Payment Mode"
            value={paymentData.paymentMode}
            onChange={(e) => setPaymentData({ ...paymentData, paymentMode: e.target.value })}
            options={PAYMENT_MODES}
            required
          />
          <Input
            label="Payment Date"
            type="date"
            value={paymentData.paymentDate}
            onChange={(e) => setPaymentData({ ...paymentData, paymentDate: e.target.value })}
            required
          />
          <Input
            label="Reference Number (Optional)"
            value={paymentData.referenceNumber}
            onChange={(e) => setPaymentData({ ...paymentData, referenceNumber: e.target.value })}
            placeholder="Transaction ID / Cheque No."
          />
          <div className="flex gap-3 pt-4">
            <Button fullWidth onClick={handleRecordPayment}>
              Record Payment
            </Button>
            <Button fullWidth variant="outline" onClick={() => setShowPaymentModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default InvoiceDetails;
