const STORAGE_PREFIX = "linehayat_student_";
const TOKEN_KEY = `${STORAGE_PREFIX}token`;

const storage = {
  setToken: (token: string) => window.localStorage.setItem(TOKEN_KEY, token),
  token: () => window.localStorage.getItem(TOKEN_KEY),
  clearToken: () => window.localStorage.removeItem(TOKEN_KEY),
};

export default storage;
