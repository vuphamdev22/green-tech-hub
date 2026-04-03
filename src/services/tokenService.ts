const ACCESS_TOKEN_KEY = "volt_access_token";
const REFRESH_TOKEN_KEY = "volt_refresh_token";
const AUTH_EVENT = "volt-auth-change";

const emitAuthChange = () => {
  window.dispatchEvent(new Event(AUTH_EVENT));
};

const tokenService = {
  getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  setTokens: (accessToken: string, refreshToken?: string) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
    emitAuthChange();
  },
  clearTokens: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    emitAuthChange();
  },
  isAuthenticated: () => Boolean(localStorage.getItem(ACCESS_TOKEN_KEY)),
  subscribe: (listener: () => void) => {
    window.addEventListener(AUTH_EVENT, listener);
    return () => window.removeEventListener(AUTH_EVENT, listener);
  },
};

export default tokenService;
