/**
 * API Service Client with JWT Bearer Token Injection
 * Mind Nest - University Web Applications Assignment
 */

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('mindnest_token');
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

export const api = {
  // Authentication
  async register(data: { name: string; email: string; password: string }) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async login(data: { email: string; password: string }) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  async updateProfile(data: { name?: string; bio?: string; avatar?: string }) {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async getAdminUsers() {
    const res = await fetch(`${API_BASE}/auth/users`, {
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  async updateUserRole(id: string, role: string) {
    const res = await fetch(`${API_BASE}/auth/users/${id}/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ role }),
    });
    return res.json();
  },

  async deleteUser(id: string) {
    const res = await fetch(`${API_BASE}/auth/users/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  // Content Management (CRUD)
  async getContent(filters?: { category?: string; type?: string; search?: string }) {
    const params = new URLSearchParams();
    if (filters?.category && filters.category !== 'All') params.append('category', filters.category);
    if (filters?.type && filters.type !== 'All') params.append('type', filters.type);
    if (filters?.search) params.append('search', filters.search);

    const res = await fetch(`${API_BASE}/content?${params.toString()}`, {
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  async getContentById(id: string) {
    const res = await fetch(`${API_BASE}/content/${id}`, {
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  async createContent(content: any) {
    const res = await fetch(`${API_BASE}/content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(content),
    });
    return res.json();
  },

  async updateContent(id: string, updates: any) {
    const res = await fetch(`${API_BASE}/content/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(updates),
    });
    return res.json();
  },

  async deleteContent(id: string) {
    const res = await fetch(`${API_BASE}/content/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  // Self-Assessment
  async getQuizzes() {
    const res = await fetch(`${API_BASE}/assessment/quizzes`, {
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  async getQuizById(id: string) {
    const res = await fetch(`${API_BASE}/assessment/quizzes/${id}`, {
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  async submitQuiz(data: { quizId: string; answers: Record<string, number> }) {
    const res = await fetch(`${API_BASE}/assessment/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async getQuizHistory() {
    const res = await fetch(`${API_BASE}/assessment/history`, {
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  async getAdminQuizResults() {
    const res = await fetch(`${API_BASE}/assessment/admin/results`, {
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  // Progress Tracking
  async getProgress() {
    const res = await fetch(`${API_BASE}/progress`, {
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  async logSession(data: {
    contentId: string;
    contentTitle: string;
    contentType: 'audio' | 'video' | 'article' | 'breathing';
    durationMinutes: number;
  }) {
    const res = await fetch(`${API_BASE}/progress/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async toggleFavorite(contentId: string) {
    const res = await fetch(`${API_BASE}/progress/favorite/${contentId}`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  // Admin Stats
  async getStats() {
    const res = await fetch(`${API_BASE}/stats/overview`, {
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },
};
