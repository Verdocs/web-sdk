import {useEffect, useState} from 'react';

export const VERDOCS_THEME_CLASS = 'verdocs-custom-theme';

export const useVerdocsTheme = (defaultEnabled = true) => {
  const [enabled, setEnabled] = useState(defaultEnabled);

  useEffect(() => {
    document.documentElement.classList.toggle(VERDOCS_THEME_CLASS, enabled);
  }, [enabled]);

  return {enabled, setEnabled, toggle: () => setEnabled(prev => !prev)};
};
