import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import ConnectorFilter from './components/Connector/ConnectorFilter';
import ConnectorTable from './components/Connector/ConnectorTable';
import ConnectorPagination from './components/Connector/ConnectorPagination';
import DeleteConnectorModal from './components/DeleteConnector/DeleteConnectorModal';
import { showSuccess, showError } from '../../utils/toast';

const MOCK_ROWS = [
    { id: 1000001, name: 'TRUSTED_BILLING', provider: 'BILLING_SERVICE', createDate: '27/07/2023 11:34:13', status: 'Active', logo: true },
    { id: 1000011, name: 'SHARING_VNEID', provider: 'SHARING_VNEID_SERVICE', createDate: '25/09/2023 15:22:23', status: 'Active', logo: false },
    { id: 1000011, name: 'MNS', provider: 'SMS_SERVER', createDate: '04/05/2023 17:22:23', status: 'Active', logo: false },
    { id: 1000010, name: 'USB_TOKEN_VNPay-CA', provider: 'USB_TOKEN_SIGNING', createDate: '04/05/2023 17:18:13', status: 'Active', logo: false },
    { id: 1000010, name: 'SMART_ID_RSS_VNeID', provider: 'SMART_ID_SIGNING', createDate: '01/01/2024 14:58:33', status: 'Active', logo: false },
    { id: 1000006, name: 'Stark KEYCLOAK_IAM', provider: 'IAM_SERVICE', createDate: '04/05/2023 17:19:37', status: 'Active', logo: false },
    { id: 1000006, name: 'SMART_ID_MOBILE_ID', provider: 'SMART_ID_SIGNING', createDate: '04/05/2023 17:21:59', status: 'Active', logo: true },
    { id: 1000009, name: 'GENERAL_MAIL', provider: 'SMTP_SERVER', createDate: '01/01/2024 14:57:45', status: 'Inactive', logo: false },
    { id: 1000009, name: 'IDENTITY_MOBILE_ID', provider: 'IDENTITY', createDate: '01/01/2024 14:57:45', status: 'Inactive', logo: false },
    { id: 1000009, name: 'ISS_MOBILE-ID', provider: 'INTERNAL_SIGNING_SERVICE', createDate: '01/01/2024 14:57:45', status: 'Inactive', logo: false },
];

const EMPTY_MODE = true;

const ConnectorsPage = () => {
    const navigate = useNavigate();

    const [search, setSearch] = useState('');
    const [providerFilter, setProviderFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [rows, setRows] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [selected, setSelected] = useState([]);
    const [loading, setLoading] = useState(false);
    const [exportLoading, setExportLoading] = useState(false);
    const [deleteRow, setDeleteRow] = useState(null);

    const fetchConnectors = useCallback(async () => {
        if (EMPTY_MODE) {
            let filtered = MOCK_ROWS.filter((r) => {
                const matchSearch = !search
                    || r.name.toLowerCase().includes(search.toLowerCase())
                    || String(r.id).includes(search)
                    || r.provider.toLowerCase().includes(search.toLowerCase());
                const matchProvider = !providerFilter || r.provider === providerFilter;
                const matchStatus = !statusFilter || r.status === statusFilter;
                return matchSearch && matchProvider && matchStatus;
            });
            setTotal(filtered.length === MOCK_ROWS.length ? 97 : filtered.length);
            setRows(filtered.slice((page - 1) * pageSize, page * pageSize));
            return;
        }
        try {
            setLoading(true);
            // TODO: const data = await connectorService.getConnectors({ search, provider: providerFilter, status: statusFilter, page, pageSize });
            // setRows(data.items ?? []);
            // setTotal(data.total ?? 0);
        } catch (err) {
            console.error('Failed to fetch connectors:', err);
        } finally {
            setLoading(false);
        }
    }, [search, providerFilter, statusFilter, page, pageSize]);

    useEffect(() => { fetchConnectors(); setSelected([]); }, [fetchConnectors]);

    const handleSearchChange = (v) => { setSearch(v); setPage(1); };
    const handleProviderChange = (v) => { setProviderFilter(v); setPage(1); };
    const handleStatusChange = (v) => { setStatusFilter(v); setPage(1); };
    const handleSelectAll = () => setSelected(selected.length === rows.length ? [] : rows.map((r) => r.id));
    const handleSelectRow = (id) => setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);

    const handleEdit = (row) => navigate(ROUTES.EDIT_CONNECTOR, { state: { rowData: row } });
    const handleDelete = (row) => setDeleteRow(row);

    const handleConfirmDelete = (row) => {
        try {
            // TODO: await connectorService.deleteConnector(row.id);
            showSuccess(`Connector deleted successfully`);
            setDeleteRow(null);
            fetchConnectors();
        } catch {
            showError('Failed to delete connector. Please try again.');
        }
    };

    const handleExportCsv = async () => {
        if (EMPTY_MODE) { console.log('Export CSV – mock mode'); return; }
        try {
            setExportLoading(true);
            // TODO: const blob = await connectorService.exportCsv({ search, provider: providerFilter, status: statusFilter });
        } catch (err) {
            console.error('Export CSV failed:', err);
        } finally {
            setExportLoading(false);
        }
    };

    return (
        <div className="w-full p-3 sm:p-6">
            {/* Header row */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4">
                <div>
                    <h1 className="text-[18px] font-bold text-gray-900 leading-7">Connectors</h1>
                    <p className="text-[13px] text-gray-500 mt-0.5 font-normal">
                        Manage third-party integrations and data connectors for your platform.
                    </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                    {/* Export CSV */}
                    <button
                        onClick={handleExportCsv}
                        disabled={exportLoading}
                        className="h-9 px-4 text-[13px] font-medium text-blue-600 bg-white border border-[#D1D5DB] rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                        Export CSV
                    </button>

                    {/* Add connector */}
                    <button
                        onClick={() => navigate(ROUTES.ADD_CONNECTOR)}
                        className="h-9 px-4 text-[13px] font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap flex items-center gap-2"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round" />
                            <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
                        </svg>
                        Add connector
                    </button>
                </div>
            </div>

            {/* Filter */}
            <div className="mb-4">
                <ConnectorFilter
                    search={search} onSearchChange={handleSearchChange}
                    providerFilter={providerFilter} onProviderChange={handleProviderChange}
                    statusFilter={statusFilter} onStatusChange={handleStatusChange}
                />
            </div>

            {/* Card: table + pagination */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
                <ConnectorTable
                    rows={rows}
                    selected={selected}
                    onSelectAll={handleSelectAll}
                    onSelectRow={handleSelectRow}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    loading={loading}
                />

                <div className="px-4 py-3 border-t border-[#F3F4F6]">
                    <ConnectorPagination
                        page={page}
                        pageSize={pageSize}
                        total={total}
                        onPageChange={setPage}
                        onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
                    />
                </div>
            </div>

            {/* Delete modal */}
            <DeleteConnectorModal
                row={deleteRow}
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteRow(null)}
            />
        </div>
    );
};

export default ConnectorsPage;