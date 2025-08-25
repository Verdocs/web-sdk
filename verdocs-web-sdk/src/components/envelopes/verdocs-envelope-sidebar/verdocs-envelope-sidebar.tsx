import {format} from 'date-fns';
import {IEnvelope, IRecipient, updateRecipient} from '@verdocs/js-sdk';
import {Component, h, Event, EventEmitter, Fragment, Host, Prop, State} from '@stencil/core';
import {cancelEnvelope, capitalize, formatFullName, getEnvelope, resendInvitation, updateEnvelope, userIsEnvelopeOwner, VerdocsEndpoint} from '@verdocs/js-sdk';
import {FORMAT_TIMESTAMP} from '../../../utils/Types';
import {VerdocsToast} from '../../../utils/Toast';
import {SDKError} from '../../../utils/errors';
import {Store} from '../../../utils/Datastore';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const InformationCircle = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff"><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>`;

const Users = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>`;

const ClipboardDocuments = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" /></svg>`;

// https://materialui.co/icon/verified-user and https://heroicons.com/
const ActivityIcons = {
  visibility: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ffffff"><path d="M12 15a3 3 0 100-6 3 3 0 000 6z" /><path fill-rule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clip-rule="evenodd" /></svg>`,
  pencil: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ffffff"><path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" /></svg>`,
  mail: `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>`,
  contact_mail: `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>`,
  done: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ffffff"><path fill-rule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clip-rule="evenodd" /></svg>`,
  send: `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>`,
  gesture: `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M4.59 6.89c.7-.71 1.4-1.35 1.71-1.22.5.2 0 1.03-.3 1.52-.25.42-2.86 3.89-2.86 6.31 0 1.28.48 2.34 1.34 2.98.75.56 1.74.73 2.64.46 1.07-.31 1.95-1.4 3.06-2.77 1.21-1.49 2.83-3.44 4.08-3.44 1.63 0 1.65 1.01 1.76 1.79-3.78.64-5.38 3.67-5.38 5.37 0 1.7 1.44 3.09 3.21 3.09 1.63 0 4.29-1.33 4.69-6.1H21v-2.5h-2.47c-.15-1.65-1.09-4.2-4.03-4.2-2.25 0-4.18 1.91-4.94 2.84-.58.73-2.06 2.48-2.29 2.72-.25.3-.68.84-1.11.84-.45 0-.72-.83-.36-1.92.35-1.09 1.4-2.86 1.85-3.52.78-1.14 1.3-1.92 1.3-3.28C8.95 3.69 7.31 3 6.44 3 5.12 3 3.97 4 3.72 4.25c-.36.36-.66.66-.88.93l1.75 1.71zm9.29 11.66c-.31 0-.74-.26-.74-.72 0-.6.73-2.2 2.87-2.76-.3 2.69-1.43 3.48-2.13 3.48z"/></svg>`,
  clear: `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`,
  check_circle: `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`,
  link: `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>`,
  cancel: `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/></svg>`,
  done_all: `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z"/></svg>`,
  create: `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>`,
  perm_identity: `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>`,
  people: `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>`,
  contact_email: `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M21 8V7l-3 2-3-2v1l3 2 3-2zm1-5H2C.9 3 0 3.9 0 5v14c0 1.1.9 2 2 2h20c1.1 0 1.99-.9 1.99-2L24 5c0-1.1-.9-2-2-2zM8 6c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H2v-1c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1zm8-6h-8V6h8v6z"/></svg>`,
  textsms: `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 11H7V9h2v2zm4 0h-2V9h2v2zm4 0h-2V9h2v2z"/></svg>`,
  verified_user: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ffffff"><path fill-rule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd" /></svg>`,
  account_circle: `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>`,
  idcard: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 10H18" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 14H18" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M6.16992 15.0001C6.37606 14.4141 6.75902 13.9065 7.26594 13.5475C7.77286 13.1884 8.37873 12.9956 8.99992 12.9956C9.62111 12.9956 10.227 13.1884 10.7339 13.5475C11.2408 13.9065 11.6238 14.4141 11.8299 15.0001" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 13C10.1046 13 11 12.1046 11 11C11 9.89543 10.1046 9 9 9C7.89543 9 7 9.89543 7 11C7 12.1046 7.89543 13 9 13Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 5H4C2.89543 5 2 5.89543 2 7V17C2 18.1046 2.89543 19 4 19H20C21.1046 19 22 18.1046 22 17V7C22 5.89543 21.1046 5 20 5Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  idcardslash: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 10H18" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 14H18" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M6.16992 15.0001C6.37606 14.4141 6.75902 13.9065 7.26594 13.5475C7.77286 13.1884 8.37873 12.9956 8.99992 12.9956C9.62111 12.9956 10.227 13.1884 10.7339 13.5475C11.2408 13.9065 11.6238 14.4141 11.8299 15.0001" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 13C10.1046 13 11 12.1046 11 11C11 9.89543 10.1046 9 9 9C7.89543 9 7 9.89543 7 11C7 12.1046 7.89543 13 9 13Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 5H4C2.89543 5 2 5.89543 2 7V17C2 18.1046 2.89543 19 4 19H20C21.1046 19 22 18.1046 22 17V7C22 5.89543 21.1046 5 20 5Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 2L22 22" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  key: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.586 17.4139C2.2109 17.7889 2.00011 18.2975 2 18.8279V20.9999C2 21.2651 2.10536 21.5195 2.29289 21.707C2.48043 21.8946 2.73478 21.9999 3 21.9999H6C6.26522 21.9999 6.51957 21.8946 6.70711 21.707C6.89464 21.5195 7 21.2651 7 20.9999V19.9999C7 19.7347 7.10536 19.4803 7.29289 19.2928C7.48043 19.1053 7.73478 18.9999 8 18.9999H9C9.26522 18.9999 9.51957 18.8946 9.70711 18.707C9.89464 18.5195 10 18.2651 10 17.9999V16.9999C10 16.7347 10.1054 16.4803 10.2929 16.2928C10.4804 16.1053 10.7348 15.9999 11 15.9999H11.172C11.7024 15.9998 12.211 15.789 12.586 15.4139L13.4 14.5999C14.7898 15.0841 16.3028 15.0822 17.6915 14.5947C19.0801 14.1071 20.2622 13.1628 21.0444 11.916C21.8265 10.6693 22.1624 9.19409 21.9971 7.73165C21.8318 6.26922 21.1751 4.90617 20.1344 3.86549C19.0937 2.8248 17.7307 2.1681 16.2683 2.00281C14.8058 1.83751 13.3306 2.17341 12.0839 2.95556C10.8372 3.7377 9.89279 4.91979 9.40525 6.30844C8.91771 7.69708 8.91585 9.21008 9.4 10.5999L2.586 17.4139Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M16.5 8C16.7761 8 17 7.77614 17 7.5C17 7.22386 16.7761 7 16.5 7C16.2239 7 16 7.22386 16 7.5C16 7.77614 16.2239 8 16.5 8Z" fill="black" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  keyslash: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.586 17.4139C2.2109 17.7889 2.00011 18.2975 2 18.8279V20.9999C2 21.2651 2.10536 21.5195 2.29289 21.707C2.48043 21.8946 2.73478 21.9999 3 21.9999H6C6.26522 21.9999 6.51957 21.8946 6.70711 21.707C6.89464 21.5195 7 21.2651 7 20.9999V19.9999C7 19.7347 7.10536 19.4803 7.29289 19.2928C7.48043 19.1053 7.73478 18.9999 8 18.9999H9C9.26522 18.9999 9.51957 18.8946 9.70711 18.707C9.89464 18.5195 10 18.2651 10 17.9999V16.9999C10 16.7347 10.1054 16.4803 10.2929 16.2928C10.4804 16.1053 10.7348 15.9999 11 15.9999H11.172C11.7024 15.9998 12.211 15.789 12.586 15.4139L13.4 14.5999C14.7898 15.0841 16.3028 15.0822 17.6915 14.5947C19.0801 14.1071 20.2622 13.1628 21.0444 11.916C21.8265 10.6693 22.1624 9.19409 21.9971 7.73165C21.8318 6.26922 21.1751 4.90617 20.1344 3.86549C19.0937 2.8248 17.7307 2.1681 16.2683 2.00281C14.8058 1.83751 13.3306 2.17341 12.0839 2.95556C10.8372 3.7377 9.89279 4.91979 9.40525 6.30844C8.91771 7.69708 8.91585 9.21008 9.4 10.5999L2.586 17.4139Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M16.5 8C16.7761 8 17 7.77614 17 7.5C17 7.22386 16.7761 7 16.5 7C16.2239 7 16 7.22386 16 7.5C16 7.77614 16.2239 8 16.5 8Z" fill="black" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  pin: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 17V22" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 10.76C8.9998 11.1321 8.89581 11.4967 8.69972 11.813C8.50363 12.1292 8.22321 12.3844 7.89 12.55L6.11 13.45C5.77679 13.6156 5.49637 13.8708 5.30028 14.187C5.10419 14.5033 5.0002 14.8679 5 15.24V16C5 16.2652 5.10536 16.5196 5.29289 16.7071C5.48043 16.8946 5.73478 17 6 17H18C18.2652 17 18.5196 16.8946 18.7071 16.7071C18.8946 16.5196 19 16.2652 19 16V15.24C18.9998 14.8679 18.8958 14.5033 18.6997 14.187C18.5036 13.8708 18.2232 13.6156 17.89 13.45L16.11 12.55C15.7768 12.3844 15.4964 12.1292 15.3003 11.813C15.1042 11.4967 15.0002 11.1321 15 10.76V7C15 6.73478 15.1054 6.48043 15.2929 6.29289C15.4804 6.10536 15.7348 6 16 6C16.5304 6 17.0391 5.78929 17.4142 5.41421C17.7893 5.03914 18 4.53043 18 4C18 3.46957 17.7893 2.96086 17.4142 2.58579C17.0391 2.21071 16.5304 2 16 2H8C7.46957 2 6.96086 2.21071 6.58579 2.58579C6.21071 2.96086 6 3.46957 6 4C6 4.53043 6.21071 5.03914 6.58579 5.41421C6.96086 5.78929 7.46957 6 8 6C8.26522 6 8.51957 6.10536 8.70711 6.29289C8.89464 6.48043 9 6.73478 9 7V10.76Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  pinslash: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 17V22" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M15.0006 9.34V7C15.0006 6.73478 15.106 6.48043 15.2935 6.29289C15.4811 6.10536 15.7354 6 16.0006 6C16.5311 6 17.0398 5.78929 17.4148 5.41421C17.7899 5.03914 18.0006 4.53043 18.0006 4C18.0006 3.46957 17.7899 2.96086 17.4148 2.58579C17.0398 2.21071 16.5311 2 16.0006 2H7.89062" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 2L22 22" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 9V10.76C8.9998 11.1321 8.89581 11.4967 8.69972 11.813C8.50363 12.1292 8.22321 12.3844 7.89 12.55L6.11 13.45C5.77679 13.6156 5.49637 13.8708 5.30028 14.187C5.10419 14.5033 5.0002 14.8679 5 15.24V16C5 16.2652 5.10536 16.5196 5.29289 16.7071C5.48043 16.8946 5.73478 17 6 17H17" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};

interface IHistoryEntry {
  icon: string;
  message: string;
  date: Date;
}

/**
 * Displays a file upload mechanism suitable for the first step of creating a template.
 * This is typically the first step in a template creation workflow.
 */
@Component({
  tag: 'verdocs-envelope-sidebar',
  styleUrl: 'verdocs-envelope-sidebar.scss',
  shadow: false,
})
export class VerdocsEnvelopeSidebar {
  private envelopeListenerId = null;

  /**
   * The endpoint to use to communicate with Verdocs. If not set, the default endpoint will be used.
   */
  @Prop() endpoint: VerdocsEndpoint = VerdocsEndpoint.getDefault();

  /**
   * The envelope ID to render. Set ONE OF templateId or envelopeId. If both are set, envelopeId will be ignored.
   */
  @Prop() envelopeId: string = '';

  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
   * terminate the process, and the calling application should correct the condition and re-render the component.
   */
  @Event({composed: true}) sdkError: EventEmitter<SDKError>;

  /**
   * Event fired when the envelope is updated in any way. May be used for tasks such as cache invalidation or reporting to other systems.
   */
  @Event({composed: true}) envelopeUpdated: EventEmitter<{endpoint: VerdocsEndpoint; envelope: IEnvelope; event: string}>;

  /**
   * Event fired when the sidebar is opened or closed.
   */
  @Event({composed: true}) toggle: EventEmitter<{open: boolean}>;

  /**
   * Event fired when the user clicks Send Another in the Manage Recipients dialog. It is up to the host application
   * to redirect the user to the appropriate next workflow step.
   */
  @Event({composed: true}) another: EventEmitter<{envelope: IEnvelope}>;

  // @State() envelope: IEnvelope | null = null;
  // @State() sortedRecipients: IRecipient[] = [];
  // @State() roleNames: string[] = [];
  @State() activeTab: number = 1;
  @State() panelOpen = false;
  @State() showRecipientDialog = '';
  @State() showCancelDialog = false;
  @State() showReinviteDialog = '';
  @State() showUpdateDialog = '';

  @State() remindersEnabled = false;
  @State() updatingReminders = false;
  @State() initialReminder: number | null = null;
  @State() followupReminders: number | null = null;

  @State() loading = true;
  @State() envelope: IEnvelope | null = null;

  async componentWillLoad() {
    try {
      this.endpoint.loadSession();

      if (!this.envelopeId) {
        console.log(`[SIDEBAR] Missing required envelope ID ${this.envelopeId}`);
        return;
      }

      if (!this.endpoint.session) {
        console.log('[SIDEBAR] Unable to start session, must be authenticated');
        return;
      }

      this.listenToEnvelope();
    } catch (e) {
      console.log('[SIDEBAR] Error loading envelope', e);
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }

  disconnectedCallback() {
    this.unlistenToEnvelope();
  }

  async listenToEnvelope() {
    console.log('[SIDEBAR] Loading envelope', this.envelopeId);
    this.unlistenToEnvelope();
    Store.subscribe(
      'envelopes',
      this.envelopeId,
      () => getEnvelope(this.endpoint, this.envelopeId),
      false,
      (envelope: IEnvelope) => {
        this.envelope = envelope;
        this.loading = false;

        this.sortEnvelopeRecipients();
        this.initialReminder = this.envelope?.initial_reminder;
        this.followupReminders = this.envelope?.followup_reminders;
        this.remindersEnabled = !!this.initialReminder;
      },
    );
  }

  unlistenToEnvelope() {
    if (this.envelopeListenerId) {
      Store.store.delListener(this.envelopeListenerId);
      this.envelopeListenerId = null;
    }
  }

  sortEnvelopeRecipients() {
    (this.envelope?.recipients || []).sort((a, b) => {
      return a.sequence === b.sequence ? a.order - b.order : a.sequence - b.sequence;
    });
  }

  setTab(tab: number) {
    this.panelOpen = tab !== this.activeTab || !this.panelOpen;
    this.toggle?.emit({open: this.panelOpen});
    this.activeTab = tab;
  }

  // TODO: Refactor to a common library?
  canResendRecipient(recipient: IRecipient) {
    return (
      !['pending', 'declined', 'submitted', 'canceled'].includes(recipient.status) && //
      !['complete', 'declined', 'canceled'].includes(this.envelope?.status)
    );
  }

  handleRecipientAction(recipient: IRecipient, id: string) {
    console.log('[SIDEBAR] Recipient action', id, recipient);
    switch (id) {
      case 'update':
        this.showUpdateDialog = recipient.role_name;
        break;

      case 'reminder':
        resendInvitation(this.endpoint, this.envelopeId, recipient.role_name, recipient.message)
          .then(() => {
            VerdocsToast('Reminder Sent', {style: 'success'});
          })
          .catch(e => {
            console.log('[SIDEBAR] Error resending invitation', e);
            VerdocsToast('Error resending invitation: ' + e.message, {style: 'error'});
          });
        break;

      case 'reinvite':
        this.showReinviteDialog = recipient.role_name;
        // resendInvitation(this.endpoint, this.envelopeId, recipient.role_name)
        //   .then(() => {
        //     VerdocsToast('Reminder Sent', {style: 'success'});
        //   })
        //   .catch(e => {
        //     console.log('[SIDEBAR] Error resending invitation', e);
        //     VerdocsToast('Error resending invitation: ' + e.message, {style: 'error'});
        //   });
        break;

      case 'inperson':
        this.showRecipientDialog = recipient.role_name;
        break;

      case 'modify':
        VerdocsToast('This feature will be enabled in a future release. Please try again later.', {style: 'info'});
        break;

      case 'details':
        VerdocsToast('This feature will be enabled in a future release. Please try again later.', {style: 'info'});
        break;
    }

    this.envelopeUpdated?.emit({endpoint: this.endpoint, envelope: this.envelope, event: id});
  }

  handleCancelEnvelope() {
    this.loading = true;
    cancelEnvelope(this.endpoint, this.envelopeId)
      .then(async r => {
        console.log('[SIDEBAR] Envelope canceled', r);
        VerdocsToast('Envelope canceled', {style: 'success'});

        // TODO: Use returned value instead?
        const newEnvelope = JSON.parse(JSON.stringify(this.envelope));
        newEnvelope.status = 'canceled';
        Store.updateEnvelope(this.envelopeId, newEnvelope);

        this.loading = false;
        this.panelOpen = false;
        this.envelopeUpdated?.emit({endpoint: this.endpoint, envelope: newEnvelope, event: 'canceled'});
      })
      .catch(e => {
        console.log('[SIDEBAR] Error canceling envelope', e);
        this.loading = false;
        VerdocsToast('Error canceling envelope: ' + e.message, {style: 'error'});
      });
  }

  handleUpdateRecipient(originalRecipient: IRecipient, updatedRecipient: IRecipient) {
    console.log('Updating recipient', originalRecipient, updatedRecipient);
    const fields: any = {};
    if (updatedRecipient.email !== originalRecipient.email) {
      fields.email = updatedRecipient.email;
    }
    if (updatedRecipient.phone !== originalRecipient.phone) {
      fields.phone = updatedRecipient.phone;
    }
    if (updatedRecipient.message !== originalRecipient.message) {
      fields.message = updatedRecipient.message;
    }
    if (updatedRecipient.first_name !== originalRecipient.first_name) {
      fields.first_name = updatedRecipient.first_name;
    }
    if (updatedRecipient.last_name !== originalRecipient.last_name) {
      fields.last_name = updatedRecipient.last_name;
    }

    if (Object.keys(fields).length > 0) {
      updateRecipient(this.endpoint, this.envelopeId, originalRecipient.role_name, fields)
        .then(r => {
          // TODO: Reload the envelope?
          VerdocsToast('Recipient updated', {style: 'success'});
          console.log('[SIDEBAR] Updated recipient', r);
          Store.getEnvelope(this.endpoint, this.envelopeId, true);
          this.showUpdateDialog = '';
        })
        .catch(e => {
          VerdocsToast(e.response.data.error, {style: 'error'});
          this.showUpdateDialog = '';
        });
    } else {
      this.showUpdateDialog = '';
    }
  }

  prepareHistoryEntries() {
    const entries: IHistoryEntry[] = [];
    const histories = this.envelope?.history_entries || [];

    entries.push({icon: 'pencil', message: 'Envelope created.', date: new Date(this.envelope?.created_at)});

    if (this.envelope?.status === 'complete') {
      entries.push({icon: 'pencil', message: 'Envelope completed.', date: new Date(this.envelope?.updated_at)});
    }

    // TODO: Shift back to server-side generating these events? We'll still need
    // to tolerate both cases here for a while.
    const ownerCanceled = histories.some(history => (history.event as any) === 'owner:canceled');
    if (this.envelope?.status === 'canceled' && !ownerCanceled) {
      entries.push({icon: 'pencil', message: 'Envelope Canceled.', date: new Date(this.envelope?.canceled_at)});
    }

    histories.forEach(history => {
      const recipient = (this.envelope?.recipients || []).find(recipient => recipient.role_name === history.role_name);
      const fullName = formatFullName(recipient);

      switch (history.event.toLowerCase()) {
        case 'recipient:kba_verified':
          entries.push({icon: 'key', message: `KBA verification completed by ${fullName}.`, date: new Date(history.created_at)});
          break;
        case 'recipient:kba_failed':
          entries.push({icon: 'keyslash', message: `KBA verification failed by ${fullName}.`, date: new Date(history.created_at)});
          break;
        case 'recipient:id_verified':
          entries.push({icon: 'idcard', message: `ID verification completed by ${fullName}.`, date: new Date(history.created_at)});
          break;
        case 'recipient:id_failed':
          entries.push({icon: 'idcardslash', message: `ID verification failed by ${fullName}.`, date: new Date(history.created_at)});
          break;
        case 'recipient:pin_verified':
          entries.push({icon: 'pin', message: `PIN verification completed by ${fullName}.`, date: new Date(history.created_at)});
          break;
        case 'recipient:pin_failed':
          entries.push({icon: 'pinslash', message: `PIN verification failed by ${fullName}.`, date: new Date(history.created_at)});
          break;
        case 'recipient:signed':
          entries.push({icon: 'gesture', message: `Signed by ${fullName}.`, date: new Date(history.created_at)});
          break;
        case 'recipient:declined':
          entries.push({icon: 'clear', message: `Declined by ${fullName}.`, date: new Date(history.created_at)});
          break;
        case 'recipient:opened':
          switch (history.event_detail) {
            // TODO: Sync these up with reality
            case 'email':
            case 'mail':
              entries.push({icon: 'visibility', message: `Opened by ${fullName}, via email.`, date: new Date(history.created_at)});
              break;
            case 'sms':
              entries.push({icon: 'visibility', message: `Opened by ${fullName}, via SMS.`, date: new Date(history.created_at)});
              break;
            case 'in_person_link':
              entries.push({icon: 'visibility', message: `Opened by ${fullName}, via In-person link.`, date: new Date(history.created_at)});
              break;
            case 'in_app':
              entries.push({icon: 'visibility', message: `Opened by ${fullName}, via dashboard.`, date: new Date(history.created_at)});
              break;
            default:
              entries.push({icon: 'visibility', message: `Opened by ${fullName}.`, date: new Date(history.created_at)});
          }
          break;
        case 'recipient:submitted':
          switch (history.event_detail) {
            // TODO: Sync up
            case 'approver':
              entries.push({icon: 'check_circle', message: `Approved by ${fullName}.`, date: new Date(history.created_at)});
              break;
            default:
              entries.push({icon: 'send', message: `Submitted by ${fullName}.`, date: new Date(history.created_at)});
              break;
          }
          break;
        case 'recipient:prepared':
          entries.push({icon: 'send', message: `Prepared by ${fullName}.`, date: new Date(history.created_at)});
          break;
        case 'recipient:claimed':
          if (history.event_detail === 'guest') {
            entries.push({icon: 'account_circle', message: `${fullName} claimed the Envelope as a guest.`, date: new Date(history.created_at)});
          } else if (history.event_detail === 'profile') {
            entries.push({icon: 'verified_user', message: `${fullName} claimed the Envelope as a verified user.`, date: new Date(history.created_at)});
          }
          break;
        case 'recipient:agreed':
          entries.push({icon: 'done', message: `${fullName} agreed to use electronic records and signatures.`, date: new Date(history.created_at)});
          break;
        case 'recipient:invited':
          if (history.event_detail === 'sms') {
            entries.push({icon: 'textsms', message: `${fullName} has been invited via SMS.`, date: new Date(history.created_at)});
          } else {
            entries.push({icon: 'mail', message: `${fullName} has been invited via email.`, date: new Date(history.created_at)});
          }
          break;
        case 'recipient:reminder':
          if (history.event_detail === 'sms') {
            entries.push({icon: 'textsms', message: `${fullName} sent a reminder via SMS.`, date: new Date(history.created_at)});
          } else {
            entries.push({icon: 'mail', message: `${fullName} sent a reminder via email.`, date: new Date(history.created_at)});
          }
          break;
        case 'invitation:resent':
          entries.push({
            icon: 'mail',
            message: `Invitation was resent to ${fullName}${history.event_detail === 'reminder' ? ' by reminder' : ''}.`,
            date: new Date(history.created_at),
          });
          break;
        case 'envelope:cc':
          entries.push({icon: 'contact_mail', message: `A copy has been sent to ${fullName}.`, date: new Date(history.created_at)});
          break;
        case 'recipient:delegated':
          entries.push({icon: 'people', message: history.event_detail, date: new Date(history.created_at)});
          break;
        case 'recipient:updated_info':
          entries.push({icon: 'perm_identity', message: history.event_detail, date: new Date(history.created_at)});
          break;
        case 'owner:updated_recipient_info':
          entries.push({icon: 'perm_identity', message: history.event_detail, date: new Date(history.created_at)});
          break;
        case 'created':
          entries.push({icon: 'create', message: `Envelope was created.`, date: new Date(history.created_at)});
          break;
        case 'completed':
          entries.push({icon: 'done_all', message: `Envelope was completed.`, date: new Date(history.created_at)});
          break;
        // TODO: Final answer?
        case 'envelope:canceled':
        case 'envelope_canceled':
        case 'canceled':
        case 'owner:canceled':
          entries.push({icon: 'cancel', message: `Envelope was canceled by the creator.`, date: new Date(history.created_at)});
          break;
        case 'envelope:expired':
          entries.push({icon: 'cancel', message: `Envelope expired.`, date: new Date(history.created_at)});
          break;
        case 'owner:get_in_person_link':
          entries.push({icon: 'link', message: `Owner accessed the In-person link for ${recipient}.`, date: new Date(history.created_at)});
          break;
        default:
          console.log('[SIDEBAR] Unknown history type', history);
          break;
      }
    });

    entries.sort((a, b) => b.date.getTime() - a.date.getTime());
    return entries;
  }

  // canModify(recipient: IRecipient) {
  //   const invalidRecipientStatus = ['declined', 'signed', 'submitted', 'canceled'];
  //   const invalidEnvelopeStatus = ['complete', 'declined', 'canceled'];
  //   return recipient.claimed !== true && invalidRecipientStatus.indexOf(recipient.status) === -1 && invalidEnvelopeStatus.indexOf(this.envelope?.status) === -1;
  // }

  handleToggleReminders() {
    if (this.remindersEnabled) {
      return this.handleSetReminders(null, null);
    } else {
      return this.handleSetReminders(MS_PER_DAY, 3 * MS_PER_DAY);
    }
  }

  handleSetReminders(initial_reminder: number | null, followup_reminders: number | null) {
    console.log('Updating reminders...');
    this.updatingReminders = true;

    updateEnvelope(this.endpoint, this.envelopeId, {initial_reminder, followup_reminders})
      .then(envelope => {
        console.log('Updated', envelope);
        Store.updateEnvelope(this.envelopeId, envelope);
        this.initialReminder = envelope.initial_reminder;
        this.followupReminders = envelope.followup_reminders;
        this.remindersEnabled = !!envelope.initial_reminder;
        this.updatingReminders = false;
      })
      .catch(e => {
        console.log('Error updating envelope', e);
        this.initialReminder = this.envelope?.initial_reminder;
        this.followupReminders = this.envelope?.followup_reminders;
        this.remindersEnabled = !!this.envelope?.initial_reminder;
        this.updatingReminders = false;
        VerdocsToast(e.response.data.error, {style: 'error'});
      });
  }

  render() {
    if (this.loading) {
      // We don't show a loading indicator for the sidebar, to avoid FOUS
      return <Host />;
    }

    const isEnvelopeOwner = userIsEnvelopeOwner(this.endpoint.profile, this.envelope);
    const historyEntries = this.prepareHistoryEntries();
    const functionsDisabled = this.envelope?.status !== 'pending' && this.envelope?.status !== 'in progress';

    return (
      <Host class={this.panelOpen ? 'open' : ''}>
        <div class="side-buttons">
          <button class={this.activeTab === 1 ? 'active' : ''} onClick={() => this.setTab(1)} innerHTML={InformationCircle} />
          <button class={this.activeTab === 2 ? 'active' : ''} onClick={() => this.setTab(2)} innerHTML={Users} />
          <button class={this.activeTab === 3 ? 'active' : ''} onClick={() => this.setTab(3)} innerHTML={ClipboardDocuments} />
        </div>

        {this.activeTab === 1 && (
          <div class="content">
            <div class="title">Details</div>

            <div class="label">Envelope ID</div>
            <div class="value">{this.envelope?.id}</div>

            <div class="label">Date Created</div>
            <div class="value">{format(new Date(this.envelope?.created_at), FORMAT_TIMESTAMP)}</div>

            <div class="label">Last Modified</div>
            <div class="value">{format(new Date(this.envelope?.updated_at), FORMAT_TIMESTAMP)}</div>

            <div class="label">Status</div>
            <div class="value">{capitalize(this.envelope?.status)}</div>

            <div class="label">Owner ID</div>
            <div class="value">{this.envelope?.profile_id}</div>

            <div class="label">Owner Name</div>
            <div class="value">{formatFullName(this.envelope?.profile)}</div>

            <div class="label">Owner Email</div>
            <div class="value">{this.envelope?.profile?.email}</div>
          </div>
        )}

        {this.activeTab === 2 && (
          <div class="content">
            <div class="title">Recipients</div>
            {this.envelope?.recipients.map((recipient, index) => {
              const canGetInPersonLink = recipient.status !== 'submitted' && recipient.status !== 'canceled' && recipient.status !== 'declined';
              const canUpdate = recipient.status !== 'submitted';
              const canSendReminder = this.canResendRecipient(recipient);
              const fullName = formatFullName(recipient);

              return (
                <div class="recipient-detail">
                  <div class="recipient-header">
                    <div class="recipient-number">{index + 1}</div>
                    <div class="recipient-name">{recipient.role_name.replace('delegated_to_', 'Delegated')}</div>
                    <div class={{'recipient-status': true, [recipient.status]: true}}>{recipient.status}</div>
                    {isEnvelopeOwner && !functionsDisabled && (
                      <verdocs-dropdown
                        onOptionSelected={item => this.handleRecipientAction(recipient, item.detail.id)}
                        options={[
                          {id: 'update', label: 'Update', disabled: !canUpdate},
                          {id: 'reminder', label: 'Send Reminder', disabled: !canSendReminder},
                          {id: 'inperson', label: 'Get In-Person Link', disabled: !canGetInPersonLink},
                          {id: 'reinvite', label: 'Re-invite', disabled: !canSendReminder},
                          // {id: 'modify', label: 'Modify Recipient', disabled: !this.canModifyRecipient(recipient)},
                          // TODO: Details dialog
                          // {id:'details',label: 'View Details'},
                        ]}
                      />
                    )}
                  </div>

                  <dic class="recipient-content">
                    <div class="recipient-name">{fullName}</div>
                    <div class="recipient-name">{recipient.email}</div>
                    <div class="recipient-name">{recipient.phone}</div>
                  </dic>
                </div>
              );
            })}

            {isEnvelopeOwner && (
              <div class="reminders">
                <div class="form-row">
                  <div class="reminders-label">Reminders</div>
                  <verdocs-switch disabled={functionsDisabled || this.updatingReminders} checked={this.remindersEnabled} onCheckedChange={() => this.handleToggleReminders()} />
                </div>

                {this.remindersEnabled && (
                  <Fragment>
                    <div class="form-row">NOTE: Reminders will only be sent for up to 14 days.</div>
                    <div class="form-row">
                      <div class="form-label">Initial Reminder (days):</div>
                      <verdocs-text-input
                        placeholder="In hours..."
                        disabled={functionsDisabled || this.updatingReminders}
                        value={String(Math.floor(this.initialReminder / MS_PER_DAY))}
                        onBlur={(e: any) => {
                          this.initialReminder = Number(e.target.value) * MS_PER_DAY;
                          this.handleSetReminders(this.initialReminder, this.followupReminders);
                        }}
                      />
                    </div>
                    <div class="form-row">
                      <div class="form-label">Follow-up Reminders:</div>
                      <verdocs-text-input
                        placeholder="In hours..."
                        disabled={functionsDisabled || this.updatingReminders}
                        value={String(Math.floor(this.followupReminders / MS_PER_DAY))}
                        onBlur={(e: any) => {
                          this.followupReminders = Number(e.target.value) * MS_PER_DAY;
                          this.handleSetReminders(this.initialReminder, this.followupReminders);
                        }}
                      />
                    </div>
                    <div class="form-row">
                      <div class="form-label">Next Reminder:</div>
                      <div style={{color: '#dddddd'}}>{format(new Date(this.envelope?.next_reminder), 'P p')}</div>
                    </div>
                  </Fragment>
                )}
              </div>
            )}
            {isEnvelopeOwner && (
              <verdocs-button
                class="manage-recipients-button"
                variant="standard"
                label="Cancel Envelope"
                onClick={() => (this.showCancelDialog = !functionsDisabled)}
                disabled={functionsDisabled}
              />
            )}
          </div>
        )}

        {this.activeTab === 3 && (
          <div class="content">
            <div class="title">History</div>

            {historyEntries.map(entry => (
              <div class="history-entry">
                <div class="activity-icon" innerHTML={ActivityIcons[entry.icon] || entry.icon} />
                <div class="activity-details">
                  <div class="activity-text">{entry.message}</div>
                  {/* 'MMMM Do YYYY, h:mm:ss a'  */}
                  <div class="activity-date">{format(entry.date, FORMAT_TIMESTAMP)}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {this.showRecipientDialog && (
          <verdocs-envelope-recipient-link envelopeId={this.envelopeId} roleName={this.showRecipientDialog} onNext={() => (this.showRecipientDialog = '')} />
        )}

        {this.showCancelDialog && (
          <verdocs-ok-dialog
            heading="Cancel Envelope?"
            message={'Are you sure you want to cancel this Envelope? This action cannot be undone.'}
            onNext={() => {
              this.showCancelDialog = false;
              this.handleCancelEnvelope();
            }}
          />
        )}

        {this.showReinviteDialog && (
          <verdocs-ok-dialog
            heading="Re-invite Recipient?"
            message={'This will reset the recipient\'s KBA status and send a new signing invitation. If you just want to send a reminder, please click "Send Reminder" instead.'}
            onNext={() => {
              this.showReinviteDialog = '';
              // this.handleCancelEnvelope();
            }}
          />
        )}

        {this.showUpdateDialog && (
          <verdocs-envelope-update-recipient
            envelopeId={this.envelopeId}
            roleName={this.showUpdateDialog}
            onNext={e => {
              console.log('next', e.detail);
              if (e.detail.action === 'save') {
                this.handleUpdateRecipient(e.detail.originalRecipient, e.detail.updatedRecipient);
              } else {
                this.showUpdateDialog = '';
              }
            }}
          />
        )}
      </Host>
    );
  }
}
