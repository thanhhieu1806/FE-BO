import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { getCompanyDetail } from "../../../services/company/companyService";

const EMPTY_MODE = false; // false = dùng API thật

// ── Mock data (dùng khi EMPTY_MODE = true) ──
const MOCK_DETAIL = {
    id: 'CMP-2024-00001',
    name: 'Công ty TNHH Công nghệ và Dịch vụ Định danh Di động',
    logo: null,
    package: 'Enterprise',
    status: 'Active',
    users: { active: 12853, inactive: 1257 },
    devices: { active: 2156, inactive: 243 },
    packageExpires: '01/02/2026',
    packageDaysLeft: 186,
    memberSince: '01/02/2023',
    memberMonths: '3 year 0 months',
    business: {
        companyName: 'Công ty TNHH Công nghệ và Dịch vụ Định danh Di động',
        companyId: 'CMP-2024-00001',
        taxCode: '0109123456',
        organization: '100+',
        phone: '+84 24 3773 6688',
        zipCode: '70000',
        address: '123 Nguyễn Xí, Phường Bình Lợi Trung, Thành phố Hồ Chí Minh',
        createdDate: '01/01/2023',
    },
    owner: {
        name: 'Phạm Xuân Khánh',
        citizenId: '001098001234',
        email: 'an.nguyen@mobile-id.vn',
        phone: '+84 24 3773 6688',
        dateOfBirth: '01/01/1999',
        gender: 'Other',
        address: '123 Nguyễn Xí, Phường Bình Lợi Trung, Thành phố Hồ Chí Minh',
    },
    servicePackage: {
        current: 'Enterprise',
        status: 'Active',
        startDate: '01/01/1999',
        expiryDate: '01/01/1999',
        usersQuota: 'Unlimited',
    },
    config: {
        groupUUID: 'FACIAL_IDENTIFICATION_a6cdf93d93d64d5f9026403aba45e8de',
        groupUUIDVisitor: 'FACIAL_IDENTIFICATION_a6cdf93d93d64d5f90264ewrreree3t3e',
    },
    identification: `{
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
      "max_size_store": 50000,
      "access_token_expires_in": 6400
    }
  ]
}`,
};

// ── Map flat API response → nested UI structure ──
const mapApiToUiData = (api) => {
    // Ghép địa chỉ từ các field riêng
    const buildAddress = (line1, line2, city, state) => {
        return [line1, line2, city, state].filter(Boolean).join(', ') || '—';
    };

    //su ly logic base64
    const buildLogicSrc = (base64Str) => {
        if (!base64Str) return null;
        //neu da co prefix thi giu nguyen
        if (base64Str.startsWith('data:'))
            return base64Str;
        // PNG
        if (base64Str.startsWith('iVBOR')) {
            return `data:image/png;base64,${base64Str}`;
        }

        // JPEG
        if (base64Str.startsWith('/9j/')) {
            return `data:image/jpeg;base64,${base64Str}`;
        }

        // Fallback: thử PNG
        return `data:image/png;base64,${base64Str}`;
    }

    // Format JSON identification cho đẹp
    const formatJson = (jsonStr) => {
        if (!jsonStr) return null;
        try {
            return JSON.stringify(JSON.parse(jsonStr), null, 2);
        } catch {
            return jsonStr;
        }
    };

    return {
        id: api.id,
        name: api.companyName || '—',
        logo: buildLogicSrc(api.companyLogo),
        package: api.servicePackage || '—',
        status: api.status || 'Inactive',

        // Users / Devices — SP hiện tại chưa có → để placeholder 0
        // Sau này khi có SP riêng thì thay vào đây
        users: {
            active: api.totalUserActive ?? 0,
            inactive: api.totalUserCancelled ?? 0,
        },
        devices: {
            active: api.totalDeviceActive ?? 0,
            inactive: api.totalDeviceCancelled ?? 0,
        },

        // Package expires / Member since — SP hiện tại chưa có → placeholder
        packageExpires: api.packageExpires || '—',
        packageDaysLeft: api.packageDaysLeft ?? null,
        memberSince: api.createdDt || '—',
        memberMonths: api.memberDuration || '—',

        // Business info — lấy từ COMPANY table
        business: {
            companyName: api.companyName || '—',
            companyId: api.id ? `CMP-${String(api.id).padStart(7, '0')}` : '—',
            taxCode: api.taxCode || '—',
            organization: api.organizationSize ? `${api.organizationSize}+` : '—',
            phone: api.phone || '—',
            zipCode: api.zipCode || '—',
            address: buildAddress(api.addressLine1, api.addressLine2, api.city, api.state),
            createdDate: api.createdDt || '—',
        },

        // Owner info — lấy từ ACCOUNT table (JOIN trong SP)
        owner: {
            name: api.ownerName || '—',
            citizenId: api.ownerCitizenId || '—',
            email: api.ownerEmail || '—',
            phone: api.ownerPhone || '—',
            dateOfBirth: api.ownerDateOfBirth || '—',
            gender: api.ownerGender || '—',
            address: buildAddress(api.ownerAddressLine1, api.ownerAddressLine2, null, null),
        },

        // Service package
        servicePackage: {
            current: api.servicePackage || '—',
            status: api.packageStatus || api.status || '—',
            startDate: api.packageStartDate || '—',
            expiryDate: api.packageExpires || '—',
            usersQuota: api.usersQuota || 'Unlimited',
        },

        // Config UUIDs — lấy từ GROUP_UUID, GROUP_UUID_VISITOR
        config: {
            groupUUID: api.groupUuid || '—',
            groupUUIDVisitor: api.groupUuidVisitor || '—',
        },

        // JSON raw từ IDENTIFICATION column
        identification: formatJson(api.identification) || null,

        // Properties JSON (nếu có)
        properties: formatJson(api.properties) || null,
    };
};

