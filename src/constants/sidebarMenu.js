export const SIDEBAR_MENU = [
    {
        section: 'OVERVIEW',
        items: [
            { label: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
        ],
    },
    {
        section: 'MANAGEMENT',
        items: [
            { label: 'Company', icon: 'company', path: '/company' },
            { label: 'Administrators', icon: 'admin', path: '/administrators' },
            { label: 'Roles & Permissions', icon: 'roles', path: '/roles' },
        ],
    },
    {
        section: 'CONFIGURATION',
        items: [
            { label: 'General', icon: 'settings', path: '/general' },
            { label: 'Connectors', icon: 'connector', path: '/connectors' },
            { label: 'Email templates', icon: 'email', path: '/email-templates' },
        ],
    },
    {
        section: 'LOGS & MONITORING',
        items: [
            { label: 'Audit logs', icon: 'audit', path: '/audit-logs' },
            { label: 'API logs', icon: 'api', path: '/api-logs' },
            { label: 'Connector logs', icon: 'connectorLogs', path: '/connector-logs' },
        ],
    },
];