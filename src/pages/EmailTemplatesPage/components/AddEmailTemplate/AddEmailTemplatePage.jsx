import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../../constants/routes';
import EmailTemplateForm from './EmailTemplateForm';
import EmailPreview from '../EmailTemplate/EmailPreview';
import { showSuccess, showError } from '../../../../utils/toast';

const INITIAL_FORM = {
    templateCode: '',
    templateName: '',
    emailSubject: '',
    recipientRoles: [],
    isActive: true,
    bodyEn: `<p>Hello <span style="color:#0057ff;font-weight:500">{{first_name}}</span>,</p><p><br/></p><p>Thank you for choosing <span style="color:#0057ff;font-weight:500">{{company}}</span>. We are excited to inform you that your request has been processed successfully. You can track your progress at any time by clicking the link below.</p><p><br/></p><p>Best regards,</p><p>Phạm Xuân Khánh - Mobile-ID</p>`,
    bodyVi: '',
};

const AddEmailTemplatePage = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState(INITIAL_FORM);
    const [saving, setSaving] = useState(false);
    const [savingDraft, setSavingDraft] = useState(false);

    const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

    const validate = () => {
        if (!form.templateCode.trim()) { showError('Template code is required.'); return false; }
        if (!form.templateName.trim()) { showError('Template name is required.'); return false; }
        if (!form.emailSubject.trim()) { showError('Email subject is required.'); return false; }
        if (!form.recipientRoles.length) { showError('Select at least one recipient role.'); return false; }
        return true;
    };

    const handleCancel = () => navigate(ROUTES.EMAIL_TEMPLATES);

    const handleSaveDraft = async () => {
        if (!form.templateCode.trim()) { showError('Template code is required.'); return; }
        try {
            setSavingDraft(true);
            // TODO: await emailTemplateService.saveDraft({ ...form, status: 'Draft' });
            await new Promise((r) => setTimeout(r, 400));
            showSuccess('Draft saved successfully');
            navigate(ROUTES.EMAIL_TEMPLATES);
        } catch {
            showError('Failed to save draft. Please try again.');
        } finally {
            setSavingDraft(false);
        }
    };

    const handleCreate = async () => {
        if (!validate()) return;
        try {
            setSaving(true);
            // TODO: await emailTemplateService.createTemplate({ ...form, status: form.isActive ? 'Active' : 'Inactive' });
            await new Promise((r) => setTimeout(r, 600));
            showSuccess('Email template created successfully');
            navigate(ROUTES.EMAIL_TEMPLATES);
        } catch {
            showError('Failed to create template. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="w-full bg-[#f8f9fb] p-3 sm:p-6 min-h-full">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-[16px] leading-[24px] mb-4">
                <button
                    onClick={handleCancel}
                    className="font-normal text-[#1f2937] hover:text-[#111827] transition-colors"
                >
                    Email templates
                </button>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                </svg>
                <span className="font-bold text-[#0057ff]">Add email template</span>
            </nav>

            {/* Page header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-5">
                <div>
                    <h1 className="text-[20px] font-bold text-[#111827] leading-[28px]">Add template</h1>
                    <p className="text-[13px] text-[#6b7280] mt-0.5">
                        Create a new email template for users or companies.
                    </p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                    <button
                        onClick={handleCancel}
                        className="h-[36px] px-4 text-[13px] font-medium text-[#374151] bg-white border border-[#e5e7eb] rounded-[8px] hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSaveDraft}
                        disabled={savingDraft}
                        className="h-[36px] px-4 text-[13px] font-medium text-[#0057ff] bg-white border border-[#e5e7eb] rounded-[8px] hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        {savingDraft ? 'Saving...' : 'Save draft'}
                    </button>
                    <button
                        onClick={handleCreate}
                        disabled={saving}
                        className="h-[36px] px-4 text-[13px] font-medium text-white bg-[#0057ff] rounded-[8px] hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? 'Creating...' : 'Create template'}
                    </button>
                </div>
            </div>

            {/* Two-column layout: form + preview */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                {/* Left: Template setup */}
                <div className="flex-1 bg-white rounded-[12px] border border-[#e5e7eb] p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-[14px] font-bold text-[#111827]">Template setup</h2>
                        <button
                            type="button"
                            onClick={() => setForm(INITIAL_FORM)}
                            className="flex items-center gap-1.5 text-[13px] text-[#374151] hover:text-blue-600 transition-colors"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M3 3v5h5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Reset to default
                        </button>
                    </div>
                    <EmailTemplateForm form={form} onChange={handleChange} />
                </div>

                {/* Right: Preview — full width mobile, fixed width desktop */}
                <div className="w-full lg:w-[380px] lg:shrink-0 bg-white rounded-[12px] border border-[#e5e7eb] p-4 sm:p-5">
                    <EmailPreview subject={form.emailSubject} body={form.bodyEn} />
                </div>
            </div>
        </div>
    );
};

export default AddEmailTemplatePage;