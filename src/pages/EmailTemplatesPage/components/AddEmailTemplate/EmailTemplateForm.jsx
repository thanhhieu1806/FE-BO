import React, { useState, useRef, useEffect } from 'react';


const DROPDOWN_VARIABLES = [
    '{admin_name}',
    '{admin_email}',
    '{password}',
    '{time}',
    '{from_shift}',
    '{to_shift}',
    '{join_date}',
    '{leave_type}',
    '{event_name}',
    '{event_des}',
    '{address}',
    '{phone}',
];

const ROLE_OPTIONS = ['Super Admin', 'Admin', 'Auditor', 'Employee'];

const inputClass = 'w-full h-[40px] px-3 text-[14px] text-[#1f2937] bg-white border border-[#e5e7eb] rounded-[8px] focus:outline-none focus:border-blue-500 placeholder-gray-400';

const InputField = ({ label, required, children }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[14px] leading-[20px] font-medium text-[#1f2937]">
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        {children}
    </div>
);

/* Toolbar button */
const ToolbarBtn = ({ title, onClick, active, children }) => (
    <button
        type="button"
        title={title}
        onClick={onClick}
        className={`w-7 h-7 flex items-center justify-center rounded hover:bg-gray-200/60 text-[#374151] transition-colors text-[13px] font-medium ${active ? 'bg-gray-200 text-[#111827]' : ''}`}
    >
        {children}
    </button>
);

const RichTextEditor = ({ value, onChange }) => {
    const [showVarMenu, setShowVarMenu] = useState(false);
    const menuRef = useRef(null);

    const execCmd = (cmd, val = null) => {
        document.execCommand(cmd, false, val);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setShowVarMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const insertVariable = (varName) => {
        execCmd('insertText', varName);
        setShowVarMenu(false);
    };

    return (
        <div className="border border-[#e5e7eb] rounded-[8px] overflow-hidden bg-white">
            {/* Toolbar */}
            <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-[#e5e7eb] bg-[#f9fafb] flex-wrap relative">
                <ToolbarBtn title="Bold" onClick={() => execCmd('bold')}><b>B</b></ToolbarBtn>
                <ToolbarBtn title="Italic" onClick={() => execCmd('italic')}><i>I</i></ToolbarBtn>
                <ToolbarBtn title="Underline" onClick={() => execCmd('underline')}><u>U</u></ToolbarBtn>
                <ToolbarBtn title="Strikethrough" onClick={() => execCmd('strikeThrough')}>
                    <span className="line-through">S</span>
                </ToolbarBtn>
                <div className="w-px h-4 bg-[#e5e7eb] mx-1" />
                <ToolbarBtn title="Align left" onClick={() => execCmd('justifyLeft')}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="15" y2="12" /><line x1="3" y1="18" x2="18" y2="18" /></svg>
                </ToolbarBtn>
                <ToolbarBtn title="Align center" onClick={() => execCmd('justifyCenter')}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6" /><line x1="7" y1="12" x2="17" y2="12" /><line x1="4" y1="18" x2="20" y2="18" /></svg>
                </ToolbarBtn>
                <ToolbarBtn title="Align right" onClick={() => execCmd('justifyRight')}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6" /><line x1="9" y1="12" x2="21" y2="12" /><line x1="6" y1="18" x2="21" y2="18" /></svg>
                </ToolbarBtn>
                <div className="w-px h-4 bg-[#e5e7eb] mx-1" />
                <ToolbarBtn title="Ordered list" onClick={() => execCmd('insertOrderedList')}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="10" y1="6" x2="21" y2="6" /><line x1="10" y1="12" x2="21" y2="12" /><line x1="10" y1="18" x2="21" y2="18" /><path d="M4 6h1v4" /><path d="M4 10h2" /><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" /></svg>
                </ToolbarBtn>
                <ToolbarBtn title="Unordered list" onClick={() => execCmd('insertUnorderedList')}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="9" y1="6" x2="20" y2="6" /><line x1="9" y1="12" x2="20" y2="12" /><line x1="9" y1="18" x2="20" y2="18" /><circle cx="4" cy="6" r="1" fill="currentColor" stroke="none" /><circle cx="4" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="4" cy="18" r="1" fill="currentColor" stroke="none" /></svg>
                </ToolbarBtn>
                <div className="w-px h-4 bg-[#e5e7eb] mx-1" />
                <ToolbarBtn title="Insert link" onClick={() => {
                    const url = window.prompt('URL:');
                    if (url) execCmd('createLink', url);
                }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" /></svg>
                </ToolbarBtn>
                <ToolbarBtn title="Insert image" onClick={() => {
                    const url = window.prompt('Image URL:');
                    if (url) execCmd('insertImage', url);
                }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                </ToolbarBtn>

                {/* Variable menu dropdown button */}
                <div className="relative" ref={menuRef}>
                    <ToolbarBtn
                        title="Insert variable dropdown"
                        active={showVarMenu}
                        onClick={() => setShowVarMenu((prev) => !prev)}
                    >
                        {`{ }`}
                    </ToolbarBtn>

                    {/* Variable Dropdown menu popover */}
                    {showVarMenu && (
                        <div className="absolute right-0 top-full mt-1 z-30 w-[180px] bg-white rounded-[8px] shadow-lg border border-[#e5e7eb] py-1 flex flex-col text-[13px] text-[#374151]">
                            {DROPDOWN_VARIABLES.map((v) => (
                                <button
                                    key={v}
                                    type="button"
                                    onClick={() => insertVariable(v)}
                                    className="w-full text-left px-3.5 py-1.5 hover:bg-[#f3f4f6] hover:text-[#0057ff] transition-colors font-mono"
                                >
                                    {v}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Editable area */}
            <div
                contentEditable
                suppressContentEditableWarning
                onInput={(e) => onChange(e.currentTarget.innerHTML)}
                className="min-h-[350px] max-h-[520px] overflow-y-auto px-4 py-3 text-[14px] text-[#1f2937] leading-[22px] focus:outline-none"
                dangerouslySetInnerHTML={{ __html: value }}
                style={{ wordBreak: 'break-word' }}
            />
        </div>
    );
};

/* Supported Variables pills section */
const VariablesSection = () => {
    const [showMoreMenu, setShowMoreMenu] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowMoreMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const PRIMARY_VARS = [
        '{company_name}', '{full_name}', '{logo}', '{reason}', '{status}', '{from_time}',
        '{to_time}', '{email}', '{approval_status}', '{approval_time}', '{request_time}',
    ];

    const DROPDOWN_VARS = [
        '{admin_name}', '{admin_email}', '{password}', '{time}', '{from_shift}', '{to_shift}',
        '{join_date}', '{leave_type}', '{event_name}', '{event_des}', '{address}', '{phone}',
    ];

    return (
        <div className="mt-3 relative">
            <p className="text-[12px] text-[#6b7280] mb-2 font-medium">Supported variables:</p>
            <div className="flex flex-wrap items-center gap-1.5">
                {PRIMARY_VARS.map((v) => (
                    <button
                        key={v}
                        type="button"
                        title={`Insert ${v}`}
                        className="px-2.5 py-1 text-[12px] text-[#374151] bg-[#f3f4f6] border border-[#e5e7eb] rounded-[6px] hover:bg-[#e5e7eb] transition-colors font-mono"
                        onClick={() => {
                            document.execCommand('insertText', false, v);
                        }}
                    >
                        {v}
                    </button>
                ))}

                {/* + 12 more dropdown button */}
                <div className="relative inline-block" ref={dropdownRef}>
                    <button
                        type="button"
                        className="px-3 py-1 text-[12px] text-[#0057ff] bg-white border border-[#0057ff] rounded-[6px] hover:bg-blue-50 flex items-center gap-1.5 transition-colors font-medium"
                        onClick={() => setShowMoreMenu((prev) => !prev)}
                    >
                        + 12 more
                        <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className={`transition-transform duration-200 ${showMoreMenu ? 'rotate-180' : ''}`}
                        >
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </button>

                    {/* Floating dropdown menu popover as shown in Image 3 */}
                    {showMoreMenu && (
                        <div className="absolute right-0 bottom-full mb-2 z-40 w-[190px] bg-white rounded-[10px] shadow-xl border border-[#e5e7eb] py-1.5 max-h-[220px] overflow-y-auto">
                            {DROPDOWN_VARS.map((v) => (
                                <button
                                    key={v}
                                    type="button"
                                    onClick={() => {
                                        document.execCommand('insertText', false, v);
                                        setShowMoreMenu(false);
                                    }}
                                    className="w-full text-left px-3.5 py-1.5 text-[13px] text-[#374151] hover:bg-[#f3f4f6] hover:text-[#0057ff] transition-colors font-mono"
                                >
                                    {v}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

/* Styled checkbox (rounded square, blue fill + white check when checked) */
const RoleCheckbox = ({ checked, onChange }) => (
    <label className="inline-flex items-center justify-center cursor-pointer" style={{ width: 20, height: 20 }}>
        <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="sr-only"
        />
        <span
            className={`flex items-center justify-center rounded-[4px] border transition-colors duration-150 shrink-0 ${checked ? 'bg-[#0057ff] border-[#0057ff]' : 'bg-white border-gray-300 hover:border-blue-400'
                }`}
            style={{ width: 16, height: 16 }}
        >
            {checked && (
                <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                    <path d="M1 3.5L3.2 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )}
        </span>
    </label>
);

/* Toggle switch — dùng inline style cho track/knob để tránh việc Tailwind
   purge mất class translate-x-5 sinh động lúc runtime (gây lỗi knob không
   trượt sang phải dù nền đã chuyển xanh). */
const Toggle = ({ checked, onChange }) => (
    <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only" />
        <div
            style={{
                width: 44,
                height: 24,
                borderRadius: 9999,
                display: 'flex',
                alignItems: 'center',
                padding: 4,
                boxSizing: 'border-box',
                backgroundColor: checked ? '#0057ff' : '#d1d5db',
                transition: 'background-color 200ms ease',
            }}
        >
            <div
                style={{
                    width: 16,
                    height: 16,
                    borderRadius: 9999,
                    backgroundColor: '#ffffff',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
                    transform: checked ? 'translateX(20px)' : 'translateX(0px)',
                    transition: 'transform 200ms ease',
                }}
            />
        </div>
    </label>
);

const EmailTemplateForm = ({ form, onChange }) => {
    const [lang, setLang] = useState('English (US)');

    return (
        <div className="flex flex-col gap-4" style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* Template code */}
            <InputField label="Template code" required>
                <input
                    type="text"
                    placeholder="e.g. Welcome new company"
                    value={form.templateCode}
                    onChange={(e) => onChange('templateCode', e.target.value)}
                    className={inputClass}
                />
            </InputField>

            {/* Template name */}
            <InputField label="Template name" required>
                <input
                    type="text"
                    placeholder="e.g. Welcome new company"
                    value={form.templateName}
                    onChange={(e) => onChange('templateName', e.target.value)}
                    className={inputClass}
                />
            </InputField>

            {/* Email subject */}
            <InputField label="Email subject" required>
                <input
                    type="text"
                    placeholder="e.g. Welcome to {company_name}"
                    value={form.emailSubject}
                    onChange={(e) => onChange('emailSubject', e.target.value)}
                    className={inputClass}
                />
            </InputField>

            {/* Recipient roles */}
            <div style={{ paddingTop: '4px', paddingBottom: '4px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px' }}>
                    <label style={{ fontSize: '14px', lineHeight: '20px', fontWeight: '500', color: '#1f2937', whiteSpace: 'nowrap' }}>
                        Recipient roles <span style={{ color: '#ef4444', marginLeft: '2px' }}>*</span>
                    </label>
                    {ROLE_OPTIONS.map((role) => {
                        const isChecked = form.recipientRoles?.includes(role) ?? false;
                        return (
                            <div key={role} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', userSelect: 'none' }}>
                                <RoleCheckbox
                                    checked={isChecked}
                                    onChange={(e) => {
                                        const current = form.recipientRoles ?? [];
                                        const next = e.target.checked
                                            ? [...current, role]
                                            : current.filter((r) => r !== role);
                                        onChange('recipientRoles', next);
                                    }}
                                />
                                <span style={{ fontSize: '14px', lineHeight: '20px', fontWeight: '400', color: '#1f2937' }}>{role}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Active toggle */}
            <div className="flex items-center gap-3">
                <Toggle
                    checked={form.isActive ?? true}
                    onChange={(v) => onChange('isActive', v)}
                />
                <span className="text-[14px] leading-[20px] text-[#1f2937] font-normal">Active template</span>
            </div>

            {/* Email body */}
            <InputField label="Email body" required>
                {/* Language tabs */}
                <div className="flex items-center border-b border-[#e5e7eb] mb-3 gap-2">
                    {['English (US)', 'Vietnamese'].map((l) => (
                        <button
                            key={l}
                            type="button"
                            onClick={() => setLang(l)}
                            className={`px-4 py-2 text-[14px] font-medium border-b-2 transition-colors -mb-px ${lang === l
                                ? 'border-[#0057ff] text-[#0057ff]'
                                : 'border-transparent text-[#6b7280] hover:text-[#374151]'
                                }`}
                        >
                            {l}
                        </button>
                    ))}
                </div>
                <RichTextEditor
                    value={lang === 'English (US)' ? (form.bodyEn ?? '') : (form.bodyVi ?? '')}
                    onChange={(v) => onChange(lang === 'English (US)' ? 'bodyEn' : 'bodyVi', v)}
                />
                <VariablesSection />
            </InputField>
        </div>
    );
};

export default EmailTemplateForm;