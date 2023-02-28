export const getCookie = (name, defaultCookie) => {
    const cookieName = encodeURIComponent(name);
    const reg = new RegExp(`(^| )${cookieName}=([^;]*)(;|$)`);
    if (typeof document === 'undefined') {
      return undefined;
    }
    return document?.cookie?.match(reg)?.[2] || defaultCookie;
  };
  