import React from 'react';

const PERM_KEYS = ['view', 'create', 'edit', 'delete', 'export'];
const PERM_LABELS = { view: 'View', create: 'Create', edit: 'Edit', delete: 'Delete', export: 'Export' };

const PermCheckbox = ({ value, onChange }) => {
    if (value === null) {
        return <span className="text-[13px] text-[#9ca3af]">-</span>;
    }
    return (
        <label className="relative inline-flex items-center justify-center cursor-pointer shrink-0">
            <input
                type="checkbox"
                checked={value}
                onChange={onChange}
                className="sr-only"
            />
            <div
                style={{
                    width: '20px',
                    height: '20px',
                    minWidth: '20px',
                    minHeight: '20px',
                    borderRadius: '4px',
                    borderWidth: '1.5px',
                    borderStyle: 'solid',
                    boxSizing: 'border-box',
                }}
                className={`flex shrink-0 items-center justify-center transition-colors duration-150 ${value
                        ? 'bg-[#0057ff] border-[#0057ff]'
                        : 'bg-white border-[#d1d5db] hover:border-[#0057ff]'
                    }`}
            >
                {value && (
                    <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                        <path
                            d="M1.5 4.5L4 7L9.5 1.5"
                            stroke="white"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                )}
            </div>
        </label>
    );
};

const RolePermissionsTable = ({ permissions, onChange }) => (
    <div className="overflow-x-auto">
        <table className="w-full border-collapse">
            <thead>
                <tr style={{ backgroundColor: '#f5f8ff' }} className="border-b border-[#E5E7EB]">
                    <th className="px-4 h-[40px] text-left text-[13px] font-bold text-[#111827] w-[220px]">Module</th>
                    {PERM_KEYS.map((key) => (
                        <th key={key} className="px-4 h-[40px] text-left text-[13px] font-bold text-[#111827] w-[120px]">
                            {PERM_LABELS[key]}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {permissions.map((row, rowIdx) => (
                    <tr key={row.module} className="hover:bg-gray-50 border-b border-[#F3F4F6]">
                        <td className="px-4 h-[44px] text-[13px] text-[#1f2937] font-normal align-middle">
                            {row.module}
                        </td>
                        {PERM_KEYS.map((key) => (
                            <td key={key} className="px-4 h-[44px] align-middle">
                                <div className="flex items-center h-full">
                                    <PermCheckbox
                                        value={row[key]}
                                        onChange={() => onChange(rowIdx, key)}
                                    />
                                </div>
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export default RolePermissionsTable;
