import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SidebarGroup from './SidebarGroup';
import { CollapseLeftIcon } from '../../assets/icons';
import { SIDEBAR_MENU } from '../../constants/sidebarMenu';
import { icon } from '../../design-tokens';
import { LogoPng as Logo } from '../../assets/images';

const Sidebar = ({ collapsed, onCollapse }) => {
  const navigate = useNavigate();
  const location = useLocation();

  /* activePath lấy từ URL thật, không cần state thủ công */
  const activePath = location.pathname;

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <aside
      className={`flex h-full shrink-0 flex-col overflow-hidden border-r border-border-primary bg-surface-primary transition-[width] duration-200 ease-in-out ${collapsed ? 'w-sidebar-collapsed' : 'w-sidebar'
        }`}
    >
      {/* Logo — preloaded via fetchpriority, only 1 network request per file */}
      <div className="flex min-h-topbar shrink-0 items-center justify-center border-b border-border-primary">
        {collapsed ? (
          <img
            src={`${process.env.PUBLIC_URL}/Logo.svg`}
            alt="CheckID"
            className="h-10 w-10 shrink-0 object-contain"
            fetchPriority="high"
            loading="eager"
          />
        ) : (
          <img
            src={Logo}
            alt="CheckID BioSense"
            style={{ width: '125px', height: '40px', padding: '0px' }}
            className="object-contain"
            fetchPriority="high"
            loading="eager"
          />
        )}
      </div>

      {/* Nav menu */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3 px-2">
        {SIDEBAR_MENU.map((group) => (
          <SidebarGroup
            key={group.section}
            group={group}
            activePath={activePath}
            collapsed={collapsed}
            onNavigate={handleNavigate}
          />
        ))}
      </nav>

      {/* Collapse button */}
      <button
        type="button"
        className="flex items-center gap-3 whitespace-nowrap bg-transparent px-6 py-3.5 text-[13px] text-text-secondary transition-colors hover:bg-surface-tertiary hover:text-text-primary"
        onClick={() => onCollapse((prev) => !prev)}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <span
          className="flex shrink-0 transition-transform duration-200 ease-in-out"
          style={{ transform: collapsed ? 'rotate(180deg)' : 'none' }}
        >
          <CollapseLeftIcon size={16} color={icon.secondary} />
        </span>
        {!collapsed && <span>Collapse</span>}
      </button>
    </aside>
  );
};

export default Sidebar;