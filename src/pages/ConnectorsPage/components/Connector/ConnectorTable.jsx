import React from 'react';

const STATUS_CONFIG = {
    Active: {
        label: 'Active',
        className: 'text-green-700',
        style: { backgroundColor: '#f0fdf4', borderRadius: '999px', padding: '4px 8px', width: '62px', height: '28px' },
    },
    Inactive: {
        label: 'Inactive',
        className: 'text-gray-400',
        style: { backgroundColor: '#f3f4f6', borderRadius: '999px', padding: '4px 8px', width: '68px', height: '28px' },
    },
};

const COLUMNS = [
    { id: 'id', label: 'ID', width: 'w-[110px]' },
    { id: 'name', label: 'Name', width: 'w-[200px]' },
    { id: 'provider', label: 'Provider', width: 'w-[220px]' },
    { id: 'createDate', label: 'Create date', width: 'w-[180px]' },
    { id: 'status', label: 'Status', width: 'w-[110px]' },
    { id: 'actions', label: 'Actions', width: 'w-[80px]', align: 'text-right' },
];

const thClass = 'px-4 h-[40px] text-[13px] font-bold text-[#111827] whitespace-nowrap text-left align-middle';
const tdClass = 'px-4 h-[40px] text-[13px] leading-[20px] text-[#1f2937] font-normal border-b border-[#F3F4F6] align-middle';

/* Checkbox */
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

/* Status badge */
const StatusBadge = ({ value }) => {
    const cfg = STATUS_CONFIG[value] ?? STATUS_CONFIG.Inactive;
    return (
        <span
            className={`inline-flex items-center justify-center text-[13px] font-medium ${cfg.className}`}
            style={cfg.style}
        >
            {cfg.label}
        </span>
    );
};

/* Edit icon */
const EditIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16.04 3.01928L8.16 10.8993C7.86 11.1993 7.56 11.7893 7.5 12.2193L7.07 15.2293C6.91 16.3193 7.68 17.0793 8.77 16.9293L11.78 16.4993C12.2 16.4393 12.79 16.1393 13.1 15.8393L20.98 7.95928C22.34 6.59928 22.98 5.01928 20.98 3.01928C18.98 1.01928 17.4 1.65928 16.04 3.01928Z"
            stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14.91 4.15039C15.58 6.54039 17.45 8.41039 19.85 9.09039"
            stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

/* Delete icon */
const DeleteIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.9999 6.73046C20.9799 6.73046 20.9499 6.73046 20.9199 6.73046C15.6299 6.20046 10.3499 6.00046 5.11992 6.53046L3.07992 6.73046C2.65992 6.77046 2.28992 6.47046 2.24992 6.05046C2.20992 5.63046 2.50992 5.27046 2.91992 5.23046L4.95992 5.03046C10.2799 4.49046 15.6699 4.70046 21.0699 5.23046C21.4799 5.27046 21.7799 5.64046 21.7399 6.05046C21.7099 6.44046 21.3799 6.73046 20.9999 6.73046Z" />
        <path d="M8.50001 5.72C8.46001 5.72 8.42001 5.72 8.37001 5.71C7.97001 5.64 7.69001 5.25 7.76001 4.85L7.98001 3.54C8.14001 2.58 8.36001 1.25 10.69 1.25H13.31C15.65 1.25 15.87 2.63 16.02 3.55L16.24 4.85C16.31 5.26 16.03 5.65 15.63 5.71C15.22 5.78 14.83 5.5 14.77 5.1L14.55 3.8C14.41 2.93 14.38 2.76 13.32 2.76H10.7C9.64001 2.76 9.62001 2.9 9.47001 3.79L9.24001 5.09C9.18001 5.46 8.86001 5.72 8.50001 5.72Z" />
        <path d="M15.2099 22.7496H8.7899C5.2999 22.7496 5.1599 20.8196 5.0499 19.2596L4.3999 9.18959C4.3699 8.77959 4.6899 8.41959 5.0999 8.38959C5.5199 8.36959 5.8699 8.67959 5.8999 9.08959L6.5499 19.1596C6.6599 20.6796 6.6999 21.2496 8.7899 21.2496H15.2099C17.3099 21.2496 17.3499 20.6796 17.4499 19.1596L18.0999 9.08959C18.1299 8.67959 18.4899 8.36959 18.8999 8.38959C19.3099 8.41959 19.6299 8.76959 19.5999 9.18959L18.9499 19.2596C18.8399 20.8196 18.6999 22.7496 15.2099 22.7496Z" />
        <path d="M13.6601 17.25H10.3301C9.92008 17.25 9.58008 16.91 9.58008 16.5C9.58008 16.09 9.92008 15.75 10.3301 15.75H13.6601C14.0701 15.75 14.4101 16.09 14.4101 16.5C14.4101 16.91 14.0701 17.25 13.6601 17.25Z" />
        <path d="M14.5 13.25H9.5C9.09 13.25 8.75 12.91 8.75 12.5C8.75 12.09 9.09 11.75 9.5 11.75H14.5C14.91 11.75 15.25 12.09 15.25 12.5C15.25 12.91 14.91 13.25 14.5 13.25Z" />
    </svg>
);

/* Action button */
const ActionBtn = ({ onClick, title, colorClass, children }) => (
    <button
        onClick={onClick}
        title={title}
        className={`inline-flex items-center justify-center transition-colors duration-150 ${colorClass}`}
        style={{ width: 24, height: 24, padding: 2, borderRadius: 4 }}
    >
        {children}
    </button>
);

const ConnectorTable = ({
    rows = [], selected = [],
    onSelectAll, onSelectRow,
    onEdit, onDelete,
    loading,
}) => {
    const allSelected = rows.length > 0 && selected.length === rows.length;
    const someSelected = selected.length > 0 && selected.length < rows.length;

    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] border-collapse">
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
                                    className={`transition-colors hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : 'bg-white'}`}
                                >
                                    <td className="w-10 px-4 h-[40px] border-b border-[#F3F4F6] align-middle">
                                        <Checkbox checked={isSelected} onChange={() => onSelectRow(row.id)} />
                                    </td>
                                    <td className={tdClass}>{row.id}</td>
                                    <td className={tdClass}>{row.name}</td>
                                    <td className={tdClass}>{row.provider}</td>
                                    <td className={tdClass}>{row.createDate}</td>
                                    <td className={tdClass}><StatusBadge value={row.status} /></td>
                                    <td className={`${tdClass} text-right`}>
                                        <div className="flex items-center justify-end gap-1">
                                            <ActionBtn
                                                onClick={() => onEdit(row)}
                                                title="Edit"
                                                colorClass="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                            >
                                                <EditIcon />
                                            </ActionBtn>
                                            <ActionBtn
                                                onClick={() => onDelete(row)}
                                                title="Delete"
                                                colorClass="text-red-400 hover:text-red-600 hover:bg-red-50"
                                            >
                                                <DeleteIcon />
                                            </ActionBtn>
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

export default ConnectorTable;