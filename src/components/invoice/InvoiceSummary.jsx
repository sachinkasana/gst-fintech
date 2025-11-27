import React from 'react';
import { formatCurrency } from '../../utils/formatters';

const InvoiceSummary = ({ items, businessState, customerState }) => {
  const calculateTotals = () => {
    let subtotal = 0;
    let totalDiscount = 0;
    let totalCGST = 0;
    let totalSGST = 0;
    let totalIGST = 0;

    items.forEach(item => {
      const itemSubtotal = (item.quantity || 0) * (item.rate || 0);
      const itemDiscount = item.discount || 0;
      const taxableAmount = itemSubtotal - itemDiscount;
      const gstRate = item.gstRate || 0;
      const gstAmount = (taxableAmount * gstRate) / 100;

      subtotal += itemSubtotal;
      totalDiscount += itemDiscount;

      // Check if intrastate or interstate
      if (businessState === customerState) {
        totalCGST += gstAmount / 2;
        totalSGST += gstAmount / 2;
      } else {
        totalIGST += gstAmount;
      }
    });

    const grandTotal = subtotal - totalDiscount + totalCGST + totalSGST + totalIGST;

    return {
      subtotal,
      totalDiscount,
      totalCGST,
      totalSGST,
      totalIGST,
      grandTotal
    };
  };

  const totals = calculateTotals();
  const isIntrastate = businessState === customerState;

  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
      <h3 className="font-semibold text-textPrimary mb-3">Invoice Summary</h3>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-textSecondary">Subtotal:</span>
          <span className="font-medium">{formatCurrency(totals.subtotal)}</span>
        </div>

        {totals.totalDiscount > 0 && (
          <div className="flex justify-between text-red-600">
            <span>Discount:</span>
            <span className="font-medium">- {formatCurrency(totals.totalDiscount)}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-textSecondary">Taxable Amount:</span>
          <span className="font-medium">
            {formatCurrency(totals.subtotal - totals.totalDiscount)}
          </span>
        </div>

        <div className="border-t border-gray-300 pt-2">
          {isIntrastate ? (
            <>
              <div className="flex justify-between text-textSecondary">
                <span>CGST:</span>
                <span className="font-medium">{formatCurrency(totals.totalCGST)}</span>
              </div>
              <div className="flex justify-between text-textSecondary">
                <span>SGST:</span>
                <span className="font-medium">{formatCurrency(totals.totalSGST)}</span>
              </div>
            </>
          ) : (
            <div className="flex justify-between text-textSecondary">
              <span>IGST:</span>
              <span className="font-medium">{formatCurrency(totals.totalIGST)}</span>
            </div>
          )}
        </div>

        <div className="border-t-2 border-gray-300 pt-3 mt-3">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-textPrimary">Grand Total:</span>
            <span className="text-2xl font-bold text-primary">
              {formatCurrency(totals.grandTotal)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded text-xs text-textSecondary">
        <p>
          <strong>Tax Type:</strong> {isIntrastate ? 'Intrastate (CGST + SGST)' : 'Interstate (IGST)'}
        </p>
      </div>
    </div>
  );
};

export default InvoiceSummary;
