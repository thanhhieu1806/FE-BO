import React, { useRef, useState, useEffect, useCallback } from 'react';
import { chart, text } from '../../../../design-tokens';
import EmptyState from '../EmptyState/EmptyState';
import DateRangePicker from '../DateRangePicker/DateRangePicker';

/*  Empty state icon  */
const ChartEmptyIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
    <rect x="4" y="10" width="4" height="10" rx="1" fill="#D1D5DB" opacity="0.9" />
    <rect x="10" y="14" width="4" height="6" rx="1" fill="#D1D5DB" opacity="0.7" />
    <rect x="16" y="6" width="4" height="14" rx="1" fill="#D1D5DB" opacity="1" />
  </svg>
);

/*  Chevron Down Icon  */
const ChevronDownIcon = ({ open }) => (
  <svg
    width="16" height="16" viewBox="0 0 16 16" fill="none"
    style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
  >
    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/*  Constants  */
const WIDTH = 542;
const HEIGHT = 340;
const PAD_LEFT = 52;
const PAD_RIGHT = 12;
const PAD_TOP = 16;
const PAD_BOTTOM = 36;
const CHART_W = WIDTH - PAD_LEFT - PAD_RIGHT;
const CHART_H = HEIGHT - PAD_TOP - PAD_BOTTOM;
const SUCCESS_COLOR = chart.success;
const FAILED_COLOR = chart.failed;
const BAR_RADIUS = 3;

const PERIOD_OPTIONS = [
  { label: 'Last 7 days', value: 'last_7_days' },
  { label: 'Today', value: 'today' },
  { label: 'This week', value: 'this_week' },
  { label: 'This month', value: 'this_month' },
  { label: 'This quarter', value: 'this_quarter' },
  { label: 'This year', value: 'this_year' },
  { label: 'Custom range', value: 'custom_range' },
];

/*  Format số: 24.568  */
const formatVN = (num) => Number(num).toLocaleString('de-DE');

/*  Helpers date  */
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
      const start = startOfDay(now);
      return `(${fmtDate(start)} - ${pad(now.getHours())}:${pad(now.getMinutes())})`;
    }
    case 'this_week': {
      const day = now.getDay();
      const diffToMon = (day === 0 ? -6 : 1 - day);
      const mon = new Date(now); mon.setDate(now.getDate() + diffToMon); mon.setHours(0, 0, 0, 0);
      const sun = new Date(mon); sun.setDate(mon.getDate() + 6); sun.setHours(23, 59, 0, 0);
      return `(${fmtDateOnly(mon)} - ${fmtDateOnly(sun)})`;
    }
    case 'this_month': {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return `(${fmtDateOnly(start)} - ${fmtDateOnly(end)})`;
    }
    case 'last_7_days': {
      const start = new Date(now); start.setDate(now.getDate() - 6); start.setHours(0, 0, 0, 0);
      return `(${fmtDateOnly(start)} - ${fmtDateOnly(now)})`;
    }
    case 'this_quarter': {
      const q = Math.floor(now.getMonth() / 3);
      const start = new Date(now.getFullYear(), q * 3, 1);
      const end = new Date(now.getFullYear(), q * 3 + 3, 0);
      return `(${fmtDateOnly(start)} - ${fmtDateOnly(end)})`;
    }
    case 'this_year': {
      const start = new Date(now.getFullYear(), 0, 1);
      const end = new Date(now.getFullYear(), 11, 31);
      return `(${fmtDateOnly(start)} - ${fmtDateOnly(end)})`;
    }
    default: return null;
  }
}

function computeYScale(successful, failed) {
  const totals = successful.map((s, i) => s + (failed[i] || 0));
  const dataMax = Math.max(...totals, 0);
  if (dataMax === 0) return { yMax: 8, yTicks: [0, 1, 2, 3, 4, 5, 6, 7, 8] };
  const rawStep = dataMax / 8;
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const niceSteps = [1, 2, 2.5, 5, 10];
  let step = magnitude * 10;
  for (const s of niceSteps) {
    const candidate = magnitude * s;
    if (candidate >= rawStep) { step = candidate; break; }
  }
  const yMax = step * 8;
  const yTicks = Array.from({ length: 9 }, (_, i) => Math.round(step * i));
  return { yMax, yTicks };
}

