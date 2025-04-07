export const login = (email: string, password: string) => {
  if (email === "example@example.com" && password === "password123") {
    return true;
  } else {
    return false;
  }
};

export const register = (email: string, password: string) => {
  // In a real application, you would perform validation,
  // user creation in the database, etc.
  // For this example, we'll just return true.
  return true;
};




