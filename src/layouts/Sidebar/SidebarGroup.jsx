import React from 'react';
import SidebarItem from './SidebarItem';

const SidebarGroup = ({ group, activePath, collapsed, onNavigate }) => (
  <div className="mb-3 flex flex-col gap-0.5">
    {!collapsed && (
      <span className="px-2.5 pb-1 pt-2 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
        {group.section}
      </span>
    )}
    {group.items.map((item) => (
      <SidebarItem
        key={item.path}
        item={item}
        isActive={activePath === item.path || activePath.startsWith(item.path + '/')}
        collapsed={collapsed}
        onClick={onNavigate}
      />
    ))}
  </div>
);

export default SidebarGroup;