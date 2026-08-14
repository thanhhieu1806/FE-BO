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

/* FIX 1: bỏ escape không cần thiết \/ và \. trong character class */
const parseDate = (str) => {
    if (!str) return null;
    const raw = str.trim();
    let day, month, year;
    // [/-.]  thay vì  [\/\-\.]
    const withSep = raw.match(/^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{4})$/);
    const noSep = raw.match(/^(\d{2})(\d{2})(\d{4})$/);

    if (withSep) {
        [, day, month, year] = withSep.map(Number);
    } else if (noSep) {
        [, day, month, year] = noSep.map(Number);
    } else {
        return null;
    }

    if (month < 1 || month > 12) return null;
    if (day < 1 || day > 31) return null;
    if (year < 1900 || year > 2100) return null;

    const d = new Date(year, month - 1, day);
    if (d.getFullYear() !== year || d.getMonth() !== month - 1 || d.getDate() !== day) return null;
    return d;
};

const autoFormat = (_prev, next) => {
    const digits = next.replace(/\D/g, '');
    if (digits.length === 0) return '';
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
};

const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const buildGrid = (year, month) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    const days = [];
    for (let i = startOffset - 1; i >= 0; i--)
        days.push({ date: new Date(year, month, -i), inMonth: false });
    for (let d = 1; d <= lastDay.getDate(); d++)
        days.push({ date: new Date(year, month, d), inMonth: true });
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++)
        days.push({ date: new Date(year, month + 1, d), inMonth: false });
    return days;
};

