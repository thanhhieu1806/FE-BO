import React from 'react';

const DeleteEmailTemplateModal = ({ row, onConfirm, onCancel }) => {
    if (!row) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
            onClick={onCancel}
        >
            {/* Modal card */}
            <div
                className="bg-white rounded-[20px] w-full max-w-[420px] p-6 flex flex-col gap-4 shadow-2xl transition-all"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Warning icon */}
                <div className="flex justify-start">
                    <div className="w-14 h-14 rounded-full bg-[#fef2f2] border border-[#fee2e2] flex items-center justify-center shrink-0">
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M12 2L1 21h22L12 2z"
                                fill="#ef4444"
                            />
                            <path
                                d="M12 9v5M12 17h.01"
                                stroke="white"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                            />
                        </svg>
                    </div>
                </div>

                {/* Title + description */}
                <div className="flex flex-col gap-2">
                    <h2 className="text-[18px] font-bold text-[#111827] leading-[26px]">
                        Delete email template{' '}
                        <span className="text-[#0057ff]">{row.name}</span>?
                    </h2>
                    <p className="text-[14px] text-[#6b7280] leading-[22px]">
                        Remove this email template. System will revert to the default template.
                    </p>
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-3 mt-2">
                    <button
                        onClick={onCancel}
                        className="flex-1 h-11 text-[14px] font-medium text-[#374151] bg-white border border-[#e5e7eb] rounded-[10px] hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onConfirm(row)}
                        className="flex-1 h-11 text-[14px] font-medium text-white bg-[#dc2626] rounded-[10px] hover:bg-[#b91c1c] transition-colors shadow-sm"
                    >
                        Delete template
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteEmailTemplateModal;