/**
 * Simple helper to display basic toast messages. These toasts do not stack, and
 * because of this are meant to be used only for infrequent notifications (those
 * that would rarely happen back to back within a few seconds).
 *
 * The main reason to use this and not a toast library is CSS efficiency. All
 * toast libraries require some block of CSS be installed. That works well for
 * an app but every Web Component gets compiled as its own mini sandbox app.
 * That means a toast library's CSS would get compiled over and over. This
 * method is styled inline and minifie to <3K, most of which is the icons. If
 * we wanted to trim it more we could move those out to an icon library because
 * they're reused in other controls as well.
 */

export interface IVerdocsToastConfig {
  duration?: number;
  style?: 'error' | 'info' | 'success' | 'default';
}

const Icons = {
  error: `<div class="toast-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width: 24px; height: 24px; display: block;">
  <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd" />
</svg></div>`,

  success: `<div class="toast-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width: 24px; height: 24px; display: block;">
  <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd" />
</svg></div>`,

  info: `<div class="toast-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width: 24px; height: 24px; display: block;">
  <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd" />
</svg></div>`,

  // The empty element allows the flex "gap" to still provide the correct spacing, visually
  default: '<div class="toast-icon"></div>',
};

const Colors = {
  error: '#ed3d3d',
  success: '#3dc763',
  info: '#2379c7',
  default: '#6a56c1',
};

const removeToasts = () => Array.from(document.getElementsByClassName('verdocs-toast')).forEach(oldToast => oldToast.remove());

const closeClicked = (e: any) => {
  e.stopPropagation();
  removeToasts();
};

export const VerdocsToast = (text: string, config: IVerdocsToastConfig = {}) => {
  // We don't stack because we have only a few specific use-cases and they would
  // almost never show more than one message at a time.
  removeToasts();

  const {duration = 5000, style = 'default'} = config || {};
  const color = Colors[style] || Colors.default;
  const icon = Icons[style] || Icons.default;

  const toastBody = `
    ${icon}
    <div class="verdocs-toast-text" style="padding: 12px 12px 12px 0; display: flex; flex: 1">${text}</div>
    <div class="verdocs-toast-close" style="padding: 12px 10px; background: rgba(0, 0, 0, 0.2); cursor: pointer;">✕</div>
  `;

  const toast = document.createElement('div');
  toast.className = 'verdocs-toast';
  toast.innerHTML = toastBody;
  toast.style.cssText = `
display: flex; flex-direction: row; gap: 10px; align-items: center;
position: fixed; top: 20px; right: 20px; z-index: 2147483647; width: 50%; max-width: calc(100% - 40px);
color: #ffffff; background: ${color}; font-family: 'Barlow', sans-serif;
border-radius: 2px; padding-left: 10px;
box-shadow: 0 3px 7px 2px rgba(0, 0, 0, 0.12), 0 10px 36px -4px rgba(77, 96, 232, 0.3);`;
  document.body.append(toast);

  const closeElements = Array.from(document.getElementsByClassName('verdocs-toast-close'));
  closeElements.forEach(closeEl => closeEl.addEventListener('click', closeClicked));

  setTimeout(removeToasts, duration);
};
