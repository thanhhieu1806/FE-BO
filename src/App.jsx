import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import { KeycloakProvider } from './configs/keycloak';
import { ROUTES } from './constants/routes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/global.css';


const applicationBasePath = process.env.PUBLIC_URL || '';

// Lazy load: mỗi page chỉ download khi user thực sự vào trang đó 
// DashboardLayout luôn được load sớm vì dùng cho mọi protected route
const DashboardLayout = lazy(() => import('./layouts/DashboardLayout/DashboardLayout'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Login = lazy(() => import('./pages/LoginPage/index'));
const CompanyPage = lazy(() => import('./pages/CompanyPage/index'));
const CompanyDetailPage = lazy(() => import('./pages/CompanyPage/details/index'));
const AdministratorPage = lazy(() => import('./pages/AdministratorPage/index'));
const AddAdministratorPage = lazy(() => import('./pages/AdministratorPage/components/AddAdministratorPage'));
const EditAdministratorPage = lazy(() => import('./pages/AdministratorPage/components/EditAdministrator/EditAdministratorPage'));
const RolesPage = lazy(() => import('./pages/RolePages/index'));
const AddRolePage = lazy(() => import('./pages/RolePages/components/AddRole/AddRolePage'));
const EditRolePage = lazy(() => import('./pages/RolePages/components/EditRole/EditRolePage'));
const GeneralPage = lazy(() => import('.//pages/GeneralPage/index'));
const ConnectorsPage = lazy(() => import('./pages/ConnectorsPage/index'));
const AddConnectorPage = lazy(() => import('./pages/ConnectorsPage/components/AddConnector/AddConnectorPage'));
const EditConnectorPage = lazy(() => import('./pages/ConnectorsPage/components/EditConnector/EditConnectorPage'));
const EmailTemplatesPage = lazy(() => import('./pages/EmailTemplatesPage/index'));
const AddEmailTemplatePage = lazy(() => import('./pages/EmailTemplatesPage/components/AddEmailTemplate/AddEmailTemplatePage'));
const EditEmailTemplatePage = lazy(() => import('./pages/EmailTemplatesPage/components/EditEmailTemplate/EditEmailTemplatePage'));
const AuditLogsPage = lazy(() => import('./pages/AuditLogPage/index'));
const DetailAuditLogPage = lazy(() => import('./pages/AuditLogPage/components/DetailAuditLog/DetailAuditLogPage'));
const ApiLogsPage = lazy(() => import('./pages/ApiLogPage/index'));
const DetailApiLogPage = lazy(() => import('./pages/ApiLogPage/components/DetailApiLog/DetailApiLogPage'));
const ConnectorLogsPage = lazy(() => import('./pages/ConnectorLogPage/index'));
const DetailConnectorLogPage = lazy(() => import('./pages/ConnectorLogPage/components/DetailConnectorLog/DetailConnectorLogPage'));
const NotFound = lazy(() => import('./pages/NotFoundPage/NotFound'));

const PageLoader = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    background: '#fff',
  }}>
    <style>{`
      @keyframes _spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      ._spinner_wrap {
        position: relative;
        width: 64px;
        height: 64px;
        animation: _spin 0.8s linear infinite;
      }
      ._spinner_track {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        border: 8px solid rgba(0, 87, 255, 0.12);
        box-sizing: border-box;
      }
      ._spinner_gradient {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        background: conic-gradient(from 0deg, #0057FF 0%, rgba(0, 87, 255, 0.15) 75%, transparent 90%);
        -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 8px), #000 calc(100% - 8px));
        mask: radial-gradient(farthest-side, transparent calc(100% - 8px), #000 calc(100% - 8px));
      }
      ._spinner_head {
        position: absolute;
        top: 0;
        left: 28px;
        width: 8px;
        height: 8px;
        background: #0057FF;
        border-radius: 50%;
      }
    `}</style>
    <div className="_spinner_wrap">
      <div className="_spinner_track" />
      <div className="_spinner_gradient" />
      <div className="_spinner_head" />
    </div>
  </div>
);

