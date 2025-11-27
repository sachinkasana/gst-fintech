import React, { useState } from 'react';
import { Download, Calendar, FileText, AlertCircle } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import { reportAPI } from '../../api/report.api';
import { downloadBlob, formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

const ReportsPage = () => {
  const [loading, setLoading] = useState({
    salesRegister: false,
    gstr1: false,
    taxSummary: false
  });
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  const handleDownloadReport = async (reportType, reportName) => {
    if (!dateRange.startDate || !dateRange.endDate) {
      toast.error('Please select date range');
      return;
    }

    const start = new Date(dateRange.startDate);
    const end = new Date(dateRange.endDate);

    if (start > end) {
      toast.error('Start date must be before end date');
      return;
    }

    setLoading({ ...loading, [reportType]: true });
    try {
      let response;
      const params = {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        format: 'excel'
      };

      switch (reportType) {
        case 'salesRegister':
          response = await reportAPI.getSalesRegister(params);
          break;
        case 'gstr1':
          response = await reportAPI.getGSTR1(params);
          break;
        case 'taxSummary':
          response = await reportAPI.getTaxSummary(params);
          break;
        default:
          return;
      }

      const blob = new Blob([response], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      const filename = `${reportName}_${dateRange.startDate}_to_${dateRange.endDate}.xlsx`;
      downloadBlob(blob, filename);
      toast.success('Report downloaded successfully! 📊');
    } catch (error) {
      console.error('Error downloading report:', error);
      toast.error('Failed to download report. Please try again.');
    } finally {
      setLoading({ ...loading, [reportType]: false });
    }
  };

  const reports = [
    {
      id: 'salesRegister',
      title: 'Sales Register',
      description: 'Complete sales register with all invoice details, taxes, and amounts',
      icon: FileText,
      color: 'bg-blue-50 text-blue-600',
      filesize: '~2MB'
    },
    {
      id: 'gstr1',
      title: 'GSTR-1 Report',
      description: 'GST return format with separate sheets for B2B, B2CS, and B2CL transactions',
      icon: FileText,
      color: 'bg-green-50 text-green-600',
      filesize: '~1.5MB'
    },
    {
      id: 'taxSummary',
      title: 'Tax Summary',
      description: 'GST summary by tax rates with CGST, SGST, IGST breakdown for each rate',
      icon: FileText,
      color: 'bg-purple-50 text-purple-600',
      filesize: '~500KB'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-textPrimary">Reports</h1>
        <p className="text-textSecondary mt-1">
          Download GST reports for your auditor and CA
        </p>
      </div>

      {/* Date Range Selection */}
      <Card title="📅 Select Date Range">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Start Date"
            type="date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
            max={dateRange.endDate}
          />
          <Input
            label="End Date"
            type="date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
            min={dateRange.startDate}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-textSecondary flex items-start gap-2">
            <Calendar className="mt-0.5 flex-shrink-0" size={16} />
            <span>
              <strong>Selected Period:</strong> {formatDate(dateRange.startDate)} to{' '}
              {formatDate(dateRange.endDate)}
            </span>
          </p>
        </div>
      </Card>

      {/* Reports List */}
      <div className="space-y-4">
        {reports.map((report) => (
          <Card key={report.id}>
            <div className="flex items-start gap-4">
              <div className={`p-4 rounded-lg ${report.color} flex-shrink-0`}>
                <report.icon size={28} />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-textPrimary mb-1">
                      {report.title}
                    </h3>
                    <p className="text-sm text-textSecondary mb-3">
                      {report.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-textSecondary">
                      <span>💾 File size: {report.filesize}</span>
                      <span>📄 Format: XLSX</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleDownloadReport(report.id, report.title.replace(/\s+/g, '-'))}
                    loading={loading[report.id]}
                    disabled={loading[report.id]}
                    className="flex items-center gap-2 whitespace-nowrap flex-shrink-0"
                    size="sm"
                  >
                    <Download size={18} />
                    <span className="hidden sm:inline">Download</span>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <div className="flex gap-3">
            <AlertCircle className="text-blue-500 flex-shrink-0" size={24} />
            <div>
              <h4 className="font-semibold text-textPrimary mb-1">📋 Report Details</h4>
              <ul className="text-sm text-textSecondary space-y-1 list-disc list-inside">
                <li>All reports generated in Excel format (.xlsx)</li>
                <li>Includes detailed transaction information</li>
                <li>Professional formatting ready for CA</li>
                <li>Automatically calculated tax totals</li>
              </ul>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex gap-3">
            <AlertCircle className="text-green-500 flex-shrink-0" size={24} />
            <div>
              <h4 className="font-semibold text-textPrimary mb-1">✅ Usage Tips</h4>
              <ul className="text-sm text-textSecondary space-y-1 list-disc list-inside">
                <li>Sales Register: For audit and record keeping</li>
                <li>GSTR-1: For GST return filing with tax office</li>
                <li>Tax Summary: For quick tax analysis</li>
                <li>Share directly with your CA</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>

      {/* Download History Card */}
      <Card>
        <div className="text-center py-8">
          <FileText size={40} className="text-gray-300 mx-auto mb-3" />
          <h4 className="font-semibold text-textPrimary mb-2">🎯 Ready to Download</h4>
          <p className="text-sm text-textSecondary">
            Select a date range above and click download to generate your reports
          </p>
        </div>
      </Card>
    </div>
  );
};

export default ReportsPage;
