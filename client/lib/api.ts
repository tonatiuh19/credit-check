/**
 * Axios instance with Clerk token interceptor.
 * All API calls should import from this module instead of bare 'axios'.
 *
 * In App.tsx, call initAxiosAuth(getToken) inside a <ClerkProvider> child
 * to wire up the auth token on every request.
 */
import axios from "axios";

type TokenGetter = () => Promise<string | null>;

let _getToken: TokenGetter | null = null;

/** Call once inside ClerkProvider to register the token getter. */
export function initAxiosAuth(getToken: TokenGetter): void {
  _getToken = getToken;
}

const api = axios.create();

api.interceptors.request.use(async (config) => {
  if (_getToken) {
    try {
      const token = await _getToken();
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    } catch {
      // silent — request proceeds without auth header
    }
  }
  return config;
});

export default api;