const DateRangePicker = ({
    value = [null, null],
    onChange,
    onClose,
    inline = false,
    placeholder = { start: 'DD/MM/YYYY', end: 'DD/MM/YYYY' },
}) => {
    const [open, setOpen] = useState(inline);
    const [pending, setPending] = useState(value);
    const [picking, setPicking] = useState('start');
    const [hoverDate, setHoverDate] = useState(null);
    const [startText, setStartText] = useState(formatDisplay(value[0]));
    const [endText, setEndText] = useState(formatDisplay(value[1]));
    const [startError, setStartError] = useState(false);
    const [endError, setEndError] = useState(false);

    const initView = () => {
        const base = value[0] || new Date();
        return { year: base.getFullYear(), month: base.getMonth() };
    };
    const [view, setView] = useState(initView);

    const containerRef = useRef(null);
    const startInputRef = useRef(null);
    const endInputRef = useRef(null);

    /* click-outside đóng dropdown */
    useEffect(() => {
        const handler = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                if (!inline) setOpen(false);
                if (onClose) onClose();
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [inline, onClose]);

    /* sync khi value prop thay đổi từ ngoài */
    useEffect(() => {
        setStartText(formatDisplay(value[0]));
        setEndText(formatDisplay(value[1]));
        setPending(value);
        setStartError(false);
        setEndError(false);
    }, [value]);

    /* FIX 2: xoá openPicker không dùng, inline logic vào onFocus */
    const syncOpenState = (side) => {
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

    const prevMonth = () => setView(v =>
        v.month === 0 ? { year: v.year - 1, month: 11 } : { year: v.year, month: v.month - 1 }
    );
    const nextMonth = () => setView(v =>
        v.month === 11 ? { year: v.year + 1, month: 0 } : { year: v.year, month: v.month + 1 }
    );

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
        const finalStart = s || pending[0];
        const finalEnd = e || pending[1];
        onChange && onChange([finalStart, finalEnd]);
        if (!inline) setOpen(false);
        if (onClose) onClose();
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

    /* nhập tay */
    const handleStartChange = (e) => {
        const formatted = autoFormat(startText, e.target.value);
        setStartText(formatted);
        setStartError(false);
        if (formatted.length === 10) {
            const d = parseDate(formatted);
            if (d) {
                setPending(([, end]) => [d, end]);
                setView({ year: d.getFullYear(), month: d.getMonth() });
                setTimeout(() => endInputRef.current?.focus(), 0);
            } else {
                setStartError(true);
            }
        }
    };

    const handleEndChange = (e) => {
        const formatted = autoFormat(endText, e.target.value);
        setEndText(formatted);
        setEndError(false);
        if (formatted.length === 10) {
            const d = parseDate(formatted);
            if (d) {
                setPending(([start]) => [start, d]);
                setView({ year: d.getFullYear(), month: d.getMonth() });
            } else {
                setEndError(true);
            }
        }
    };

    const handleStartBlur = () => {
        if (!startText) { setPending(([, end]) => [null, end]); setStartError(false); return; }
        const d = parseDate(startText);
        if (d) {
            setStartText(formatDisplay(d));
            setPending(([, end]) => [d, end]);
            setView({ year: d.getFullYear(), month: d.getMonth() });
            setStartError(false);
        } else {
            setStartError(true);
        }
    };

    const handleEndBlur = () => {
        if (!endText) { setPending(([start]) => [start, null]); setEndError(false); return; }
        const d = parseDate(endText);
        if (d) {
            setEndText(formatDisplay(d));
            setPending(([start]) => [start, d]);
            setView({ year: d.getFullYear(), month: d.getMonth() });
            setEndError(false);
        } else {
            setEndError(true);
        }
    };

    const handleStartKeyDown = (e) => {
        if (e.key === 'Enter') { handleStartBlur(); endInputRef.current?.focus(); }
    };

    const handleEndKeyDown = (e) => {
        if (e.key === 'Enter') { handleEndBlur(); handleConfirm(); }
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
        <div ref={containerRef} className="relative select-none">
            {/* ── Trigger: 300×40 theo Figma, không render nếu inline=true ── */}
            {!inline && (
                <div
                    onClick={() => !open && syncOpenState('start')}
                    className={`flex items-center gap-1 cursor-pointer rounded-md border bg-white px-3
                        ${open
                            ? 'border-[#0057FF]'
                            : (startError || endError)
                                ? 'border-red-400'
                                : 'border-[#E5E7EB]'
                        }`}
                    style={{ width: 300, height: 40 }}
                >
                    {/* Start input */}
                    <input
                        ref={startInputRef}
                        value={startText}
                        placeholder={placeholder.start}
                        onChange={handleStartChange}
                        onFocus={() => syncOpenState('start')}
                        onBlur={handleStartBlur}
                        onKeyDown={handleStartKeyDown}
                        onClick={(e) => e.stopPropagation()}
                        maxLength={10}
                        className={`min-w-0 flex-1 border-0 bg-transparent text-[14px] font-normal outline-none cursor-text
                            ${startError ? 'text-red-500' : 'text-[#1F2937]'} placeholder-[#9CA3AF]`}
                        style={{ WebkitUserSelect: 'text', userSelect: 'text' }}
                    />

                    {/* Arrow icon */}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0 text-[#9CA3AF] pointer-events-none">
                        <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>

                    {/* End input */}
                    <input
                        ref={endInputRef}
                        value={endText}
                        placeholder={placeholder.end}
                        onChange={handleEndChange}
                        onFocus={() => syncOpenState('end')}
                        onBlur={handleEndBlur}
                        onKeyDown={handleEndKeyDown}
                        onClick={(e) => e.stopPropagation()}
                        maxLength={10}
                        className={`min-w-0 flex-1 border-0 bg-transparent text-[14px] font-normal outline-none cursor-text
                            ${endError ? 'text-red-500' : 'text-[#1F2937]'} placeholder-[#9CA3AF]`}
                        style={{ WebkitUserSelect: 'text', userSelect: 'text' }}
                    />

                    {/* Calendar icon */}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0 text-[#9CA3AF] pointer-events-none">
                        <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </div>
            )}

            {/* ── Dropdown Calendar Panel ── */}
            {(open || inline) && (
                <div className={inline ? "relative z-50 w-[min(310px,calc(100vw-24px))] rounded-xl border border-gray-200 bg-white shadow-xl" : "absolute right-0 top-[44px] z-50 w-[min(310px,calc(100vw-24px))] rounded-xl border border-gray-200 bg-white shadow-xl"}>
                    {/* Inline header inputs */}
                    {inline && (
                        <div className="flex items-center gap-1 border-b border-gray-100 px-3 py-2">
                            <input
                                ref={startInputRef}
                                value={startText}
                                placeholder={placeholder.start}
                                onChange={handleStartChange}
                                onBlur={handleStartBlur}
                                onKeyDown={handleStartKeyDown}
                                maxLength={10}
                                className={`min-w-0 flex-1 border-0 bg-transparent text-[13px] font-normal outline-none ${startError ? 'text-red-500' : 'text-[#1F2937]'} placeholder-[#9CA3AF]`}
                            />
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="shrink-0 text-[#9CA3AF]">
                                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <input
                                ref={endInputRef}
                                value={endText}
                                placeholder={placeholder.end}
                                onChange={handleEndChange}
                                onBlur={handleEndBlur}
                                onKeyDown={handleEndKeyDown}
                                maxLength={10}
                                className={`min-w-0 flex-1 border-0 bg-transparent text-[13px] font-normal outline-none ${endError ? 'text-red-500' : 'text-[#1F2937]'} placeholder-[#9CA3AF]`}
                            />
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0 text-[#9CA3AF]">
                                <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </div>
                    )}

                    {/* Thông báo lỗi */}
                    {(startError || endError) && (
                        <p className="px-4 pt-3 pb-1 text-[11px] text-red-500">
                            {startError && endError
                                ? 'Ngày không hợp lệ (DD/MM/YYYY)'
                                : startError
                                    ? 'Ngày bắt đầu không hợp lệ'
                                    : 'Ngày kết thúc không hợp lệ'}
                        </p>
                    )}

                    {/* Month nav */}
                    <div className="flex items-center justify-between px-4 pt-3 pb-2">
                        <button onClick={prevMonth} className="flex h-7 w-7 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-colors">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        <span className="text-[15px] font-semibold text-gray-800">
                            {MONTH_NAMES[view.month]} {view.year}
                        </span>
                        <button onClick={nextMonth} className="flex h-7 w-7 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-colors">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>

                    {/* Day headers */}
                    <div className="grid grid-cols-7 px-3 pb-1">
                        {DAY_LABELS.map(d => (
                            <div key={d} className="py-1 text-center text-[12px] font-semibold text-gray-500">
                                {d}
                            </div>
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
                                            'relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-[13px] transition-colors cursor-pointer',
                                            sel
                                                ? 'bg-[#0057FF] text-white font-bold'
                                                : hovered
                                                    ? 'border border-[#0057FF] text-gray-800 font-normal bg-transparent'
                                                    : inMonth
                                                        ? 'text-gray-800 font-normal hover:bg-gray-100'
                                                        : 'text-gray-300 font-normal hover:bg-gray-100',
                                        ].join(' ')}
                                    >
                                        {date.getDate()}
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    {/* Shortcuts */}
                    <div className="flex justify-center gap-4 sm:gap-6 border-t border-gray-100 px-4 py-3">
                        {shortcuts.map(s => (
                            <button key={s.label} onClick={s.action}
                                className="text-[13px] font-medium text-[#0057FF] hover:opacity-70 transition-opacity">
                                {s.label}
                            </button>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-4 py-3">
                        <button onClick={handleReset}
                            className="text-[13px] font-semibold text-gray-700 hover:text-gray-500 transition-colors">
                            Reset
                        </button>
                        <button onClick={handleConfirm}
                            className="rounded-lg bg-[#0057FF] px-4 py-1.5 text-[13px] font-semibold text-white hover:bg-[#004FE8] transition-colors">
                            Confirm
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DateRangePicker;