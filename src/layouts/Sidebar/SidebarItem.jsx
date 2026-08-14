import React from 'react';
import { ICON_MAP } from '../../assets/icons';
import { sidebar } from '../../design-tokens';

const SidebarItem = ({ item, isActive, collapsed, onClick }) => {
  const IconComponent = ICON_MAP[item.icon];

  return (
    <button
      type="button"
      className={`flex w-full items-center gap-2.5 whitespace-nowrap rounded-md border-0 px-2.5 py-2 text-left transition-[background,color] duration-150 ${isActive
        ? 'bg-surface-dimBrandLv1 text-brand-primary'
        : 'bg-transparent text-text-primary hover:bg-surface-tertiary'
        }`}
      style={{ fontSize: '16px', fontWeight: 500, lineHeight: '24px' }}
      onClick={() => onClick(item.path)}
      title={collapsed ? item.label : undefined}
    >
      {IconComponent && (
        /* Active: icon màu brand (xanh), không có wrapper nền — Default: icon màu primary */
        <span className="flex h-[20px] w-[20px] shrink-0 items-center justify-center">
          <IconComponent
            size={18}
            color={isActive ? sidebar.iconActive : sidebar.iconDefault}
          />
        </span>
      )}
      {!collapsed && (
        <span className="overflow-hidden text-ellipsis">{item.label}</span>
      )}
    </button>
  );
};

export default SidebarItem;