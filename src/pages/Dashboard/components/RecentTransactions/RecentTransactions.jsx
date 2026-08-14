import React from 'react';
import EmptyState from '../EmptyState/EmptyState';

/* ─── Empty state icon ─── */
const TransactionEmptyIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="16" height="18" rx="2" stroke="#D1D5DB" strokeWidth="1.5" />
    <path d="M9 2h6M9 2a2 2 0 00-2 2M15 2a2 2 0 012 2" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="8" y1="10" x2="16" y2="10" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="8" y1="14" x2="16" y2="14" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="8" y1="18" x2="12" y2="18" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/* ─── Blue Info Icon ─── */
const BlueInfoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="#2563EB" strokeWidth="1.5" />
    <path d="M12 11v5M12 8h.01" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/* Columns matching reference image: ID | Company | Method | Function | Status | Time | Actions */
const COLUMNS = [
  { key: 'id', label: 'ID', align: 'text-left' },
  { key: 'company', label: 'Company', align: 'text-left' },
  { key: 'method', label: 'Method', align: 'text-left' },
  { key: 'function', label: 'Function', align: 'text-left' },
  { key: 'status', label: 'Status', align: 'text-left' },
  { key: 'time', label: 'Time', align: 'text-left' },
  { key: 'actions', label: 'Actions', align: 'text-center' },
];

const renderStatusBadge = (status) => {
  const normalized = (status || '').toLowerCase();
  if (normalized === 'failed') {
    return (
      <span className="inline-block rounded-full bg-[#FEE2E2] px-3 py-0.5 text-[12px] font-semibold text-[#DC2626]">
        Failed
      </span>
    );
  }
  if (normalized === 'pending') {
    return (
      <span className="inline-block rounded-full bg-[#DCFCE7] px-3 py-0.5 text-[12px] font-semibold text-[#16A34A]">
        Pending
      </span>
    );
  }
  return (
    <span className="inline-block rounded-full bg-[#DCFCE7] px-3 py-0.5 text-[12px] font-semibold text-[#16A34A]">
      {status || 'Successful'}
    </span>
  );
};

const RecentTransactions = ({ transactions = [] }) => (
  <div className="w-full overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr className="border-b border-[#E5E7EB] bg-[#F8FAFC]">
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                className={`whitespace-nowrap px-4 py-3.5 ${col.align} text-[13px] font-bold text-[#374151]`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-[#F1F5F9]">
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={COLUMNS.length} className="py-6">
                <EmptyState
                  icon={<TransactionEmptyIcon />}
                  title="No recent transactions"
                  subtitle="Transaction records will appear here once data is available"
                />
              </td>
            </tr>
          ) : (
            transactions.map((tx, idx) => (
              <tr key={`${tx.id}-${idx}`} className="transition-colors hover:bg-[#F8FAFC]">
                {/* ID */}
                <td className="whitespace-nowrap px-4 py-3.5 align-middle text-[13px] font-normal text-[#374151]">
                  {tx.id}
                </td>

                {/* Company */}
                <td className="whitespace-nowrap px-4 py-3.5 align-middle text-[13px]">
                  <span className="cursor-pointer font-semibold uppercase text-[#2563EB] hover:underline">
                    {tx.company}
                  </span>
                </td>

                {/* Method */}
                <td className="whitespace-nowrap px-4 py-3.5 align-middle text-[13px] font-normal text-[#374151]">
                  {tx.method || 'GET'}
                </td>

                {/* Function */}
                <td className="whitespace-nowrap px-4 py-3.5 align-middle text-[13px] font-normal text-[#4B5563]">
                  {tx.function || tx.service || '—'}
                </td>

                {/* Status */}
                <td className="whitespace-nowrap px-4 py-3.5 align-middle">
                  {renderStatusBadge(tx.status)}
                </td>

                {/* Time */}
                <td className="whitespace-nowrap px-4 py-3.5 align-middle text-[13px] font-normal text-[#6B7280]">
                  {tx.time}
                </td>

                {/* Actions */}
                <td className="whitespace-nowrap px-4 py-3.5 align-middle text-center">
                  <button
                    type="button"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-[#EFF6FF]"
                    title="View details"
                    aria-label={`View details for transaction ${tx.id}`}
                  >
                    <BlueInfoIcon />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default RecentTransactions;