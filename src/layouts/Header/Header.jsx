import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import {
  MenuIcon,
  SearchIcon,
  BellIcon,
  ChevronDownIcon,
} from '../../assets/icons';
import { icon, palette, text } from '../../design-tokens';
import { performLogout } from '../../utils/logout';

/* Lấy chữ cái đầu của tên để hiển thị avatar */
const getInitial = (name) => {
  if (!name) return '?';
  return name.trim().charAt(0).toUpperCase();
};

/* Lấy tên hiển thị từ OIDC user profile */
const getDisplayName = (user) => {
  if (!user) return '';
  const profile = user.profile;
  return (
    profile?.name ||
    profile?.preferred_username ||
    profile?.email ||
    'User'
  );
};

/* Lấy role từ OIDC token claims (tuỳ backend trả về field nào) */
const getRole = (user) => {
  if (!user) return '';
  const profile = user.profile;
  return (
    profile?.role ||
    profile?.roles?.[0] ||
    profile?.realm_access?.roles?.[0] ||
    'Admin'
  );
};

/* ─── NotificationBell ─── */
const NotificationBell = ({ count = 0 }) => {
  const [hovered, setHovered] = useState(false);
  const hasNotification = count > 0;
  const displayCount = count > 9 ? '9+' : String(count);
  const bellColor = hovered ? icon.brand : hasNotification ? icon.primary : icon.secondary;

  return (
    <button
      type="button"
      className={`relative flex h-[40px] w-[40px] items-center justify-center rounded-[8px] border-0 p-[10px] transition-colors ${hovered ? 'bg-surface-dimBrandLv1' : 'bg-surface-primary'
        }`}
      aria-label={hasNotification ? `${count} notifications` : 'Notifications'}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="relative inline-flex">
        <BellIcon size={20} color={bellColor} />
        {hasNotification && (
          <span
            className="absolute -right-2 -top-1.5 flex h-[15px] min-w-[18px] items-center justify-center rounded-full px-[2px] text-[9px] font-bold leading-none"
            style={{ backgroundColor: palette.red[500], color: text.reverse }}
            aria-hidden="true"
          >
            {displayCount}
          </span>
        )}
      </span>
    </button>
  );
};

/* ─── UserMenu dropdown ─── */
const UserMenu = ({ userName, userRole, onLogout, isLoggingOut }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  /* Đóng dropdown khi click ra ngoài */
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogoutClick = () => {
    setOpen(false);
    onLogout();
  };

  return (
    <div ref={menuRef} className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-md border-0 bg-transparent px-2 py-1 transition-colors hover:bg-surface-tertiary"
        aria-label="User menu"
        aria-expanded={open}
        disabled={isLoggingOut}
      >
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-primary text-[13px] font-bold text-text-reverse"
          aria-hidden="true"
        >
          {getInitial(userName)}
        </div>
        <div className="hidden sm:flex flex-col text-left leading-[1.1]">
          <span className="text-[13px] font-semibold text-text-primary">{userName}</span>
          <span className="text-[11px] text-text-tertiary">{userRole}</span>
        </div>
        <ChevronDownIcon
          size={14}
          color={icon.secondary}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-50 min-w-[180px] overflow-hidden rounded-xl border border-border-primary bg-surface-primary shadow-lg">
          {/* User info summary */}
          <div className="border-b border-border-primary px-4 py-3">
            <p className="text-[13px] font-semibold text-text-primary">{userName}</p>
            <p className="text-[11px] text-text-tertiary">{userRole}</p>
          </div>

          {/* Logout button */}
          <div className="p-1.5">
            <button
              type="button"
              onClick={handleLogoutClick}
              disabled={isLoggingOut}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {/* Logout icon */}
              {isLoggingOut ? (
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  className="animate-spin"
                >
                  <circle
                    cx="12" cy="12" r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray="31.4"
                    strokeDashoffset="10"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              {isLoggingOut ? 'Đang đăng xuất...' : 'Đăng xuất'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Header ─── */
const Header = ({ notificationCount = 9, onMenuClick }) => {
  const auth = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const userName = getDisplayName(auth.user);
  const userRole = getRole(auth.user);
  const handleLogout = async () => {
    if (isLoggingOut) return; // chống double-click
    setIsLoggingOut(true);
    try {
      await performLogout(auth);
      // performLogout sẽ tự redirect, không cần làm gì thêm
    } catch {
      // Fallback an toàn: dù lỗi vẫn redirect về login
      window.location.replace(`${process.env.PUBLIC_URL || ''}/login`);
    }
  };

  return (
    <header className="sticky top-0 z-20 flex h-topbar shrink-0 items-center justify-between border-b border-border-primary bg-surface-primary px-3 sm:px-8">
      {/* Left: menu + search */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border-0 bg-transparent transition-colors hover:bg-surface-tertiary"
          onClick={onMenuClick}
          aria-label="Toggle menu"
        >
          <MenuIcon size={20} color={icon.secondary} />
        </button>

        {/* Mobile: chỉ icon kính lúp | Desktop: input đầy đủ */}
        <button
          type="button"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border-0 bg-transparent transition-colors hover:bg-surface-tertiary sm:hidden"
          aria-label="Search"
        >
          <SearchIcon size={20} color={icon.secondary} />
        </button>

        <div className="hidden sm:flex w-60 items-center gap-2 rounded-md border border-border-primary bg-surface-secondary px-3 py-1.5 transition-[border-color] focus-within:border-border-brand">
          <SearchIcon size={16} color={icon.secondary} />
          <input
            type="text"
            placeholder="Search..."
            className="w-full border-0 bg-transparent text-[13px] text-text-primary outline-none placeholder:text-text-tertiary"
            aria-label="Search"
          />
        </div>
      </div>

      {/* Right: bell + divider + user */}
      <div className="flex items-center gap-2 sm:gap-4">
        <NotificationBell count={notificationCount} />

        <div className="h-6 w-px bg-border-primary" />

        <UserMenu
          userName={userName}
          userRole={userRole}
          onLogout={handleLogout}
          isLoggingOut={isLoggingOut}
        />
      </div>
    </header>
  );
};

export default Header;