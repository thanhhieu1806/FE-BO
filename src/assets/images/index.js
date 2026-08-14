/**
 * Central image exports — mỗi file chỉ được bundle 1 lần bởi webpack.
 * Import từ đây thay vì import trực tiếp từ assets/ để đảm bảo
 * browser chỉ request mỗi ảnh 1 lần (browser cache theo URL hash của webpack).
 */
export { default as LogoPng } from './Logo.png';
export { default as LogoSvg } from './Logo.svg';
export { default as GoogleIcon } from './google_icon.png';
export { default as MobileIdIcon } from './mobileid-icon.png';
export { default as VneidIcon } from './Vneid-icon.png';
