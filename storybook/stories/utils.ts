/**
 * The api the stories talk to, from STORYBOOK_API_URL in storybook/.env.local (for example http://localhost:3000 for a
 * local api server). Empty means the js-sdk default. Restart Storybook after changing it.
 */
export const API_URL: string = (import.meta as any).env?.STORYBOOK_API_URL || '';

export const loadStoryDefaults =(storyId: string, defaults: Record<string, any>) => {
  try {
    const existing = localStorage.getItem(`sb-default-${storyId}`) || '{}';
    const existingObj = JSON.parse(existing);

    // Ensure we only reload CURRENT fields, in case those have changed over time.
    // We use the defaults to determine what is desired.
    const filteredDefaults = Object.keys(defaults).reduce(
      (acc, key) => {
        if (key in existingObj) {
          acc[key] = existingObj[key];
        }
        return acc;
      },
      {} as Record<string, any>,
    );

    return {...defaults, ...filteredDefaults};
  } catch (e) {
    return defaults;
  }
};