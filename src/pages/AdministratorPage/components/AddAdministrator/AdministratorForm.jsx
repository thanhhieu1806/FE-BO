import React, { useState, useRef, useEffect } from 'react';

const ROLE_OPTIONS = ['Admin', 'Super admin', 'Supervisor'];

const VnFlagIcon = ({ size = 16 }) => (
    <div
        style={{ width: `${size}px`, height: `${size}px`, minWidth: `${size}px`, minHeight: `${size}px`, padding: 0 }}
        className="relative shrink-0 overflow-hidden rounded-full flex items-center justify-center bg-[#d22f27]"
    >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="16 16 40 40" className="w-full h-full object-cover">
            <rect x="0" y="0" width="72" height="72" fill="#d22f27" />
            <path fill="#f1b31c" stroke="#f1b31c" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" d="m28.89 47l7.303-22l6.295 21.663L25 33.61l22-.543z" />
        </svg>
    </div>
);

const UsFlagIcon = ({ size = 16 }) => (
    <div
        style={{ width: `${size}px`, height: `${size}px`, minWidth: `${size}px`, minHeight: `${size}px`, padding: 0 }}
        className="relative shrink-0 overflow-hidden rounded-full flex items-center justify-center border border-gray-200"
    >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72" className="w-full h-full object-cover">
            <path fill="#b22234" d="M5 17h62v38H5z" />
            <path fill="#fff" d="M5 21h62v4H5zm0 8h62v4H5zm0 8h62v4H5zm0 8h62v4H5z" />
            <path fill="#3c3b6e" d="M5 17h30v21H5z" />
            <circle fill="#fff" cx="12" cy="22" r="1.5" />
            <circle fill="#fff" cx="20" cy="22" r="1.5" />
            <circle fill="#fff" cx="28" cy="22" r="1.5" />
            <circle fill="#fff" cx="16" cy="27" r="1.5" />
            <circle fill="#fff" cx="24" cy="27" r="1.5" />
            <circle fill="#fff" cx="12" cy="32" r="1.5" />
            <circle fill="#fff" cx="20" cy="32" r="1.5" />
            <circle fill="#fff" cx="28" cy="32" r="1.5" />
        </svg>
    </div>
);

const PREFIX_OPTIONS = [
    { code: 'VN', dial: '+84', icon: <VnFlagIcon size={16} /> },
    { code: 'US', dial: '+1', icon: <UsFlagIcon size={16} /> },
];

const PhonePrefixSelect = () => {
    const [selected, setSelected] = useState('VN');
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const currentOption = PREFIX_OPTIONS.find((o) => o.code === selected) || PREFIX_OPTIONS[0];

    return (
        <div ref={containerRef} className="relative shrink-0 flex items-center">
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="flex h-[40px] items-center gap-1.5 px-3 bg-white border border-[#e5e7eb] rounded-[8px] cursor-pointer hover:border-blue-500 transition-colors focus:outline-none"
            >
                {currentOption.icon}
                <svg
                    width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"
                    className={`transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
                >
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>

            {open && (
                <div className="absolute left-0 top-[calc(100%+4px)] z-50 min-w-[130px] bg-white border border-[#e5e7eb] rounded-[8px] shadow-lg py-1">
                    {PREFIX_OPTIONS.map((opt) => (
                        <button
                            key={opt.code}
                            type="button"
                            onClick={() => { setSelected(opt.code); setOpen(false); }}
                            className={`flex w-full items-center gap-2.5 px-3 py-2 text-[13px] hover:bg-gray-50 transition-colors ${selected === opt.code ? 'bg-blue-50/60 font-semibold text-blue-600' : 'text-[#374151]'}`}
                        >
                            {opt.icon}
                            <span>{opt.code}</span>
                            <span className="text-gray-400 font-normal ml-auto">{opt.dial}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const InputField = ({ label, required, children }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-medium text-[#374151]">
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        {children}
    </div>
);

const inputClass = 'w-full h-[40px] px-3 text-[13px] text-[#1f2937] bg-white border border-[#e5e7eb] rounded-[8px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-400';

const AdministratorForm = ({ form, onChange }) => (
    <div className="flex flex-col gap-4">
        {/* Row 1: Full name + Email — stack dọc trên mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Full name" required>
                <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => onChange('fullName', e.target.value)}
                    className={inputClass}
                    placeholder=""
                />
            </InputField>
            <InputField label="Email address" required>
                <input
                    type="email"
                    value={form.email}
                    onChange={(e) => onChange('email', e.target.value)}
                    className={inputClass}
                    placeholder=""
                />
            </InputField>
        </div>

        {/* Row 2: Role + Phone — stack dọc trên mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Role" required>
                <div className="relative">
                    <select
                        value={form.role}
                        onChange={(e) => onChange('role', e.target.value)}
                        className={`${inputClass} appearance-none pr-8 cursor-pointer`}
                    >
                        {ROLE_OPTIONS.map((r) => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                    <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </div>
            </InputField>

            <InputField label="Phone number">
                <div className="flex gap-2">
                    <PhonePrefixSelect />
                    <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => onChange('phone', e.target.value)}
                        className={`${inputClass} flex-1`}
                        placeholder=""
                    />
                </div>
            </InputField>
        </div>

        {/* Row 3: Toggle active */}
        <div className="flex items-center gap-2.5">
            <button
                type="button"
                onClick={() => onChange('isActive', !form.isActive)}
                className={`relative inline-flex h-[22px] w-[40px] shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none ${form.isActive ? 'bg-blue-600' : 'bg-gray-300'}`}
            >
                <span className={`inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow transition-transform duration-200 ${form.isActive ? 'translate-x-[19px]' : 'translate-x-[2px]'}`} />
            </button>
            <span className="text-[13px] text-[#374151] font-medium">Active administrator</span>
        </div>
    </div>
);

export default AdministratorForm;