// Sub-components (giữ nguyên 100% — không thay đổi UI)

const StatBox = ({ label, activeValue, inactiveValue }) => (
    <div className="flex flex-col justify-between rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm">
        <p className="text-[15px] font-bold text-[#1F2937]">{label}</p>
        <div className="mt-3 grid grid-cols-2 divide-x divide-[#E5E7EB]">
            <div className="pr-3">
                <p className="text-[13px] font-normal text-[#6B7280]">Active</p>
                <p className="mt-1 text-[20px] font-bold leading-tight text-[#058900]">
                    {activeValue.toLocaleString('vi-VN')}
                </p>
            </div>
            <div className="pl-4">
                <p className="text-[13px] font-normal text-[#6B7280]">Inactive</p>
                <p className="mt-1 text-[20px] font-bold leading-tight text-[#D92D20]">
                    {inactiveValue.toLocaleString('vi-VN')}
                </p>
            </div>
        </div>
    </div>
);

const InfoBox = ({ label, primaryValue, secondaryValue }) => (
    <div className="flex flex-col justify-between rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm">
        <p className="text-[15px] font-bold text-[#1F2937]">{label}</p>
        <div className="mt-3">
            <p className="text-[20px] font-bold leading-tight text-[#1F2937]">{primaryValue}</p>
            {secondaryValue && (
                <p className="mt-2 text-[13px] font-normal text-[#6B7280]">{secondaryValue}</p>
            )}
        </div>
    </div>
);

const SectionCard = ({ title, children }) => (
    <div className="rounded-xl border border-[#E5E7EB] bg-white p-5">
        <h3
            className="mb-4 text-[16px] font-bold text-[#1f2937]"
            style={{ fontFamily: 'Inter', fontWeight: 700, lineHeight: '24px' }}
        >
            {title}
        </h3>
        {children}
    </div>
);

const InfoRow = ({ label, value }) => (
    <div className="flex py-2 border-b border-[#F3F4F6] last:border-0">
        <span
            className="w-[180px] shrink-0 text-[14px] text-[#6b7280]"
            style={{ fontFamily: 'Inter', fontWeight: 400 }}
        >
            {label}:
        </span>
        <span className="text-[14px] text-[#1f2937]" style={{ fontFamily: 'Inter' }}>
            {value}
        </span>
    </div>
);

