export const getenv = (name) => {
  return import.meta.env[`VITE_${name}`];
};
