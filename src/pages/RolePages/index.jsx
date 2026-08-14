import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { showSuccess, showError } from '../../utils/toast';
import RoleTable from './components/Role/RoleTable';
import RoleFilter from './components/Role/RoleFilter';
import RolePagination from './components/Role/RolePagination';
import DeleteRoleModal from './components/DeleteRole/DeleteRoleModal';

const MOCK_ROLES = [
    { id: 1000001, roleName: 'Super Admin', description: 'Full access to all features and settings', admins: 1, status: 'Active' },
    { id: 1000005, roleName: 'Admin', description: 'Manage administrators and platform configuration', admins: 5, status: 'Active' },
    { id: 1000006, roleName: 'Supervisor', description: 'Read-only access to dashboard and reports', admins: 2, status: 'Active' },
];
const EMPTY_MODE = true;

const RolesPage = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [rows, setRows] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [selected, setSelected] = useState([]);
    const [loading, setLoading] = useState(false);
    const [deleteRow, setDeleteRow] = useState(null);

    const fetchRoles = useCallback(async () => {
        if (EMPTY_MODE) {
            let filtered = MOCK_ROLES.filter((r) => {
                const matchSearch = !search || r.roleName.toLowerCase().includes(search.toLowerCase());
                const matchStatus = !statusFilter || r.status === statusFilter;
                return matchSearch && matchStatus;
            });
            setTotal(filtered.length);
            setRows(filtered.slice((page - 1) * pageSize, page * pageSize));
            return;
        }
        try {
            setLoading(true);
        } catch (err) {
            console.error('Failed to fetch roles:', err);
        } finally {
            setLoading(false);
        }
    }, [search, statusFilter, page, pageSize]);

    useEffect(() => { fetchRoles(); setSelected([]); }, [fetchRoles]);

    const handleSelectAll = () => setSelected(selected.length === rows.length ? [] : rows.map((r) => r.id));
    const handleSelectRow = (id) => setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
    const handleEdit = (row) => navigate(ROUTES.EDIT_ROLE, { state: { rowData: row } });
    const handleDelete = (row) => setDeleteRow(row);

    const handleConfirmDelete = (row) => {
        try {
            showSuccess(`Role "${row.roleName}" deleted successfully`);
            setDeleteRow(null);
            fetchRoles();
        } catch (err) {
            showError('Failed to delete role, please try again');
        }
    };

    return (
        <div className="min-h-full p-4 sm:p-6">
            <DeleteRoleModal
                row={deleteRow}
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteRow(null)}
            />

            {/* Header — wrap trên mobile */}
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div className="min-w-0">
                    <h1 className="text-[18px] font-bold text-gray-900 leading-7">Roles & Permissions</h1>
                    <p className="text-[13px] text-gray-500 mt-0.5">
                        Manage roles and assign permissions to control access across the platform.
                    </p>
                </div>
                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    <button className="h-9 px-4 text-[13px] font-medium text-blue-600 bg-white border border-[#D1D5DB] rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap">
                        Export CSV
                    </button>
                    <button
                        onClick={() => navigate(ROUTES.ADD_ROLE)}
                        className="h-[36px] px-4 text-[13px] font-medium text-white bg-blue-600 rounded-[8px] hover:bg-blue-700 transition-colors whitespace-nowrap"
                    >
                        Add role
                    </button>
                </div>
            </div>

            {/* Filter */}
            <div className="mb-4">
                <RoleFilter
                    search={search}
                    onSearchChange={(v) => { setSearch(v); setPage(1); }}
                    statusFilter={statusFilter}
                    onStatusChange={(v) => { setStatusFilter(v); setPage(1); }}
                />
            </div>

            {/* Table + Pagination */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
                <RoleTable
                    rows={rows}
                    selected={selected}
                    onSelectAll={handleSelectAll}
                    onSelectRow={handleSelectRow}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    loading={loading}
                />
                <div className="px-4 py-3 border-t border-[#F3F4F6]">
                    <RolePagination
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

export default RolesPage;