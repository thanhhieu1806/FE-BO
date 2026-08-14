import axiosInstance from '../../configs/axiosInstance';

// EMPTY_MODE flags
// true  → dùng mock data (chưa có SP / đang dev)
// false → gọi API thật
const EMPTY_MODE = {
  summary: false,       // SP_BO_DASHBOARD_COMPANY/DEVICE/USER đã có
  trend: true,          // SP_BO_DASHBOARD_TREND chưa có
  attendance: true,     // SP_BO_DASHBOARD_ATTENDANCE chưa có
  visitor: true,        // SP_BO_DASHBOARD_VISITOR chưa có
  recentTransactions: true, // SP_BO_DASHBOARD_RECENT_TXN chưa có
};

// Mock data
const MOCK = {
  summary: {
    businesses: { active: '1.248', cancelled: '84' },
    users: { active: '12.853', cancelled: '1.257' },
    devices: { active: '2.156', cancelled: '243' },
  },

  trend: {
    labels: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00'],
    successful: [2650, 3120, 3980, 4210, 3760, 3250, 3598],
    failed: [170, 188, 218, 292, 240, 172, 152],
  },

  attendance: {
    total: 24568,
    segments: [
      { label: 'Face', value: 67.0 },
      { label: 'Other', value: 33.0 },
    ],
  },

  visitor: {
    total: 24568,
    segments: [
      { label: 'Face', value: 67.0 },
      { label: 'Other', value: 33.0 },
    ],
  },

  recentTransactions: [
    { id: '1000001', company: 'MOBILE-ID TECH', method: 'GET', function: '/api/v1/get/me', status: 'Successful', time: '01/01/2024 14:49:00' },
    { id: '1000002', company: 'DIGITAL SIGNATURE...', method: 'POST', function: '/api/v1/refresh/cache', status: 'Successful', time: '01/01/2024 14:59:12' },
    { id: '1000003', company: 'SMART AUTHENTIC...', method: 'PUT', function: '/api/v1/update/user', status: 'Failed', time: '01/01/2024 14:58:33' },
    { id: '1000004', company: 'SECURE LOGIN SYS...', method: 'GET', function: '/api/v1/delete/item', status: 'Successful', time: '01/01/2024 14:54:10' },
    { id: '1000005', company: 'IDENTITY VERIFICA...', method: 'GET', function: '/api/v1/create/order', status: 'Pending', time: '01/01/2024 15:10:22' },
    { id: '1000006', company: 'BIOMETRIC ACCESS', method: 'PATCH', function: '/api/v1/fetch/details', status: 'Failed', time: '01/01/2024 15:25:47' },
    { id: '1000007', company: 'ENCRYPTION TECH', method: 'DELETE', function: '/api/v1/submit/form', status: 'Successful', time: '01/01/2024 15:40:18' },
    { id: '1000008', company: 'TRUSTED IDENTITY', method: 'GET', function: '/api/v1/list/products', status: 'Successful', time: '01/01/2024 16:05:33' },
    { id: '1000009', company: 'ACCESS CONTROL', method: 'GET', function: '/api/v1/modify/settin...', status: 'Pending', time: '01/01/2024 16:20:55' },
    { id: '1000010', company: 'MOBILE SECURITY', method: 'GET', function: '/api/v1/reset/passwo...', status: 'Failed', time: '01/01/2024 14:57:45' },
  ],
};

// Helpers
const fmtNum = (n) =>
  typeof n === 'number' ? n.toLocaleString('vi-VN') : String(n ?? '—');

/**
 * Map response từ API summary về shape frontend cần.
 * SP trả về: { COMPANY_ACTIVE, COMPANY_CANCELLED, DEVICE_ACTIVE, ... }
 */
const mapSummary = (data) => ({
  businesses: {
    active: fmtNum(data.COMPANY_ACTIVE ?? data.companyActive),
    cancelled: fmtNum(data.COMPANY_CANCELLED ?? data.companyCancelled),
  },
  users: {
    active: fmtNum(data.USER_ACTIVE ?? data.userActive),
    cancelled: fmtNum(data.USER_CANCELLED ?? data.userCancelled),
  },
  devices: {
    active: fmtNum(data.DEVICE_ACTIVE ?? data.deviceActive),
    cancelled: fmtNum(data.DEVICE_CANCELLED ?? data.deviceCancelled),
  },
});

// Service methods
const dashboardService = {

  /**
   * Lấy tổng hợp Company / User / Device
   * Backend: GET /api/dashboard/summary?dateFrom=&dateTo=
   */
  getSummary: async ({ dateFrom, dateTo } = {}) => {
    if (EMPTY_MODE.summary) return MOCK.summary;
    try {
      const { data } = await axiosInstance.get('/api/dashboard/summary', {
        params: { dateFrom, dateTo },
      });
      const resData = data?.data ?? data;
      if (!resData) return MOCK.summary;
      return mapSummary(resData);
    } catch (err) {
      console.warn('[DashboardService] API getSummary lỗi hoặc chưa chạy, dùng mock:', err);
      return MOCK.summary;
    }
  },

  /**
   * Lấy dữ liệu trend chart
   * Backend: GET /api/dashboard/trend?dateFrom=&dateTo=
   * Expected response:
   * {
   *   labels: string[],
   *   successful: number[],
   *   failed: number[]
   * }
   */
  getTrend: async ({ dateFrom, dateTo } = {}) => {
    if (EMPTY_MODE.trend) return MOCK.trend;
    const { data } = await axiosInstance.get('/api/dashboard/trend', {
      params: { dateFrom, dateTo },
    });
    return data?.data ?? data;
  },

  /**
   * Lấy dữ liệu attendance donut
   * Backend: GET /api/dashboard/attendance?dateFrom=&dateTo=
   * Expected response:
   * {
   *   total: number,
   *   segments: [{ label: string, value: number }]
   * }
   */
  getAttendance: async ({ dateFrom, dateTo } = {}) => {
    if (EMPTY_MODE.attendance) return MOCK.attendance;
    const { data } = await axiosInstance.get('/api/dashboard/attendance', {
      params: { dateFrom, dateTo },
    });
    return data?.data ?? data;
  },

  /**
   * Lấy dữ liệu visitor donut
   * Backend: GET /api/dashboard/visitor?dateFrom=&dateTo=
   */
  getVisitor: async ({ dateFrom, dateTo } = {}) => {
    if (EMPTY_MODE.visitor) return MOCK.visitor;
    const { data } = await axiosInstance.get('/api/dashboard/visitor', {
      params: { dateFrom, dateTo },
    });
    return data?.data ?? data;
  },

  /**
   * Lấy 10 giao dịch gần nhất
   * Backend: GET /api/dashboard/recent-transactions?dateFrom=&dateTo=
   * Expected response: array of transaction objects
   */
  getRecentTransactions: async ({ dateFrom, dateTo } = {}) => {
    if (EMPTY_MODE.recentTransactions) return MOCK.recentTransactions;
    const { data } = await axiosInstance.get('/api/dashboard/recent-transactions', {
      params: { dateFrom, dateTo },
    });
    return data?.data ?? data ?? [];
  },
};

export default dashboardService;