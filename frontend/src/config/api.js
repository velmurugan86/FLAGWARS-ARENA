export const API_BASE_URL = import.meta.env.VITE_BASEURL || '';

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  MY_TEAM: `${API_BASE_URL}/team/my-team`,
  TEAM_STANDINGS: `${API_BASE_URL}/team/standings`,
  CHALLENGES: `${API_BASE_URL}/challenges`,
  SUBMIT_FLAG: `${API_BASE_URL}/challenges/submit`,
};
