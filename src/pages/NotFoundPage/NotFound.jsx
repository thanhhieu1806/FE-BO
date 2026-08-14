import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { LogoPng as Logo } from '../../assets/images';
import NotFoundSVG from '../../assets/images/Frame.svg';
import USAFlag from '../../assets/images/icons--usa-flag.svg';

const RefreshIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M21 12C21 16.97 16.97 21 12 21C7.03 21 3 16.97 3 12C3 7.03 7.03 3 12 3C14.29 3 16.38 3.86 17.96 5.29"
            stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M22 4L17.96 5.29L19.25 9.33"
            stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ArrowLeftIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M9.57 5.93L3.5 12L9.57 18.07M20.5 12H3.67"
            stroke="#0057FF" strokeWidth="1.8" strokeMiterlimit="10"
            strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const NotFound = () => {
    const navigate = useNavigate();
    const handleRefresh = () => window.location.reload();
    const handleBack = () => navigate(ROUTES.DASHBOARD, { replace: true });

    return (
        <div className="flex flex-col min-h-screen bg-white">

            {/* ── Header ── */}
            <header className="flex h-16 shrink-0 items-center justify-between px-8 lg:px-[125px] border-b border-gray-200">

                {/* Logo: natural size, not stretched */}
                <div className="flex items-center h-16">
                    <img
                        src={Logo}
                        alt="CheckID BioSense"
                        className="h-10 w-auto object-contain"
                    />
                </div>

                {/* Language picker */}
                <button
                    type="button"
                    className="flex items-center gap-1.5 h-10 px-2.5 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                    <img
                        src={USAFlag}
                        alt="EN"
                        className="rounded-full object-cover"
                        style={{ width: 16, height: 16, minWidth: 16 }}
                    />
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M6 9l6 6 6-6" stroke="#6B7280" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </header>

            {/* ── Main ── */}
            <main className="flex-1 flex items-center justify-center px-8 lg:px-[125px]">
                {/*
                    Desktop (lg+): text LEFT | illustration RIGHT  ← khớp ảnh gốc
                    Mobile: text TOP, illustration BOTTOM
                */}
                <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20 w-full max-w-[1284px] py-10">

                    {/* ── LEFT: text + buttons (704px) ── */}
                    <div className="flex flex-col items-start gap-6 w-full lg:w-[704px] shrink-0">
                        <div className="flex flex-col gap-2">
                            {/* Figma: Inter 700, 48px, line-height 58px, #1f2937 */}
                            <h1
                                className="m-0 font-bold text-[#1f2937]"
                                style={{ fontFamily: "'Inter', sans-serif", fontSize: 48, lineHeight: '58px' }}
                            >
                                Page not Found
                            </h1>
                            {/* Figma: Inter 400, 18px, line-height 27px, #6b7280 */}
                            <p
                                className="m-0 text-[#6b7280]"
                                style={{ fontFamily: "'Inter', sans-serif", fontSize: 18, lineHeight: '27px' }}
                            >
                                Sorry, the page you are looking for doesn't exist or has been removed.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                type="button"
                                onClick={handleRefresh}
                                className="inline-flex items-center gap-2 w-fit bg-[#0057FF] text-white border-none rounded-lg px-5 py-2.5 text-[13px] font-semibold cursor-pointer hover:bg-blue-700 active:bg-blue-800 transition-colors"
                            >
                                <RefreshIcon />
                                Refresh
                            </button>
                            <button
                                type="button"
                                onClick={handleBack}
                                className="inline-flex items-center gap-1.5 w-fit bg-transparent text-[#0057FF] border-none p-0 text-[13px] font-medium cursor-pointer hover:underline transition-colors"
                            >
                                <ArrowLeftIcon />
                                Back to homepage
                            </button>
                        </div>
                    </div>

                    {/* ── RIGHT: illustration (500×211) ── */}
                    <div className="w-full lg:w-[500px] shrink-0 flex justify-center lg:justify-start">
                        <img
                            src={NotFoundSVG}
                            alt="Page not found illustration"
                            className="w-full max-w-[500px] lg:h-[211px] object-contain"
                        />
                    </div>

                </div>
            </main>

        </div>
    );
};

export default NotFound;