import {format} from 'date-fns';
import {deleteTemplate, getTemplates, TTemplateAction, VerdocsEndpoint} from '@verdocs/js-sdk';
import {integerSequence, ITemplate, IGetTemplatesParams, canPerformTemplateAction} from '@verdocs/js-sdk';
import {Component, Event, EventEmitter, h, Host, Prop, State, Watch} from '@stencil/core';
import {IFilterOption} from '../../controls/verdocs-quick-filter/verdocs-quick-filter';
import {IMenuOption} from '../../controls/verdocs-dropdown/verdocs-dropdown';
import {SDKError} from '../../../utils/errors';
import { VerdocsToast } from '../../../utils/Toast';

const GlobeAltIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>`;
const LockClosedIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>`;
const BuildingOfficeIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>`;
const EnvelopeIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>`;
const CreatedIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 122.88"><g><path d="M81.61,4.73c0-2.61,2.58-4.73,5.77-4.73c3.19,0,5.77,2.12,5.77,4.73v20.72c0,2.61-2.58,4.73-5.77,4.73 c-3.19,0-5.77-2.12-5.77-4.73V4.73L81.61,4.73z M66.11,103.81c-0.34,0-0.61-1.43-0.61-3.2c0-1.77,0.27-3.2,0.61-3.2H81.9 c0.34,0,0.61,1.43,0.61,3.2c0,1.77-0.27,3.2-0.61,3.2H66.11L66.11,103.81z M15.85,67.09c-0.34,0-0.61-1.43-0.61-3.2 c0-1.77,0.27-3.2,0.61-3.2h15.79c0.34,0,0.61,1.43,0.61,3.2c0,1.77-0.27,3.2-0.61,3.2H15.85L15.85,67.09z M40.98,67.09 c-0.34,0-0.61-1.43-0.61-3.2c0-1.77,0.27-3.2,0.61-3.2h15.79c0.34,0,0.61,1.43,0.61,3.2c0,1.77-0.27,3.2-0.61,3.2H40.98 L40.98,67.09z M66.11,67.09c-0.34,0-0.61-1.43-0.61-3.2c0-1.77,0.27-3.2,0.61-3.2H81.9c0.34,0,0.61,1.43,0.61,3.2 c0,1.77-0.27,3.2-0.61,3.2H66.11L66.11,67.09z M91.25,67.09c-0.34,0-0.61-1.43-0.61-3.2c0-1.77,0.27-3.2,0.61-3.2h15.79 c0.34,0,0.61,1.43,0.61,3.2c0,1.77-0.27,3.2-0.61,3.2H91.25L91.25,67.09z M15.85,85.45c-0.34,0-0.61-1.43-0.61-3.2 c0-1.77,0.27-3.2,0.61-3.2h15.79c0.34,0,0.61,1.43,0.61,3.2c0,1.77-0.27,3.2-0.61,3.2H15.85L15.85,85.45z M40.98,85.45 c-0.34,0-0.61-1.43-0.61-3.2c0-1.77,0.27-3.2,0.61-3.2h15.79c0.34,0,0.61,1.43,0.61,3.2c0,1.77-0.27,3.2-0.61,3.2H40.98 L40.98,85.45z M66.11,85.45c-0.34,0-0.61-1.43-0.61-3.2c0-1.77,0.27-3.2,0.61-3.2H81.9c0.34,0,0.61,1.43,0.61,3.2 c0,1.77-0.27,3.2-0.61,3.2H66.11L66.11,85.45z M91.25,85.45c-0.34,0-0.61-1.43-0.61-3.2c0-1.77,0.27-3.2,0.61-3.2h15.79 c0.34,0,0.61,1.43,0.61,3.2c0,1.77-0.27,3.2-0.61,3.2H91.25L91.25,85.45z M15.85,103.81c-0.34,0-0.61-1.43-0.61-3.2 c0-1.77,0.27-3.2,0.61-3.2h15.79c0.34,0,0.61,1.43,0.61,3.2c0,1.77-0.27,3.2-0.61,3.2H15.85L15.85,103.81z M40.98,103.81 c-0.34,0-0.61-1.43-0.61-3.2c0-1.77,0.27-3.2,0.61-3.2h15.79c0.34,0,0.61,1.43,0.61,3.2c0,1.77-0.27,3.2-0.61,3.2H40.98 L40.98,103.81z M29.61,4.73c0-2.61,2.58-4.73,5.77-4.73s5.77,2.12,5.77,4.73v20.72c0,2.61-2.58,4.73-5.77,4.73 s-5.77-2.12-5.77-4.73V4.73L29.61,4.73z M6.4,45.32h110.07V21.47c0-0.8-0.33-1.53-0.86-2.07c-0.53-0.53-1.26-0.86-2.07-0.86H103 c-1.77,0-3.2-1.43-3.2-3.2c0-1.77,1.43-3.2,3.2-3.2h10.55c2.57,0,4.9,1.05,6.59,2.74c1.69,1.69,2.74,4.02,2.74,6.59v27.06v65.03 c0,2.57-1.05,4.9-2.74,6.59c-1.69,1.69-4.02,2.74-6.59,2.74H9.33c-2.57,0-4.9-1.05-6.59-2.74C1.05,118.45,0,116.12,0,113.55V48.52 V21.47c0-2.57,1.05-4.9,2.74-6.59c1.69-1.69,4.02-2.74,6.59-2.74H20.6c1.77,0,3.2,1.43,3.2,3.2c0,1.77-1.43,3.2-3.2,3.2H9.33 c-0.8,0-1.53,0.33-2.07,0.86c-0.53,0.53-0.86,1.26-0.86,2.07V45.32L6.4,45.32z M116.48,51.73H6.4v61.82c0,0.8,0.33,1.53,0.86,2.07 c0.53,0.53,1.26,0.86,2.07,0.86h104.22c0.8,0,1.53-0.33,2.07-0.86c0.53-0.53,0.86-1.26,0.86-2.07V51.73L116.48,51.73z M50.43,18.54 c-1.77,0-3.2-1.43-3.2-3.2c0-1.77,1.43-3.2,3.2-3.2h21.49c1.77,0,3.2,1.43,3.2,3.2c0,1.77-1.43,3.2-3.2,3.2H50.43L50.43,18.54z"/></g></svg>`;
const LastUsedIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 410.2"><path d="M35.28 35.51h32.54v43.42c0 10.58 4.27 20.06 11.35 27.23 17.03 17.14 45.5 17.45 63.06.93 7.71-7.29 12.4-17.14 12.4-28.16V35.51h65.71v43.42c0 6.34 1.56 12.3 4.35 17.6 2.03 3.85 4.71 7.37 7.92 10.43l2.41 2.24c1.79 1.46 3.71 2.79 5.76 3.97l.31.18.07.04.25.13.16.1.15.08.27.14.05.03.32.17.05.03.27.13.15.08.17.09.26.12.07.04.32.16.03.01.31.15.12.06.2.09.24.11.1.05.33.14.34.16.1.04.23.1.21.09.13.05.31.13h.03l.34.14.08.04.27.1.18.07.16.06.3.11.05.02.34.12.06.02.3.11.16.05.19.07.26.09.09.03.35.12.02.01.34.1.13.04.22.07.25.07.11.03.36.11.36.1.11.03.25.07.22.06.14.04.34.09h.02l.37.1.08.02.29.06.19.05.17.03.32.08.05.01.37.08.06.01.31.06.17.04.21.03.28.06.09.02.37.07h.03l.35.06.14.03.23.03.27.04.11.02.38.06.38.05.12.01.26.04.23.03.15.01.35.05h.03l.39.04.08.01.3.02.21.02.17.02.34.02.05.01.39.03h.05l.34.02.18.01.21.01.3.02h.08l.39.01.03.01.36.01h.39l.28.01h.96l.33-.01h.39l.18-.01.2-.01.25-.01h.13l.32-.02h.07l.38-.02h.01l.37-.02.07-.01.32-.02.12-.01.26-.02.19-.02.19-.02.25-.02.13-.01.31-.04h.07l.37-.05h.01l.37-.04.06-.01.32-.04.12-.02.26-.03.18-.03.19-.03.24-.04.14-.02.3-.05.07-.01.36-.06h.01l.37-.07.05-.01.32-.06.12-.02.25-.05.18-.04.19-.04.23-.05.14-.03.29-.07.08-.01.35-.08.01-.01.36-.08.05-.02.31-.08.11-.02.25-.07.17-.04.2-.06.22-.05.14-.05.28-.08.07-.02.34-.09.02-.01.36-.11.03-.01.32-.1.1-.03.25-.08.16-.05.19-.07.22-.07.13-.04.28-.1.08-.03.32-.11.02-.01.35-.13.04-.01.3-.11.09-.04.26-.1.15-.06.19-.07.21-.09.13-.05.26-.11.08-.03.32-.13.02-.01.33-.14.04-.02.3-.13.09-.04.24-.11.14-.07.19-.08.19-.1.14-.06.25-.12.08-.03.3-.16h.03l.32-.17.03-.01.29-.16.09-.04.24-.12.13-.07.19-.1.18-.1.14-.07.23-.13.08-.05.29-.16.03-.01.31-.18c1.11-.64 2.17-1.31 3.2-2.03l2.71-1.95c4.36-3.56 7.92-7.88 10.43-12.76 2.73-5.26 4.25-11.19 4.25-17.5V35.51h33.97c9.68 0 18.5 3.98 24.91 10.38 6.4 6.37 10.38 15.2 10.38 24.9V192.9H365.1v-53.83H11.3v233.49c0 15.25 12.49 27.74 27.75 27.74h298.3c15.27 0 27.75-12.51 27.75-27.74V325.6h11.31v49.32c0 9.7-3.98 18.53-10.37 24.91-6.42 6.39-15.24 10.37-24.92 10.37H35.28c-9.68 0-18.49-3.97-24.89-10.37C3.97 393.41 0 384.59 0 374.92V70.79C0 61.12 3.97 52.3 10.36 45.9c6.43-6.42 15.25-10.39 24.92-10.39zm211.43-21.54c0-7.71 7.61-13.97 17.03-13.97 9.42 0 17.04 6.26 17.04 13.97v64.96c0 7.7-7.62 13.96-17.04 13.96-9.42 0-17.03-6.26-17.03-13.96V13.97zm-152.52 0C94.19 6.26 101.81 0 111.23 0c9.42 0 17.03 6.26 17.03 13.97v64.96c0 7.7-7.61 13.96-17.03 13.96-9.42 0-17.04-6.26-17.04-13.96V13.97zm311.37 327.72c1.48-14.79 2.69-32.45 3.59-46.5h-75.88v-71.88h77.43c-.39-14.06-1.17-31.75-2.35-46.58-.96-5.93 6.02-9.73 10.51-5.9l90.89 82.99c2.7 2.31 3.02 6.38.7 9.08l-.74.73-93.65 84.05c-4.6 3.89-11.47-.19-10.5-5.99zM63.51 286h50.56c3.53 0 6.43 2.91 6.43 6.44v42.06c0 3.52-2.91 6.44-6.43 6.44H63.51c-3.53 0-6.44-2.91-6.44-6.44v-42.06c0-3.54 2.9-6.44 6.44-6.44zm198.44-98.62h50.55c3.23 0 5.92 2.43 6.37 5.52h-16v49.42h-40.92c-3.53 0-6.45-2.9-6.45-6.45v-42.05c0-3.54 2.9-6.44 6.45-6.44zm0 98.62h40.92v39.6h16.07v8.9c0 3.52-2.92 6.44-6.44 6.44h-50.55c-3.53 0-6.45-2.91-6.45-6.44v-42.06c0-3.54 2.9-6.44 6.45-6.44zm-98.5-98.62h50.56c3.53 0 6.43 2.92 6.43 6.44v42.05c0 3.53-2.91 6.45-6.43 6.45h-50.56c-3.53 0-6.44-2.9-6.44-6.45v-42.05c0-3.54 2.9-6.44 6.44-6.44zm-99.94 0h50.56c3.53 0 6.43 2.92 6.43 6.44v42.05c0 3.53-2.91 6.45-6.43 6.45H63.51c-3.53 0-6.44-2.9-6.44-6.45v-42.05c0-3.54 2.9-6.44 6.44-6.44zM163.45 286h50.56c3.53 0 6.43 2.91 6.43 6.44v42.06c0 3.52-2.91 6.44-6.43 6.44h-50.56c-3.53 0-6.44-2.91-6.44-6.44v-42.06c0-3.54 2.9-6.44 6.44-6.44z"/></svg>`;
const UpdatedIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 506.49"><path fill-rule="nonzero" d="m371.06 415.61-43.25 11.52 6.23-46.41 37.02 34.89zm6.76-177.5c36.98 0 70.56 15.04 94.83 39.35C496.96 301.7 512 335.25 512 372.31c0 37.02-15.02 70.61-39.3 94.88l-.68.64c-24.23 23.88-57.5 38.66-94.2 38.66-37.06 0-70.61-15.04-94.88-39.31l-.64-.69c-23.9-24.24-38.68-57.53-38.68-94.18 0-37.06 15.04-70.61 39.32-94.89 24.27-24.27 57.85-39.31 94.88-39.31zm78.74 55.41c-20.09-20.11-47.96-32.58-78.74-32.58-30.75 0-58.61 12.47-78.75 32.62-20.15 20.14-32.62 48-32.62 78.75 0 30.5 12.25 58.14 32.02 78.19l.6.55c20.14 20.14 48 32.61 78.75 32.61 30.48 0 58.12-12.25 78.21-32.02l.54-.58c20.15-20.15 32.61-48 32.61-78.75s-12.48-58.61-32.62-78.79zM294.24 17.11C294.24 7.69 303.52 0 315.1 0c11.57 0 20.87 7.64 20.87 17.11v74.85c0 9.42-9.3 17.11-20.87 17.11-11.58 0-20.86-7.65-20.86-17.11V17.11zM56.8 242.28c-1.17 0-2.23-5.2-2.23-11.57 0-6.38.92-11.53 2.23-11.53h56.94c1.18 0 2.24 5.2 2.24 11.53 0 6.39-.92 11.57-2.24 11.57H56.8zm90.77 0c-1.17 0-2.23-5.2-2.23-11.57 0-6.38.92-11.53 2.23-11.53h56.94c1.18 0 2.24 5.2 2.24 11.53 0 6.39-.92 11.57-2.24 11.57h-56.94zm90.77 0c-1.16 0-2.22-5.2-2.22-11.57 0-6.38.92-11.53 2.22-11.53h56.94c1.19 0 2.25 5.15 2.25 11.49-5.7 3.55-11.2 7.44-16.43 11.61h-42.76zm-181.4 66.24c-1.18 0-2.24-5.2-2.24-11.57 0-6.38.93-11.58 2.24-11.58h56.94c1.18 0 2.22 5.2 2.22 11.58 0 6.37-.91 11.57-2.22 11.57H56.94zm90.77 0c-1.18 0-2.24-5.2-2.24-11.57 0-6.38.93-11.58 2.24-11.58h56.94c1.18 0 2.23 5.2 2.23 11.58 0 6.37-.92 11.57-2.23 11.57h-56.94zM57.06 374.8c-1.18 0-2.24-5.2-2.24-11.59 0-6.36.94-11.56 2.24-11.56H114c1.19 0 2.24 5.2 2.24 11.56 0 6.39-.93 11.59-2.24 11.59H57.06zm90.78 0c-1.19 0-2.25-5.2-2.25-11.59 0-6.36.94-11.56 2.25-11.56h56.94c1.18 0 2.24 5.2 2.24 11.56 0 6.39-.94 11.59-2.24 11.59h-56.94zM106.83 17.11C106.83 7.69 116.1 0 127.69 0c11.57 0 20.86 7.64 20.86 17.11v74.85c0 9.42-9.34 17.11-20.86 17.11-11.59 0-20.86-7.65-20.86-17.11V17.11zM22.97 163.64h397.39V77.46c0-2.94-1.19-5.53-3.09-7.43-1.9-1.9-4.59-3.08-7.42-3.08h-38.1c-6.39 0-11.59-5.2-11.59-11.57 0-6.38 5.2-11.58 11.59-11.58h38.1c9.32 0 17.7 3.77 23.82 9.88 6.12 6.14 9.88 14.5 9.88 23.83v136.81c-7.61-2.62-15.41-4.73-23.44-6.29v-21.38h.25H22.97v223.17c0 2.94 1.18 5.52 3.08 7.42 1.91 1.9 4.61 3.08 7.44 3.08h188.85c2.16 8.02 4.86 15.84 8.11 23.36H33.71c-9.3 0-17.7-3.75-23.84-9.89C3.75 427.72 0 419.36 0 410.02V77.55c0-9.29 3.75-17.7 9.87-23.82 6.14-6.13 14.5-9.89 23.84-9.89h40.67c6.38 0 11.57 5.2 11.57 11.57C85.95 61.8 80.76 67 74.38 67H33.71c-2.96 0-5.54 1.18-7.44 3.08-1.9 1.9-3.09 4.59-3.09 7.43v86.16h-.21v-.03zm158.95-96.69c-6.39 0-11.57-5.2-11.57-11.57 0-6.38 5.18-11.58 11.57-11.58h77.55c6.39 0 11.57 5.2 11.57 11.58 0 6.37-5.18 11.57-11.57 11.57h-77.55zm161.66 303.24 45.37-51.33c.72-.84 1.78-1.34 2.85-1.36.69-.01 1.37.13 1.98.45l32.94 29.96c.66.59 1.05 1.46 1.06 2.35.02 1-.39 1.98-1.16 2.66l-46.15 52.16-36.95-34.89h.06z"/></svg>`;

const VisibilityFilters: IFilterOption[] = [
  {value: 'private_shared', label: 'Personal + Shared'},
  {value: 'private', label: 'Personal'},
  {value: 'shared', label: 'Shared'},
  {value: 'public', label: 'Public'},
];

const StarredFilters: IFilterOption[] = [
  {value: 'all', label: 'All'},
  {value: 'starred', label: 'Starred'},
  {value: 'unstarred', label: 'Not Starred'},
];

const SortOptions: IFilterOption[] = [
  {value: 'name', label: 'Name'},
  {value: 'created_at', label: 'Created'},
  {value: 'updated_at', label: 'Last Updated'},
  {value: 'last_used_at', label: 'Last Used'},
  {value: 'counter', label: 'Most Used'},
  {value: 'star_counter', label: 'Most Starred'},
];

export type TAllowedTemplateAction = 'send' | 'createlink' | 'signnow' | 'submitted' | 'link' | 'edit' | 'delete';

/**
 * Display a list of templates in the caller's account.
 *
 * ```ts
 * <verdocs-template-list
 *   visibility="private"
 *   sort="updated_at"
 *   onViewTemplate={({ detail }) => console.log('View template:', detail) }
 *   />
 * ```
 */@Component({
  tag: 'verdocs-templates-list',
  styleUrl: 'verdocs-templates-list.scss',
})
export class VerdocsTemplatesList {
  /**
   * The endpoint to use to communicate with Verdocs. If not set, the default endpoint will be used.
   */
  @Prop() endpoint: VerdocsEndpoint = VerdocsEndpoint.getDefault();

  /**
   * The sharing settings to filter by.
   */
  @Prop({reflect: true, mutable: true}) visibility?: 'private_shared' | 'private' | 'shared' | 'public' = 'private_shared';

  /**
   * The starred settings to filter by.
   */
  @Prop({reflect: true, mutable: true}) starred: 'all' | 'starred' | 'unstarred' = 'all';

  /**
   * The sort order to display.
   */
  @Prop({reflect: true, mutable: true}) sort: string = 'updated_at';

  /**
   * If set, filter templates by the specified name.
   */
  @Prop({reflect: true, mutable: true}) name: string = '';

  /**
   * Override the If set, filter templates by the specified name.
   */
  @Prop({reflect: true, mutable: true}) allowedActions: TAllowedTemplateAction[] = ['send', 'submitted', 'link', 'edit', 'delete'];
  // @Prop({reflect: true, mutable: true}) allowedActions: TAllowedTemplateAction[] = ['send', 'createlink', 'signnow', 'submitted', 'link', 'edit', 'delete'];

  /**
   * Whether or not pagination should be enabled.
   */
  @Prop() showPagination = true;

  /**
   * The number of rows to display per page.
   */
  @Prop() rowsPerPage = 10;

  /**
   * The initial page number to select. Pagination is internally controlled but may be overriden by the
   * host applicaiton.
   */
  @Prop() selectedPage = 0;

  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
   * terminate the process, and the calling application should correct the condition and re-render the component.
   */
  @Event({composed: true}) sdkError: EventEmitter<SDKError>;

