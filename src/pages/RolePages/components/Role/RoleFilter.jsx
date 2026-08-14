import React from 'react';

const STATUS_OPTIONS = [
    { value: '', label: 'All statuses' },
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
];

const RoleFilter = ({ search, onSearchChange, statusFilter, onStatusChange }) => (
    <div className="flex gap-2 w-full">

        <div className="relative w-1/2">
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
                type="text"
                placeholder="Search role name..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full h-9 pl-8 pr-3 text-[13px] text-gray-800 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-400 placeholder-gray-400"
            />
        </div>

        <div className="relative w-1/2">
            <select
                value={statusFilter}
                onChange={(e) => onStatusChange(e.target.value)}
                className="w-full h-9 pl-3 pr-8 text-[13px] text-gray-800 bg-white border border-gray-200 rounded-md appearance-none cursor-pointer focus:outline-none focus:border-blue-400"
            >
                {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
            </svg>
        </div>

    </div>
);

export default RoleFilter;