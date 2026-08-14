import React, { useEffect, useRef, useState } from 'react';
import { brand } from '../../../../design-tokens';

const parseDisplayNumber = (str) => {
  if (typeof str === 'number') return str;
  if (typeof str !== 'string') return NaN;

  const raw = str.trim();
  if (!raw || raw === '–' || raw === '-') return NaN;

  // Xoá tất cả ký tự không phải số → chỉ giữ digit
  // "1.248" → "1248", "12,853" → "12853"
  const digitsOnly = raw.replace(/[^0-9]/g, '');
  const n = parseInt(digitsOnly, 10);
  return isNaN(n) ? NaN : n;
};

/**
 * Format số nguyên → chuỗi giống format gốc.
 * Dùng toLocaleString vi-VN: 1248 → "1.248", 12853 → "12.853"
 */
const formatNumber = (n) => n.toLocaleString('vi-VN');

/* ── Count-up hook ── */
const useCountUp = (target, duration = 1000) => {
  const [displayed, setDisplayed] = useState('0');
  const rafRef = useRef(null);

  useEffect(() => {
    // Cancel animation đang chạy nếu target đổi
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const numeric = parseDisplayNumber(target);

    // Không phải số → hiển thị nguyên (dash, placeholder)
    if (isNaN(numeric)) {
      setDisplayed(target ?? '–');
      return;
    }

    // Số = 0 → hiển thị 0 không animate
    if (numeric === 0) {
      setDisplayed('0');
      return;
    }

    setDisplayed('0');
    let startTime = null;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic: bắt đầu nhanh, về cuối chậm dần → mượt
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(numeric * eased);

      setDisplayed(formatNumber(current));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        // Đảm bảo hiển thị chính xác giá trị cuối cùng
        setDisplayed(typeof target === 'string' ? target : formatNumber(numeric));
      }
    };

    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return displayed;
};

/* ── Animated stat value ── */
const AnimatedValue = ({ value, color }) => {
  const displayed = useCountUp(value);
  return (
    <span
      className="whitespace-nowrap text-lg sm:text-xl font-bold leading-[1.15] truncate"
      style={{ color, fontVariantNumeric: 'tabular-nums' }}
    >
      {displayed}
    </span>
  );
};

/* ── StatCard ── */
const StatCard = ({ icon, iconColor = brand.primary, title, stats = [] }) => {
  const iconBgColor = iconColor.startsWith('#')
    ? `${iconColor}1A`
    : `color-mix(in srgb, ${iconColor} 12%, transparent)`;

  return (
    <div className="flex flex-col gap-2.5 rounded-md border border-border-primary bg-surface-primary p-4 sm:p-6 transition-shadow hover:shadow-cardHover">
      <div className="flex items-center gap-2">
        <div
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
          style={{ backgroundColor: iconBgColor, color: iconColor }}
        >
          {icon}
        </div>
        <span className="text-[13px] font-semibold text-text-primary">{title}</span>
      </div>

      <div className="flex w-full items-stretch">
        {stats.map((stat, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <div className="mx-3 sm:mx-4 w-px shrink-0 self-stretch bg-border-primary" aria-hidden />
            )}
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="whitespace-nowrap text-[11px] font-normal text-text-secondary">
                {stat.label}
              </span>
              <AnimatedValue value={stat.value} color={stat.valueColor} />
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default StatCard;