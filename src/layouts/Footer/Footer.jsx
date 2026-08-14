import React from 'react';
import { MailOutlineIcon, PhoneIcon } from '../../assets/icons';

const Footer = () => (
  <footer className="flex h-footer shrink-0 items-center justify-between border-t border-border-primary bg-surface-primary px-8 text-[11px] text-text-tertiary">
    <span>
      Version 1.20251128 Copyright © 2023 – 2025 Mobile-ID Technologies and Service Joint Stock Company
    </span>
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-1.5">
        <MailOutlineIcon size={14} color="currentColor" />
        <span>info@mobile-id.vn</span>
      </div>
      <div className="flex items-center gap-1.5">
        <PhoneIcon size={14} color="currentColor" />
        <span>1900 6884</span>
      </div>
    </div>
  </footer>
);

export default Footer;