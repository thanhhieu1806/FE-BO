import { toast } from 'react-toastify';

const baseConfig = {
    position: 'top-right',
    autoClose: 3000,
    closeOnClick: true,
    pauseOnHover: true,
    hideProgressBar: true,
    closeButton: false,
    icon: false,
    style: { padding: 0, background: 'transparent', boxShadow: 'none' },
};

const ToastItem = ({ message, color, bg, icon }) => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        background: bg,
        borderLeft: `4px solid ${color}`,
        borderRadius: 8,
        padding: '12px 16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        minWidth: 300,
    }}>
        {/* Icon 24x24 theo Figma */}
        <div style={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
        }}>
            {icon}
        </div>
        {/* Text theo Figma: 14px, weight 400, #1f2937, line-height 20px */}
        <span style={{
            fontSize: 14,
            fontWeight: 400,
            color: '#1f2937',
            lineHeight: '20px',
            fontFamily: 'Inter, sans-serif',
        }}>
            {message}
        </span>
    </div>
);

const CheckIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path
            d="M4 12l5 5L20 7"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const XIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path
            d="M18 6L6 18M6 6l12 12"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
        />
    </svg>
);

const WarnIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
        <path d="M12 9v4M12 17h.01" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
);

const InfoIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
        <path d="M12 16v-4M12 8h.01" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
);

export const showSuccess = (message) => toast(
    <ToastItem message={message} color="#15803d" bg="#f0fdf4" icon={<CheckIcon />} />,
    baseConfig
);

export const showError = (message) => toast(
    <ToastItem message={message} color="#dc2626" bg="#fff1f2" icon={<XIcon />} />,
    baseConfig
);

export const showWarning = (message) => toast(
    <ToastItem message={message} color="#f59e0b" bg="#fffbeb" icon={<WarnIcon />} />,
    baseConfig
);

export const showInfo = (message) => toast(
    <ToastItem message={message} color="#3b82f6" bg="#eff6ff" icon={<InfoIcon />} />,
    baseConfig
);