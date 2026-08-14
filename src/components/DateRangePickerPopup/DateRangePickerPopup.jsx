import React, { useState, useRef, useEffect } from 'react';

/* ── Helpers ── */
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

const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const buildGrid = (year, month) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDayIndex = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    const totalCells = Math.ceil((startDayIndex + lastDay.getDate()) / 7) * 7;
    const grid = [];
    const startDate = new Date(year, month, 1 - startDayIndex);
    for (let i = 0; i < totalCells; i++) {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);
        grid.push({
            date: d,
            inMonth: d.getMonth() === month,
        });
    }
    return grid;
};

const CalendarIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M3 10h18M8 3v4M16 3v4" strokeLinecap="round" />
    </svg>
);

const DateRangePickerPopup = ({
    fromDate,
    toDate,
    onFromChange,
    onToChange,
}) => {
    const [open, setOpen] = useState(false);
    const [startText, setStartText] = useState(fromDate || '');
    const [endText, setEndText] = useState(toDate || '');
    const [pending, setPending] = useState([parseDate(fromDate), parseDate(toDate)]);
    const [picking, setPicking] = useState('start');
    const [hoverDate, setHoverDate] = useState(null);
    const [startError, setStartError] = useState(false);
    const [endError, setEndError] = useState(false);

    const today = new Date();
    const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() });
    const containerRef = useRef(null);
    const endInputRef = useRef(null);

    useEffect(() => {
        setStartText(fromDate || '');
        setEndText(toDate || '');
        setPending([parseDate(fromDate), parseDate(toDate)]);
    }, [fromDate, toDate]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const openPicker = (mode = 'start') => {
        setPicking(mode);
        const s = parseDate(startText);
        const e = parseDate(endText);
        setPending([s, e]);
        const refDate = (mode === 'start' ? s : e) || s || new Date();
        setView({ year: refDate.getFullYear(), month: refDate.getMonth() });
        setOpen(true);
    };

    const prevMonth = () => {
        setView(({ year, month }) => month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 });
    };

    const nextMonth = () => {
        setView(({ year, month }) => month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 });
    };

    const handleDateClick = (date) => {
        if (picking === 'start') {
            setPending([date, null]);
            setStartText(formatDisplay(date));
            setEndText('');
            setStartError(false);
            setPicking('end');
        } else {
            const start = pending[0];
            let s = start, e = date;
            if (start && date < start) { s = date; e = start; }
            setPending([s, e]);
            setStartText(formatDisplay(s));
            setEndText(formatDisplay(e));
            setEndError(false);
            setPicking('start');
        }
    };

    const handleConfirm = () => {
        const s = parseDate(startText);
        const e = parseDate(endText);
        const sErr = startText !== '' && !s;
        const eErr = endText !== '' && !e;
        setStartError(sErr);
        setEndError(eErr);
        if (sErr || eErr) return;
        onFromChange && onFromChange(startText);
        onToChange && onToChange(endText);
        setOpen(false);
    };

    const handleReset = () => {
        setPending([null, null]);
        setStartText('');
        setEndText('');
        setStartError(false);
        setEndError(false);
        setPicking('start');
        onFromChange && onFromChange('');
        onToChange && onToChange('');
        const now = new Date();
        setView({ year: now.getFullYear(), month: now.getMonth() });
    };

    const handleStartChange = (e) => {
        const formatted = autoFormat(e.target.value);
        setStartText(formatted);
        setStartError(false);
        if (formatted.length === 10) {
            const d = parseDate(formatted);
            if (d) {
                setPending(([, end]) => [d, end]);
                setView({ year: d.getFullYear(), month: d.getMonth() });
                setTimeout(() => endInputRef.current?.focus(), 0);
            } else setStartError(true);
        }
    };

    const handleEndChange = (e) => {
        const formatted = autoFormat(e.target.value);
        setEndText(formatted);
        setEndError(false);
        if (formatted.length === 10) {
            const d = parseDate(formatted);
            if (d) {
                setPending(([start]) => [start, d]);
                setView({ year: d.getFullYear(), month: d.getMonth() });
            } else setEndError(true);
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

    const shortcuts = [
        {
            label: 'Today',
            action: () => {
                const t = startOfDay(new Date());
                setPending([t, t]);
                setStartText(formatDisplay(t));
                setEndText(formatDisplay(t));
                setView({ year: t.getFullYear(), month: t.getMonth() });
            },
        },
        {
            label: 'This week',
            action: () => {
                const now = new Date();
                const s = startOfWeek(now);
                const e = endOfWeek(now);
                setPending([s, e]);
                setStartText(formatDisplay(s));
                setEndText(formatDisplay(e));
                setView({ year: s.getFullYear(), month: s.getMonth() });
            },
        },
        {
            label: 'This month',
            action: () => {
                const now = new Date();
                const s = startOfMonth(now);
                const e = endOfMonth(now);
                setPending([s, e]);
                setStartText(formatDisplay(s));
                setEndText(formatDisplay(e));
                setView({ year: s.getFullYear(), month: s.getMonth() });
            },
        },
    ];

    const grid = buildGrid(view.year, view.month);

    return (
        <div ref={containerRef} className="relative">
            {/* Trigger Bar */}
            <div
                onClick={() => !open && openPicker('start')}
                className={`flex items-center gap-1.5 cursor-pointer rounded-[8px] border bg-white px-3 h-[38px] transition-colors ${open ? 'border-[#0057ff] ring-1 ring-[#0057ff]/20' : (startError || endError) ? 'border-red-400' : 'border-[#e5e7eb] hover:border-gray-300'
                    }`}
                style={{ minWidth: 230 }}
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
                <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); open ? setOpen(false) : openPicker('start'); }}
                    className="shrink-0 ml-auto text-[#9ca3af] hover:text-[#0057ff] transition-colors"
                >
                    <CalendarIcon />
                </button>
            </div>

            {/* Popup Calendar Dropdown */}
            {open && (
                <div
                    className="absolute left-0 top-[44px] z-50 w-[310px] rounded-[12px] bg-white border border-[#e5e7eb] shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                >
                    {/* Top input display */}
                    <div className="p-3 border-b border-[#e5e7eb] bg-[#f8f9fb]">
                        <div className="flex items-center justify-between rounded-[8px] border border-[#e5e7eb] bg-white px-3 py-1.5 text-[13px]">
                            <span className="text-[#374151] font-medium">{startText || 'DD/MM/YYYY'}</span>
                            <span className="text-[#9ca3af]">→</span>
                            <span className="text-[#374151] font-medium">{endText || 'DD/MM/YYYY'}</span>
                            <span className="text-[#9ca3af]"><CalendarIcon /></span>
                        </div>
                    </div>

                    {/* Month/Year Navigation */}
                    <div className="flex items-center justify-between px-4 pt-3 pb-2">
                        <button
                            type="button"
                            onClick={prevMonth}
                            className="p-1 text-gray-500 hover:text-gray-800 rounded-md hover:bg-gray-100 transition-colors"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="15 18 9 12 15 6" />
                            </svg>
                        </button>
                        <span className="text-[14px] font-bold text-[#111827]">
                            {MONTH_NAMES[view.month]} {view.year}
                        </span>
                        <button
                            type="button"
                            onClick={nextMonth}
                            className="p-1 text-gray-500 hover:text-gray-800 rounded-md hover:bg-gray-100 transition-colors"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </button>
                    </div>

                    {/* Day Labels */}
                    <div className="grid grid-cols-7 px-3 text-center mb-1">
                        {DAY_LABELS.map((d) => (
                            <span key={d} className="text-[12px] font-semibold text-[#6b7280] py-1">
                                {d}
                            </span>
                        ))}
                    </div>

                    {/* Dates Grid */}
                    <div className="grid grid-cols-7 px-3 pb-3 gap-y-1">
                        {grid.map(({ date, inMonth }, i) => {
                            const sel = isSelected(date);
                            const startPt = isStart(date);
                            const endPt = isEnd(date);
                            const inRange = isInRange(date);
                            const hovered = isHovered(date);

                            return (
                                <div
                                    key={i}
                                    className={`relative flex items-center justify-center h-8 ${inRange ? 'bg-[#0057ff]/10' : ''
                                        } ${startPt && pending[1] ? 'rounded-l-full bg-[#0057ff]/10' : ''
                                        } ${endPt && pending[0] ? 'rounded-r-full bg-[#0057ff]/10' : ''
                                        }`}
                                >
                                    <button
                                        type="button"
                                        onClick={() => handleDateClick(date)}
                                        onMouseEnter={() => setHoverDate(date)}
                                        className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-[12px] transition-colors ${sel ? 'bg-[#0057ff] text-white font-bold'
                                            : hovered ? 'border border-[#0057ff] text-gray-800'
                                                : inMonth ? 'text-gray-800 hover:bg-gray-100'
                                                    : 'text-gray-300 hover:bg-gray-100'
                                            }`}
                                    >
                                        {date.getDate()}
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    {/* Shortcuts */}
                    <div className="flex justify-center gap-5 border-t border-[#e5e7eb] px-4 py-2.5 bg-white">
                        {shortcuts.map((s) => (
                            <button
                                key={s.label}
                                type="button"
                                onClick={s.action}
                                className="text-[12px] font-medium text-[#0057ff] hover:underline transition-all"
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between border-t border-[#e5e7eb] px-4 py-3 bg-white">
                        <button
                            type="button"
                            onClick={handleReset}
                            className="text-[13px] font-medium text-[#4b5563] hover:text-[#111827] transition-colors"
                        >
                            Reset
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirm}
                            className="rounded-[8px] bg-[#0057ff] px-5 py-1.5 text-[13px] font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DateRangePickerPopup;
