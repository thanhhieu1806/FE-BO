import axiosInstance from "../../configs/axiosInstance";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
export const EMPTY_MODE = false; // true = dùng mock, false = gọi API thật

//  MOCK DATA 
const MOCK_LIST = {
    data: [
        {
            id: 1000001,
            companyName: "Công ty TNHH Công nghệ và Dịch vụ Số Việt Nam",
            taxCode: "0109123456",
            ownerName: "Nguyen Van An",
            ownerEmail: "nguyenvanan@example.com",
            servicePackage: "Enterprise",
            status: "Active",
        },
        {
            id: 1000007,
            companyName: "Công ty Cổ phần Phát triển Giải pháp Công nghệ Xanh",
            taxCode: "0703456789",
            ownerName: "Tran Quang Huy",
            ownerEmail: "tranquanghuy@example.com",
            servicePackage: "Business",
            status: "Active",
        },
    ],
    page: 1,
    size: 10,
    total: 2,
    totalPages: 1,
};

const MOCK_DETAIL = {
    id: 1000001,
    companyName: "Công ty TNHH Công nghệ và Dịch vụ Định danh Di động",
    taxCode: "0109123456",
    status: "Active",
    ownerName: "Phạm Xuân Khánh",
    ownerEmail: "an.nguyen@mobile-id.vn",
    ownerPhone: "+84 24 3773 6888",
    phone: "+84 24 3773 6888",
    addressLine1: "123 Nguyễn Xi, Phường Bình Lợi Trung",
    city: "Thành phố Hồ Chí Minh",
    groupUuid: "FACIAL_IDENTIFICATION_a6cf93d93d64d5f9028403aba45e8de",
    groupUuidVisitor: "FACIAL_IDENTIFICATION_a6cf93d93d64d5f90284awrnerea3t3e",
};

//  API CALLS 
export const getCompanyList = async (params = {}) => {
    if (EMPTY_MODE) {
        return MOCK_LIST;
    }
    const response = await axiosInstance.get(API_ENDPOINTS.COMPANY.LIST, { params });
    return response.data;
};

export const getCompanyDetail = async (id) => {
    if (EMPTY_MODE) {
        return MOCK_DETAIL;
    }
    const response = await axiosInstance.get(API_ENDPOINTS.COMPANY.DETAIL(id));
    return response.data;
};