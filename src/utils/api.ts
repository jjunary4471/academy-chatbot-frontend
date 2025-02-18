// filepath: /Users/lee_junha/workspace/meet/counseling-system/academy-chatbot-frontend/src/api.ts
export const fetchApi = async (endpoint: string, options?: RequestInit) => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const response = await fetch(`${baseUrl}${endpoint}`, options);
    return response;
  };