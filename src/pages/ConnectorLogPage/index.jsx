import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import ConnectorLogFilter from './components/ConnectorLog/ConnectorLogFilter';
import ConnectorLogTable from './components/ConnectorLog/ConnectorLogTable';
import ConnectorLogPagination from './components/ConnectorLog/ConnectorLogPagination';

const MOCK_ROWS = [
    { id: 1, logId: '1000001', name: 'MOBILE_ID_IDENTIFI...', method: 'GET', function: '/api/v1/get/me', status: 'Successful', time: '01/01/2024 14:49:00' },
    { id: 2, logId: '1000011', name: 'DMS_MOBILE_ID', method: 'POST', function: '/api/v1/refresh/cache', status: 'Successful', time: '01/01/2024 14:59:12' },
    { id: 3, logId: '1000010', name: 'GENERAL_SMS', method: 'PUT', function: '/api/v1/update/user', status: 'Failed', time: '01/01/2024 14:58:33' },
    { id: 4, logId: '1000006', name: 'MOBILE_ID_IAM', method: 'GET', function: '/api/v1/delete/item', status: 'Successful', time: '01/01/2024 14:54:10' },
    { id: 5, logId: '1000007', name: 'MOBILE_ID_IAM', method: 'GET', function: '/api/v1/create/order', status: 'Pending', time: '01/01/2024 15:10:22' },
    { id: 6, logId: '1000008', name: 'MOBILE_ID_IAM', method: 'PATCH', function: '/api/v1/fetch/details', status: 'Failed', time: '01/01/2024 15:25:47' },
    { id: 7, logId: '1000009', name: 'MOBILE_ID_IAM', method: 'DELETE', function: '/api/v1/submit/form', status: 'Successful', time: '01/01/2024 15:40:18' },
    { id: 8, logId: '1000010', name: 'MOBILE_ID_IAM', method: 'GET', function: '/api/v1/list/products', status: 'Successful', time: '01/01/2024 16:05:33' },
    { id: 9, logId: '1000011', name: 'MOBILE_ID_IAM', method: 'GET', function: '/api/v1/modify/settin...', status: 'Pending', time: '01/01/2024 16:20:55' },
    { id: 10, logId: '1000009', name: 'MOBILE_ID_IAM', method: 'GET', function: '/api/v1/reset/passwo...', status: 'Failed', time: '01/01/2024 14:57:45' },
];

const ConnectorLogsPage = () => {
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [companyFilter, setCompanyFilter] = useState('');
    const [methodFilter, setMethodFilter] = useState('');
    const [rows, setRows] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [selected, setSelected] = useState([]);

    const fetchLogs = useCallback(() => {
        let filtered = MOCK_ROWS.filter((r) => {
            const matchSearch = !searchTerm || r.name.toLowerCase().includes(searchTerm.toLowerCase()) || r.function.toLowerCase().includes(searchTerm.toLowerCase()) || r.logId.includes(searchTerm);
            const matchCompany = !companyFilter || r.name === companyFilter;
            const matchMethod = !methodFilter || r.method === methodFilter;
            return matchSearch && matchCompany && matchMethod;
        });
        setTotal(filtered.length);
        setRows(filtered.slice((page - 1) * pageSize, page * pageSize));
    }, [searchTerm, companyFilter, methodFilter, page, pageSize]);

    useEffect(() => {
        fetchLogs();
        setSelected([]);
    }, [fetchLogs]);

    const handleSelectAll = () => setSelected(selected.length === rows.length ? [] : rows.map((r) => r.id));
    const handleSelectRow = (id) => setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);

    const handleView = (row) => navigate(ROUTES.CONNECTOR_LOG_DETAIL.replace(':id', row.logId || row.id), { state: { rowData: row } });
    const handleExportCsv = () => console.log('Export CSV – mock mode');

    return (
        <div className="w-full bg-[#f8f9fb] p-4 sm:p-6 min-h-full">
            {/* Header row */}
            <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
                <div>
                    <h1 className="text-[20px] font-bold text-[#111827] leading-[28px]">Connector logs</h1>
                    <p className="text-[13px] text-[#6b7280] mt-0.5">
                        View detailed outgoing request, incoming response, and latency metrics for third-party service connections.
                    </p>
                </div>
                <button
                    onClick={handleExportCsv}
                    className="h-[36px] px-4 text-[13px] font-medium text-[#0057ff] bg-white border border-[#e5e7eb] rounded-[8px] hover:bg-gray-50 transition-colors shrink-0"
                >
                    Export CSV
                </button>
            </div>

            {/* Filters */}
            <ConnectorLogFilter
                searchTerm={searchTerm}
                onSearchChange={(v) => { setSearchTerm(v); setPage(1); }}
                dateFrom={dateFrom}
                dateTo={dateTo}
                onDateFromChange={(v) => { setDateFrom(v); setPage(1); }}
                onDateToChange={(v) => { setDateTo(v); setPage(1); }}
                companyFilter={companyFilter}
                onCompanyChange={(v) => { setCompanyFilter(v); setPage(1); }}
                methodFilter={methodFilter}
                onMethodChange={(v) => { setMethodFilter(v); setPage(1); }}
            />

            {/* Card: table + pagination */}
            <div className="bg-white border border-[#e5e7eb] rounded-[12px] overflow-hidden shadow-sm">
                <ConnectorLogTable
                    rows={rows}
                    selected={selected}
                    onSelectAll={handleSelectAll}
                    onSelectRow={handleSelectRow}
                    onView={handleView}
                />

                <div className="px-4 py-3 border-t border-[#f3f4f6]">
                    <ConnectorLogPagination
                        total={total}
                        page={page}
                        pageSize={pageSize}
                        onPageChange={setPage}
                        onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ConnectorLogsPage;
