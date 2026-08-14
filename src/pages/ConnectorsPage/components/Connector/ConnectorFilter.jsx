import React from 'react';

const PROVIDER_OPTIONS = [
    { value: '', label: 'All provider' },
    { value: 'BILLING_SERVICE', label: 'BILLING_SERVICE' },
    { value: 'SHARING_VNEID_SERVICE', label: 'SHARING_VNEID_SERVICE' },
    { value: 'SMS_SERVER', label: 'SMS_SERVER' },
    { value: 'USB_TOKEN_SIGNING', label: 'USB_TOKEN_SIGNING' },
    { value: 'SMART_ID_SIGNING', label: 'SMART_ID_SIGNING' },
    { value: 'IAM_SERVICE', label: 'IAM_SERVICE' },
    { value: 'SMTP_SERVER', label: 'SMTP_SERVER' },
    { value: 'IDENTITY', label: 'IDENTITY' },
    { value: 'INTERNAL_SIGNING_SERVICE', label: 'INTERNAL_SIGNING_SERVICE' },
];

const STATUS_OPTIONS = [
    { value: '', label: 'All statuses' },
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
];

const ChevronDown = () => (
    <svg
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
        width="14" height="14" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2"
    >
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

const ConnectorFilter = ({
    search, onSearchChange,
    providerFilter, onProviderChange,
    statusFilter, onStatusChange,
}) => (
    <div className="w-full overflow-x-auto">
        <div className="flex items-center min-w-[860px] gap-2">

            {/* Search - chiếm ~50% */}
            <div className="relative" style={{ flex: '0 0 50%' }}>
                <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    width="15" height="15" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2"
                >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                    type="text"
                    placeholder="Search"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full h-[36px] pl-9 pr-3 text-[13px] text-[#1f2937] bg-white border border-[#e5e7eb] rounded-[6px] focus:outline-none focus:border-blue-400 placeholder-gray-400"
                />
            </div>

            {/* Provider filter - chiếm ~25% */}
            <div className="relative" style={{ flex: '0 0 calc(25% - 4px)' }}>
                <select
                    value={providerFilter}
                    onChange={(e) => onProviderChange(e.target.value)}
                    className="w-full h-[36px] pl-3 pr-8 text-[13px] text-[#1f2937] font-normal bg-white border border-[#e5e7eb] rounded-[6px] appearance-none cursor-pointer focus:outline-none focus:border-blue-400"
                >
                    {PROVIDER_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
                <ChevronDown />
            </div>

            {/* Status filter - chiếm ~25% */}
            <div className="relative" style={{ flex: '0 0 calc(25% - 4px)' }}>
                <select
                    value={statusFilter}
                    onChange={(e) => onStatusChange(e.target.value)}
                    className="w-full h-[36px] pl-3 pr-8 text-[13px] text-[#1f2937] font-normal bg-white border border-[#e5e7eb] rounded-[6px] appearance-none cursor-pointer focus:outline-none focus:border-blue-400"
                >
                    {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
                <ChevronDown />
            </div>

        </div>
    </div>
);

export default ConnectorFilter;