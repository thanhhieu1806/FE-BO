import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import EmailTemplateFilter from './components/EmailTemplate/EmailTemplateFilter';
import EmailTemplateTable from './components/EmailTemplate/EmailTemplateTable';
import EmailTemplatePagination from './components/EmailTemplate/EmailTemplatePagination';
import DeleteEmailTemplateModal from './components/DeleteEmailTemplate/DeleteEmailTemplateModal';
import { showSuccess, showError } from '../../utils/toast';

const MOCK_ROWS = [
    { id: 1000001, name: 'Welcome email', subject: 'Welcome to {{company_name}} — ge...', createDate: '01/01/2024 14:49:00', status: 'Active', category: 'Company' },
    { id: 1000001, name: 'Password reset', subject: 'Reset your {{company_name}} passw...', createDate: '01/02/2024 09:15:00', status: 'Draft', category: 'Security' },
    { id: 1000001, name: 'Company invitation', subject: "You've been invited to join {{compan...", createDate: '01/03/2024 08:00:00', status: 'Active', category: 'Company' },
    { id: 1000001, name: 'User activation', subject: 'Activate your CHECKID BIOSENSE a...', createDate: '01/01/2024 14:49:00', status: 'Active', category: 'User' },
    { id: 1000001, name: 'Security alert', subject: 'Unusual sign-in activity detected', createDate: '01/04/2024 16:30:00', status: 'Inactive', category: 'Security' },
];

const EMPTY_MODE = true;

const EmailTemplatesPage = () => {
    const navigate = useNavigate();

    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [rows, setRows] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [selected, setSelected] = useState([]);
    const [loading, setLoading] = useState(false);
    const [exportLoading, setExportLoading] = useState(false);
    const [deleteRow, setDeleteRow] = useState(null);

    const fetchTemplates = useCallback(async () => {
        if (EMPTY_MODE) {
            let filtered = MOCK_ROWS.filter((r) => {
                const matchSearch = !search
                    || r.name.toLowerCase().includes(search.toLowerCase())
                    || r.subject.toLowerCase().includes(search.toLowerCase())
                    || String(r.id).includes(search);
                const matchCategory = !categoryFilter || r.category === categoryFilter;
                const matchStatus = !statusFilter || r.status === statusFilter;
                return matchSearch && matchCategory && matchStatus;
            });
            setTotal(filtered.length);
            setRows(filtered.slice((page - 1) * pageSize, page * pageSize));
            return;
        }
        try {
            setLoading(true);
            // TODO: const data = await emailTemplateService.getTemplates({ search, category: categoryFilter, status: statusFilter, page, pageSize });
        } catch (err) {
            console.error('Failed to fetch email templates:', err);
        } finally {
            setLoading(false);
        }
    }, [search, categoryFilter, statusFilter, page, pageSize]);

    useEffect(() => { fetchTemplates(); setSelected([]); }, [fetchTemplates]);

    const handleSearchChange = (v) => { setSearch(v); setPage(1); };
    const handleCategoryChange = (v) => { setCategoryFilter(v); setPage(1); };
    const handleStatusChange = (v) => { setStatusFilter(v); setPage(1); };
    const handleSelectAll = () => setSelected(selected.length === rows.length ? [] : rows.map((r) => r.id));
    const handleSelectRow = (id) => setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);

    const handleEdit = (row) => navigate(ROUTES.EDIT_EMAIL_TEMPLATE, { state: { rowData: row } });
    const handleDelete = (row) => setDeleteRow(row);

    const handleConfirmDelete = async (row) => {
        try {
            // TODO: await emailTemplateService.deleteTemplate(row.id);
            showSuccess('Email template deleted successfully');
            setDeleteRow(null);
            fetchTemplates();
        } catch {
            showError('Failed to delete template. Please try again.');
        }
    };

    const handleExportCsv = async () => {
        if (EMPTY_MODE) { console.log('Export CSV – mock mode'); return; }
        try {
            setExportLoading(true);
            // TODO: const blob = await emailTemplateService.exportCsv({ search, category: categoryFilter, status: statusFilter });
        } catch (err) {
            console.error('Export CSV failed:', err);
        } finally {
            setExportLoading(false);
        }
    };

    return (
        <div className="w-full p-3 sm:p-6">
            {/* Header row */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-5">
                <div>
                    <h1 className="text-[20px] font-bold text-[#111827] leading-7">Email templates</h1>
                    <p className="text-[13px] text-[#6b7280] mt-1 font-normal">
                        Customize system emails sent to users and companies.
                    </p>
                </div>
                <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                    <button
                        onClick={handleExportCsv}
                        disabled={exportLoading}
                        className="h-9 px-4 text-[13px] font-medium text-[#0057ff] bg-white border border-[#e5e7eb] rounded-[8px] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                        Export CSV
                    </button>
                    <button
                        onClick={() => navigate(ROUTES.ADD_EMAIL_TEMPLATE)}
                        className="h-9 px-4 text-[13px] font-medium text-white bg-[#0057ff] rounded-[8px] hover:bg-blue-700 transition-colors whitespace-nowrap"
                    >
                        Add template
                    </button>
                </div>
            </div>

            {/* Filter */}
            <div className="mb-4">
                <EmailTemplateFilter
                    search={search} onSearchChange={handleSearchChange}
                    categoryFilter={categoryFilter} onCategoryChange={handleCategoryChange}
                    statusFilter={statusFilter} onStatusChange={handleStatusChange}
                />
            </div>

            {/* Card: table + pagination */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
                <EmailTemplateTable
                    rows={rows}
                    selected={selected}
                    onSelectAll={handleSelectAll}
                    onSelectRow={handleSelectRow}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    loading={loading}
                />
                <div className="px-4 py-3 border-t border-[#F3F4F6]">
                    <EmailTemplatePagination
                        page={page}
                        pageSize={pageSize}
                        total={total}
                        onPageChange={setPage}
                        onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
                    />
                </div>
            </div>

            {/* Delete modal */}
            <DeleteEmailTemplateModal
                row={deleteRow}
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteRow(null)}
            />
        </div>
    );
};

export default EmailTemplatesPage;