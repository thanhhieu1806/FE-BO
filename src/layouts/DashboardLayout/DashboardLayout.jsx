import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import SessionTimeoutModal from '../SessionTimeoutModal/SessionTimeoutModal';

const DashboardLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [hidden, setHidden] = useState(false);

  /* Tự động thu nhỏ/ẩn sidebar khi thu nhỏ màn hình để giao diện và biểu đồ không bị tràn/bể */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setHidden(true);
        setCollapsed(true);
      } else if (window.innerWidth < 1024) {
        setHidden(false);
        setCollapsed(true);
      } else {
        setHidden(false);
        setCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /* Ẩn hoàn toàn sidebar khi nhấn nút hamburger menu trên Header */
  const handleToggleMenu = () => {
    setHidden((prev) => !prev);
  };

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-surface-secondary">
      <SessionTimeoutModal />
      <div className="flex flex-1 overflow-hidden">
        {!hidden && (
          <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
        )}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <Header onMenuClick={handleToggleMenu} />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardLayout;