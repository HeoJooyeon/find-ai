export const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
  alert(`Copied: ${text}`);
};
