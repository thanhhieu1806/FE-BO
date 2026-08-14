import React from 'react';

const ApiLogPagination = ({
    total,
    page,
    pageSize,
    onPageChange,
    onPageSizeChange,
}) => {
    const totalPages = Math.ceil(total / pageSize) || 1;
    const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, total);

    return (
        <div className="flex items-center justify-between mt-4 px-2">
            {/* Rows per page dropdown + result text */}
            <div className="flex items-center gap-3">
                <div className="relative">
                    <select
                        value={pageSize}
                        onChange={(e) => onPageSizeChange(Number(e.target.value))}
                        className="h-[32px] px-3 pr-7 text-[13px] text-[#374151] bg-white border border-[#e5e7eb] rounded-[6px] focus:outline-none focus:border-[#0057ff] appearance-none cursor-pointer"
                    >
                        {[10, 20, 50, 100].map((size) => (
                            <option key={size} value={size}>{size}</option>
                        ))}
                    </select>
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#6b7280]">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </span>
                </div>
                <span className="text-[13px] text-[#6b7280]">
                    Showing {start} to {end} of {total} results
                </span>
            </div>

            {/* Pagination buttons */}
            <div className="flex items-center gap-1">
                <button
                    type="button"
                    onClick={() => onPageChange(page - 1)}
                    disabled={page <= 1}
                    className="w-[32px] h-[32px] flex items-center justify-center rounded-[6px] border border-[#e5e7eb] bg-white text-[#374151] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                        key={p}
                        type="button"
                        onClick={() => onPageChange(p)}
                        className={`w-[32px] h-[32px] text-[13px] font-medium rounded-[6px] transition-colors ${p === page
                            ? 'bg-[#0057ff] text-white'
                            : 'bg-white border border-[#e5e7eb] text-[#374151] hover:bg-gray-50'
                            }`}
                    >
                        {p}
                    </button>
                ))}
                <button
                    type="button"
                    onClick={() => onPageChange(page + 1)}
                    disabled={page >= totalPages}
                    className="w-[32px] h-[32px] flex items-center justify-center rounded-[6px] border border-[#e5e7eb] bg-white text-[#374151] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default ApiLogPagination;
