const TOKEN_KEY = "token";
const DEMO_EMAIL = "sagarrana8266@gmail.com";
const DEMO_PASSWORD = "123456";

const setTokenCookie = (token: string) => {
  if (typeof document === "undefined") return;
  document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=86400; samesite=lax`;
};

const clearTokenCookie = () => {
  if (typeof document === "undefined") return;
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; samesite=lax`;
};

export const login = (email: string, password: string) => {
  if (email !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
    return false;
  }
  const token = btoa(`${email}:${Date.now()}`);
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
  setTokenCookie(token);
  return true;
};

export const isAuth = () => {
  if (typeof window === "undefined") return false;
  return document.cookie.includes(`${TOKEN_KEY}=`);
};

export const logOut = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
  clearTokenCookie();
};

export const getDemoCredentials = () => ({
  email: DEMO_EMAIL,
  password: DEMO_PASSWORD,
});
