import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../../../../constants/routes';
import { showSuccess } from '../../../../utils/toast';

/* ─── JSON syntax highlight ─── */
const highlightJson = (raw) => {
    if (!raw) return '';
    const str = typeof raw === 'string' ? raw : JSON.stringify(raw, null, 2);
    const escaped = str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return escaped
        .replace(/"([^"]+)"(?=\s*:)/g, '<span style="color:#0057ff">"$1"</span>')
        .replace(/:\s*"([^"]*)"/g, (m, v) => `: <span style="color:#0057ff">"${v}"</span>`)
        .replace(/:\s*(-?[0-9]+(\.[0-9]+)?)/g, (m, v) => `: <span style="color:#0057ff">${v}</span>`)
        .replace(/:\s*(true|false|null)/g, (m, v) => `: <span style="color:#0057ff">${v}</span>`);
};

/* ─── Copy icon ─── */
const CopyIcon = ({ size = 13 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
);

/* ─── Code icon for JSON panels ─── */
const CodeIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
    </svg>
);

/* ─── InfoRow ─── */
const InfoRow = ({ label, children }) => (
    <div className="flex items-start gap-2">
        <span className="text-[13px] text-[#6b7280] w-[120px] shrink-0 leading-[20px]">{label}</span>
        <span className="text-[13px] text-[#111827] font-normal leading-[20px] break-all">{children}</span>
    </div>
);

/* ─── JSON Panel ─── */
const JsonPanel = ({ title, rawJson }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(typeof rawJson === 'string' ? rawJson : JSON.stringify(rawJson, null, 2));
            setCopied(true);
            showSuccess('Copied to clipboard');
            setTimeout(() => setCopied(false), 1500);
        } catch { /* ignore */ }
    };

    return (
        <div className="flex-1 min-w-0 border border-[#e5e7eb] rounded-[8px] overflow-hidden bg-white">
            {/* Panel header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#e5e7eb] bg-white">
                <div className="flex items-center gap-2 text-[#374151]">
                    <CodeIcon />
                    <span className="text-[13px] font-semibold text-[#111827]">{title}</span>
                </div>
                <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-[12px] font-medium text-[#0057ff] hover:opacity-70 transition-opacity"
                >
                    <CopyIcon />
                    {copied ? 'Copied' : 'Copy JSON'}
                </button>
            </div>
            {/* JSON content */}
            <pre
                className="px-4 py-3 text-[11px] leading-[18px] font-mono overflow-auto m-0 bg-white"
                style={{
                    fontFamily: "'Source Code Pro', 'ui-monospace', monospace",
                    color: '#0057ff',
                    minHeight: 120,
                    maxHeight: 240,
                }}
                dangerouslySetInnerHTML={{ __html: highlightJson(rawJson) }}
            />
        </div>
    );
};

/* ─── Mock data ─── */
const MOCK_DETAIL = {
    logId: '23142154',
    company: 'MOBILE-ID TECH',
    actor: 'Luu Thi Thom',
    actorEmail: 'thom@mobile-id.vn',
    action: 'Update',
    ipAddress: '10.0.12.45',
    url: 'http://10.1.0.24:20080/api/v1/refresh/cache',
    userAgent: 'Mobile',
    module: 'Connectors',
    responseCode: '1001',
    responseMessage: 'User not found',
    time: '01/02/2024 09:15:00',
    requestHeader: JSON.stringify({
        attributeType: 'GoPaperless Workflow Configuration',
        remarkEn: 'All of configuration of GoPaperless Workflow System',
        remark: 'Cấu hình của hệ thống GoPaperless Workflow',
        attributes: [{ dateFormat: 'dd/MM/yyyy HH:mm:ss' }],
    }, null, 2),
    responseHeader: JSON.stringify({
        attributeType: 'GoPaperless Workflow Configuration',
        remarkEn: 'All of configuration of GoPaperless Workflow System',
        remark: 'Cấu hình của hệ thống GoPaperless Workflow',
        attributes: [{ dateFormat: 'dd/MM/yyyy HH:mm:ss' }],
    }, null, 2),
    request: JSON.stringify({ code: 1001, message: 'User not found' }, null, 2),
    response: JSON.stringify({
        attributeType: 'GoPaperless Workflow Configuration',
        remarkEn: 'All of configuration of GoPaperless Workflow System',
        remark: 'Cấu hình của hệ thống GoPaperless Workflow',
        attributes: [{ dateFormat: 'dd/MM/yyyy HH:mm:ss' }],
    }, null, 2),
};

const DetailAuditLogPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const rowData = location.state?.rowData ?? {};
    const [urlCopied, setUrlCopied] = useState(false);

    const detail = {
        ...MOCK_DETAIL,
        company: rowData.company ?? MOCK_DETAIL.company,
        module: rowData.module ?? MOCK_DETAIL.module,
        time: rowData.time ?? MOCK_DETAIL.time,
        actor: rowData.actor ?? MOCK_DETAIL.actor,
        action: rowData.action ?? MOCK_DETAIL.action,
        ipAddress: rowData.ipAddress ?? MOCK_DETAIL.ipAddress,
    };

    const handleBack = () => navigate(ROUTES.AUDIT_LOGS);
    const handleExportCsv = () => console.log('Export CSV – mock mode');

    const handleCopyUrl = async () => {
        try {
            await navigator.clipboard.writeText(detail.url);
            setUrlCopied(true);
            setTimeout(() => setUrlCopied(false), 1500);
        } catch { /* ignore */ }
    };

    return (
        <div className="w-full bg-[#f8f9fb] p-4 sm:p-6 min-h-full">

            {/* Header row: back link + title + Export CSV */}
            <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
                <div className="min-w-0">
                    {/* Back link */}
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-1.5 text-[13px] text-[#374151] hover:text-[#111827] transition-colors mb-2"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12" />
                            <polyline points="12 19 5 12 12 5" />
                        </svg>
                        Back to Audit logs
                    </button>
                    <h1 className="text-[20px] font-bold text-[#111827] leading-[28px]">Audit log details</h1>
                    <p className="text-[13px] text-[#6b7280] mt-0.5">View details of this recorded event.</p>
                </div>
                <button
                    onClick={handleExportCsv}
                    className="h-[36px] px-4 text-[13px] font-medium text-[#0057ff] bg-white border border-[#e5e7eb] rounded-[8px] hover:bg-gray-50 transition-colors self-start"
                >
                    Export CSV
                </button>
            </div>

            {/* Log information card */}
            <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-4 sm:p-6 mb-4">
                <h2 className="text-[14px] font-bold text-[#111827] mb-4">Log information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-3">
                    {/* Left column */}
                    <div className="flex flex-col gap-3">
                        <InfoRow label="Log ID:">
                            {detail.logId}
                        </InfoRow>
                        <InfoRow label="Company:">
                            <span className="text-[#0057ff] font-medium">{detail.company}</span>
                        </InfoRow>
                        <InfoRow label="Actor:">
                            {detail.actor}
                        </InfoRow>
                        <InfoRow label="Actor email:">
                            {detail.actorEmail}
                        </InfoRow>
                        <InfoRow label="Action:">
                            <span className="text-[#0057ff] font-medium">{detail.action}</span>
                        </InfoRow>
                        <InfoRow label="IP address:">
                            {detail.ipAddress}
                        </InfoRow>
                    </div>

                    {/* Right column */}
                    <div className="flex flex-col gap-3">
                        <InfoRow label="URL:">
                            <span className="flex items-center gap-2 flex-wrap">
                                <a
                                    href={detail.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[#0057ff] underline hover:opacity-70 break-all"
                                >
                                    {detail.url}
                                </a>
                                <button
                                    type="button"
                                    onClick={handleCopyUrl}
                                    title={urlCopied ? 'Copied!' : 'Copy URL'}
                                    className={`transition-colors shrink-0 text-[12px] flex items-center gap-1 ${urlCopied ? 'text-[#16a34a]' : 'text-[#9ca3af] hover:text-[#6b7280]'}`}
                                >
                                    <CopyIcon size={14} />
                                    {urlCopied && <span>Copied!</span>}
                                </button>
                            </span>
                        </InfoRow>
                        <InfoRow label="User agent:">
                            {detail.userAgent}
                        </InfoRow>
                        <InfoRow label="Module:">
                            {detail.module}
                        </InfoRow>
                        <InfoRow label="Response code:">
                            <span className={`inline-flex items-center justify-center px-3 py-0.5 text-[12.5px] font-semibold rounded-full ${detail.responseCode === '200' || detail.responseCode === 200 ? 'bg-[#e6f4ea] text-[#16a34a]' : 'bg-[#fef2f2] text-[#ef4444]'}`}>
                                {detail.responseCode}
                            </span>
                        </InfoRow>
                        <InfoRow label="Response message:">
                            {detail.responseMessage}
                        </InfoRow>
                        <InfoRow label="Time:">
                            {detail.time}
                        </InfoRow>
                    </div>
                </div>
            </div>

            {/* Request & Response details card */}
            <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-4 sm:p-6">
                <h2 className="text-[14px] font-bold text-[#111827] mb-4">Request &amp; Response details</h2>

                {/* Row 1: Request header | Response header */}
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <JsonPanel title="Request header" rawJson={detail.requestHeader} />
                    <JsonPanel title="Response header" rawJson={detail.responseHeader} />
                </div>

                {/* Row 2: Request | Response */}
                <div className="flex flex-col md:flex-row gap-4">
                    <JsonPanel title="Request" rawJson={detail.request} />
                    <JsonPanel title="Response" rawJson={detail.response} />
                </div>
            </div>
        </div>
    );
};

export default DetailAuditLogPage;