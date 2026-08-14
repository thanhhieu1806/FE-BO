import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../../../../constants/routes';
import { showSuccess, showError } from '../../../../utils/toast';
import RolePermissionsTable from '../Role/RolePermissionsTable';

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

const inputClass = 'w-full h-[40px] px-3 text-[13px] text-[#1f2937] bg-white border border-[#e5e7eb] rounded-[8px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-400';

const EditRolePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const rowData = location.state?.rowData ?? null;

    const [roleName, setRoleName] = useState('');
    const [description, setDescription] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [permissions, setPermissions] = useState(DEFAULT_PERMISSIONS);

    useEffect(() => {
        if (rowData) {
            setRoleName(rowData.roleName ?? '');
            setDescription(rowData.description ?? '');
            setIsActive(rowData.status === 'Active');
        }
    }, [rowData]);

    const handlePermissionChange = (moduleIndex, permKey) => {
        setPermissions((prev) => prev.map((row, idx) => {
            if (idx !== moduleIndex) return row;
            if (row[permKey] === null) return row;
            return { ...row, [permKey]: !row[permKey] };
        }));
    };

    const handleSave = () => {
        try {
            showSuccess('Role updated successfully');
            navigate(ROUTES.ROLES);
        } catch (err) {
            showError('Failed to update role, please try again');
        }
    };

    return (
        <div className="min-h-full bg-[#f8f9fb] p-4 sm:p-6">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-[16px] leading-[24px] mb-4">
                <button
                    onClick={() => navigate(ROUTES.ROLES)}
                    className="font-normal text-[#1f2937] hover:text-[#111827] transition-colors"
                >
                    Roles & Permissions
                </button>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                </svg>
                <span className="font-bold text-[#0057ff]">Edit roles & permissions</span>
            </nav>

            {/* Header — wrap trên mobile */}
            <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
                <div className="min-w-0">
                    <h1 className="text-[20px] font-bold text-[#111827] leading-[28px]">Edit Role</h1>
                    <p className="text-[13px] text-[#6b7280] mt-0.5">
                        Update this role's permissions and assigned users to control platform access.
                    </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <button
                        onClick={() => navigate(ROUTES.ROLES)}
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

            {/* Role details */}
            <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-4 sm:p-6 mb-4">
                <h2 className="text-[14px] font-bold text-[#111827] mb-4">Role details</h2>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-medium text-[#374151]">
                            Role name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={roleName}
                            onChange={(e) => setRoleName(e.target.value)}
                            className={inputClass}
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-medium text-[#374151]">Description</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className={inputClass}
                        />
                    </div>
                    <div className="flex items-center gap-2.5">
                        <button
                            type="button"
                            onClick={() => setIsActive(!isActive)}
                            className={`relative inline-flex h-[22px] w-[40px] shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none ${isActive ? 'bg-blue-600' : 'bg-gray-300'}`}
                        >
                            <span className={`inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow transition-transform duration-200 ${isActive ? 'translate-x-[19px]' : 'translate-x-[2px]'}`} />
                        </button>
                        <span className="text-[13px] text-[#374151] font-medium">Active role</span>
                    </div>
                </div>
            </div>

            {/* Permissions */}
            <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-[14px] font-bold text-[#111827]">Permissions</h2>
                    <button
                        onClick={() => setPermissions(DEFAULT_PERMISSIONS)}
                        className="flex items-center gap-1.5 text-[13px] text-[#6b7280] hover:text-[#374151] transition-colors"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                            <path d="M3 3v5h5" />
                        </svg>
                        Reset to default
                    </button>
                </div>
                <RolePermissionsTable permissions={permissions} onChange={handlePermissionChange} />
            </div>
        </div>
    );
};

export default EditRolePage;