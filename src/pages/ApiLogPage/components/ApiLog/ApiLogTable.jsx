import React from 'react';

const COLUMNS = [
    { id: 'id', label: 'ID', width: 'w-[100px]' },
    { id: 'company', label: 'Company', width: 'w-[200px]' },
    { id: 'method', label: 'Method', width: 'w-[100px]' },
    { id: 'function', label: 'Function', width: 'w-[200px]' },
    { id: 'status', label: 'Status', width: 'w-[120px]' },
    { id: 'time', label: 'Time', width: 'w-[180px]' },
    { id: 'actions', label: 'Actions', width: 'w-[80px]', align: 'text-center' },
];

const Checkbox = ({ checked, onChange }) => (
    <label className="inline-flex items-center justify-center cursor-pointer" style={{ width: 18, height: 18 }}>
        <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
        <span
            className={`flex items-center justify-center rounded-[4px] border transition-colors shrink-0 ${checked ? 'bg-[#0057ff] border-[#0057ff]' : 'bg-white border-[#d1d5db] hover:border-blue-400'
                }`}
            style={{ width: 16, height: 16 }}
        >
            {checked && (
                <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                    <path d="M1 3.5L3.2 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )}
        </span>
    </label>
);

export const MethodBadge = ({ method }) => {
    let style = 'bg-[#f0f5ff] text-[#0057ff]'; // GET: xanh dương
    const m = (method || '').toUpperCase();
    if (m === 'POST') style = 'bg-[#e6f4ea] text-[#16a34a]';   // POST: xanh lá
    if (m === 'PUT') style = 'bg-[#fff7ed] text-[#ea580c]';    // PUT: cam
    if (m === 'PATCH') style = 'bg-[#f3e8ff] text-[#9333ea]';  // PATCH: tím
    if (m === 'DELETE') style = 'bg-[#fef2f2] text-[#ef4444]'; // DELETE: đỏ

    return (
        <span className={`inline-flex items-center justify-center px-2.5 py-0.5 text-[12px] font-semibold rounded-[6px] uppercase ${style}`}>
            {method}
        </span>
    );
};

export const ResponseCodeBadge = ({ code }) => {
    const isSuccess = code === 200 || code === '200' || code === '200 OK' || code === 'Success';
    const bg = isSuccess ? 'bg-[#e6f4ea] text-[#16a34a]' : 'bg-[#fef2f2] text-[#ef4444]';

    return (
        <span className={`inline-flex items-center justify-center px-3 py-0.5 text-[12.5px] font-semibold rounded-full ${bg}`}>
            {code}
        </span>
    );
};

const StatusBadge = ({ status }) => {
    let bg = 'bg-[#e6f4ea] text-[#16a34a]'; // Successful
    if (status === 'Failed') bg = 'bg-[#fef2f2] text-[#ef4444]';
    if (status === 'Pending') bg = 'bg-[#ecfdf5] text-[#10b981]';

    return (
        <span className={`inline-flex items-center justify-center px-2.5 py-0.5 text-[12px] font-medium rounded-full ${bg}`}>
            {status}
        </span>
    );
};

const InfoIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0057ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
);

const thClass = 'px-4 h-[40px] text-left text-[13px] font-semibold text-[#111827] bg-[#f5f8ff] border-b border-[#e5e7eb] align-middle select-none';
const tdClass = 'px-4 h-[44px] text-[13.5px] text-[#374151] border-b border-[#f3f4f6] align-middle';

const ApiLogTable = ({ rows, selected, onSelectAll, onSelectRow, onView }) => {
    const allSelected = rows.length > 0 && selected.length === rows.length;

    return (
        <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-[#f5f8ff] border-b border-[#e5e7eb]">
                            <th className="w-10 px-4 h-[40px] bg-[#f5f8ff] align-middle">
                                <Checkbox checked={allSelected} onChange={onSelectAll} />
                            </th>
                            {COLUMNS.map((col) => (
                                <th key={col.id} className={`${thClass} ${col.width} ${col.align || ''}`}>
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length === 0 ? (
                            <tr>
                                <td colSpan={COLUMNS.length + 1} className="py-8 text-center text-[13px] text-[#6b7280]">
                                    No API logs available
                                </td>
                            </tr>
                        ) : (
                            rows.map((row, idx) => {
                                const isSelected = selected.includes(row.id);
                                return (
                                    <tr
                                        key={`${row.id}-${idx}`}
                                        className={`transition-colors hover:bg-gray-50/80 ${isSelected ? 'bg-blue-50/50' : 'bg-white'}`}
                                    >
                                        <td className="w-10 px-4 h-[44px] border-b border-[#f3f4f6] align-middle">
                                            <Checkbox checked={isSelected} onChange={() => onSelectRow(row.id)} />
                                        </td>
                                        <td className={tdClass}>{row.logId || row.id}</td>
                                        <td className={tdClass}>
                                            <button
                                                type="button"
                                                onClick={() => onView(row)}
                                                className="text-[#0057ff] font-medium hover:underline text-left"
                                            >
                                                {row.company}
                                            </button>
                                        </td>
                                        <td className={tdClass}>
                                            <MethodBadge method={row.method} />
                                        </td>
                                        <td className={tdClass}>{row.function}</td>
                                        <td className={tdClass}>
                                            <StatusBadge status={row.status} />
                                        </td>
                                        <td className={tdClass}>{row.time}</td>
                                        <td className={`${tdClass} text-center`}>
                                            <button
                                                type="button"
                                                onClick={() => onView(row)}
                                                title="View details"
                                                className="p-1 hover:opacity-70 transition-opacity inline-flex items-center justify-center"
                                            >
                                                <InfoIcon />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
        </div>
    );
};

export default ApiLogTable;
