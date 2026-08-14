import React from 'react';

const STATUS_CONFIG = {
    Active: { label: 'Active', className: 'text-green-700 bg-green-50' },
    Inactive: { label: 'Inactive', className: 'text-gray-400 bg-gray-100' },
};

const PACKAGE_DOT = {
    Enterprise: 'bg-green-500',
    Business: 'bg-blue-500',
    Trial: 'bg-gray-400',
};

const COLUMNS = [
    { id: 'id', label: 'ID', width: 'w-[80px]' },
    { id: 'name', label: 'Name', width: 'max-w-0' },
    { id: 'taxCode', label: 'Tax code', width: 'w-[130px]' },
    { id: 'owner', label: 'Owner', width: 'w-[200px]' },
    { id: 'servicePackage', label: 'Service package', width: 'w-[145px]' },
    { id: 'status', label: 'Status', width: 'w-[90px]', align: 'text-center' },
    { id: 'actions', label: 'Actions', width: 'w-[70px]', align: 'text-center' },
];

const thClass = 'px-4 h-[44px] text-[13px] font-bold text-[#111827] whitespace-nowrap text-left align-middle overflow-hidden';
const tdClass = 'px-4 h-[44px] text-[13px] text-[#1f2937] font-normal border-b border-[#F3F4F6] align-middle overflow-hidden';

const PackageCell = ({ value }) => (
    <span className="flex items-center gap-1.5">
        <span className={`w-[7px] h-[7px] rounded-full shrink-0 ${PACKAGE_DOT[value] ?? 'bg-gray-400'}`} />
        <span className="text-[14px] leading-[20px] text-[#1f2937]">{value}</span>
    </span>
);

const StatusBadge = ({ value }) => {
    const cfg = STATUS_CONFIG[value] ?? STATUS_CONFIG.Inactive;
    return (
        <span className={`inline-flex items-center px-2.5 py-[2px] rounded-full text-[12px] font-medium ${cfg.className}`}>
            {cfg.label}
        </span>
    );
};

/* Eye icon — hình mắt thật: path cong trên dưới + pupil */
const EyeIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

/* Checkbox — 24x24 theo Figma */
const Checkbox = ({ checked, indeterminate, onChange }) => (
    <label className="inline-flex items-center justify-center cursor-pointer" style={{ width: 24, height: 24 }}>
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
                ? 'bg-blue-600 border-blue-600'
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

const CompanyTable = ({ rows = [], selected = [], onSelectAll, onSelectRow, onView, loading }) => {
    const allSelected = rows.length > 0 && selected.length === rows.length;
    const someSelected = selected.length > 0 && selected.length < rows.length;

    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] border-collapse table-fixed">

                {/* Head */}
                <thead>
                    <tr style={{ backgroundColor: '#f5f8ff' }} className="border-b border-[#E5E7EB]">
                        <th className="w-10 px-4 h-[40px] text-left align-middle">
                            <Checkbox
                                checked={allSelected}
                                indeterminate={someSelected}
                                onChange={onSelectAll}
                            />
                        </th>
                        {COLUMNS.map((col) => (
                            <th
                                key={col.id}
                                className={`${thClass} ${col.width} ${col.align ?? 'text-left'}`}
                            >
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>

                {/* Body */}
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
                        rows.map((row) => {
                            const isSelected = selected.includes(row.id);
                            return (
                                <tr
                                    key={row.id}
                                    className={`transition-colors hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}
                                >
                                    <td className="w-10 px-4 h-[40px] border-b border-[#F3F4F6] align-middle">
                                        <Checkbox
                                            checked={isSelected}
                                            onChange={() => onSelectRow(row.id)}
                                        />
                                    </td>
                                    <td className={tdClass}>
                                        <span className="block truncate" title={String(row.id)}>{row.id}</span>
                                    </td>
                                    <td className={`${tdClass} max-w-0`}>
                                        <span className="block truncate text-[#1f2937] font-medium" title={row.name}>{row.name}</span>
                                    </td>
                                    <td className={tdClass}>
                                        <span className="block truncate" title={row.taxCode}>{row.taxCode}</span>
                                    </td>
                                    <td className={tdClass}>
                                        <span className="block truncate" title={row.owner}>{row.owner}</span>
                                    </td>
                                    <td className={tdClass}><PackageCell value={row.servicePackage} /></td>
                                    <td className={`${tdClass} text-center`}><StatusBadge value={row.status} /></td>
                                    <td className={`${tdClass} text-center`}>
                                        <button
                                            onClick={() => onView(row)}
                                            title="View detail"
                                            className="inline-flex items-center justify-center w-8 h-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
                                        >
                                            <EyeIcon />
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

export default CompanyTable;