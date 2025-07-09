export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);

    return true;
  } catch {
    return false;
  }
};

export const sanitizeUrl = (url: string) => {
  return url.replace(/^https?:\/\//, '').replace(/\.[^.]*$/, '');
};
