export const loadStoryDefaults = (storyId: string, defaults: Record<string, any>) => {
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