/*  Rounded-top rect path  */
function roundedTopRect(x, y, w, h, r) {
  if (h <= 0) return '';
  const rx = Math.min(r, w / 2, h / 2);
  return `M${x},${y + h} L${x},${y + rx} Q${x},${y} ${x + rx},${y} L${x + w - rx},${y} Q${x + w},${y} ${x + w},${y + rx} L${x + w},${y + h} Z`;
}

/*  count up hook  */
function useCountUp(target, duration = 600, delay = 0) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);
  useEffect(() => {
    if (target === 0) { setValue(0); return; }
    let startTime = null;
    const timer = setTimeout(() => {
      const step = (ts) => {
        if (!startTime) startTime = ts;
        const p = Math.min((ts - startTime) / duration, 1);
        setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) rafRef.current = requestAnimationFrame(step);
        else setValue(target);
      };
      rafRef.current = requestAnimationFrame(step);
    }, delay);
    return () => { clearTimeout(timer); if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, duration, delay]);
  return value;
}

/*  Keyframes  */
const STYLE_ID = 'txn-bar-chart-kf';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
    @keyframes barGrow { from { transform: scaleY(0); } to { transform: scaleY(1); } }
    @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
  `;
  document.head.appendChild(el);
}

/*  Tooltip  */
const Tooltip = ({ x, y, svgWidth, label, successVal, failedVal }) => {
  const total = successVal + failedVal;
  const W = 148; const H = 88;
  let tx = x - W / 2;
  if (tx < PAD_LEFT) tx = PAD_LEFT;
  if (tx + W > svgWidth - PAD_RIGHT) tx = svgWidth - PAD_RIGHT - W;
  const ty = Math.max(PAD_TOP, y - H - 10);
  return (
    <g style={{ pointerEvents: 'none', animation: 'fadeIn 120ms ease forwards' }}>
      <line x1={x} y1={PAD_TOP} x2={x} y2={PAD_TOP + CHART_H}
        stroke="#D1D5DB" strokeWidth="1" strokeDasharray="4 3" />
      <foreignObject x={tx} y={ty} width={W} height={H}>
        <div style={{
          background: '#fff', borderRadius: 10, padding: '8px 12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.13)', fontSize: 12,
          border: '1px solid #E5E7EB', lineHeight: 1.7,
        }}>
          <div style={{ fontWeight: 700, fontSize: 12, color: '#111827', marginBottom: 2 }}>{label}</div>
          <div style={{ color: '#6B7280', fontSize: 11 }}>Total: <b style={{ color: '#111827' }}>{formatVN(total)}</b></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#6B7280', fontSize: 11 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: SUCCESS_COLOR, display: 'inline-block', flexShrink: 0 }} />
            <span>Successful</span>
            <b style={{ color: '#111827', marginLeft: 4 }}>{formatVN(successVal)}</b>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#6B7280', fontSize: 11 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: FAILED_COLOR, display: 'inline-block', flexShrink: 0 }} />
            <span>Failed</span>
            <b style={{ color: '#111827', marginLeft: 4 }}>{formatVN(failedVal)}</b>
          </div>
        </div>
      </foreignObject>
    </g>
  );
};

/*  Period Dropdown  */
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

  const handleSelect = (optValue) => {
    if (optValue === 'custom_range') { setShowPicker(true); setOpen(false); }
    else { onChange(optValue); setOpen(false); setShowPicker(false); }
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
          cursor: 'pointer', minWidth: 120,
          boxShadow: open ? '0 0 0 2px #3B82F620' : 'none', outline: 'none',
        }}
      >
        <span style={{ flex: 1, textAlign: 'left' }}>{selected.label}</span>
        <ChevronDownIcon open={open || showPicker} />
      </button>

      {open && !showPicker && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', right: 0, zIndex: 100,
          background: '#fff', borderRadius: 10, border: '1px solid #E5E7EB',
          boxShadow: '0 8px 24px rgba(0,0,0,0.10)', minWidth: 148, overflow: 'hidden',
        }}>
          {PERIOD_OPTIONS.map(opt => (
            <div key={opt.value} onClick={() => handleSelect(opt.value)}
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

      {showPicker && (
        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', right: 0, zIndex: 100 }}>
          <DateRangePicker
            inline={true}
            value={customRange || [null, null]}
            onChange={(dates) => { onCustomRangeChange(dates); onChange('custom_range'); setShowPicker(false); }}
            onClose={() => setShowPicker(false)}
          />
        </div>
      )}
    </div>
  );
};

/*  Main Component  */
const TransactionTrendChart = ({ data, period, onPeriodChange, subtitle }) => {
  const [tooltipIndex, setTooltipIndex] = useState(-1);
  const [customRange, setCustomRange] = useState([null, null]);
  const [animated, setAnimated] = useState(false);
  const prevKeyRef = useRef(null);

  const handleMouseEnterCol = useCallback((i) => setTooltipIndex(i), []);
  const handleMouseLeave = useCallback(() => setTooltipIndex(-1), []);

  useEffect(() => {
    const newKey = data?.labels?.join(',') ?? '';
    if (prevKeyRef.current !== newKey) {
      setAnimated(false);
      setTooltipIndex(-1);
      prevKeyRef.current = newKey;
      if (!newKey) return;
      const t = setTimeout(() => setAnimated(true), 80);
      return () => clearTimeout(t);
    }
  }, [data]);

  const totalSuccessful = data?.successful?.reduce((a, b) => a + b, 0) ?? 0;
  const totalFailed = data?.failed?.reduce((a, b) => a + b, 0) ?? 0;
  const total = totalSuccessful + totalFailed;

  const mapPeriod = (p) => {
    const m = { 'Today': 'today', 'This week': 'this_week', 'This month': 'this_month', 'Last 7 days': 'last_7_days' };
    return m[p] ?? p ?? 'last_7_days';
  };
  const activePeriod = mapPeriod(period);
  const [autoSubtitle, setAutoSubtitle] = useState(() => subtitle || getSubtitleByPeriod(activePeriod, customRange));
  useEffect(() => { setAutoSubtitle(subtitle || getSubtitleByPeriod(activePeriod, customRange)); }, [activePeriod, subtitle, customRange]);

  const dispTotal = useCountUp(total, 700, 100);
  const dispSuccess = useCountUp(totalSuccessful, 700, 200);
  const dispFailed = useCountUp(totalFailed, 700, 300);

  const headerTop = (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
      <div>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0, lineHeight: '22px' }}>
          Transaction trend
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
        onChange={(val) => {
          const reverseMap = { 'today': 'Today', 'this_week': 'This week', 'this_month': 'This month', 'last_7_days': 'Last 7 days' };
          if (onPeriodChange) onPeriodChange(reverseMap[val] ?? val);
        }}
      />
    </div>
  );

  const statsRow = (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', margin: '4px 0 8px 0' }}>
      <div style={{ padding: '6px 16px 6px 0', borderRight: '1px solid #E5E7EB' }}>
        <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 2 }}>Total</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#111827', lineHeight: 1.1 }}>{formatVN(dispTotal)}</div>
      </div>
      <div style={{ padding: '6px 16px', borderRight: '1px solid #E5E7EB' }}>
        <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 2 }}>Successful</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: SUCCESS_COLOR, lineHeight: 1.1 }}>{formatVN(dispSuccess)}</div>
      </div>
      <div style={{ padding: '6px 0 6px 16px' }}>
        <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 2 }}>Failed</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: FAILED_COLOR, lineHeight: 1.1 }}>{formatVN(dispFailed)}</div>
      </div>
    </div>
  );

  const legend = (
    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12, marginBottom: 4 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#374151', fontWeight: 500 }}>
        <span style={{ width: 12, height: 12, borderRadius: 3, background: SUCCESS_COLOR, display: 'inline-block' }} />
        Successful
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#374151', fontWeight: 500 }}>
        <span style={{ width: 12, height: 12, borderRadius: 3, background: FAILED_COLOR, display: 'inline-block' }} />
        Failed
      </div>
    </div>
  );

  if (!data?.labels?.length) {
    return (
      <div className="flex h-full w-full flex-col font-sans">
        {headerTop}
        {statsRow}
        <EmptyState
          icon={<ChartEmptyIcon />}
          title="No transaction data"
          subtitle="Data will appear when transactions are recorded"
        />
      </div>
    );
  }

  const { labels, successful, failed } = data;
  const { yMax, yTicks } = computeYScale(successful, failed);
  const N = labels.length;
  const COL_W = CHART_W / N;
  const BAR_GAP = Math.max(COL_W * 0.2, 6);
  const BAR_W = COL_W - BAR_GAP * 2;

  const barX = (i) => PAD_LEFT + i * COL_W + BAR_GAP;
  const barY = (val) => PAD_TOP + CHART_H - (val / yMax) * CHART_H;
  const barH = (val) => (val / yMax) * CHART_H;

  const GRID_LEFT = PAD_LEFT;
  const GRID_RIGHT = PAD_LEFT + CHART_W;

  const tooltipBarCenterX = tooltipIndex >= 0 ? PAD_LEFT + tooltipIndex * COL_W + COL_W / 2 : 0;
  const tooltipBarTopY = tooltipIndex >= 0
    ? barY((successful[tooltipIndex] || 0) + (failed[tooltipIndex] || 0)) - 10
    : 0;

  return (
    <div className="flex h-full w-full flex-col font-sans">
      {headerTop}
      {statsRow}
      {legend}

      <div className="w-full flex-1 min-h-[220px] sm:min-h-[260px]">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="block h-full w-full"
          style={{ overflow: 'visible' }}
          aria-label="Transaction trend chart"
          preserveAspectRatio="xMidYMid meet"
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            <clipPath id="txnChartArea">
              <rect x={PAD_LEFT} y={PAD_TOP} width={CHART_W} height={CHART_H} />
            </clipPath>
          </defs>

          {/* Y grid lines + labels */}
          {yTicks.map((tick) => {
            const y = barY(tick);
            return (
              <g key={`hg${tick}`}>
                <line x1={GRID_LEFT} y1={y} x2={GRID_RIGHT} y2={y}
                  stroke={tick === 0 ? '#D1D5DB' : '#E5E7EB'}
                  strokeWidth="1"
                  strokeDasharray={tick === 0 ? undefined : '3 4'} />
                <text x={GRID_LEFT - 6} y={y + 4} textAnchor="end" fontSize="10"
                  fontFamily="inherit" fill={text.tertiary}>
                  {tick >= 1000 ? (tick / 1000).toFixed(tick % 1000 === 0 ? 0 : 1) + 'k' : tick}
                </text>
              </g>
            );
          })}

          {/* Bars */}
          <g clipPath="url(#txnChartArea)">
            {labels.map((_, i) => {
              const sVal = successful[i] || 0;
              const fVal = failed[i] || 0;
              const totalVal = sVal + fVal;
              const x = barX(i);
              const successH = barH(sVal);
              const failedH = barH(fVal);
              const totalBarY = barY(totalVal);
              const successBarY = PAD_TOP + CHART_H - successH;
              const isHovered = tooltipIndex === i;
              const baseOpacity = tooltipIndex >= 0 && !isHovered ? 0.55 : 1;
              const transformOrigin = `${x + BAR_W / 2}px ${PAD_TOP + CHART_H}px`;
              const animStyle = animated
                ? { transformOrigin, animation: `barGrow 500ms cubic-bezier(0.34,1.56,0.64,1) ${i * 40}ms both` }
                : { transformOrigin, transform: 'scaleY(0)' };

              return (
                <g key={`bar${i}`} style={{ opacity: baseOpacity, transition: 'opacity 0.15s', ...animStyle }}>
                  {successH > 0 && (
                    <path
                      d={fVal > 0
                        ? `M${x},${successBarY + successH} L${x},${successBarY} L${x + BAR_W},${successBarY} L${x + BAR_W},${successBarY + successH} Z`
                        : roundedTopRect(x, successBarY, BAR_W, successH, BAR_RADIUS)
                      }
                      fill={SUCCESS_COLOR}
                    />
                  )}
                  {failedH > 0 && (
                    <path
                      d={roundedTopRect(x, totalBarY, BAR_W, failedH, BAR_RADIUS)}
                      fill={FAILED_COLOR}
                    />
                  )}
                </g>
              );
            })}
          </g>

          {/* Hover zones */}
          {labels.map((_, i) => (
            <rect key={`hz${i}`}
              x={PAD_LEFT + i * COL_W} y={PAD_TOP}
              width={COL_W} height={CHART_H}
              fill="transparent"
              style={{ cursor: 'default' }}
              onMouseEnter={() => handleMouseEnterCol(i)}
            />
          ))}

          {/* Tooltip */}
          {tooltipIndex >= 0 && (
            <Tooltip
              x={tooltipBarCenterX}
              y={tooltipBarTopY}
              svgWidth={WIDTH}
              label={labels[tooltipIndex]}
              successVal={successful[tooltipIndex] || 0}
              failedVal={failed[tooltipIndex] || 0}
            />
          )}

          {/* X labels */}
          {labels.map((label, i) => (
            <text key={`xl${i}`}
              x={PAD_LEFT + i * COL_W + COL_W / 2}
              y={HEIGHT - 6}
              textAnchor="middle" fontSize="10"
              fontFamily="inherit" fill={text.tertiary}
            >
              {label}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
};

export default TransactionTrendChart;