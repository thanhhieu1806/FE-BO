import React from 'react';

const COLUMNS = [
    { id: 'time', label: 'Time', width: 'w-[160px]' },
    { id: 'company', label: 'Company', width: 'w-[200px]' },
    { id: 'actor', label: 'Actor', width: 'w-[150px]' },
    { id: 'action', label: 'Action', width: 'w-[100px]' },
    { id: 'module', label: 'Module', width: 'w-[150px]' },
    { id: 'ipAddress', label: 'IP Address', width: 'w-[130px]' },
    { id: 'actions', label: 'Actions', width: 'w-[80px]', align: 'text-center' },
];

const thClass = 'px-4 h-[40px] text-[13px] font-bold text-[#111827] whitespace-nowrap text-left align-middle';
const tdClass = 'px-4 h-[40px] text-[13px] leading-[20px] text-[#1f2937] font-normal border-b border-[#F3F4F6] align-middle whitespace-nowrap';

/* Checkbox */
const Checkbox = ({ checked, indeterminate, onChange }) => (
    <label className="inline-flex items-center justify-center cursor-pointer" style={{ width: 20, height: 20 }}>
        <input
            type="checkbox"
            checked={checked}
            ref={(el) => { if (el) el.indeterminate = !!indeterminate; }}
            onChange={onChange}
            className="sr-only"
        />
        <span className={`
            flex items-center justify-center rounded-[4px] border transition-colors duration-150 shrink-0
            ${checked || indeterminate
                ? 'bg-[#0057ff] border-[#0057ff]'
                : 'bg-white border-gray-300 hover:border-blue-400'}
        `} style={{ width: 16, height: 16 }}>
            {indeterminate && !checked ? (
                <svg width="8" height="2" viewBox="0 0 8 2" fill="none">
                    <rect x="0" y="0.5" width="8" height="1" rx="0.5" fill="white" />
                </svg>
            ) : checked ? (
                <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                    <path d="M1 3.5L3.2 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ) : null}
        </span>
    </label>
);

/* View (eye) icon button */
const ViewIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const AuditLogTable = ({
    rows = [], selected = [],
    onSelectAll, onSelectRow,
    onView,
    loading,
}) => {
    const allSelected = rows.length > 0 && selected.length === rows.length;
    const someSelected = selected.length > 0 && selected.length < rows.length;

    return (
        /* Wrapper scrolls horizontally on small screens; table keeps its minimum width */
        <div className="w-full overflow-x-auto -webkit-overflow-scrolling-touch">
            <table className="w-full min-w-[800px] border-collapse">
                <thead>
                    <tr style={{ backgroundColor: '#f5f8ff' }} className="border-b border-[#E5E7EB]">
                        <th className="w-10 px-4 h-[40px] text-left align-middle">
                            <Checkbox checked={allSelected} indeterminate={someSelected} onChange={onSelectAll} />
                        </th>
                        {COLUMNS.map((col) => (
                            <th key={col.id} className={`${thClass} ${col.width} ${col.align ?? 'text-left'}`}>
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={COLUMNS.length + 1} className="px-4 py-10 text-center text-[13px] text-gray-400">
                                Loading...
                            </td>
                        </tr>
                    ) : rows.length === 0 ? (
                        <tr>
                            <td colSpan={COLUMNS.length + 1} className="px-4 py-10 text-center text-[13px] text-gray-400">
                                No data available
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
                                    <td className="w-10 px-4 h-[40px] border-b border-[#F3F4F6] align-middle">
                                        <Checkbox checked={isSelected} onChange={() => onSelectRow(row.id)} />
                                    </td>
                                    <td className={tdClass}>{row.time}</td>
                                    <td className={tdClass}>
                                        <button
                                            type="button"
                                            onClick={() => onView(row)}
                                            className="text-[#0057ff] font-medium hover:underline"
                                        >
                                            {row.company}
                                        </button>
                                    </td>
                                    <td className={tdClass}>{row.actor}</td>
                                    <td className={tdClass}>{row.action}</td>
                                    <td className={tdClass}>{row.module}</td>
                                    <td className={tdClass}>{row.ipAddress || '-'}</td>
                                    <td className={`${tdClass} text-center`}>
                                        <div className="flex items-center justify-center">
                                            <button
                                                onClick={() => onView(row)}
                                                title="View details"
                                                className="w-7 h-7 rounded-[6px] border border-[#dbeafe] text-[#2563eb] bg-white flex items-center justify-center hover:bg-blue-50 transition-colors"
                                            >
                                                <ViewIcon />
                                            </button>
                                        </div>
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

export default AuditLogTable;