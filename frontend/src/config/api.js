// API Configuration for different environments
const getApiBaseUrl = () => {
  // Check if we're in production (deployed)
  if (import.meta.env.PROD) {
    // Your actual backend Vercel URL
    return "https://user-ranking-app.vercel.app";
  }
  // Development environment - use empty string for proxy
  return "";
};

export const API_BASE_URL = getApiBaseUrl();
export default API_BASE_URL;