  /**
   * Event fired when the user clicks a template to view it. Typically the host application will use this to navigate
   * to the template preview. This is also fired when the user selects "Preview/Send" fropm the dropdown menu.
   */
  @Event({composed: true}) viewTemplate: EventEmitter<{endpoint: VerdocsEndpoint; template: ITemplate}>;

  /**
   * Event fired when the user clicks to sign a template now.
   */
  @Event({composed: true}) signNow: EventEmitter<{endpoint: VerdocsEndpoint; template: ITemplate}>;

  /**
   * Event fired when the user clicks to sign a template now.
   */
  @Event({composed: true}) submittedData: EventEmitter<{endpoint: VerdocsEndpoint; template: ITemplate}>;

  /**
   * Event fired when the user selects to create a preview link for a template.
   */
  // @Event({composed: true}) createLink: EventEmitter<{endpoint: VerdocsEndpoint; template: ITemplate}>;

  /**
   * Event fired when the user chooses the Edit option from the dropdown menu.
   */
  @Event({composed: true}) editTemplate: EventEmitter<{endpoint: VerdocsEndpoint; template: ITemplate}>;

  /**
   * Event fired when the user chooses the Delete option from the dropdown menu. When this is fired, the template
   * will already have been deleted. The host application should remove it from the list or refresh the list.
   */
  @Event({composed: true}) templateDeleted: EventEmitter<{endpoint: VerdocsEndpoint; template: ITemplate}>;

