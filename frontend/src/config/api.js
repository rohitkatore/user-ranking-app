// API Configuration for different environments
const getApiBaseUrl = () => {
  // Check if we're in production (deployed on Vercel)
  if (import.meta.env.PROD) {
    // Your backend Vercel URL
    return 'https://user-ranking-app.vercel.app';
  }
  // Development environment - use empty string to use proxy
  return '';
};

export const API_BASE_URL = getApiBaseUrl();
export default API_BASE_URL;
