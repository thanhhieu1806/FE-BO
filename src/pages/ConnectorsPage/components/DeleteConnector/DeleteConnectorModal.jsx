import React from 'react';

const DeleteConnectorModal = ({ row, onConfirm, onCancel }) => {
    if (!row) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 z-50 flex items-center justify-center"
                style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                onClick={onCancel}
            >
                {/* Modal */}
                <div
                    className="bg-white rounded-[16px] w-full max-w-[400px] mx-4 p-5 sm:p-6 flex flex-col gap-4 shadow-xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Warning icon */}
                    <div className="flex justify-start">
                        <div className="w-[64px] h-[64px] rounded-full flex items-center justify-center"
                            style={{ backgroundColor: '#fff1f1' }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                                    fill="#ef4444"
                                />
                                <line x1="12" y1="9" x2="12" y2="13" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                <line x1="12" y1="17" x2="12.01" y2="17" stroke="white" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </div>
                    </div>

                    {/* Title + description */}
                    <div className="flex flex-col gap-2">
                        <h2 className="text-[18px] font-bold text-[#111827] leading-[26px]">
                            Delete connector{' '}
                            <span className="text-[#0057ff]">{row.name}</span>?
                        </h2>
                        <p className="text-[14px] text-[#6b7280] leading-[22px]">
                            Remove this integration and disconnect all linked services.
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 mt-2">
                        <button
                            onClick={onCancel}
                            className="flex-1 h-[44px] text-[14px] font-medium text-[#374151] bg-white border border-[#e5e7eb] rounded-[10px] hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => onConfirm(row)}
                            className="flex-1 h-[44px] text-[14px] font-medium text-white rounded-[10px] transition-colors"
                            style={{ backgroundColor: '#ef4444' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
                        >
                            Delete connector
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DeleteConnectorModal;