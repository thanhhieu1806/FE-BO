import React, { useEffect, useRef, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { chart, palette } from '../../../../design-tokens';
import EmptyState from '../EmptyState/EmptyState';
import DateRangePicker from '../DateRangePicker/DateRangePicker';

const SEGMENT_COLORS = chart.donut;

/* ─── Chevron Down Icon ─── */
const ChevronDownIcon = ({ open }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
    style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ─── Period options ─── */
const PERIOD_OPTIONS = [
  { label: 'Today', value: 'today' },
  { label: 'This week', value: 'this_week' },
  { label: 'This month', value: 'this_month' },
  { label: 'This quarter', value: 'this_quarter' },
  { label: 'This year', value: 'this_year' },
  { label: 'Custom range', value: 'custom_range' },
];

/* ─── Format helpers ─── */
const pad = (n) => String(n).padStart(2, '0');
const fmtDate = (d) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
const fmtDateOnly = (d) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;

function getSubtitleByPeriod(period, customRange) {
  const now = new Date();
  const startOfDay = (d) => { const r = new Date(d); r.setHours(0, 0, 0, 0); return r; };

  if (period === 'custom_range' && customRange && customRange[0] && customRange[1]) {
    return `(${fmtDateOnly(customRange[0])} - ${fmtDateOnly(customRange[1])})`;
  }

  switch (period) {
    case 'today': {
      return `(${fmtDate(startOfDay(now))} - ${pad(now.getHours())}:${pad(now.getMinutes())})`;
    }
    case 'this_week': {
      const day = now.getDay();
      const mon = new Date(now); mon.setDate(now.getDate() + (day === 0 ? -6 : 1 - day)); mon.setHours(0, 0, 0, 0);
      const sun = new Date(mon); sun.setDate(mon.getDate() + 6);
      return `(${fmtDateOnly(mon)} - ${fmtDateOnly(sun)})`;
    }
    case 'this_month': {
      const s = new Date(now.getFullYear(), now.getMonth(), 1);
      const e = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return `(${fmtDateOnly(s)} - ${fmtDateOnly(e)})`;
    }
    case 'this_quarter': {
      const q = Math.floor(now.getMonth() / 3);
      const s = new Date(now.getFullYear(), q * 3, 1);
      const e = new Date(now.getFullYear(), q * 3 + 3, 0);
      return `(${fmtDateOnly(s)} - ${fmtDateOnly(e)})`;
    }
    case 'this_year': {
      return `(${fmtDateOnly(new Date(now.getFullYear(), 0, 1))} - ${fmtDateOnly(new Date(now.getFullYear(), 11, 31))})`;
    }
    default: return null;
  }
}

/* ─── Dropdown Period ─── */
const PeriodDropdown = ({ value, onChange, customRange, onCustomRangeChange }) => {
  const [open, setOpen] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const ref = useRef(null);
  const selected = PERIOD_OPTIONS.find(o => o.value === value) || PERIOD_OPTIONS[0];

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setShowPicker(false); }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (opt) => {
    if (opt.value === 'custom_range') { setShowPicker(true); setOpen(false); }
    else { onChange(opt.value); setOpen(false); setShowPicker(false); }
  };

  return (
    <div ref={ref} style={{ position: 'relative', userSelect: 'none' }}>
      <button
        onClick={() => { setOpen(o => !o); setShowPicker(false); }}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 12px', borderRadius: 8,
          border: '1px solid #E5E7EB', background: '#fff',
          fontSize: 13, fontWeight: 500, color: '#111827',
          cursor: 'pointer', minWidth: 110, outline: 'none',
          boxShadow: open || showPicker ? '0 0 0 2px #3B82F620' : 'none',
        }}
      >
        <span style={{ flex: 1, textAlign: 'left' }}>{selected.label}</span>
        <ChevronDownIcon open={open || showPicker} />
      </button>

      {/* Dropdown list */}
      {open && !showPicker && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', right: 0, zIndex: 100,
          background: '#fff', borderRadius: 10, border: '1px solid #E5E7EB',
          boxShadow: '0 8px 24px rgba(0,0,0,0.10)', minWidth: 148, overflow: 'hidden',
        }}>
          {PERIOD_OPTIONS.map(opt => (
            <div
              key={opt.value}
              onClick={() => handleSelect(opt)}
              style={{
                padding: '9px 16px', fontSize: 13, cursor: 'pointer',
                color: opt.value === value ? '#2563EB' : '#111827',
                fontWeight: opt.value === value ? 600 : 400,
                background: 'transparent', transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#F3F4F6'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}

      {/* DateRangePicker popover */}
      {showPicker && (
        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', right: 0, zIndex: 100 }}>
          <DateRangePicker
            inline={true}
            value={customRange || [null, null]}
            onChange={(dates) => {
              onCustomRangeChange(dates);
              onChange('custom_range');
              setShowPicker(false);
            }}
            onClose={() => setShowPicker(false)}
          />
        </div>
      )}
    </div>
  );
};

/* ── Count-up integer ── */
const useCountUpInt = (target, duration = 1000) => {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);
  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const n = typeof target === 'number' ? target : 0;
    if (n === 0) { setValue(0); return; }
    setValue(0); let t0 = null;
    const step = (ts) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / duration, 1);
      setValue(Math.round(n * (1 - Math.pow(1 - p, 3))));
      if (p < 1) rafRef.current = requestAnimationFrame(step); else setValue(n);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);
  return value;
};

/* ── Count-up float ── */
const useCountUpFloat = (target, duration = 1000, delay = 0) => {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);
  const timerRef = useRef(null);
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const n = typeof target === 'number' ? target : 0;
    setValue(0);
    timerRef.current = setTimeout(() => {
      if (n === 0) return;
      let t0 = null;
      const step = (ts) => {
        if (!t0) t0 = ts;
        const p = Math.min((ts - t0) / duration, 1);
        setValue(parseFloat((n * (1 - Math.pow(1 - p, 3))).toFixed(1)));
        if (p < 1) rafRef.current = requestAnimationFrame(step); else setValue(n);
      };
      rafRef.current = requestAnimationFrame(step);
    }, delay);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); if (rafRef.current) cancelAnimationFrame(rafRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, delay]);
  return value;
};

/* ── Empty icons ── */
const AttendanceEmptyIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
    <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="9" cy="7" r="4" stroke="#D1D5DB" strokeWidth="1.5" />
    <path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const VisitorEmptyIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="4" r="2.5" stroke="#D1D5DB" strokeWidth="1.5" />
    <path d="M9 9h6l-1 5.5 2.5 4.5M9 9l-1 5.5-2.5 4.5M10 20l2-3 2 3" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const EMPTY_DEFAULTS = {
  attendance: { title: 'No attendance data', subtitle: 'Check back when data is available' },
  visitor: { title: 'No visitor data', subtitle: 'Visitor records will show here' },
};

/* ── Legend item ── */
const AnimatedLegendItem = ({ seg, color, delay }) => {
  const pct = useCountUpFloat(seg.value, 1000, delay);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '12px 1fr auto', alignItems: 'center', gap: 8, minHeight: 26 }}>
      <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />
      <span style={{ fontSize: 14, color: '#374151', fontWeight: 400, whiteSpace: 'nowrap' }}>
        {seg.label}
      </span>
      <span style={{ fontSize: 14, color: '#6B7280', fontWeight: 400, whiteSpace: 'nowrap', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
        {pct.toFixed(1).replace('.', ',')}%
      </span>
    </div>
  );
};

/* ── Map period string từ index.jsx ('Today','This week','This month') sang PERIOD_OPTIONS value ── */
const mapPeriodToValue = (period) => {
  if (!period) return 'today';
  const map = {
    'Today': 'today',
    'This week': 'this_week',
    'This month': 'this_month',
    'today': 'today',
    'this_week': 'this_week',
    'this_month': 'this_month',
    'this_quarter': 'this_quarter',
    'this_year': 'this_year',
    'custom_range': 'custom_range',
  };
  return map[period] ?? 'today';
};