const StatusBadge = ({ value }) => {
    const cfg =
        value === 'Active'
            ? 'text-green-700 bg-green-50 border border-green-200'
            : 'text-gray-500 bg-gray-100 border border-gray-200';
    return (
        <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-medium ${cfg}`}
            style={{ fontFamily: 'Inter' }}
        >
            {value}
        </span>
    );
};

const CopyButton = ({ text, label = 'Copy' }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };
    return (
        <button
            onClick={handleCopy}
            className="ml-2 flex items-center gap-1 text-[12px] text-blue-600 hover:text-blue-800 transition-colors"
            style={{ fontFamily: 'Inter' }}
        >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </svg>
            {copied ? 'Copied!' : label}
        </button>
    );
};

// Main Page

const CompanyDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            setLoading(true);
            try {
                if (EMPTY_MODE) {
                    // Mock mode — dùng data mẫu
                    setData(MOCK_DETAIL);
                } else {
                    // API mode — gọi backend, map flat → nested
                    const apiResult = await getCompanyDetail(id);
                    setData(mapApiToUiData(apiResult));
                }
            } catch (error) {
                console.error("Không thể tải thông tin công ty", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center text-[13px] text-gray-400">
                Loading...
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex h-64 items-center justify-center text-[13px] text-gray-400">
                Company not found.
            </div>
        );
    }

    return (
        <div className="w-full p-6 space-y-6" style={{ fontFamily: 'Inter' }}>

            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-[16px]">
                <button
                    onClick={() => navigate(ROUTES.COMPANY)}
                    className="font-normal text-[#6b7280] hover:underline transition-colors"
                    style={{ fontFamily: 'Inter', fontWeight: 400 }}
                >
                    Company
                </button>
                <span className="text-gray-300">›</span>
                <span
                    className="font-bold text-[#0057ff]"
                    style={{ fontFamily: 'Inter', fontWeight: 700 }}
                >
                    Detail company
                </span>
            </nav>

            {/* Page header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1
                        className="text-[16px] font-bold text-[#1f2937] leading-[24px]"
                        style={{ fontFamily: 'Inter', fontWeight: 700 }}
                    >
                        Detail company
                    </h1>
                    <p
                        className="text-[14px] text-[#6b7280] mt-0.5"
                        style={{ fontFamily: 'Inter', fontWeight: 400, lineHeight: '20px' }}
                    >
                        View and manage details for this registered business, including service packages and account status.
                    </p>
                </div>
                <button
                    className="h-9 px-4 text-[13px] font-medium text-gray-700 bg-white border border-[#D1D5DB] rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
                    style={{ fontFamily: 'Inter' }}
                >
                    View audit
                </button>
            </div>

            {/* Company identity */}
            <div className="flex items-center justify-between rounded-xl border border-[#E5E7EB] bg-white px-5 py-4">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-[20px] font-bold text-gray-400 shrink-0">
                        {data.logo ? (
                            <img src={data.logo} alt={data.name} className="h-12 w-12 rounded-xl object-cover" />
                        ) : (
                            data.name.charAt(0)
                        )}
                    </div>
                    <div>
                        <p className="text-[15px] font-bold text-gray-900" style={{ fontFamily: 'Inter' }}>
                            {data.name}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="w-3 h-3 rounded-full bg-[#058900]" />
                            <span className="text-[14px] text-gray-500" style={{ fontFamily: 'Inter' }}>
                                {data.package}
                            </span>
                        </div>
                    </div>
                </div>
                <StatusBadge value={data.status} />
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-4 gap-4">
                <StatBox
                    label="Users"
                    activeValue={data.users.active}
                    inactiveValue={data.users.inactive}
                />
                <StatBox
                    label="Devices"
                    activeValue={data.devices.active}
                    inactiveValue={data.devices.inactive}
                />
                <InfoBox
                    label="Package expires"
                    primaryValue={data.packageExpires}
                    secondaryValue={data.packageDaysLeft != null ? `${data.packageDaysLeft} days left` : null}
                />
                <InfoBox
                    label="Member since"
                    primaryValue={data.memberSince}
                    secondaryValue={data.memberMonths !== '—' ? data.memberMonths : null}
                />
            </div>

            {/* Business + Owner */}
            <div className="grid grid-cols-2 gap-4">
                <SectionCard title="Business information">
                    <InfoRow label="Company name" value={data.business.companyName} />
                    <InfoRow label="Company ID" value={data.business.companyId} />
                    <InfoRow label="Tax code" value={data.business.taxCode} />
                    <InfoRow label="Organization" value={data.business.organization} />
                    <InfoRow label="Phone number" value={data.business.phone} />
                    <InfoRow label="Zip code" value={data.business.zipCode} />
                    <InfoRow label="Address" value={data.business.address} />
                    <InfoRow label="Created date" value={data.business.createdDate} />
                </SectionCard>

                <SectionCard title="Owner information">
                    <InfoRow label="Owner name" value={data.owner.name} />
                    <InfoRow label="Citizen ID" value={data.owner.citizenId} />
                    <InfoRow label="Email" value={data.owner.email} />
                    <InfoRow label="Phone" value={data.owner.phone} />
                    <InfoRow label="Day of birth" value={data.owner.dateOfBirth} />
                    <InfoRow label="Gender" value={data.owner.gender} />
                    <InfoRow label="Address" value={data.owner.address} />
                </SectionCard>
            </div>

            {/* Service package */}
            <SectionCard title="Service package">
                <div className="grid grid-cols-2 gap-x-8">
                    <div>
                        <InfoRow
                            label="Current package"
                            value={
                                <span className="flex items-center gap-1.5 text-[14px] text-gray-900">
                                    <span className="w-3 h-3 rounded-full bg-[#058900]" />
                                    {data.servicePackage.current}
                                </span>
                            }
                        />
                        <InfoRow label="Start date" value={data.servicePackage.startDate} />
                        <InfoRow label="Users quota" value={data.servicePackage.usersQuota} />
                    </div>
                    <div>
                        <InfoRow
                            label="Package status"
                            value={<StatusBadge value={data.servicePackage.status} />}
                        />
                        <InfoRow label="Expiry date" value={data.servicePackage.expiryDate} />
                    </div>
                </div>
            </SectionCard>

            {/* Configuration properties */}
            <SectionCard title="Configuration properties">
                <InfoRow
                    label="Group UUID"
                    value={
                        <div className="flex items-center flex-wrap gap-1">
                            <span className="text-[13px] text-gray-900 break-all">
                                {data.config.groupUUID}
                            </span>
                            {data.config.groupUUID !== '—' && (
                                <CopyButton text={data.config.groupUUID} />
                            )}
                        </div>
                    }
                />
                <InfoRow
                    label="Group UUID visitor"
                    value={
                        <div className="flex items-center flex-wrap gap-1">
                            <span className="text-[13px] text-gray-900 break-all">
                                {data.config.groupUUIDVisitor}
                            </span>
                            {data.config.groupUUIDVisitor !== '—' && (
                                <CopyButton text={data.config.groupUUIDVisitor} />
                            )}
                        </div>
                    }
                />
            </SectionCard>

            {/* Identification JSON */}
            {data.identification && (
                <div className="rounded-xl border border-[#E5E7EB] bg-white overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-3 border-b border-[#F3F4F6]">
                        <div className="flex items-center gap-2 text-[14px] font-semibold text-gray-900">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                <polyline points="16 18 22 12 16 6" />
                                <polyline points="8 6 2 12 8 18" />
                            </svg>
                            Identification
                        </div>
                        <CopyButton text={data.identification} label="Copy JSON" />
                    </div>
                    <pre
                        className="p-5 overflow-x-auto max-h-[300px] m-0"
                        style={{
                            fontFamily: "'Source Code Pro', monospace",
                            fontWeight: 400,
                            fontSize: '11px',
                            lineHeight: '17.879991607666px',
                            letterSpacing: '0px',
                            color: '#0057ff',
                            backgroundColor: '#f8fafc',
                            margin: 0,
                        }}
                    >
                        {data.identification}
                    </pre>
                </div>
            )}

            {/* Properties JSON (nếu có) */}
            {data.properties && (
                <div className="rounded-xl border border-[#E5E7EB] bg-white overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-3 border-b border-[#F3F4F6]">
                        <div className="flex items-center gap-2 text-[14px] font-semibold text-gray-900">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                <polyline points="16 18 22 12 16 6" />
                                <polyline points="8 6 2 12 8 18" />
                            </svg>
                            Properties
                        </div>
                        <CopyButton text={data.properties} label="Copy JSON" />
                    </div>
                    <pre
                        className="p-5 overflow-x-auto max-h-[300px] m-0"
                        style={{
                            fontFamily: "'Source Code Pro', monospace",
                            fontWeight: 400,
                            fontSize: '11px',
                            lineHeight: '17.879991607666px',
                            color: '#0057ff',
                            backgroundColor: '#f8fafc',
                            margin: 0,
                        }}
                    >
                        {data.properties}
                    </pre>
                </div>
            )}

        </div>
    );
};

export default CompanyDetailPage;