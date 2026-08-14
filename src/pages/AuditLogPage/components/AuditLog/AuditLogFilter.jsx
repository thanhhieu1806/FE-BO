import React, { useState, useRef, useEffect } from 'react';

/* helpers */
const pad = (n) => String(n).padStart(2, '0');
const formatDisplay = (date) => {
    if (!date) return '';
    return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
};
const sameDay = (a, b) =>
    a && b &&
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear();
const startOfDay = (d) => { const c = new Date(d); c.setHours(0, 0, 0, 0); return c; };
const startOfWeek = (d) => {
    const c = new Date(d); c.setHours(0, 0, 0, 0);
    const day = c.getDay() === 0 ? 6 : c.getDay() - 1;
    c.setDate(c.getDate() - day); return c;
};
const endOfWeek = (d) => { const c = startOfWeek(d); c.setDate(c.getDate() + 6); return c; };
const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
const endOfMonth = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0);

const parseDate = (str) => {
    if (!str) return null;
    const raw = str.trim();
    const withSep = raw.match(/^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{4})$/);
    const noSep = raw.match(/^(\d{2})(\d{2})(\d{4})$/);
    let day, month, year;
    if (withSep) [, day, month, year] = withSep.map(Number);
    else if (noSep) [, day, month, year] = noSep.map(Number);
    else return null;
    if (month < 1 || month > 12 || day < 1 || day > 31 || year < 1900 || year > 2100) return null;
    const d = new Date(year, month - 1, day);
    if (d.getFullYear() !== year || d.getMonth() !== month - 1 || d.getDate() !== day) return null;
    return d;
};

const autoFormat = (next) => {
    const digits = next.replace(/\D/g, '');
    if (digits.length === 0) return '';
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
};

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const buildGrid = (year, month) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    const days = [];
    for (let i = startOffset - 1; i >= 0; i--) days.push({ date: new Date(year, month, -i), inMonth: false });
    for (let d = 1; d <= lastDay.getDate(); d++) days.push({ date: new Date(year, month, d), inMonth: true });
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) days.push({ date: new Date(year, month + 1, d), inMonth: false });
    return days;
};

