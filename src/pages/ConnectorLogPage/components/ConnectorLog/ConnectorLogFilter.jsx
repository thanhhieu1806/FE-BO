import React from 'react';
import DateRangePickerPopup from '../../../../components/DateRangePickerPopup/DateRangePickerPopup';

const COMPANY_OPTIONS = [
    { value: '', label: 'All companies' },
    { value: 'MOBILE_ID_IDENTIFICATION', label: 'MOBILE_ID_IDENTIFICATION' },
    { value: 'DMS_MOBILE_ID', label: 'DMS_MOBILE_ID' },
    { value: 'GENERAL_SMS', label: 'GENERAL_SMS' },
    { value: 'MOBILE_ID_IAM', label: 'MOBILE_ID_IAM' },
];

const METHOD_OPTIONS = [
    { value: '', label: 'All methods' },
    { value: 'GET', label: 'GET' },
    { value: 'POST', label: 'POST' },
    { value: 'PUT', label: 'PUT' },
    { value: 'DELETE', label: 'DELETE' },
    { value: 'PATCH', label: 'PATCH' },
];

const SearchIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);



const ConnectorLogFilter = ({
    searchTerm,
    onSearchChange,
    dateFrom,
    dateTo,
    onDateFromChange,
    onDateToChange,
    companyFilter,
    onCompanyChange,
    methodFilter,
    onMethodChange,
}) => {
    return (
        <div className="flex flex-wrap items-center gap-3 mb-4">
            {/* Search input */}
            <div className="relative min-w-[200px] flex-1 sm:flex-none sm:w-[240px]">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <SearchIcon />
                </span>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search"
                    className="w-full h-[38px] pl-9 pr-3 text-[13.5px] text-[#1f2937] bg-white border border-[#e5e7eb] rounded-[8px] focus:outline-none focus:border-[#0057ff] placeholder-[#9ca3af]"
                />
            </div>

            {/* Interactive Date range picker popup */}
            <DateRangePickerPopup
                fromDate={dateFrom}
                toDate={dateTo}
                onFromChange={onDateFromChange}
                onToChange={onDateToChange}
            />

            {/* Company dropdown */}
            <div className="relative flex-1 min-w-[160px]">
                <select
                    value={companyFilter}
                    onChange={(e) => onCompanyChange(e.target.value)}
                    className="w-full h-[38px] px-3 pr-8 text-[13.5px] text-[#374151] bg-white border border-[#e5e7eb] rounded-[8px] focus:outline-none focus:border-[#0057ff] appearance-none cursor-pointer"
                >
                    {COMPANY_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#6b7280]">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </span>
            </div>

            {/* Method dropdown */}
            <div className="relative flex-1 min-w-[140px]">
                <select
                    value={methodFilter}
                    onChange={(e) => onMethodChange(e.target.value)}
                    className="w-full h-[38px] px-3 pr-8 text-[13.5px] text-[#374151] bg-white border border-[#e5e7eb] rounded-[8px] focus:outline-none focus:border-[#0057ff] appearance-none cursor-pointer"
                >
                    {METHOD_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#6b7280]">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </span>
            </div>
        </div>
    );
};

export default ConnectorLogFilter;
