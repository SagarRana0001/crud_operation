const TOKEN_KEY = "token";
const DEMO_EMAIL = "sagarrana8266@gmail.com";
const DEMO_PASSWORD = "123456";

const setTokenCookie = (token: string) => {
  document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=86400; samesite=lax`;
};

const clearTokenCookie = () => {
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; samesite=lax`;
};

export const login = (email: string, password: string) => {
  if (email !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
    return false;
  }

  const token = btoa(`${email}:${Date.now()}`);
  localStorage.setItem(TOKEN_KEY, token);
  setTokenCookie(token);
  return true;
};

export const isAuth = () => {
  if (typeof window === "undefined") {
    return false;
  }
  return document.cookie.includes(`${TOKEN_KEY}=`);
};

export const logOut = () => {
  localStorage.removeItem(TOKEN_KEY);
  clearTokenCookie();
};

export const getDemoCredentials = () => ({
  email: DEMO_EMAIL,
  password: DEMO_PASSWORD,
});