/* ── Inline DateRangePicker dành riêng cho AuditLogFilter ── */
const AuditDateRangePicker = ({ value = [null, null], onChange }) => {
    const [open, setOpen] = useState(false);
    const [pending, setPending] = useState(value);
    const [picking, setPicking] = useState('start');
    const [hoverDate, setHoverDate] = useState(null);
    const [startText, setStartText] = useState(formatDisplay(value[0]));
    const [endText, setEndText] = useState(formatDisplay(value[1]));
    const [startError, setStartError] = useState(false);
    const [endError, setEndError] = useState(false);
    const [view, setView] = useState(() => {
        const base = value[0] || new Date();
        return { year: base.getFullYear(), month: base.getMonth() };
    });

    const containerRef = useRef(null);
    const endInputRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const v0Time = value[0]?.getTime() ?? null;
    const v1Time = value[1]?.getTime() ?? null;

    useEffect(() => {
        setStartText(formatDisplay(value[0]));
        setEndText(formatDisplay(value[1]));
        setPending(value);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [v0Time, v1Time]);

    const openPicker = (side) => {
        setPicking(side);
        if (!open) {
            setPending(value);
            setStartText(formatDisplay(value[0]));
            setEndText(formatDisplay(value[1]));
            setStartError(false);
            setEndError(false);
            const base = value[0] || new Date();
            setView({ year: base.getFullYear(), month: base.getMonth() });
            setOpen(true);
        }
    };

    const prevMonth = () => setView(v => v.month === 0 ? { year: v.year - 1, month: 11 } : { year: v.year, month: v.month - 1 });
    const nextMonth = () => setView(v => v.month === 11 ? { year: v.year + 1, month: 0 } : { year: v.year, month: v.month + 1 });

    const handleDayClick = (date) => {
        if (picking === 'start') {
            setPending([date, pending[1]]);
            setStartText(formatDisplay(date));
            setStartError(false);
            setPicking('end');
        } else {
            if (pending[0] && date < pending[0]) {
                setPending([date, pending[0]]);
                setStartText(formatDisplay(date));
                setEndText(formatDisplay(pending[0]));
            } else {
                setPending([pending[0], date]);
                setEndText(formatDisplay(date));
            }
            setEndError(false);
            setPicking('start');
        }
    };

    const applyShortcut = (start, end) => {
        setPending([start, end]);
        setStartText(formatDisplay(start));
        setEndText(formatDisplay(end));
        setStartError(false);
        setEndError(false);
        setView({ year: start.getFullYear(), month: start.getMonth() });
        setPicking('start');
    };

    const shortcuts = [
        { label: 'Today', action: () => { const t = startOfDay(new Date()); applyShortcut(t, t); } },
        { label: 'This week', action: () => { const t = new Date(); applyShortcut(startOfWeek(t), endOfWeek(t)); } },
        { label: 'This month', action: () => { const t = new Date(); applyShortcut(startOfMonth(t), endOfMonth(t)); } },
    ];

    const handleConfirm = () => {
        const s = parseDate(startText);
        const e = parseDate(endText);
        const sErr = startText !== '' && !s;
        const eErr = endText !== '' && !e;
        setStartError(sErr);
        setEndError(eErr);
        if (sErr || eErr) return;
        onChange && onChange([s || pending[0], e || pending[1]]);
        setOpen(false);
    };

    const handleReset = () => {
        setPending([null, null]);
        setStartText('');
        setEndText('');
        setStartError(false);
        setEndError(false);
        setPicking('start');
        const today = new Date();
        setView({ year: today.getFullYear(), month: today.getMonth() });
    };

    const handleStartChange = (e) => {
        const formatted = autoFormat(e.target.value);
        setStartText(formatted);
        setStartError(false);
        if (formatted.length === 10) {
            const d = parseDate(formatted);
            if (d) { setPending(([, end]) => [d, end]); setView({ year: d.getFullYear(), month: d.getMonth() }); setTimeout(() => endInputRef.current?.focus(), 0); }
            else setStartError(true);
        }
    };

    const handleEndChange = (e) => {
        const formatted = autoFormat(e.target.value);
        setEndText(formatted);
        setEndError(false);
        if (formatted.length === 10) {
            const d = parseDate(formatted);
            if (d) { setPending(([start]) => [start, d]); setView({ year: d.getFullYear(), month: d.getMonth() }); }
            else setEndError(true);
        }
    };

    const isSelected = (date) => sameDay(date, pending[0]) || sameDay(date, pending[1]);
    const isStart = (date) => sameDay(date, pending[0]);
    const isEnd = (date) => sameDay(date, pending[1]);
    const isHovered = (date) => picking === 'end' && hoverDate && sameDay(date, hoverDate) && !isSelected(date);
    const isInRange = (date) => {
        const [s, e] = pending;
        const effectiveEnd = e || (picking === 'end' && hoverDate) || null;
        if (!s || !effectiveEnd) return false;
        const lo = s < effectiveEnd ? s : effectiveEnd;
        const hi = s < effectiveEnd ? effectiveEnd : s;
        return date > lo && date < hi;
    };

    const grid = buildGrid(view.year, view.month);

    return (
        <div ref={containerRef} className="relative">
            {/* Trigger */}
            <div
                onClick={() => !open && openPicker('start')}
                className={`flex items-center gap-1.5 cursor-pointer rounded-[8px] border bg-white px-3 h-[38px] ${open ? 'border-[#0057FF]' : (startError || endError) ? 'border-red-400' : 'border-[#e5e7eb]'}`}
                style={{ minWidth: 240 }}
            >
                <input
                    value={startText}
                    placeholder="DD/MM/YYYY"
                    onChange={handleStartChange}
                    onFocus={() => openPicker('start')}
                    onClick={(e) => e.stopPropagation()}
                    maxLength={10}
                    className={`border-0 bg-transparent text-[13px] font-normal outline-none cursor-text ${startError ? 'text-red-500' : 'text-[#1f2937]'} placeholder-[#9ca3af]`}
                    style={{ width: 85, WebkitUserSelect: 'text', userSelect: 'text' }}
                />
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0 text-[#9ca3af] pointer-events-none">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <input
                    ref={endInputRef}
                    value={endText}
                    placeholder="DD/MM/YYYY"
                    onChange={handleEndChange}
                    onFocus={() => openPicker('end')}
                    onClick={(e) => e.stopPropagation()}
                    maxLength={10}
                    className={`border-0 bg-transparent text-[13px] font-normal outline-none cursor-text ${endError ? 'text-red-500' : 'text-[#1f2937]'} placeholder-[#9ca3af]`}
                    style={{ width: 85, WebkitUserSelect: 'text', userSelect: 'text' }}
                />
                <svg
                    width="15" height="15" viewBox="0 0 24 24" fill="none"
                    className="shrink-0 ml-auto text-[#9ca3af] cursor-pointer hover:text-[#0057FF] transition-colors"
                    onClick={(e) => { e.stopPropagation(); open ? setOpen(false) : openPicker('start'); }}
                >
                    <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            </div>

            {/* Dropdown calendar */}
            {open && (
                <div className="absolute left-0 top-[44px] z-50 w-[300px] rounded-xl border border-gray-200 bg-white shadow-xl select-none">
                    {(startError || endError) && (
                        <p className="px-4 pt-3 pb-1 text-[11px] text-red-500">
                            {startError && endError ? 'Ngày không hợp lệ' : startError ? 'Ngày bắt đầu không hợp lệ' : 'Ngày kết thúc không hợp lệ'}
                        </p>
                    )}

                    {/* Month nav */}
                    <div className="flex items-center justify-between px-4 pt-3 pb-2">
                        <button onClick={prevMonth} className="flex h-7 w-7 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-colors">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </button>
                        <span className="text-[14px] font-semibold text-gray-800">{MONTH_NAMES[view.month]} {view.year}</span>
                        <button onClick={nextMonth} className="flex h-7 w-7 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-colors">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </button>
                    </div>

                    {/* Day headers */}
                    <div className="grid grid-cols-7 px-3 pb-1">
                        {DAY_LABELS.map(d => (
                            <div key={d} className="py-1 text-center text-[11px] font-semibold text-gray-500">{d}</div>
                        ))}
                    </div>

                    {/* Day grid */}
                    <div className="grid grid-cols-7 px-3 pb-2">
                        {grid.map(({ date, inMonth }, i) => {
                            const sel = isSelected(date);
                            const inRng = isInRange(date);
                            const start = isStart(date);
                            const end = isEnd(date);
                            const hovered = isHovered(date);
                            return (
                                <div
                                    key={i}
                                    className="relative flex h-9 items-center justify-center"
                                    onMouseEnter={() => picking === 'end' && setHoverDate(date)}
                                    onMouseLeave={() => setHoverDate(null)}
                                >
                                    {inRng && <div className="absolute inset-y-1 inset-x-0 bg-[#EEF4FF]" />}
                                    {start && pending[1] && <div className="absolute inset-y-1 right-0 left-1/2 bg-[#EEF4FF]" />}
                                    {end && pending[0] && <div className="absolute inset-y-1 left-0 right-1/2 bg-[#EEF4FF]" />}
                                    <button
                                        onClick={() => handleDayClick(date)}
                                        className={[
                                            'relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-[12px] transition-colors cursor-pointer',
                                            sel ? 'bg-[#0057FF] text-white font-bold'
                                                : hovered ? 'border border-[#0057FF] text-gray-800'
                                                    : inMonth ? 'text-gray-800 hover:bg-gray-100'
                                                        : 'text-gray-300 hover:bg-gray-100',
                                        ].join(' ')}
                                    >
                                        {date.getDate()}
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    {/* Shortcuts */}
                    <div className="flex justify-center gap-5 border-t border-gray-100 px-4 py-3">
                        {shortcuts.map(s => (
                            <button key={s.label} onClick={s.action} className="text-[12px] font-medium text-[#0057FF] hover:opacity-70 transition-opacity">
                                {s.label}
                            </button>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-4 py-3">
                        <button onClick={handleReset} className="text-[12px] font-semibold text-gray-700 hover:text-gray-500 transition-colors">Reset</button>
                        <button onClick={handleConfirm} className="rounded-lg bg-[#0057FF] px-4 py-1.5 text-[12px] font-semibold text-white hover:bg-[#004FE8] transition-colors">Confirm</button>
                    </div>
                </div>
            )}
        </div>
    );
};

/* ── Options ── */
const COMPANY_OPTIONS = [
    { value: '', label: 'All companies' },
    { value: 'MOBILE-ID TECH', label: 'MOBILE-ID TECH' },
    { value: 'DIGITAL WAVE SOLUTIONS', label: 'DIGITAL WAVE SOLUTIONS' },
    { value: 'NEXGEN SOFTWARE INC.', label: 'NEXGEN SOFTWARE INC.' },
];
const ACTION_OPTIONS = [
    { value: '', label: 'All actions' },
    { value: 'Create', label: 'Create' },
    { value: 'Update', label: 'Update' },
    { value: 'Delete', label: 'Delete' },
    { value: 'Login', label: 'Login' },
];
const MODULE_OPTIONS = [
    { value: '', label: 'All modules' },
    { value: 'Company', label: 'Company' },
    { value: 'Connectors', label: 'Connectors' },
    { value: 'Email templates', label: 'Email templates' },
];

const ChevronDown = () => (
    <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

const selectClass = 'w-full h-[38px] pl-3 pr-8 text-[13px] text-[#1f2937] bg-white border border-[#e5e7eb] rounded-[8px] appearance-none cursor-pointer focus:outline-none focus:border-blue-500';

/* ── Main Filter Component ── */
const AuditLogFilter = ({
    dateRange, onDateRangeChange,
    companyFilter, onCompanyChange,
    actionFilter, onActionChange,
    moduleFilter, onModuleChange,
}) => (
    <div className="flex flex-wrap items-center gap-3">
        <AuditDateRangePicker value={dateRange} onChange={onDateRangeChange} />

        <div className="relative flex-1 min-w-[150px]">
            <select value={companyFilter} onChange={(e) => onCompanyChange(e.target.value)} className={selectClass}>
                {COMPANY_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <ChevronDown />
        </div>

        <div className="relative flex-1 min-w-[130px]">
            <select value={actionFilter} onChange={(e) => onActionChange(e.target.value)} className={selectClass}>
                {ACTION_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <ChevronDown />
        </div>

        <div className="relative flex-1 min-w-[130px]">
            <select value={moduleFilter} onChange={(e) => onModuleChange(e.target.value)} className={selectClass}>
                {MODULE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <ChevronDown />
        </div>
    </div>
);

export default AuditLogFilter;