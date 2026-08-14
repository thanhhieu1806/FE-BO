import React, { useState, useEffect, useCallback } from 'react';
import AdministratorFilter from './components/Administrator/AdministratorFilter';
import AdministratorTable from './components/Administrator/AdministratorTable';
import AdministratorPagination from './components/Administrator/AdministratorPagination';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import { showSuccess, showError } from '../../utils/toast';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

const MOCK_ROWS = [
    { id: 1000001, name: 'Luu Thi Thom', email: 'huy.tran@fintrust.vn', role: 'Super admin', createdDate: '01/01/2025 16:30:00', status: 'Active' },
    { id: 1000005, name: 'Pham Thi Hoa', email: 'hoa.pham@fintrust.vn', role: 'Admin', createdDate: '05/01/2025 08:30:00', status: 'Active' },
    { id: 1000006, name: 'Hoang Van Duc', email: 'duc.hoang@fintrust.vn', role: 'Supervisor', createdDate: '06/01/2025 10:20:00', status: 'Active' },
    { id: 1000007, name: 'Bui Thi Lan', email: 'lan.bui@fintrust.vn', role: 'Admin', createdDate: '07/01/2025 13:50:00', status: 'Active' },
    { id: 1000003, name: 'Tran Thi Mai', email: 'mai.tran@fintrust.vn', role: 'Admin', createdDate: '03/01/2025 11:45:00', status: 'Inactive' },
    { id: 1000004, name: 'Le Van Binh', email: 'binh.le@fintrust.vn', role: 'Admin', createdDate: '04/01/2025 14:00:00', status: 'Active' },
    { id: 1000002, name: 'Nguyen Van An', email: 'an.nguyen@fintrust.vn', role: 'Admin', createdDate: '02/01/2025 09:15:00', status: 'Active' },
    { id: 1000008, name: 'Do Van Hung', email: 'hung.do@fintrust.vn', role: 'Admin', createdDate: '08/01/2025 15:10:00', status: 'Inactive' },
    { id: 1000001, name: 'Luu Thi Thom', email: 'huy.tran@fintrust.vn', role: 'Admin', createdDate: '01/01/2025 16:30:00', status: 'Active' },
    { id: 1000009, name: 'Ngoc Thi Kim', email: 'kim.ngoc@fintrust.vn', role: 'Admin', createdDate: '09/01/2025 12:00:00', status: 'Active' },
];
const EMPTY_MODE = true;

const AdministratorPage = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [rows, setRows] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [selected, setSelected] = useState([]);
    const [loading, setLoading] = useState(false);
    const [exportLoading, setExportLoading] = useState(false);
    const [deleteRow, setDeleteRow] = useState(null);

    const fetchAdministrators = useCallback(async () => {
        if (EMPTY_MODE) {
            let filtered = MOCK_ROWS.filter((r) => {
                const matchSearch = !search
                    || r.name.toLowerCase().includes(search.toLowerCase())
                    || String(r.id).includes(search)
                    || r.email.toLowerCase().includes(search.toLowerCase());
                const matchRole = !roleFilter || r.role === roleFilter;
                const matchStatus = !statusFilter || r.status === statusFilter;
                return matchSearch && matchRole && matchStatus;
            });
            setTotal(filtered.length === MOCK_ROWS.length ? 97 : filtered.length);
            setRows(filtered.slice((page - 1) * pageSize, page * pageSize));
            return;
        }
        try {
            setLoading(true);
        } catch (err) {
            console.error('Failed to fetch administrators:', err);
        } finally {
            setLoading(false);
        }
    }, [search, roleFilter, statusFilter, page, pageSize]);

    useEffect(() => { fetchAdministrators(); setSelected([]); }, [fetchAdministrators]);

    const handleSearchChange = (v) => { setSearch(v); setPage(1); };
    const handleRoleChange = (v) => { setRoleFilter(v); setPage(1); };
    const handleStatusChange = (v) => { setStatusFilter(v); setPage(1); };
    const handleSelectAll = () => setSelected(selected.length === rows.length ? [] : rows.map((r) => r.id));
    const handleSelectRow = (id) => setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
    const handleEdit = (row) => navigate(ROUTES.EDIT_ADMINISTRATOR, { state: { rowData: row } });
    const handleDelete = (row) => setDeleteRow(row);
    const handleConfirmDelete = (row) => {
        try {
            showSuccess(`Administrator "${row.name}" deleted successfully`);
            setDeleteRow(null);
            fetchAdministrators();
        } catch (err) {
            showError('Failed to delete administrator, please try again');
        }
    };
    const handleCancelDelete = () => setDeleteRow(null);

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
        <div className="min-h-full p-4 sm:p-6">
            <DeleteConfirmModal
                row={deleteRow}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />

            {/* Header — wrap sang dòng trên mobile */}
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div className="min-w-0">
                    <h1 className="text-[18px] font-bold text-gray-900 leading-7">Administrators</h1>
                    <p className="text-[13px] text-gray-500 mt-0.5 font-normal">
                        Manage platform administrators and their access roles.
                    </p>
                </div>
                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    <button
                        onClick={handleExportCsv}
                        disabled={exportLoading}
                        className="h-9 px-4 text-[13px] font-medium text-blue-600 bg-white border border-[#D1D5DB] rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                        Export CSV
                    </button>
                    <button
                        onClick={() => navigate(ROUTES.ADD_ADMINISTRATOR)}
                        className="h-[36px] px-4 text-[13px] font-medium text-white bg-blue-600 rounded-[8px] hover:bg-blue-700 whitespace-nowrap"
                    >
                        Add administrators
                    </button>
                </div>
            </div>

            {/* Filter */}
            <div className="mb-4">
                <AdministratorFilter
                    search={search} onSearchChange={handleSearchChange}
                    roleFilter={roleFilter} onRoleChange={handleRoleChange}
                    statusFilter={statusFilter} onStatusChange={handleStatusChange}
                />
            </div>

            {/* Table + Pagination */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
                <AdministratorTable
                    rows={rows}
                    selected={selected}
                    onSelectAll={handleSelectAll}
                    onSelectRow={handleSelectRow}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    loading={loading}
                />
                <div className="px-4 py-3 border-t border-[#F3F4F6]">
                    <AdministratorPagination
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

export default AdministratorPage;