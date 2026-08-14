import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../../../../constants/routes';
import ConnectorForm, { JsonEditor } from '../AddConnector/ConnectorForm';
import { showSuccess, showError } from '../../../../utils/toast';

const DEFAULT_JSON = `{
  "attributeType": "GoPaperless Workflow Configuration",
  "remarkEn": "All of configuration of GoPaperless Workflow System",
  "remark": "Cấu hình của hệ thống GoPaperless Workflow",
  "attributes": [
    {
      "dateFormat": "dd/MM/yyyy HH:mm:ss",
      "qr_expired_time": "100",
      "max_field_name": 120,
      "max_template_name": 50,
      "max_category_name": 50,
      "max_size_store": 50000
    }
  ]
}`;

const EditConnectorPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const rowData = location.state?.rowData ?? {};

    const [form, setForm] = useState({
        connectorName: rowData.name ?? '',
        description: rowData.description ?? 'VNeID',
        provider: rowData.provider ?? '',
        prefixCode: rowData.prefixCode ?? 'RSS',
        isActive: rowData.status === 'Active',
        createdAt: rowData.createDate ?? '11/05/2026 09:30:28',
        createdBy: rowData.createdBy ?? 'SYSTEM_GENERATED',
        modifiedAt: rowData.modifiedAt ?? '11/05/2026 09:30:28',
        modifiedBy: rowData.modifiedBy ?? 'GiaTK',
    });

    // Mock file đã upload sẵn khi edit
    const [logoFile, setLogoFile] = useState(
        rowData.logo ? { name: 'File-name.png', size: 24 * 1024 } : null
    );

    const getInitialJson = () => {
        if (rowData.config) {
            if (typeof rowData.config === 'string') {
                try {
                    return JSON.stringify(JSON.parse(rowData.config), null, 2);
                } catch {
                    return rowData.config;
                }
            }
            return JSON.stringify(rowData.config, null, 2);
        }
        if (rowData.jsonConfig) {
            return typeof rowData.jsonConfig === 'string' ? rowData.jsonConfig : JSON.stringify(rowData.jsonConfig, null, 2);
        }
        return DEFAULT_JSON;
    };

    const [jsonConfig, setJsonConfig] = useState(getInitialJson);
    const [saving, setSaving] = useState(false);

    const handleFormChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleCancel = () => navigate(ROUTES.CONNECTORS);

    const handleSave = async () => {
        if (!form.connectorName.trim()) {
            showError('Connector name is required.');
            return;
        }
        if (!form.provider) {
            showError('Please select a provider.');
            return;
        }
        try {
            setSaving(true);
            // TODO: await connectorService.updateConnector(rowData.id, { ...form, config: jsonConfig, logo: logoFile });
            await new Promise((res) => setTimeout(res, 600));
            showSuccess('Connector updated successfully');
            navigate(ROUTES.CONNECTORS);
        } catch {
            showError('Failed to update connector. Please try again.');
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
                    Connectors
                </button>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                </svg>
                <span className="font-bold text-[#0057ff]">Edit connector</span>
            </nav>

            {/* Page header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-5">
                <div>
                    <h1 className="text-[20px] font-bold text-[#111827] leading-[28px]">Edit connector</h1>
                    <p className="text-[13px] text-[#6b7280] mt-0.5">
                        Update connector information and configuration properties.
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
                        onClick={handleSave}
                        disabled={saving}
                        className="h-[36px] px-4 text-[13px] font-medium text-white bg-blue-600 rounded-[8px] hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? 'Updating...' : 'Update connector'}
                    </button>
                </div>
            </div>

            {/* General information */}
            <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-4 sm:p-6 mb-4">
                <h2 className="text-[14px] font-bold text-[#111827] mb-4">General information</h2>
                <ConnectorForm
                    form={form}
                    onChange={handleFormChange}
                    logoFile={logoFile}
                    onLogoChange={setLogoFile}
                    onLogoRemove={() => setLogoFile(null)}
                    isEdit={true}
                />
            </div>

            {/* Configuration properties */}
            <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-4 sm:p-6">
                <h2 className="text-[14px] font-bold text-[#111827] mb-4">Configuration properties</h2>
                <JsonEditor value={jsonConfig} onChange={setJsonConfig} />
            </div>
        </div>
    );
};

export default EditConnectorPage;