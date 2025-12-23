import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { invoiceAPI } from '../api/invoice.api';
import StatsCard from '../components/dashboard/StatsCard';
import RecentInvoices from '../components/dashboard/RecentInvoices';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import { formatCurrency } from '../utils/formatters';
import { Plus, IndianRupee, FileText, Clock, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await invoiceAPI.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary">Dashboard</h1>
          <p className="text-textSecondary mt-1">
            Welcome back! Here's your business overview
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Today's Sales"
          value={formatCurrency(stats?.today?.sales || 0)}
          subtitle={`${stats?.today?.count || 0} invoices`}
          icon={IndianRupee}
          color="success"
        />
        <StatsCard
          title="This Month"
          value={formatCurrency(stats?.month?.sales || 0)}
          subtitle={`${stats?.month?.count || 0} invoices`}
          icon={TrendingUp}
          color="primary"
        />
        <StatsCard
          title="Outstanding"
          value={formatCurrency(stats?.outstanding || 0)}
          subtitle="Unpaid invoices"
          icon={Clock}
          color="warning"
        />
        <StatsCard
          title="Total Invoices"
          value={stats?.month?.count || 0}
          subtitle="This month"
          icon={FileText}
          color="primary"
        />
      </div>

      {/* Payment Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-textPrimary mb-4">
            Payment Status (This Month)
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-textSecondary">Paid</span>
              </div>
              <span className="font-semibold text-textPrimary">
                {formatCurrency(stats?.month?.paid || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm text-textSecondary">Unpaid</span>
              </div>
              <span className="font-semibold text-textPrimary">
                {formatCurrency(stats?.month?.unpaid || 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-textPrimary mb-4">
            Quick Actions
          </h3>
          <div className="space-y-2">
            <Button
              variant="outline"
              fullWidth
              onClick={() => navigate('/invoices/create')}
              className="justify-start"
            >
              <Plus size={18} className="mr-2" />
              Create New Invoice
            </Button>
            <Button
              variant="outline"
              fullWidth
              onClick={() => navigate('/customers')}
              className="justify-start"
            >
              <Plus size={18} className="mr-2" />
              Add Customer
            </Button>
            <Button
              variant="outline"
              fullWidth
              onClick={() => navigate('/reports')}
              className="justify-start"
            >
              <FileText size={18} className="mr-2" />
              Download Reports
            </Button>
          </div>
        </div>
      </div>

      {/* Recent Invoices */}
      <RecentInvoices invoices={stats?.recentInvoices || []} />
    </div>
  );
};

export default Dashboard;
