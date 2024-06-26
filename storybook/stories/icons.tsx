const CircleIcon = `
  <svg xmlns="http://www.w3.org/2000/svg"  height="24px" viewBox="0 0 24 24" width="24px" fill="#ffffff"><g><rect fill="none" height="24" width="24"/></g><g><g><path d="M12,2C6.48,2,2,6.48,2,12c0,5.52,4.48,10,10,10s10-4.48,10-10C22,6.48,17.52,2,12,2z M12,20c-4.42,0-8-3.58-8-8 c0-4.42,3.58-8,8-8s8,3.58,8,8C20,16.42,16.42,20,12,20z"/><circle cx="7" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="17" cy="12" r="1.5"/></g></g></svg>
`;

const ArrowIcon = `
<svg width="10" height="26" viewBox="0 0 10 26" fill="#ffffff" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_31568_3647)"><path d="M9.64682 13.431L2.10645 20.9466C1.86503 21.1853 1.47466 21.1853 1.23324 20.9466L0.216218 19.9411C-0.0251976 19.7025 -0.0251976 19.3165 0.216218 19.0778L6.30296 12.9993L0.216218 6.9208C-0.0251976 6.68213 -0.0251976 6.29619 0.216218 6.05752L1.23324 5.05205C1.47466 4.81338 1.86503 4.81338 2.10645 5.05205L9.64682 12.5677C9.88824 12.8064 9.88824 13.1923 9.64682 13.431Z"/></g><defs><clipPath id="clip0_31568_3647"><rect width="9.86207" height="26"/></clipPath></defs></svg>
`;

const CalendarIcon = `
<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="#000000"><path d="M7.6 13.925q-.55 0-.925-.375t-.375-.925q0-.55.375-.937.375-.388.925-.388t.925.388q.375.387.375.937t-.375.925q-.375.375-.925.375Zm4.4 0q-.55 0-.925-.375t-.375-.925q0-.55.375-.937.375-.388.925-.388t.925.388q.375.387.375.937t-.375.925q-.375.375-.925.375Zm4.4 0q-.55 0-.925-.375t-.375-.925q0-.55.375-.937.375-.388.925-.388t.925.388q.375.387.375.937t-.375.925q-.375.375-.925.375ZM5.3 22.85q-1.325 0-2.238-.912-.912-.913-.912-2.238V6.3q0-1.325.912-2.238.913-.912 2.238-.912H6v-2h2.575v2h6.85v-2H18v2h.7q1.325 0 2.238.912.912.913.912 2.238v13.4q0 1.325-.912 2.238-.913.912-2.238.912Zm0-3.15h13.4V10H5.3v9.7ZM5.3 8h13.4V6.3H5.3Zm0 0V6.3 8Z"/></svg>
`;

export const Icons = {None: null, CircleIcon, ArrowIcon, CalendarIcon};

export const IconLabels = {
  CircleIcon: 'Circle',
  ArrowIcon: 'Arrow',
  CalendarIcon: 'Calendar',
};

export const IconOptions = {
  options: Object.keys(Icons),
  mapping: Icons,
  control: {
    type: 'select',
    labels: IconLabels,
  },
};
