import api from "./axios";

// Initialisation CSRF (obligatoire avant login/register)
export const csrf = () => api.get("/sanctum/csrf-cookie");

// Login
export const login = async (email: string, password: string) => {
  await csrf();
  return api.post("/login", { email, password });
};

// Logout
export const logout = async () => {
  return api.post("/logout");
};

// Récupération de l'utilisateur
export const getUser = async () => {
  return api.get("/api/user");
};
