import React from 'react';

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

const buildPageList = (current, total) => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages = new Set([1, total, current - 1, current, current + 1].filter((p) => p >= 1 && p <= total));
    const sorted = [...pages].sort((a, b) => a - b);
    const result = [];
    let prev = null;
    for (const p of sorted) {
        if (prev !== null && p - prev > 1) result.push('...');
        result.push(p);
        prev = p;
    }
    return result;
};

const PageBtn = ({ active, disabled, onClick, children }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`flex items-center justify-center w-8 h-8 text-[13px] rounded-[8px] border transition-colors ${active
            ? 'bg-[#0057ff] border-[#0057ff] text-white font-semibold'
            : disabled
                ? 'border-[#E5E7EB] text-gray-300 bg-white cursor-not-allowed'
                : 'border-[#E5E7EB] text-gray-600 bg-white hover:bg-gray-50'
            }`}
    >
        {children}
    </button>
);

const ChevronLeft = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="15 18 9 12 15 6" />
    </svg>
);

const ChevronRight = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="9 18 15 12 9 6" />
    </svg>
);

const RolePagination = ({ page, pageSize, total, onPageChange, onPageSizeChange }) => {
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
    const to = Math.min(page * pageSize, total);
    const pageList = buildPageList(page, totalPages);

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Left: page size + count */}
            <div className="flex items-center gap-2">
                <div className="relative">
                    <select
                        value={pageSize}
                        onChange={(e) => onPageSizeChange(Number(e.target.value))}
                        className="h-8 pl-3 pr-7 text-[13px] text-gray-700 bg-white border border-[#E5E7EB] rounded-md appearance-none focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                        {PAGE_SIZE_OPTIONS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                    <svg
                        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                        width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    >
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </div>
                <span className="text-[13px] text-gray-500 whitespace-nowrap">
                    Showing {from} to {to} of {total} results
                </span>
            </div>

            {/* Right: page buttons */}
            <div className="flex items-center gap-1 flex-wrap">
                <PageBtn disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
                    <ChevronLeft />
                </PageBtn>
                {pageList.map((p, idx) =>
                    p === '...' ? (
                        <span key={`ellipsis-${idx}`} className="w-8 text-center text-[13px] text-gray-400">...</span>
                    ) : (
                        <PageBtn key={p} active={p === page} onClick={() => onPageChange(p)}>{p}</PageBtn>
                    )
                )}
                <PageBtn disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
                    <ChevronRight />
                </PageBtn>
            </div>
        </div>
    );
};

export default RolePagination;