//  Route guards 
const ProtectedRoute = ({ children }) => {
  const auth = useAuth();
  if (auth.isLoading) return <PageLoader />;
  if (!auth.isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const auth = useAuth();
  if (auth.isLoading) return <PageLoader />;
  if (auth.isAuthenticated) return <Navigate to={ROUTES.DASHBOARD} replace />;
  return children;
};

const RootRoute = () => {
  const auth = useAuth();
  if (auth.isLoading) return <PageLoader />;
  return (
    <Navigate
      to={auth.isAuthenticated ? ROUTES.DASHBOARD : ROUTES.LOGIN}
      replace
    />
  );
};

//  Routes 
function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<RootRoute />} />

        <Route
          path={ROUTES.LOGIN}
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path={ROUTES.DASHBOARD}
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.COMPANY}
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <CompanyPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.COMPANY_DETAIL}
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <CompanyDetailPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.ADMINISTRATORS}
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <AdministratorPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route path={ROUTES.ADD_ADMINISTRATOR} element={<ProtectedRoute><DashboardLayout><AddAdministratorPage /></DashboardLayout></ProtectedRoute>} />

        <Route path={ROUTES.EDIT_ADMINISTRATOR} element={
          <ProtectedRoute><DashboardLayout><EditAdministratorPage /></DashboardLayout></ProtectedRoute>
        } />

        {/* roles */}
        <Route path={ROUTES.ROLES} element={<ProtectedRoute><DashboardLayout><RolesPage /></DashboardLayout></ProtectedRoute>} />
        <Route path={ROUTES.ADD_ROLE} element={<ProtectedRoute><DashboardLayout><AddRolePage /></DashboardLayout></ProtectedRoute>} />
        <Route path={ROUTES.EDIT_ROLE} element={<ProtectedRoute><DashboardLayout><EditRolePage /></DashboardLayout></ProtectedRoute>} />

        {/* genera */}
        <Route path={ROUTES.GENERAL} element={
          <ProtectedRoute><DashboardLayout><GeneralPage /></DashboardLayout></ProtectedRoute>
        } />

        {/* connectors */}
        <Route path={ROUTES.CONNECTORS} element={<ProtectedRoute><DashboardLayout><ConnectorsPage /></DashboardLayout></ProtectedRoute>} />
        <Route path={ROUTES.ADD_CONNECTOR} element={<ProtectedRoute><DashboardLayout><AddConnectorPage /></DashboardLayout></ProtectedRoute>} />
        <Route path={ROUTES.EDIT_CONNECTOR} element={<ProtectedRoute><DashboardLayout><EditConnectorPage /></DashboardLayout></ProtectedRoute>} />


        {/* email templates */}
        <Route path={ROUTES.EMAIL_TEMPLATES} element={<ProtectedRoute><DashboardLayout><EmailTemplatesPage /></DashboardLayout></ProtectedRoute>} />
        <Route path={ROUTES.ADD_EMAIL_TEMPLATE} element={<ProtectedRoute><DashboardLayout><AddEmailTemplatePage /></DashboardLayout></ProtectedRoute>} />
        <Route path={ROUTES.EDIT_EMAIL_TEMPLATE} element={<ProtectedRoute><DashboardLayout><EditEmailTemplatePage /></DashboardLayout></ProtectedRoute>} />

        {/* audit logs */}
        <Route path={ROUTES.AUDIT_LOGS} element={<ProtectedRoute><DashboardLayout><AuditLogsPage /></DashboardLayout></ProtectedRoute>} />
        <Route path={ROUTES.AUDIT_LOG_DETAIL} element={<ProtectedRoute><DashboardLayout><DetailAuditLogPage /></DashboardLayout></ProtectedRoute>} />

        {/* api logs */}
        <Route path={ROUTES.API_LOGS} element={<ProtectedRoute><DashboardLayout><ApiLogsPage /></DashboardLayout></ProtectedRoute>} />
        <Route path={ROUTES.API_LOG_DETAIL} element={<ProtectedRoute><DashboardLayout><DetailApiLogPage /></DashboardLayout></ProtectedRoute>} />

        {/* connector logs */}
        <Route path={ROUTES.CONNECTOR_LOGS} element={<ProtectedRoute><DashboardLayout><ConnectorLogsPage /></DashboardLayout></ProtectedRoute>} />
        <Route path={ROUTES.CONNECTOR_LOG_DETAIL} element={<ProtectedRoute><DashboardLayout><DetailConnectorLogPage /></DashboardLayout></ProtectedRoute>} />

        {/* ── 404 catch-all ── */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <BrowserRouter basename={applicationBasePath}>
      <KeycloakProvider>
        <AppRoutes />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar
          closeButton={false}
          icon={false}
          toastStyle={{ background: 'transparent', boxShadow: 'none', padding: 0 }}
        />
      </KeycloakProvider>
    </BrowserRouter>
  );
}
export default App;