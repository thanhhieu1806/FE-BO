import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import AuditLogFilter from './components/AuditLog/AuditLogFilter';
import AuditLogTable from './components/AuditLog/AuditLogTable';
import AuditLogPagination from './components/AuditLog/AuditLogPagination';

const MOCK_ROWS = [
    { id: 1, time: '01/01/2024 14:49:00', company: 'MOBILE-ID TECH', actor: 'Lưu Thị Thơm', action: 'Update', module: 'Connectors', ipAddress: '10.0.12.45' },
    { id: 2, time: '01/02/2024 09:15:00', company: 'DIGITAL WAVE SOLUTIONS', actor: 'Phạm Xuân Khánh', action: 'Create', module: 'Company', ipAddress: '' },
    { id: 3, time: '01/03/2024 08:00:00', company: 'NEXGEN SOFTWARE INC.', actor: 'Phạm Xuân Khánh', action: 'Login', module: 'Connectors', ipAddress: '10.0.8.22' },
    { id: 4, time: '01/01/2024 14:49:00', company: 'VORTEX INNOVATIONS', actor: 'Phạm Xuân Khánh', action: 'Create', module: 'Email templates', ipAddress: '10.0.12.45' },
    { id: 5, time: '01/04/2024 16:30:00', company: 'CYBERNETIC DYNAMICS', actor: 'Phạm Xuân Khánh', action: 'Create', module: 'Company', ipAddress: '192.168.1.102' },
    { id: 6, time: '01/04/2024 16:30:00', company: 'QUANTUM BYTE LABS', actor: 'Phạm Xuân Khánh', action: 'Create', module: 'Company', ipAddress: '192.168.1.102' },
    { id: 7, time: '01/04/2024 17:05:23', company: 'INFINITY TECH HUB', actor: 'Lê Thị Hương', action: 'Update', module: 'Email templates', ipAddress: '192.168.1.103' },
    { id: 8, time: '01/04/2024 17:45:12', company: 'ECLIPSE SYSTEMS', actor: 'Nguyễn Văn An', action: 'Delete', module: 'Email templates', ipAddress: '192.168.1.104' },
    { id: 9, time: '01/04/2024 18:15:47', company: 'PIONEER DATA CORP', actor: 'Trần Minh Tuấn', action: 'Create', module: 'Connectors', ipAddress: '192.168.1.105' },
    { id: 10, time: '01/04/2024 18:15:47', company: 'ASTRAL NETWORKS', actor: 'Trần Minh Tuấn', action: 'Create', module: 'Connectors', ipAddress: '192.168.1.105' },
];

const EMPTY_MODE = true;

const parseDMY = (str) => {
    if (!str) return null;
    const [d, m, y] = str.split('/').map(Number);
    if (!d || !m || !y) return null;
    return new Date(y, m - 1, d);
};

const rowDateOnly = (time) => parseDMY(time.split(' ')[0]);

const AuditLogsPage = () => {
    const navigate = useNavigate();

    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [companyFilter, setCompanyFilter] = useState('');
    const [actionFilter, setActionFilter] = useState('');
    const [moduleFilter, setModuleFilter] = useState('');
    const [rows, setRows] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [selected, setSelected] = useState([]);
    const [loading, setLoading] = useState(false);
    const [exportLoading, setExportLoading] = useState(false);

    const fetchLogs = useCallback(async () => {
        if (EMPTY_MODE) {
            const from = parseDMY(dateFrom);
            const to = parseDMY(dateTo);
            const filtered = MOCK_ROWS.filter((r) => {
                const matchCompany = !companyFilter || r.company === companyFilter;
                const matchAction = !actionFilter || r.action === actionFilter;
                const matchModule = !moduleFilter || r.module === moduleFilter;
                const rDate = rowDateOnly(r.time);
                const matchFrom = !from || !rDate || rDate >= from;
                const matchTo = !to || !rDate || rDate <= to;
                return matchCompany && matchAction && matchModule && matchFrom && matchTo;
            });
            setTotal(filtered.length);
            setRows(filtered.slice((page - 1) * pageSize, page * pageSize));
            return;
        }
        try {
            setLoading(true);
        } catch (err) {
            console.error('Failed to fetch audit logs:', err);
        } finally {
            setLoading(false);
        }
    }, [dateFrom, dateTo, companyFilter, actionFilter, moduleFilter, page, pageSize]);

    useEffect(() => { fetchLogs(); setSelected([]); }, [fetchLogs]);

    const handleDateFromChange = (v) => { setDateFrom(v); setPage(1); };
    const handleDateToChange = (v) => { setDateTo(v); setPage(1); };
    const handleCompanyChange = (v) => { setCompanyFilter(v); setPage(1); };
    const handleActionChange = (v) => { setActionFilter(v); setPage(1); };
    const handleModuleChange = (v) => { setModuleFilter(v); setPage(1); };
    const handleSelectAll = () => setSelected(selected.length === rows.length ? [] : rows.map((r) => r.id));
    const handleSelectRow = (id) => setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);

    const handleView = (row) => navigate(ROUTES.AUDIT_LOG_DETAIL, { state: { rowData: row } });

    const handleExportCsv = async () => {
        if (EMPTY_MODE) { console.log('Export CSV – mock mode'); return; }
        try {
            setExportLoading(true);
        } catch (err) {
            console.error('Export CSV failed:', err);
        } finally {
            setExportLoading(false);
        }
    };

    return (
        <div className="w-full p-4 sm:p-6">
            {/* Header row */}
            <div className="flex items-start justify-between gap-3 mb-5">
                <div className="min-w-0">
                    <h1 className="text-[20px] font-bold text-[#111827] leading-7">Audit logs</h1>
                    <p className="text-[13px] text-[#6b7280] mt-1 font-normal">
                        Track administrative actions and system events.
                    </p>
                </div>

                <button
                    onClick={handleExportCsv}
                    disabled={exportLoading}
                    className="h-9 px-4 text-[13px] font-medium text-[#0057ff] bg-[#f5f8ff] border border-[#dbe8ff] rounded-[8px] hover:bg-[#eaf0ff] transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shrink-0"
                >
                    Export CSV
                </button>
            </div>

            {/* Filter */}
            <div className="mb-4">
                <AuditLogFilter
                    dateFrom={dateFrom} onDateFromChange={handleDateFromChange}
                    dateTo={dateTo} onDateToChange={handleDateToChange}
                    companyFilter={companyFilter} onCompanyChange={handleCompanyChange}
                    actionFilter={actionFilter} onActionChange={handleActionChange}
                    moduleFilter={moduleFilter} onModuleChange={handleModuleChange}
                />
            </div>

            {/* Card: table + pagination */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
                <AuditLogTable
                    rows={rows}
                    selected={selected}
                    onSelectAll={handleSelectAll}
                    onSelectRow={handleSelectRow}
                    onView={handleView}
                    loading={loading}
                />

                <div className="px-4 py-3 border-t border-[#F3F4F6]">
                    <AuditLogPagination
                        page={page}
                        pageSize={pageSize}
                        total={total}
                        onPageChange={setPage}
                        onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
                    />
                </div>
            </div>
        </div>
    );
};

export default AuditLogsPage;