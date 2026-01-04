export const getAssetPath = (path: string): string => {
  // Vite provides import.meta.env.BASE_URL for the base path
  // Access via unknown to properly type the env object
  const env = import.meta.env as unknown as { BASE_URL?: string };
  const base = env.BASE_URL || '/';
  // Remove leading slash from path if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${base}${cleanPath}`;
};

export default getAssetPath;
