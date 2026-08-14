const {
  palette,
  brand,
  text,
  icon,
  border,
  surface,
  sidebar,
  navbar,
} = require('./colors');
const { fontFamily, fontSize, fontWeight } = require('./typography');
const { layout, borderRadius, boxShadow, spacing } = require('./layout');

/** @type {import('tailwindcss').Config['theme']['extend']} */
const extend = {
  colors: {
    palette,
    brand,
    text,
    icon,
    border,
    surface,
    sidebar,
    navbar,
  },
  fontFamily,
  fontSize,
  fontWeight,
  borderRadius,
  boxShadow,
  spacing,
  width: {
    sidebar: layout.sidebarWidth,
    'sidebar-collapsed': layout.sidebarCollapsed,
  },
  height: {
    topbar: layout.topbarHeight,
    footer: layout.footerHeight,
  },
  minHeight: {
    topbar: layout.topbarHeight,
  },
};

module.exports = { extend };
