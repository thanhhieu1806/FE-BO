import React from 'react';

const STATUS_CONFIG = {
    Active: { label: 'Active', className: 'text-green-700', style: { backgroundColor: '#f0fdf4', borderRadius: '999px', padding: '4px 8px', width: '58px', height: '28px' } },
    Inactive: { label: 'Inactive', className: 'text-gray-400', style: { backgroundColor: '#f3f4f6', borderRadius: '999px', padding: '4px 8px', width: '68px', height: '28px' } },
};

const COLUMNS = [
    { id: 'id', label: 'ID', width: 'w-[110px]' },
    { id: 'roleName', label: 'Role name', width: 'w-[160px]' },
    { id: 'description', label: 'Description', width: '' },
    { id: 'admins', label: 'Admins', width: 'w-[100px]' },
    { id: 'status', label: 'Status', width: 'w-[110px]' },
    { id: 'actions', label: 'Actions', width: 'w-[80px]', align: 'text-right' },
];

const thClass = 'px-4 h-[40px] text-[13px] font-bold text-[#111827] whitespace-nowrap text-left align-middle';
const tdClass = 'px-4 h-[40px] text-[13px] text-[#1f2937] font-normal border-b border-[#F3F4F6] align-middle';

const Checkbox = ({ checked, indeterminate, onChange }) => (
    <label className="inline-flex items-center justify-center cursor-pointer" style={{ width: 24, height: 24 }}>
        <input type="checkbox" checked={checked}
            ref={(el) => { if (el) el.indeterminate = !!indeterminate; }}
            onChange={onChange} className="sr-only" />
        <span className={`flex items-center justify-center rounded-[4px] border transition-colors duration-150 shrink-0 ${checked || indeterminate ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300 hover:border-blue-400'}`}
            style={{ width: 16, height: 16 }}>
            {indeterminate && !checked ? (
                <svg width="8" height="2" viewBox="0 0 8 2" fill="none"><rect x="0" y="0.5" width="8" height="1" rx="0.5" fill="white" /></svg>
            ) : checked ? (
                <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.2 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            ) : null}
        </span>
    </label>
);

const StatusBadge = ({ value }) => {
    const cfg = STATUS_CONFIG[value] ?? STATUS_CONFIG.Inactive;
    return <span className={`inline-flex items-center justify-center text-[13px] font-medium ${cfg.className}`} style={cfg.style}>{cfg.label}</span>;
};

const EditIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16.04 3.02L8.16 10.9C7.86 11.2 7.56 11.79 7.5 12.22L7.07 15.23C6.91 16.32 7.68 17.08 8.77 16.93L11.78 16.5C12.2 16.44 12.79 16.14 13.1 15.84L20.98 7.96C22.34 6.6 22.98 5.02 20.98 3.02C18.98 1.02 17.4 1.66 16.04 3.02Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14.91 4.15C15.58 6.54 17.45 8.41 19.85 9.09" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const DeleteIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 6.73C15.63 6.2 10.35 6 5.12 6.53L3.08 6.73C2.66 6.77 2.29 6.47 2.25 6.05C2.21 5.63 2.51 5.27 2.92 5.23L4.96 5.03C10.28 4.49 15.67 4.7 21.07 5.23C21.48 5.27 21.78 5.64 21.74 6.05C21.71 6.44 21.38 6.73 21 6.73Z" />
        <path d="M8.5 5.72C8.46 5.72 8.42 5.72 8.37 5.71C7.97 5.64 7.69 5.25 7.76 4.85L7.98 3.54C8.14 2.58 8.36 1.25 10.69 1.25H13.31C15.65 1.25 15.87 2.63 16.02 3.55L16.24 4.85C16.31 5.26 16.03 5.65 15.63 5.71C15.22 5.78 14.83 5.5 14.77 5.1L14.55 3.8C14.41 2.93 14.38 2.76 13.32 2.76H10.7C9.64 2.76 9.62 2.9 9.47 3.79L9.24 5.09C9.18 5.46 8.86 5.72 8.5 5.72Z" />
        <path d="M15.21 22.75H8.79C5.3 22.75 5.16 20.82 5.05 19.26L4.4 9.19C4.37 8.78 4.69 8.42 5.1 8.39C5.52 8.37 5.87 8.68 5.9 9.09L6.55 19.16C6.66 20.68 6.7 21.25 8.79 21.25H15.21C17.31 21.25 17.35 20.68 17.45 19.16L18.1 9.09C18.13 8.68 18.49 8.37 18.9 8.39C19.31 8.42 19.63 8.77 19.6 9.19L18.95 19.26C18.84 20.82 18.7 22.75 15.21 22.75Z" />
        <path d="M13.66 17.25H10.33C9.92 17.25 9.58 16.91 9.58 16.5C9.58 16.09 9.92 15.75 10.33 15.75H13.66C14.07 15.75 14.41 16.09 14.41 16.5C14.41 16.91 14.07 17.25 13.66 17.25Z" />
        <path d="M14.5 13.25H9.5C9.09 13.25 8.75 12.91 8.75 12.5C8.75 12.09 9.09 11.75 9.5 11.75H14.5C14.91 11.75 15.25 12.09 15.25 12.5C15.25 12.91 14.91 13.25 14.5 13.25Z" />
    </svg>
);

const ActionBtn = ({ onClick, title, colorClass, children }) => (
    <button onClick={onClick} title={title}
        className={`inline-flex items-center justify-center transition-colors duration-150 ${colorClass}`}
        style={{ width: 24, height: 24, padding: 2, borderRadius: 4 }}>
        {children}
    </button>
);

const RoleTable = ({ rows = [], selected = [], onSelectAll, onSelectRow, onEdit, onDelete, loading }) => {
    const allSelected = rows.length > 0 && selected.length === rows.length;
    const someSelected = selected.length > 0 && selected.length < rows.length;

    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse">
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
                        <tr><td colSpan={COLUMNS.length + 1} className="px-4 py-10 text-center text-[13px] text-gray-400">Loading...</td></tr>
                    ) : rows.length === 0 ? (
                        <tr><td colSpan={COLUMNS.length + 1} className="px-4 py-10 text-center text-[13px] text-gray-400">No data available</td></tr>
                    ) : rows.map((row, idx) => {
                        const isSelected = selected.includes(row.id);
                        return (
                            <tr key={`${row.id}-${idx}`} className={`transition-colors hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : 'bg-white'}`}>
                                <td className="w-10 px-4 h-[40px] border-b border-[#F3F4F6] align-middle">
                                    <Checkbox checked={isSelected} onChange={() => onSelectRow(row.id)} />
                                </td>
                                <td className={tdClass}>{row.id}</td>
                                <td className={tdClass}>{row.roleName}</td>
                                <td className={tdClass}>{row.description}</td>
                                <td className={tdClass}>{row.admins}</td>
                                <td className={tdClass}><StatusBadge value={row.status} /></td>
                                <td className={`${tdClass} text-right`}>
                                    <div className="flex items-center justify-end gap-1">
                                        <ActionBtn onClick={() => onEdit(row)} title="Edit" colorClass="text-blue-500 hover:text-blue-700 hover:bg-blue-50">
                                            <EditIcon />
                                        </ActionBtn>
                                        <ActionBtn onClick={() => onDelete(row)} title="Delete" colorClass="text-red-400 hover:text-red-600 hover:bg-red-50">
                                            <DeleteIcon />
                                        </ActionBtn>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default RoleTable;