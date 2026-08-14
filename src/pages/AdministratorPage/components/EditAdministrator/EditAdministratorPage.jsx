import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../../../../constants/routes';
import AdministratorForm from '../AddAdministrator/AdministratorForm';
import AdminPermissionsTable from '../AddAdministrator/AdminPermissionsTable';
import { showSuccess, showError } from '../../../../utils/toast';

const DEFAULT_PERMISSIONS = [
    { module: 'Overview', view: true, create: null, edit: null, delete: null, export: false },
    { module: 'Company', view: true, create: null, edit: null, delete: null, export: false },
    { module: 'Administrators', view: true, create: false, edit: false, delete: false, export: true },
    { module: 'Roles & permissions', view: true, create: false, edit: false, delete: false, export: true },
    { module: 'General settings', view: true, create: null, edit: true, delete: null, export: null },
    { module: 'Connectors', view: true, create: true, edit: true, delete: false, export: false },
    { module: 'Email templates', view: true, create: true, edit: true, delete: true, export: true },
    { module: 'Audit logs', view: true, create: null, edit: null, delete: null, export: false },
];

const EditAdministratorPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const rowData = location.state?.rowData ?? null;

    const [form, setForm] = useState({
        fullName: '',
        email: '',
        role: 'Admin',
        phone: '',
        isActive: true,
    });
    const [permissions, setPermissions] = useState(DEFAULT_PERMISSIONS);

    useEffect(() => {
        if (rowData) {
            setForm({
                fullName: rowData.name ?? '',
                email: rowData.email ?? '',
                role: rowData.role ?? 'Admin',
                phone: rowData.phone ?? '',
                isActive: rowData.status === 'Active',
            });
        }
    }, [rowData]);

    const handleFormChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));
    const handlePermissionChange = (moduleIndex, permKey) => {
        setPermissions((prev) =>
            prev.map((row, idx) => {
                if (idx !== moduleIndex) return row;
                if (row[permKey] === null) return row;
                return { ...row, [permKey]: !row[permKey] };
            })
        );
    };
    const handleResetToDefault = () => setPermissions(DEFAULT_PERMISSIONS);
    const handleCancel = () => navigate(ROUTES.ADMINISTRATORS);
    const handleSave = () => {
        try {
            showSuccess('Administrator updated successfully');
            navigate(ROUTES.ADMINISTRATORS);
        } catch (err) {
            showError('Update failed, please try again');
        }
    };

    return (
        <div className="min-h-full bg-[#f8f9fb] p-4 sm:p-6">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-[13px] mb-4">
                <button
                    onClick={handleCancel}
                    className="font-normal text-[16px] leading-[24px] text-[#1f2937] hover:text-[#111827] transition-colors"
                >
                    Administrators
                </button>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6" />
                </svg>
                <span className="font-bold text-[16px] leading-[24px] text-[#0057ff]">Edit administrators</span>
            </nav>

            {/* Page header — wrap trên mobile */}
            <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
                <div className="min-w-0">
                    <h1 className="text-[20px] font-bold text-[#111827] leading-[28px]">Edit administrators</h1>
                    <p className="text-[13px] text-[#6b7280] mt-0.5">
                        Update this administrator's details and access role.
                    </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <button
                        onClick={handleCancel}
                        className="h-[36px] px-4 text-[13px] font-medium text-[#374151] bg-white border border-[#e5e7eb] rounded-[8px] hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="h-[36px] px-4 text-[13px] font-medium text-white bg-blue-600 rounded-[8px] hover:bg-blue-700 transition-colors"
                    >
                        Save changes
                    </button>
                </div>
            </div>

            {/* Administrator details */}
            <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-4 sm:p-6 mb-4">
                <h2 className="text-[14px] font-bold text-[#111827] mb-4">Administrator details</h2>
                <AdministratorForm form={form} onChange={handleFormChange} />
            </div>

            {/* Permissions */}
            <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-[14px] font-bold text-[#111827]">Permissions</h2>
                    <button
                        onClick={handleResetToDefault}
                        className="flex items-center gap-1.5 text-[13px] text-[#6b7280] hover:text-[#374151] transition-colors"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                            <path d="M3 3v5h5" />
                        </svg>
                        Reset to default
                    </button>
                </div>
                <AdminPermissionsTable
                    permissions={permissions}
                    onChange={handlePermissionChange}
                />
            </div>
        </div>
    );
};

export default EditAdministratorPage;