import React, { useState } from 'react';
import { LogoPng } from '../../../../assets/images';
import { showSuccess, showError } from '../../../../utils/toast';

/* Render template variables as colored spans */
const renderBody = (html) => {
    if (!html) return '';
    return html.replace(/\{\{([^}]+)\}\}|\{([^}]+)\}/g, (match) => {
        return `<span style="color:#0057ff;font-weight:500">${match}</span>`;
    });
};

const EmailPreview = ({ subject, body, senderName = 'Phạm Xuân Khánh - Mobile-ID' }) => {
    const [mode, setMode] = useState('Desktop'); // 'Desktop' | 'Mobile'

    return (
        <div className="flex flex-col h-full">
            {/* Preview header */}
            <div className="flex items-center justify-between mb-4">
                <span className="text-[14px] font-bold text-[#111827]">Preview</span>
                <div className="flex items-center gap-1 bg-[#f3f4f6] rounded-[8px] p-1">
                    {['Desktop', 'Mobile'].map((m) => (
                        <button
                            key={m}
                            onClick={() => setMode(m)}
                            className={`px-3 py-1 text-[13px] font-medium rounded-[6px] transition-all ${mode === m
                                ? 'bg-white text-[#111827] shadow-sm font-semibold'
                                : 'text-[#6b7280] hover:text-[#374151]'
                                }`}
                        >
                            {m}
                        </button>
                    ))}
                </div>
            </div>

            {/* Email card */}
            <div
                className="flex-1 overflow-auto"
                style={{ maxWidth: mode === 'Mobile' ? 360 : '100%', margin: '0 auto', width: '100%' }}
            >
                <div className="bg-white border border-[#e5e7eb] rounded-[12px] overflow-hidden shadow-sm p-5 flex flex-col justify-between min-h-[440px]">
                    <div>
                        {/* Logo header */}
                        <div className="flex items-center justify-center pt-1 pb-4">
                            <img src={LogoPng} alt="CHECKID BIOSENSE" className="h-8 object-contain" />
                        </div>

                        {/* Title */}
                        <h2 className="text-[16px] font-bold text-[#111827] mb-3 leading-[24px]">
                            Welcome to Mobile-ID Ecosystem!
                        </h2>

                        {/* Body */}
                        <div
                            className="text-[12.5px] text-[#374151] leading-[20px]"
                            dangerouslySetInnerHTML={{
                                __html: body
                                    ? renderBody(body)
                                    : `<p>Hello <span style="color:#0057ff;font-weight:500">{{first_name}}</span>,</p><br/><p>Thank you for choosing <span style="color:#0057ff;font-weight:500">{{company}}</span>. We are excited to inform you that your request has been processed successfully. You can track your progress at any time by clicking the link below.</p><br/><p>Best regards,</p><p>${senderName}</p>`
                            }}
                        />
                    </div>

                    {/* Footer */}
                    <div className="pt-4 mt-4 border-t border-[#f3f4f6] text-center">
                        <p className="text-[11px] text-[#9ca3af]">© 2026 BackOffice Inc. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ─── Test Email Delivery ─── */
export const TestEmailDelivery = () => {
    const [testEmail, setTestEmail] = useState('superadmin@gmail.com');
    const [recipientName, setRecipientName] = useState('');
    const [useSampleData, setUseSampleData] = useState(true);
    const [sending, setSending] = useState(false);

    const handleSendTest = async () => {
        if (!testEmail.trim()) {
            showError('Test recipient email is required.');
            return;
        }
        if (!recipientName.trim()) {
            showError('Recipient name is required.');
            return;
        }
        try {
            setSending(true);
            // TODO: await emailTemplateService.sendTestEmail({ to: testEmail, recipientName, useSampleData });
            await new Promise((r) => setTimeout(r, 800));
            showSuccess('Test email sent successfully!');
        } catch {
            showError('Failed to send test email. Please try again.');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="flex flex-col gap-3">
            {/* Header */}
            <div className="flex items-center gap-2">
                <span className="text-[14px] font-bold text-[#111827]">Test email delivery</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" strokeLinecap="round" />
                    <line x1="12" y1="8" x2="12.01" y2="8" strokeLinecap="round" />
                </svg>
            </div>

            {/* Test recipient */}
            <div className="flex flex-col gap-1">
                <label className="text-[13px] font-medium text-[#374151]">
                    Test recipient <span className="text-[#ef4444]">*</span>
                </label>
                <input
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full h-[38px] px-3 text-[13.5px] text-[#1f2937] bg-white border border-[#e5e7eb] rounded-[8px] focus:outline-none focus:border-[#0057ff] focus:ring-1 focus:ring-[#0057ff] placeholder-[#9ca3af]"
                />
            </div>

            {/* Recipient name */}
            <div className="flex flex-col gap-1">
                <label className="text-[13px] font-medium text-[#374151]">
                    Recipient name <span className="text-[#ef4444]">*</span>
                </label>
                <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Enter recipient name"
                    className="w-full h-[38px] px-3 text-[13.5px] text-[#1f2937] bg-white border border-[#e5e7eb] rounded-[8px] focus:outline-none focus:border-[#0057ff] focus:ring-1 focus:ring-[#0057ff] placeholder-[#9ca3af]"
                />
            </div>

            {/* Send with sample data + Send button */}
            <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                        type="checkbox"
                        checked={useSampleData}
                        onChange={(e) => setUseSampleData(e.target.checked)}
                        className="w-[17px] h-[17px] rounded-[4px] border-[#d1d5db] text-[#0057ff] focus:ring-[#0057ff] cursor-pointer accent-[#0057ff]"
                    />
                    <span className="text-[13px] text-[#374151] font-normal">Send with sample data</span>
                </label>
                <button
                    type="button"
                    onClick={handleSendTest}
                    disabled={sending}
                    className="h-[36px] px-4 text-[13px] font-medium text-white bg-[#0057ff] rounded-[8px] hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                    {sending ? 'Sending...' : 'Send test email'}
                </button>
            </div>
        </div>
    );
};

export default EmailPreview;