import React from 'react';
import { useSessionTimeout } from '../../hooks/useSessionTimeout';

/**
 * SessionTimeoutModal
 *
 * Hiển thị popup cảnh báo khi người dùng không hoạt động trong 55 phút.
 * Countdown đếm ngược 5 phút còn lại.
 *
 * Props: không có — tự lấy state từ useSessionTimeout hook.
 * Hook được mount duy nhất một lần trong DashboardLayout.
 */
export default function SessionTimeoutModal() {
    const { showWarning, secondsLeft, continueSession, forceLogout } = useSessionTimeout();

    if (!showWarning) return null;

    const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
    const ss = String(secondsLeft % 60).padStart(2, '0');

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="session-timeout-title"
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60"
        >
            <div className="flex w-[520px] flex-col items-start rounded-2xl bg-white px-6 pt-6 pb-4 shadow-[0_8px_40px_rgba(0,0,0,0.18)]">

                {/* Icon cảnh báo */}
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                            d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                            fill="#F59E0B"
                        />
                        <line x1="12" y1="9" x2="12" y2="13" stroke="white" strokeWidth="2" strokeLinecap="round" />
                        <circle cx="12" cy="17" r="1" fill="white" />
                    </svg>
                </div>

                {/* Tiêu đề */}
                <p
                    id="session-timeout-title"
                    className="mb-2 w-full text-[15px] font-bold leading-relaxed text-gray-900"
                >
                    Your CheckID BioSense BackOffice session will expire in:
                </p>

                {/* Countdown — tabular-nums để số không nhảy layout */}
                <div
                    className="mb-2 font-bold text-[24px] leading-tight tracking-normal text-[#0057ff] [font-variant-numeric:tabular-nums]"
                    aria-live="polite"
                    aria-atomic="true"
                >
                    {mm}:{ss}
                </div>

                {/* Mô tả */}
                <p className="mb-6 text-[13px] leading-relaxed text-gray-400">
                    Please click <strong className="text-gray-600">Log out</strong> if you are finished,
                    or <strong className="text-gray-600">Continue</strong> to keep working.
                </p>

                {/* Nút hành động */}
                <div className="flex w-full gap-3">
                    <button
                        type="button"
                        onClick={forceLogout}
                        className="flex h-11 flex-1 items-center justify-center rounded-xl border border-gray-200 bg-white text-[14px] font-semibold text-gray-700 transition-colors hover:bg-gray-50 active:bg-gray-100"
                    >
                        Log out
                    </button>
                    <button
                        type="button"
                        onClick={continueSession}
                        className="flex h-11 flex-1 items-center justify-center rounded-xl border-none bg-[#0057FF] text-[14px] font-semibold text-white transition-colors hover:bg-blue-700 active:bg-blue-800"
                    >
                        Continue
                    </button>
                </div>

            </div>
        </div>
    );
}