  /**
   * Event fired when the user changes their sort order. Host applications can use this to save the user's preferences.
   */
  @Event({composed: true}) changeSort: EventEmitter<string>;

  /**
   * Event fired when the user changes their sort order. Host applications can use this to save the user's preferences.
   */
  @Event({composed: true}) changeVisibility: EventEmitter<'private_shared' | 'private' | 'shared' | 'public'>;

  /**
   * Event fired when the user changes their sort order. Host applications can use this to save the user's preferences.
   */
  @Event({composed: true}) changeStarred: EventEmitter<'all' | 'starred' | 'unstarred'>;

  /**
   * Event fired when the user changes the name filter. This is fired for every inputChange event (every character
   * typed). This event is provided for balance with the other events, but host applications should generally not
   * save this value. Users might appreciate applications remembering their sorting or filtering preferences, but
   * probably not their search terms.
   */
  @Event({composed: true}) changeName: EventEmitter<string>;

  @State() count = 0;
  @State() initiallyLoaded = false;
  @State() loading = true;
  @State() confirmDelete: ITemplate | null = null;
  @State() templates: ITemplate[] = [];
  @State() localNameFilter = '';

  @Watch('sharing')
  handleSharingUpdated() {
    return this.queryTemplates();
  }

  @Watch('starred')
  handleStarredUpdated() {
    return this.queryTemplates();
  }

  @Watch('sort')
  handleSortUpdated() {
    return this.queryTemplates();
  }

  @Watch('name')
  handleNameUpdated() {
    return this.queryTemplates();
  }

  @Watch('selectedPage')
  handlePageUpdated() {
    return this.queryTemplates();
  }

  componentWillLoad() {
    this.endpoint.loadSession();
    if (!this.endpoint.session) {
      console.log('[TEMPLATES] Must be authenticated');
      return;
    }
  }

  async componentDidLoad() {
    await this.queryTemplates();
    this.initiallyLoaded = true;
  }

