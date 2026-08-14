import React, { useState } from 'react';
import { showSuccess, showError } from '../../utils/toast';

/* ── Reusable sub-components ── */

const SectionCard = ({ title, description, children }) => (
    <div className="rounded-xl border border-[#E5E7EB] bg-white px-6 py-5">
        <div className="mb-4">
            <h2 className="text-[15px] font-semibold text-[#1F2937]">{title}</h2>
            {description && (
                <p className="mt-0.5 text-[13px] text-[#6B7280]">{description}</p>
            )}
        </div>
        {children}
    </div>
);

const FieldLabel = ({ children, required }) => (
    <label className="mb-1.5 block text-[13px] font-medium text-[#374151]">
        {children}
        {required && <span className="ml-0.5 text-red-500">*</span>}
    </label>
);

const TextInput = ({ value, onChange, placeholder, hint }) => (
    <div>
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-[14px] text-[#1F2937] outline-none placeholder:text-[#9CA3AF] focus:border-[#0057FF] focus:ring-1 focus:ring-[#0057FF] transition-colors"
        />
        {hint && <p className="mt-1 text-[12px] text-[#6B7280]">{hint}</p>}
    </div>
);

const SelectInput = ({ value, onChange, options }) => (
    <div className="relative">
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full cursor-pointer appearance-none rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-[14px] text-[#1F2937] outline-none hover:border-[#9CA3AF] focus:border-[#0057FF] focus:ring-1 focus:ring-[#0057FF] transition-colors pr-9"
        >
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
        {/* Chevron — pointer-events-none nên click vẫn xuyên xuống select */}
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </span>
    </div>
);

const NumberInput = ({ value, onChange }) => {
    const num = parseInt(value, 10) || 0;
    return (
        <div className="relative">
            <input
                type="text"
                inputMode="numeric"
                value={value}
                onChange={(e) => {
                    const v = e.target.value.replace(/[^0-9]/g, '');
                    onChange(v);
                }}
                className="w-full rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-[14px] text-[#1F2937] outline-none hover:border-[#9CA3AF] focus:border-[#0057FF] focus:ring-1 focus:ring-[#0057FF] transition-colors pr-7"
            />
            {/* Up / Down — float inside input, no extra border */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-[3px]">
                <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => onChange(String(num + 1))}
                    className="flex h-[14px] w-[14px] cursor-pointer items-center justify-center rounded-sm bg-transparent hover:bg-[#F3F4F6] transition-colors"
                >
                    <svg width="9" height="5" viewBox="0 0 9 5" fill="none">
                        <path d="M1 4.5l3.5-3.5L8 4.5" stroke="#9CA3AF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => onChange(String(Math.max(1, num - 1)))}
                    className="flex h-[14px] w-[14px] cursor-pointer items-center justify-center rounded-sm bg-transparent hover:bg-[#F3F4F6] transition-colors"
                >
                    <svg width="9" height="5" viewBox="0 0 9 5" fill="none">
                        <path d="M1 0.5L4.5 4 8 0.5" stroke="#9CA3AF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

/* Toggle — Figma spec: 44×24px, padding 2px, border-radius 99px */
const Toggle = ({ checked, onChange }) => (
    <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        style={{ width: 44, height: 24, borderRadius: 99, padding: 2 }}
        className={`relative inline-flex shrink-0 cursor-pointer border-0 transition-colors duration-200 focus:outline-none ${checked ? 'bg-[#0057FF]' : 'bg-[#D1D5DB]'}`}
    >
        <span
            style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                backgroundColor: "white",
                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                transform: checked ? "translateX(20px)" : "translateX(0px)",
                transition: "transform 0.2s ease",
                display: "inline-block",
                flexShrink: 0,
            }}
        />
    </button>
);

/* ── Default state ── */

const DEFAULT_FORM = {
    systemName: 'MOBILE-ID BackOffice',
    contactEmail: 'noreply@mobile-id.com',
    defaultLanguage: 'en',
    timezone: 'UTC+7',
    recordsPerPage: '20',
    dateTimeFormat: 'DD/MM/YYYY HH:mm:ss',
    allowNewCompany: true,
};

const LANGUAGE_OPTIONS = [
    { value: 'en', label: 'English' },
    { value: 'vi', label: 'Tiếng Việt' },
];

const TIMEZONE_OPTIONS = [
    { value: 'UTC+7', label: '(UTC+07:00) Bangkok, Hanoi, Jakarta' },
    { value: 'UTC+8', label: '(UTC+08:00) Beijing, Singapore' },
    { value: 'UTC+0', label: '(UTC+00:00) London' },
];

const DATETIME_OPTIONS = [
    { value: 'DD/MM/YYYY HH:mm:ss', label: 'DD/MM/YYYY HH:mm:ss' },
    { value: 'MM/DD/YYYY HH:mm:ss', label: 'MM/DD/YYYY HH:mm:ss' },
    { value: 'YYYY-MM-DD HH:mm:ss', label: 'YYYY-MM-DD HH:mm:ss' },
];

/* ── Main Page ── */

const GeneralPage = () => {
    const [form, setForm] = useState(DEFAULT_FORM);
    const [saved, setSaved] = useState(DEFAULT_FORM);
    const [saving, setSaving] = useState(false);

    const isDirty = JSON.stringify(form) !== JSON.stringify(saved);

    const setField = (key) => (value) => setForm((prev) => ({ ...prev, [key]: value }));

    const handleDiscard = () => setForm(saved);

    const handleSave = async () => {
        if (!form.systemName.trim()) {
            showError('System name is required.');
            return;
        }
        try {
            setSaving(true);
            // TODO: await generalService.saveSettings(form);
            await new Promise((res) => setTimeout(res, 600)); // mock delay
            setSaved(form);
            showSuccess('Settings saved successfully.');
        } catch {
            showError('Failed to save settings. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-full w-full p-3 sm:p-6">

            {/* ── Page Header ── */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="text-[18px] font-bold leading-7 text-[#1F2937]">General</h1>
                    <p className="mt-0.5 text-[13px] text-[#6B7280]">
                        Default settings applied to new companies.
                    </p>
                </div>

                {/* Action buttons — only visible when form is dirty or always per design */}
                <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                    <button
                        type="button"
                        onClick={handleDiscard}
                        disabled={!isDirty || saving}
                        className="h-9 px-4 text-[13px] font-medium text-[#374151] bg-white border border-[#D1D5DB] rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Discard
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={!isDirty || saving}
                        className="h-9 px-4 text-[13px] font-medium text-white bg-[#0057FF] rounded-lg hover:bg-[#004FE8] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {saving ? 'Saving...' : 'Save changes'}
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-5">

                {/* ── System identity ── */}
                <SectionCard
                    title="System identity"
                    description="Branding and contact information shown across the platform."
                >
                    <div className="flex flex-col gap-4">
                        <div>
                            <FieldLabel required>System name</FieldLabel>
                            <TextInput
                                value={form.systemName}
                                onChange={setField('systemName')}
                                placeholder="Enter system name"
                            />
                        </div>
                        <div>
                            <FieldLabel>System contact email</FieldLabel>
                            <TextInput
                                value={form.contactEmail}
                                onChange={setField('contactEmail')}
                                placeholder="noreply@example.com"
                                hint="Used for system notifications and automated emails."
                            />
                        </div>
                    </div>
                </SectionCard>

                {/* ── Localization ── */}
                <SectionCard
                    title="Localization"
                    description="Default language, timezone and display formats for new companies."
                >
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <FieldLabel>Default language</FieldLabel>
                            <SelectInput
                                value={form.defaultLanguage}
                                onChange={setField('defaultLanguage')}
                                options={LANGUAGE_OPTIONS}
                            />
                        </div>
                        <div>
                            <FieldLabel>Timezone</FieldLabel>
                            <SelectInput
                                value={form.timezone}
                                onChange={setField('timezone')}
                                options={TIMEZONE_OPTIONS}
                            />
                        </div>
                        <div>
                            <FieldLabel>Default records per page</FieldLabel>
                            <NumberInput
                                value={form.recordsPerPage}
                                onChange={setField('recordsPerPage')}
                            />
                        </div>
                        <div>
                            <FieldLabel>Date &amp; time format</FieldLabel>
                            <SelectInput
                                value={form.dateTimeFormat}
                                onChange={setField('dateTimeFormat')}
                                options={DATETIME_OPTIONS}
                            />
                        </div>
                    </div>
                </SectionCard>

                {/* ── Registration ── */}
                <SectionCard
                    title="Registration"
                    description="Control how new organizations can join the platform."
                >
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-[14px] font-medium text-[#1F2937]">
                                Allow new company registration
                            </p>
                            <p className="mt-0.5 text-[12px] text-[#6B7280]">
                                When enabled, external organizations can self-register. Disable to restrict onboarding to admin-invited companies only.
                            </p>
                        </div>
                        <div className="shrink-0 pt-0.5">
                            <Toggle
                                checked={form.allowNewCompany}
                                onChange={setField('allowNewCompany')}
                            />
                        </div>
                    </div>
                </SectionCard>

            </div>
        </div>
    );
};

export default GeneralPage;