import React, { useRef, useState } from 'react';

const PROVIDER_OPTIONS = [
    'BILLING_SERVICE',
    'SHARING_VNEID_SERVICE',
    'SMS_SERVER',
    'USB_TOKEN_SIGNING',
    'SMART_ID_SIGNING',
    'IAM_SERVICE',
    'SMTP_SERVER',
    'IDENTITY',
    'INTERNAL_SIGNING_SERVICE',
    'RSSP_MID',
];

const PREFIX_CODE_OPTIONS = [
    'RSS',
    'RSSP',
    'SMS',
    'IAM',
    'SMTP',
    'USB',
];

/* ── Input styles ── */
const inputClass =
    'w-full h-[40px] px-3 text-[14px] leading-[20px] text-[#1f2937] font-normal bg-white border border-[#e5e7eb] rounded-[8px] focus:outline-none focus:border-[#0057ff] focus:ring-1 focus:ring-[#0057ff] placeholder-[#9ca3af]';

const readonlyInputClass =
    'w-full h-[40px] px-3 pr-10 text-[14px] leading-[20px] text-[#1f2937] font-normal bg-white border border-[#e5e7eb] rounded-[8px] outline-none cursor-default select-none';

/* ── Icons ── */
const ChevronDown = () => (
    <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280]"
        width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

const CalendarIcon = () => (
    <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280]"
        width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" strokeLinecap="round" />
        <line x1="8" y1="2" x2="8" y2="6" strokeLinecap="round" />
        <line x1="3" y1="10" x2="21" y2="10" strokeLinecap="round" />
    </svg>
);

/* ── Label wrapper ── */
const InputField = ({ label, required, children }) => (
    <div className="flex flex-col gap-[6px]">
        <label className="text-[14px] leading-[20px] font-medium text-[#374151]">
            {label}
            {required && <span className="text-[#ef4444] ml-0.5">*</span>}
        </label>
        {children}
    </div>
);

/* ─── Logo Upload Zone ─── */
const LogoUpload = ({ file, onFileChange, onRemove }) => {
    const inputRef = useRef(null);

    const handleDrop = (e) => {
        e.preventDefault();
        const dropped = e.dataTransfer.files[0];
        if (dropped) onFileChange(dropped);
    };

    const handleSelect = (e) => {
        const f = e.target.files[0];
        if (f) onFileChange(f);
        e.target.value = '';
    };

    const formatSize = (bytes) => {
        if (!bytes) return '24 KB';
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <div className="flex flex-col">
            {/* ── Drop zone: nền trắng, border dashed, icon + text 1 hàng (theo ảnh 1 & 2) ── */}
            <div
                onClick={() => inputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className={[
                    'flex flex-col items-center justify-center gap-[4px]',
                    'border border-dashed border-[#d1d5db] bg-white',
                    'py-[14px] px-4 cursor-pointer',
                    'hover:border-[#0057ff] hover:bg-[#f5f8ff] transition-colors',
                    file ? 'rounded-t-[8px]' : 'rounded-[8px]',
                ].join(' ')}
            >
                {/* Icon + main text trên 1 dòng */}
                <div className="flex items-center gap-[6px]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                        stroke="#6b7280" strokeWidth="1.8">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"
                            strokeLinecap="round" strokeLinejoin="round" />
                        <polyline points="17 8 12 3 7 8"
                            strokeLinecap="round" strokeLinejoin="round" />
                        <line x1="12" y1="3" x2="12" y2="15" strokeLinecap="round" />
                    </svg>
                    <span className="text-[14px] leading-[20px] text-[#1f2937] font-normal">
                        Drag and drop your file or{' '}
                        <span className="text-[#0057ff] underline cursor-pointer">select file</span>
                    </span>
                </div>
                {/* Sub-text */}
                <p className="text-[12px] leading-[18px] text-[#9ca3af] text-center">
                    (The file format can only be .doc, .docx and pdf, files must be less than 2MB)
                </p>
            </div>

            <input ref={inputRef} type="file"
                accept=".doc,.docx,.pdf,.png,.jpg,.jpeg,.svg"
                className="hidden" onChange={handleSelect} />

            {/* ── File preview: nối liền dưới drop zone (theo ảnh 2) ── */}
            {file && (
                <div className="flex items-center justify-between gap-3 px-3 py-[10px]
                    border border-t-0 border-dashed border-[#d1d5db] rounded-b-[8px] bg-white">
                    <div className="flex items-center gap-2.5 min-w-0">
                        {/* Thumbnail nhỏ */}
                        <div className="w-9 h-9 rounded-[4px] shrink-0 overflow-hidden
                            border border-[#e5e7eb] bg-[#f0f4ff]
                            flex items-center justify-center">
                            {file.objectUrl ? (
                                <img src={file.objectUrl} alt="thumb"
                                    className="w-full h-full object-contain" />
                            ) : (
                                /* Placeholder colorful block giống FPT logo trong ảnh */
                                <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-[1px] p-[3px]">
                                    <div className="rounded-[1px] bg-[#e53935]" />
                                    <div className="rounded-[1px] bg-[#43a047]" />
                                    <div className="rounded-[1px] bg-[#1e88e5]" />
                                    <div className="rounded-[1px] bg-[#fb8c00]" />
                                </div>
                            )}
                        </div>
                        <div className="min-w-0">
                            <p className="text-[13px] font-medium text-[#1f2937] truncate">
                                {file.name || 'File-name.png'}
                            </p>
                            <p className="text-[12px] text-[#9ca3af]">{formatSize(file.size)}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                        <button type="button" title="Download"
                            className="w-7 h-7 flex items-center justify-center rounded
                                text-[#9ca3af] hover:text-[#6b7280] hover:bg-[#f3f4f6] transition-colors">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"
                                    strokeLinecap="round" strokeLinejoin="round" />
                                <polyline points="7 10 12 15 17 10"
                                    strokeLinecap="round" strokeLinejoin="round" />
                                <line x1="12" y1="15" x2="12" y2="3" strokeLinecap="round" />
                            </svg>
                        </button>
                        <button type="button" title="Remove"
                            onClick={(e) => { e.stopPropagation(); onRemove(); }}
                            className="w-7 h-7 flex items-center justify-center rounded
                                text-[#d1d5db] hover:text-[#ef4444] hover:bg-[#fef2f2] transition-colors">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="15" y1="9" x2="9" y2="15" strokeLinecap="round" />
                                <line x1="9" y1="9" x2="15" y2="15" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

/* ─── JSON syntax highlight (toàn màu xanh #0057ff theo Figma) ─── */
const highlightJson = (raw) => {
    const escaped = raw
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    return escaped
        .replace(/"([^"]+)"(?=\s*:)/g, '<span style="color:#0057ff">"$1"</span>')
        .replace(/:\s*"([^"]*)"/g, (m, v) => `: <span style="color:#0057ff">"${v}"</span>`)
        .replace(/:\s*(-?[0-9]+(\.[0-9]+)?)/g, (m, v) => `: <span style="color:#0057ff">${v}</span>`)
        .replace(/:\s*(true|false|null)/g, (m, v) => `: <span style="color:#0057ff">${v}</span>`);
};

/* ─── JSON Editor — cho phép nhập, xem & sửa JSON ─── */
export const JsonEditor = ({ value = '', onChange, readOnly = false }) => {
    const [copied, setCopied] = useState(false);
    const [jsonError, setJsonError] = useState('');

    const handleTextChange = (e) => {
        const val = e.target.value;
        if (onChange) onChange(val);
        if (!val.trim()) {
            setJsonError('');
            return;
        }
        try {
            JSON.parse(val);
            setJsonError('');
        } catch (err) {
            setJsonError(err.message);
        }
    };

    const handleCopy = () => {
        try {
            navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch { /* ignore */ }
    };

    return (
        <div className="border border-[#e5e7eb] rounded-[8px] overflow-hidden bg-white">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-[8px] border-b border-[#e5e7eb] bg-[#f8f9fb]">
                <div className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                        <polyline points="16 18 22 12 16 6" strokeLinecap="round" strokeLinejoin="round" />
                        <polyline points="8 6 2 12 8 18" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-[13px] font-medium text-[#374151]">
                        JSON Configuration
                    </span>
                </div>

                {!readOnly && (
                    <button
                            type="button"
                            onClick={handleCopy}
                            className="flex items-center gap-1.5 text-[13px] font-normal text-[#0057ff] hover:opacity-70 transition-opacity"
                        >
                            {copied ? (
                                <>
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Copy JSON
                                </>
                            )}
                        </button>
                )}
            </div>

            {/* Editable Textarea */}
            {readOnly ? (
                <pre
                    className="w-full min-h-[220px] p-4 bg-white overflow-auto m-0 text-[11px] font-mono text-[#0057ff]"
                    style={{
                        fontFamily: "'Source Code Pro', 'ui-monospace', 'SFMono-Regular', 'Menlo', monospace",
                        fontWeight: 400,
                        fontSize: '11px',
                        lineHeight: '17.88px',
                        letterSpacing: '0px',
                        color: '#0057ff',
                    }}
                    dangerouslySetInnerHTML={{ __html: highlightJson(value) }}
                />
            ) : (
                <textarea
                    value={value}
                    onChange={handleTextChange}
                    placeholder={`Enter or paste JSON configuration here...\n\nExample:\n{\n  "attributeType": "GoPaperless Workflow Configuration",\n  "attributes": []\n}`}
                    className="w-full min-h-[240px] p-4 bg-white text-[11px] font-mono text-[#0057ff] border-0 outline-none resize-y placeholder-[#9ca3af]"
                    style={{
                        fontFamily: "'Source Code Pro', 'ui-monospace', 'SFMono-Regular', 'Menlo', monospace",
                        fontWeight: 400,
                        fontSize: '11px',
                        lineHeight: '17.88px',
                        letterSpacing: '0px',
                        color: '#0057ff',
                    }}
                />
            )}

            {/* Error Message */}
            {jsonError && !readOnly && (
                <div className="px-4 py-2 bg-red-50 border-t border-red-100 text-[12px] text-red-600 font-medium flex items-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    Invalid JSON: {jsonError}
                </div>
            )}
        </div>
    );
};

/* ─── ConnectorForm ─── */
const ConnectorForm = ({ form, onChange, logoFile, onLogoChange, onLogoRemove, isEdit = false }) => (
    <div className="flex flex-col gap-4">
        {/* Row 1 */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InputField label="Connector name" required>
                <input type="text" value={form.connectorName}
                    onChange={(e) => onChange('connectorName', e.target.value)}
                    placeholder="Enter connector name" className={inputClass} />
            </InputField>
            <InputField label="Description" required>
                <input type="text" value={form.description}
                    onChange={(e) => onChange('description', e.target.value)}
                    placeholder="Enter description" className={inputClass} />
            </InputField>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InputField label="Provider" required>
                <div className="relative">
                    <select value={form.provider}
                        onChange={(e) => onChange('provider', e.target.value)}
                        className={`${inputClass} appearance-none pr-9 cursor-pointer`}>
                        <option value="">Select in the list</option>
                        {PROVIDER_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <ChevronDown />
                </div>
            </InputField>
            <InputField label="Prefix code" required>
                <div className="relative">
                    <select value={form.prefixCode}
                        onChange={(e) => onChange('prefixCode', e.target.value)}
                        className={`${inputClass} appearance-none pr-9 cursor-pointer`}>
                        <option value="">e.g RSSP</option>
                        {PREFIX_CODE_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <ChevronDown />
                </div>
            </InputField>
        </div>

        {/* Logo */}
        <InputField label="Logo">
            <LogoUpload file={logoFile} onFileChange={onLogoChange} onRemove={onLogoRemove} />
        </InputField>

        {/* Edit-only fields */}
        {isEdit && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InputField label="Created at">
                    <div className="relative">
                        <input type="text" value={form.createdAt || ''} readOnly
                            className={readonlyInputClass} />
                        <CalendarIcon />
                    </div>
                </InputField>
                <InputField label="Created by">
                    <input type="text" value={form.createdBy || ''} readOnly
                        className={`${readonlyInputClass} pr-3`} />
                </InputField>
                <InputField label="Modified at">
                    <div className="relative">
                        <input type="text" value={form.modifiedAt || ''} readOnly
                            className={readonlyInputClass} />
                        <CalendarIcon />
                    </div>
                </InputField>
                <InputField label="Modified by">
                    <input type="text" value={form.modifiedBy || ''} readOnly
                        className={`${readonlyInputClass} pr-3`} />
                </InputField>
            </div>
        )}

        {/* Active toggle */}
        {isEdit && (
            <div className="flex items-center gap-3">
                <button type="button" role="switch" aria-checked={form.isActive}
                    onClick={() => onChange('isActive', !form.isActive)}
                    style={{ width: 44, height: 24, borderRadius: 99, padding: 2, flexShrink: 0 }}
                    className={`inline-flex border-0 cursor-pointer transition-colors duration-200 focus:outline-none ${form.isActive ? 'bg-[#0057ff]' : 'bg-[#d1d5db]'}`}>
                    <span style={{
                        width: 20, height: 20, borderRadius: '50%',
                        backgroundColor: 'white',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                        transform: form.isActive ? 'translateX(20px)' : 'translateX(0px)',
                        transition: 'transform 0.2s ease',
                        display: 'inline-block', flexShrink: 0,
                    }} />
                </button>
                <span className="text-[14px] leading-[20px] font-normal text-[#374151]">
                    Active connector
                </span>
            </div>
        )}
    </div>
);

export default ConnectorForm;