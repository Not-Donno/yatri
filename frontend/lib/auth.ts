export const auth = {
  getToken: () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  },

  setToken: (token: string) => {
    localStorage.setItem("token", token);
  },

  logout: () => {
    localStorage.removeItem("token");
  },

  isLoggedIn: () => {
    return !!localStorage.getItem("token");
  },
};