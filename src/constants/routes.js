export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    DASHBOARD: '/dashboard',

    // Company
    COMPANY: '/company',
    COMPANY_DETAIL: '/company/details/:id',   // ← phải khớp với URL browser

    // Administrators
    ADMINISTRATORS: '/administrators',
    ADD_ADMINISTRATOR: '/administrators/add',
    EDIT_ADMINISTRATOR: '/administrators/edit/:id',

    // Roles
    ROLES: '/roles',
    ADD_ROLE: '/roles/add',
    EDIT_ROLE: '/roles/edit/:id',

    // General
    GENERAL: '/general',

    // Connectors
    CONNECTORS: '/connectors',
    ADD_CONNECTOR: '/connectors/add',
    EDIT_CONNECTOR: '/connectors/edit/:id',

    // Email Templates
    EMAIL_TEMPLATES: '/email-templates',
    ADD_EMAIL_TEMPLATE: '/email-templates/add',
    EDIT_EMAIL_TEMPLATE: '/email-templates/edit/:id',

    // Audit Logs & Monitoring
    AUDIT_LOGS: '/audit-logs',
    AUDIT_LOG_DETAIL: '/audit-logs/:id',

    API_LOGS: '/api-logs',
    API_LOG_DETAIL: '/api-logs/:id',
    CONNECTOR_LOGS: '/connector-logs',
    CONNECTOR_LOG_DETAIL: '/connector-logs/:id',
};  