/* ── Map PERIOD_OPTIONS value ngược lại sang label string cho index.jsx ── */
const mapValueToPeriod = (value) => {
  const map = {
    'today': 'Today',
    'this_week': 'This week',
    'this_month': 'This month',
    'this_quarter': 'This quarter',
    'this_year': 'This year',
    'custom_range': 'custom_range',
  };
  return map[value] ?? value;
};

/* ── DonutChart ── */
const DonutChart = ({
  total = 0,
  segments = [],
  emptyVariant = 'attendance',
  emptyTitle,
  emptySubtitle,
  title,
  period,
  onPeriodChange,
  subtitle,
}) => {
  const echartsRef = useRef(null);
  const animatedTotal = useCountUpInt(total);

  const activePeriod = mapPeriodToValue(period);
  const [customRange, setCustomRange] = useState([null, null]);
  const [autoSubtitle, setAutoSubtitle] = useState(
    () => subtitle || getSubtitleByPeriod(activePeriod, customRange)
  );

  useEffect(() => {
    setAutoSubtitle(subtitle || getSubtitleByPeriod(activePeriod, customRange));
  }, [activePeriod, subtitle, customRange]);

  const handlePeriodChange = (value) => {
    if (onPeriodChange) onPeriodChange(mapValueToPeriod(value));
  };

  /* ── Header ── */
  const headerTop = (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
      <div>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0, lineHeight: '24px' }}>
          {title}
        </h2>
        {autoSubtitle && (
          <p style={{ fontSize: 11, color: '#9CA3AF', margin: '2px 0 0 0', lineHeight: '16px' }}>
            {autoSubtitle}
          </p>
        )}
      </div>
      <PeriodDropdown
        value={activePeriod}
        customRange={customRange}
        onCustomRangeChange={setCustomRange}
        onChange={handlePeriodChange}
      />
    </div>
  );

  /* ── Empty state ── */
  if (!segments || segments.length === 0 || total === 0) {
    const defaults = EMPTY_DEFAULTS[emptyVariant] ?? EMPTY_DEFAULTS.attendance;
    const icon = emptyVariant === 'visitor' ? <VisitorEmptyIcon /> : <AttendanceEmptyIcon />;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
        {headerTop}
        <EmptyState icon={icon} title={emptyTitle ?? defaults.title} subtitle={emptySubtitle ?? defaults.subtitle} />
      </div>
    );
  }

  const chartData = segments.map((seg) => ({
    name: seg.label,
    value: seg.value,
    itemStyle: { color: SEGMENT_COLORS[seg.label.toLowerCase()] ?? palette.grey[300] },
  }));

  const option = {
    animation: true, animationDuration: 1000, animationEasing: 'cubicOut',
    tooltip: { show: false },
    series: [{
      type: 'pie', radius: ['45%', '82%'], center: ['50%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 8, borderColor: '#ffffff', borderWidth: 5 },
      label: { show: false }, labelLine: { show: false },
      emphasis: { scale: false, itemStyle: { borderWidth: 5 } },
      data: chartData,
    }],
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
      {headerTop}
      {/* Body: donut trái + legend phải */}
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 24, flex: 1, paddingTop: 4, paddingBottom: 4 }}>
        {/* Donut */}
        <div style={{ position: 'relative', width: 180, height: 180, flexShrink: 0 }}>
          <ReactECharts
            ref={echartsRef} option={option}
            notMerge={true} lazyUpdate={false}
            style={{ width: '100%', height: '100%' }}
            opts={{ renderer: 'svg' }}
          />
          {/* Center label */}
          <div style={{
            position: 'absolute', left: '50%', top: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', textAlign: 'center', width: 90, pointerEvents: 'none',
          }}>
            <span style={{
              fontSize: 22, fontWeight: 700, color: '#111827',
              fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', lineHeight: 1.2,
            }}>
              {animatedTotal.toLocaleString('vi-VN')}
            </span>
            <span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 400, marginTop: 4 }}>
              Total
            </span>
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, justifyContent: 'center' }}>
          {segments.map((seg, i) => (
            <AnimatedLegendItem
              key={i} seg={seg}
              color={SEGMENT_COLORS[seg.label.toLowerCase()] ?? palette.grey[300]}
              delay={i * 80}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DonutChart;