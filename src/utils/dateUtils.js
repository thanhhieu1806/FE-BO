/**
 * dateUtils – shared date helper functions.
 * Không phụ thuộc vào thư viện ngoài.
 */

/**
 * Format Date hoặc ISO string → DD/MM/YYYY
 * @param {Date|string} date
 * @returns {string}
 */
export const formatDate = (date) => {
  const d   = date instanceof Date ? date : new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const mon = String(d.getMonth() + 1).padStart(2, '0');
  return `${day}/${mon}/${d.getFullYear()}`;
};

/**
 * Format Date hoặc ISO string → DD/MM/YYYY HH:mm:ss
 * @param {Date|string} date
 * @returns {string}
 */
export const formatDateTime = (date) => {
  const d   = date instanceof Date ? date : new Date(date);
  const hh  = String(d.getHours()).padStart(2, '0');
  const mm  = String(d.getMinutes()).padStart(2, '0');
  const ss  = String(d.getSeconds()).padStart(2, '0');
  return `${formatDate(d)} ${hh}:${mm}:${ss}`;
};
