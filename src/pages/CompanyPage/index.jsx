import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import CompanyFilter from './components/CompanyFilter';
import CompanyTable from './components/CompanyTable';
import CompanyPagination from './components/CompanyPagination';
import { getCompanyList } from '../../services/company/companyService';

// MOCK_ROWS dùng khi EMPTY_MODE = true
const MOCK_ROWS = [
    { id: 1000001, name: 'Công ty TNHH Công nghệ và Dịch vụ Số Việt Nam', taxCode: '0109123456', owner: 'Nguyen Van An', servicePackage: 'Enterprise', status: 'Active' },
    { id: 1000007, name: 'Công ty Cổ phần Phát triển Giải pháp Công nghệ Xanh', taxCode: '0703456789', owner: 'Tran Quang Huy', servicePackage: 'Business', status: 'Active' },
    { id: 1000005, name: 'Công ty TNHH An ninh Mạng Quốc Gia', taxCode: '0502345678', owner: 'Hoang Van Duc', servicePackage: 'Trial', status: 'Active' },
    { id: 1000008, name: 'Công ty TNHH Thiết bị Công nghệ Thông minh', taxCode: '0809871234', owner: 'Le Thi Mai', servicePackage: 'Trial', status: 'Active' },
    { id: 1000003, name: 'Công ty Cổ phần Dịch vụ Công nghệ Toàn Cầu', taxCode: '0301234567', owner: 'Le Van Cuong', servicePackage: 'Trial', status: 'Inactive' },
    { id: 1000004, name: 'Công ty TNHH Phần mềm và Tự động hóa Miền Nam', taxCode: '0408765432', owner: 'Pham Thi Dao', servicePackage: 'Trial', status: 'Active' },
    { id: 1000002, name: 'Công ty TNHH Truyền thông và Giải trí Số', taxCode: '0209876543', owner: 'Tran Thi Binh', servicePackage: 'Trial', status: 'Active' },
    { id: 1000009, name: 'Công ty Cổ phần Nghiên cứu và Phát triển AI', taxCode: '0901239876', owner: 'Pham Van Nam', servicePackage: 'Trial', status: 'Active' },
    { id: 1000010, name: 'Công ty TNHH Kỹ thuật và Phát triển Hệ thống', taxCode: '0109123456', owner: 'Nguyen Van An', servicePackage: 'Trial', status: 'Active' },
    { id: 1000006, name: 'Công ty TNHH Giải pháp Tích hợp và Vận hành', taxCode: '0607654321', owner: 'Nguyen Thi Ha', servicePackage: 'Trial', status: 'Active' },
];

const EMPTY_MODE = false;

const CompanyPage = () => {
    const navigate = useNavigate();

    const [search, setSearch] = useState('');
    const [packageFilter, setPackageFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [rows, setRows] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [selected, setSelected] = useState([]);
    const [loading, setLoading] = useState(false);
    const [exportLoading, setExportLoading] = useState(false);

    const fetchCompanies = useCallback(async () => {
        if (EMPTY_MODE) {
            // Lọc mock theo search + status
            const kw = search.toLowerCase();
            const filtered = MOCK_ROWS.filter((r) => {
                const matchKw = !kw || r.name.toLowerCase().includes(kw) || r.taxCode.includes(kw);
                const matchStatus = !statusFilter || r.status === statusFilter;
                return matchKw && matchStatus;
            });
            const offset = (page - 1) * pageSize;
            setRows(filtered.slice(offset, offset + pageSize));
            setTotal(filtered.length);
            return;
        }

        setLoading(true);
        try {
            const params = {
                keyword: search || undefined,
                status: statusFilter || undefined,
                page,
                size: pageSize,
            };
            const result = await getCompanyList(params);
            const mapped = (result.data ?? []).map((item) => ({
                ...item,
                name: item.companyName,
                owner: item.ownerName,
            }));
            setRows(mapped);
            setTotal(result.total ?? 0);
        } catch (error) {
            console.error('Không thể tải danh sách công ty', error);
        } finally {
            setLoading(false);
        }
    }, [search, statusFilter, page, pageSize]);

    useEffect(() => {
        fetchCompanies();
    }, [fetchCompanies]);

    const handleSearchChange = (v) => { setSearch(v); setPage(1); };
    const handlePackageChange = (v) => { setPackageFilter(v); setPage(1); };
    const handleStatusChange = (v) => { setStatusFilter(v); setPage(1); };
    const handleSelectAll = () => setSelected(selected.length === rows.length ? [] : rows.map((r) => r.id));
    const handleSelectRow = (id) => setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
    const handleView = (row) => navigate(ROUTES.COMPANY_DETAIL.replace(':id', row.id));

    const handleExportCsv = async () => {
        if (EMPTY_MODE) { console.log('Export CSV – mock mode'); return; }
        try {
            setExportLoading(true);
            console.warn('exportCsv chưa được implement');
        } catch (err) {
            console.error('Export CSV failed:', err);
        } finally {
            setExportLoading(false);
        }
    };

    return (
        <div className="w-full p-4 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div className="min-w-0">
                    <h1 className="text-[18px] font-bold text-gray-900 leading-7">Company</h1>
                    <p className="text-[13px] text-gray-500 mt-0.5 font-normal">
                        Manage registered businesses, service packages and account status.
                    </p>
                </div>

                <button
                    onClick={handleExportCsv}
                    disabled={exportLoading}
                    className="h-9 px-4 text-[13px] font-medium text-blue-600 bg-white border border-[#D1D5DB] rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shrink-0"
                >
                    Export CSV
                </button>
            </div>

            <div className="mb-4">
                <CompanyFilter
                    search={search} onSearchChange={handleSearchChange}
                    packageFilter={packageFilter} onPackageChange={handlePackageChange}
                    statusFilter={statusFilter} onStatusChange={handleStatusChange}
                />
            </div>

            <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
                <CompanyTable
                    rows={rows}
                    selected={selected}
                    onSelectAll={handleSelectAll}
                    onSelectRow={handleSelectRow}
                    onView={handleView}
                    loading={loading}
                />

                <div className="px-4 py-3 border-t border-[#F3F4F6]">
                    <CompanyPagination
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

export default CompanyPage;