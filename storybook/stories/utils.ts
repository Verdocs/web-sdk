export const loadStoryDefaults = (storyId: string, defaults: Record<string, any>) => {
  try {
    const existing = localStorage.getItem(`sb-default-${storyId}`) || '{}';
    const existingObj = JSON.parse(existing);
    return {...defaults, ...existingObj};
  } catch (e) {
    return defaults;
  }
};
