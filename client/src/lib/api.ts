const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export const apiClient = {
  async fetch(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('access_token');
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add existing headers from options
    if (options.headers) {
      const existingHeaders = new Headers(options.headers);
      existingHeaders.forEach((value, key) => {
        headers[key] = value;
      });
    }

    // Add authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message);
    }

    return response.json();
  },

  // Auth endpoints
  auth: {
    register: (data: any) => apiClient.fetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    login: async (data: any) => {
      const response = await apiClient.fetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      // Store the JWT token from NestJS backend
      if (response.access_token) {
        localStorage.setItem('access_token', response.access_token);
      }
      return response;
    },
    logout: () => {
      localStorage.removeItem('access_token');
    },
    verifyEmail: (email: string, otp: string) => apiClient.fetch('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    }),
    resendVerification: (email: string) => apiClient.fetch('/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
    getCurrentUser: () => apiClient.fetch('/users/me'),
  },

  // Profile endpoints
  profiles: {
    getMyProfile: () => apiClient.fetch('/profiles/me'),
    createProfile: (data: any) => apiClient.fetch('/profiles', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    updateProfile: (id: string, data: any) => apiClient.fetch(`/profiles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  },

  // Admin endpoints
  admin: {
    getPendingUsers: (role?: string) => 
      apiClient.fetch(`/admin/users/pending${role ? `?role=${role}` : ''}`),
    approveUser: (id: string) => apiClient.fetch(`/admin/users/${id}/approve`, {
      method: 'POST',
    }),
    rejectUser: (id: string, reason?: string) => apiClient.fetch(`/admin/users/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),
    getStats: () => apiClient.fetch('/admin/stats'),
    sendBroadcast: (data: {
      subject: string;
      message: string;
      recipients?: 'all' | 'consultants' | 'companies' | string[];
      ctaText?: string;
      ctaUrl?: string;
    }) => apiClient.fetch('/admin/broadcast', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  },

  // Consultant endpoints
  consultants: {
    create: (data: any) => apiClient.fetch('/consultants', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    getAll: () => apiClient.fetch('/consultants'),
    getById: (id: string) => apiClient.fetch(`/consultants/${id}`),
  },

  // Job endpoints
  jobs: {
    create: (data: any) => apiClient.fetch('/jobs', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    getAll: (params?: any) => {
      const query = params ? `?${new URLSearchParams(params).toString()}` : '';
      return apiClient.fetch(`/jobs${query}`);
    },
    getById: (id: string) => apiClient.fetch(`/jobs/${id}`),
    update: (id: string, data: any) => apiClient.fetch(`/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id: string) => apiClient.fetch(`/jobs/${id}`, {
      method: 'DELETE',
    }),
  },

  // Application endpoints
  applications: {
    create: (data: any) => apiClient.fetch('/applications', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    getMy: () => apiClient.fetch('/applications/me'),
    getById: (id: string) => apiClient.fetch(`/applications/${id}`),
  },

  // Menu endpoints
  menu: {
    getForUser: () => apiClient.fetch('/menu'),
    getPublic: () => apiClient.fetch('/menu/public'),
    getAll: () => apiClient.fetch('/menu/all'),
  },
};