  async queryTemplates() {
    console.log('[TEMPLATES] Querying templates');
    this.loading = true;
    try {
      let queryParams: IGetTemplatesParams = {
        visibility: this.visibility,
        // starred: this.starred,
        page: this.selectedPage,
        // sort: this.sort,
        rows: this.rowsPerPage,
        // ascending: this.sort === 'name' || this.sort === 'star_counter',
      };

      if (this.name.trim() !== '') {
        queryParams.q = this.name.trim();
      }

      const response = await getTemplates(this.endpoint, queryParams);
      this.templates = response.templates;
      this.count = response.count;
      this.loading = false;
    } catch (e) {
      this.loading = false;
      console.log('[TEMPLATES] Error listing templates', e);
      VerdocsToast('Unable to list template: ' + e.message, {style: 'error'});
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }

  handleOptionSelected = (option: string, template: ITemplate) => {
    if (option === 'send') {
      this.viewTemplate?.emit({endpoint: this.endpoint, template: template});
      // } else if (option === 'createlink') {
      //   VerdocsToast('This feature is coming soon!');
    } else if (option === 'signnow') {
      this.signNow?.emit({endpoint: this.endpoint, template: template});
    } else if (option === 'submitted') {
      this.submittedData?.emit({endpoint: this.endpoint, template: template});
      // } else if (option === 'link') {
      //   VerdocsToast('This feature is coming soon!');
    } else if (option === 'edit') {
      this.editTemplate?.emit({endpoint: this.endpoint, template: template});
    } else if (option === 'delete') {
      this.confirmDelete = template;
    }
  };

  deleteTemplate(template: ITemplate) {
    this.confirmDelete = null;
    deleteTemplate(this.endpoint, template.id)
      .then(() => {
        console.log('[TEMPLATES] Deleted template', template);
        this.templateDeleted?.emit({endpoint: this.endpoint, template: template});
        return this.queryTemplates();
      })
      .catch(e => {
        console.log('[TEMPLATES] Error deleting template', template);
        VerdocsToast('Unable to delete template: ' + e.message, {style: 'error'});
        this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
      });
  }

  render() {
    // In addition to the server query we also filter locally. This provides a faster UI update
    // while the onBlur re-queries the server for any new records that now qualify by the filter.
    const locallyFilteredTemplates = !this.localNameFilter ? this.templates : this.templates.filter(t => t.name.toLowerCase().includes(this.localNameFilter.toLowerCase()));

    return (
      <Host>
        <div class="header">
          <div class="filter">
            <verdocs-text-input
              id="verdocs-filter-name"
              value={this.name}
              clearable={true}
              autocomplete="off"
              placeholder="Filter by Name..."
              onInput={(e: any) => (this.localNameFilter = e.target.value.trim())}
              onFocusout={(e: any) => {
                this.name = e.target.value.trim();
                this.localNameFilter = e.target.value.trim();
                this.changeName?.emit(this.name);
              }}
            />
          </div>

          <verdocs-quick-filter
            label="Visibility"
            value={this.visibility}
            options={VisibilityFilters}
            onOptionSelected={e => {
              this.visibility = e.detail.value as any;
              this.changeVisibility?.emit(this.visibility);
            }}
          />

          <verdocs-quick-filter
            label="Starred"
            value={this.starred}
            options={StarredFilters}
            onOptionSelected={e => {
              this.starred = e.detail.value as any;
              this.changeStarred?.emit(this.starred);
            }}
          />

          <verdocs-quick-filter
            label="Sort By"
            value={this.sort}
            options={SortOptions}
            onOptionSelected={e => {
              this.sort = e.detail.value as any;
              this.changeSort?.emit(this.sort);
            }}
          />
          {this.loading && <verdocs-spinner mode="dark" size={24} />}
          <div style={{display: 'flex', flex: '1'}} />
        </div>

        {/*<verdocs-table*/}
        {/*  data={locallyFilteredTemplates}*/}
        {/*  onRowClick={(template: any) => this.viewTemplate?.emit({endpoint: this.endpoint, template: template as ITemplate})}*/}
        {/*  columns={[*/}
        {/*    {*/}
        {/*      id: 'starred',*/}
        {/*      renderCell: (_, row) => <verdocs-template-star template={row} endpoint={this.endpoint} />,*/}
        {/*    },*/}
        {/*    {*/}
        {/*      id: 'name',*/}
        {/*    },*/}
        {/*    {*/}
        {/*      id: 'usage',*/}
        {/*      renderCell: (_, row) => (*/}
        {/*        <div>*/}
        {/*          <span innerHTML={EnvelopeIcon} title="Usage Counter" />*/}
        {/*          {row.counter || '--'}*/}
        {/*        </div>*/}
        {/*      ),*/}
        {/*    },*/}
        {/*    {*/}
        {/*      id: 'created_at',*/}
        {/*      renderCell: (_, row) => {*/}
        {/*        const dateToShow = this.sort === 'created_at' ? 'created_at' : this.sort === 'updated_at' ? 'updated_at' : 'last_used_at';*/}
        {/*        const date = row[dateToShow];*/}

        {/*        return (*/}
        {/*          <div class="last-used">*/}
        {/*            {dateToShow === 'created_at' && <span innerHTML={CreatedIcon} title="Created" />}*/}
        {/*            {dateToShow === 'updated_at' && <span innerHTML={UpdatedIcon} title="Last Updated" />}*/}
        {/*            {dateToShow === 'last_used_at' && <span innerHTML={LastUsedIcon} title="Last Used" />}*/}
        {/*            {date ? format(new Date(date), 'P') : 'Never'}*/}
        {/*          </div>*/}
        {/*        );*/}
        {/*      },*/}
        {/*    },*/}
        {/*    {*/}
        {/*      id: 'ownership',*/}
        {/*      renderCell: (_, row) => (*/}
        {/*        <div>*/}
        {/*          {row.is_public && (*/}
        {/*            <div class="ownership">*/}
        {/*              <span innerHTML={GlobeAltIcon} /> Public*/}
        {/*            </div>*/}
        {/*          )}*/}
        {/*          {!row.is_public && !row.is_personal && (*/}
        {/*            <div class="ownership">*/}
        {/*              <span innerHTML={LockClosedIcon} /> Private*/}
        {/*            </div>*/}
        {/*          )}*/}
        {/*          {!row.is_public && row.is_personal && (*/}
        {/*            <div class="ownership">*/}
        {/*              <span innerHTML={BuildingOfficeIcon} /> Shared*/}
        {/*            </div>*/}
        {/*          )}*/}
        {/*        </div>*/}
        {/*      ),*/}
        {/*    },*/}
        {/*    {*/}
        {/*      id: 'actions',*/}
        {/*      renderCell: (_, row) => {*/}
        {/*        const MENU_OPTIONS: IMenuOption[] = [];*/}

        {/*        if (row.allowed_operations.includes(TemplateActions.READ) && this.allowedActions.includes('send')) {*/}
        {/*          MENU_OPTIONS.push({label: 'Preview / Send', id: 'send', disabled: !row.allowed_operations.includes(TemplateActions.READ)});*/}
        {/*        }*/}

        {/*        // if (this.allowedActions.includes('createlink')) {*/}
        {/*        //   MENU_OPTIONS.push({label: 'Create Link', id: 'createlink', disabled: true});*/}
        {/*        // }*/}

        {/*        if (row.allowed_operations.includes(TemplateActions.CREATE_PERSONAL) && this.allowedActions.includes('signnow')) {*/}
        {/*          MENU_OPTIONS.push({label: 'Sign Now', id: 'signnow', disabled: true});*/}
        {/*        }*/}

        {/*        if (row.allowed_operations.includes(TemplateActions.READ) && this.allowedActions.includes('submitted')) {*/}
        {/*          MENU_OPTIONS.push({label: ''});*/}
        {/*          MENU_OPTIONS.push({label: 'Submissions', id: 'submitted'});*/}
        {/*        }*/}

        {/*        if (this.allowedActions.includes('link') || this.allowedActions.includes('edit') || this.allowedActions.includes('delete')) {*/}
        {/*          MENU_OPTIONS.push({label: ''});*/}

        {/*          // TODO: The preview link used to be just an internal route in the main Web application, but*/}
        {/*          // that's not suitable for embeddding. Disabling until this gets re-requested as a feature,*/}
        {/*          // in which case we'll want to move this to an API-driven function.*/}
        {/*          // if (this.allowedActions.includes('link') || this.allowedActions.includes('edit') || this.allowedActions.includes('delete')) {*/}
        {/*          //   MENU_OPTIONS.push({label: 'Get Preview Link', id: 'link', disabled: !this.canPreview(template)});*/}
        {/*          // }*/}

        {/*          if (this.allowedActions.includes('link') || this.allowedActions.includes('edit') || this.allowedActions.includes('delete')) {*/}
        {/*            MENU_OPTIONS.push({label: 'Edit', id: 'edit', disabled: !row.allowed_operations.includes(TemplateActions.WRITE)});*/}
        {/*          }*/}

        {/*          if (this.allowedActions.includes('link') || this.allowedActions.includes('edit') || this.allowedActions.includes('delete')) {*/}
        {/*            MENU_OPTIONS.push({*/}
        {/*              label: 'Delete',*/}
        {/*              id: 'delete',*/}
        {/*              disabled: !row.allowed_operations.includes(TemplateActions.DELETE),*/}
        {/*            });*/}
        {/*          }*/}
        {/*        }*/}

        {/*        return <verdocs-dropdown options={MENU_OPTIONS} onOptionSelected={e => this.handleOptionSelected(e.detail.id, row)} />;*/}
        {/*      },*/}
        {/*    },*/}
        {/*  ]}*/}
        {/*/>*/}

        {locallyFilteredTemplates.map(template => {
          const dateToShow = this.sort === 'created_at' ? 'created_at' : this.sort === 'updated_at' ? 'updated_at' : 'last_used_at';
          const date = template[dateToShow];

          const MENU_OPTIONS: IMenuOption[] = [];

          const allowed_operations: TTemplateAction[] = [];

          // serverless/src/functions/getTemplates.ts:        allowed_operations: [] as string[],
          // serverless/src/functions/getTemplates.ts:      canPerformTemplateAction(request.session, 'create_personal', record) && record.allowed_operations.push('create_personal');
          // serverless/src/functions/getTemplates.ts:      canPerformTemplateAction(request.session, 'create_org', record) && record.allowed_operations.push('create_org');
          // serverless/src/functions/getTemplates.ts:      canPerformTemplateAction(request.session, 'create_public', record) && record.allowed_operations.push('create_public');
          // serverless/src/functions/getTemplates.ts:      canPerformTemplateAction(request.session, 'read', record) && record.allowed_operations.push('read');
          // serverless/src/functions/getTemplates.ts:      canPerformTemplateAction(request.session, 'write', record) && record.allowed_operations.push('write');
          // serverless/src/functions/getTemplates.ts:      canPerformTemplateAction(request.session, 'delete', record) && record.allowed_operations.push('delete');
          // serverless/src/functions/getTemplates.ts:      canPerformTemplateAction(request.session, 'change_visibility_personal', record) && record.allowed_operations.push('change_visibility_personal');
          // serverless/src/functions/getTemplates.ts:      canPerformTemplateAction(request.session, 'change_visibility_org', record) && record.allowed_operations.push('change_visibility_org');
          // serverless/src/functions/getTemplates.ts:      canPerformTemplateAction(request.session, 'change_visibility_public', record) && record.allowed_operations.push('change_visibility_public');

          if (this.allowedActions.includes('send')) {
            MENU_OPTIONS.push({label: 'Preview / Send', id: 'send', disabled: !canPerformTemplateAction(this.endpoint.profile, 'read', template)});
          }

          // if (this.allowedActions.includes('createlink')) {
          //   MENU_OPTIONS.push({label: 'Create Link', id: 'createlink', disabled: true});
          // }

          if (this.allowedActions.includes('signnow')) {
            MENU_OPTIONS.push({label: 'Sign Now', id: 'signnow', disabled: true});
          }

          if (this.allowedActions.includes('submitted')) {
            MENU_OPTIONS.push({label: ''});
            MENU_OPTIONS.push({label: 'Submissions', id: 'submitted', disabled: !canPerformTemplateAction(this.endpoint.profile, 'read', template)});
          }

          if (this.allowedActions.includes('link') || this.allowedActions.includes('edit') || this.allowedActions.includes('delete')) {
            MENU_OPTIONS.push({label: ''});

            // TODO: The preview link used to be just an internal route in the main Web application, but
            // that's not suitable for embeddding. Disabling until this gets re-requested as a feature,
            // in which case we'll want to move this to an API-driven function.
            // if (this.allowedActions.includes('link') || this.allowedActions.includes('edit') || this.allowedActions.includes('delete')) {
            //   MENU_OPTIONS.push({label: 'Get Preview Link', id: 'link', disabled: !this.canPreview(template)});
            // }

            if (this.allowedActions.includes('link') || this.allowedActions.includes('edit') || this.allowedActions.includes('delete')) {
              MENU_OPTIONS.push({label: 'Edit', id: 'edit', disabled: !allowed_operations.includes('write')});
            }

            if (this.allowedActions.includes('link') || this.allowedActions.includes('edit') || this.allowedActions.includes('delete')) {
              MENU_OPTIONS.push({label: 'Delete', id: 'delete', disabled: !allowed_operations.includes('delete')});
            }
          }

          return (
            <div
              class="template"
              onClick={() => {
                this.viewTemplate?.emit({endpoint: this.endpoint, template});
              }}
            >
              <div class="inner">
                <verdocs-template-star template={template} endpoint={this.endpoint} />

                <div class="spacer icon-spacer" />
                <div class="name">{template.name}</div>

                <div class="spacer usage-spacer" />
                <div class="usage">
                  <span innerHTML={EnvelopeIcon} title="Usage Counter" />
                  {template.counter || '--'}
                </div>

                <div class="spacer last-used-spacer" />
                <div class="last-used">
                  {dateToShow === 'created_at' && <span innerHTML={CreatedIcon} title="Created" />}
                  {dateToShow === 'updated_at' && <span innerHTML={UpdatedIcon} title="Last Updated" />}
                  {dateToShow === 'last_used_at' && <span innerHTML={LastUsedIcon} title="Last Used" />}
                  {date ? format(new Date(date), 'P') : 'Never'}
                </div>

                <div class="spacer ownership-spacer" />
                {template.is_public && (
                  <div class="ownership">
                    <span innerHTML={GlobeAltIcon} /> Public
                  </div>
                )}
                {!template.is_public && !template.is_personal && (
                  <div class="ownership">
                    <span innerHTML={LockClosedIcon} /> Private
                  </div>
                )}
                {!template.is_public && template.is_personal && (
                  <div class="ownership">
                    <span innerHTML={BuildingOfficeIcon} /> Shared
                  </div>
                )}

                <verdocs-dropdown options={MENU_OPTIONS} onOptionSelected={e => this.handleOptionSelected(e.detail.id, template)} />
              </div>
            </div>
          );
        })}

        {!this.initiallyLoaded && (
          <div>
            {integerSequence(0, this.rowsPerPage).map(() => (
              <div class="template-placeholder" />
            ))}
          </div>
        )}

        {this.initiallyLoaded && !this.templates.length && <div class="empty-text">No matching templates found. Please adjust your filters and try again.</div>}

        {this.initiallyLoaded && this.templates.length && this.showPagination ? (
          <div style={{marginTop: '20px'}}>
            <verdocs-pagination
              selectedPage={this.selectedPage}
              perPage={this.rowsPerPage}
              itemCount={this.count}
              onSelectPage={e => {
                this.selectedPage = e.detail.selectedPage;
              }}
            />
          </div>
        ) : (
          <div />
        )}

        {this.confirmDelete && (
          <verdocs-ok-dialog
            heading="Delete this Template?"
            message="This operation cannot be undone."
            onNext={() => this.deleteTemplate(this.confirmDelete)}
            onExit={() => (this.confirmDelete = null)}
            showCancel={true}
          />
        )}
      </Host>
    );
  }
}
