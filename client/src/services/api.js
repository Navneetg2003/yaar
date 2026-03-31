/**
 * API service - handles all HTTP requests to the Yaar backend
 * Base URL determined by environment or defaults to localhost:5000
 */

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * Helper to make authenticated requests with JWT token
 */
async function fetchWithAuth(endpoint, options = {}) {
  const token = localStorage.getItem("yaar_token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `API Error: ${response.status}`);
  }

  return response.json();
}

/**
 * Stream responses from the chat endpoint (Server-Sent Events)
 */
async function chatStream(message, onToken, onComplete, onError) {
  const token = localStorage.getItem("yaar_token");

  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE}/api/chat/message`, {
      method: "POST",
      headers,
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Chat failed");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");

      buffer = lines.pop(); // Keep incomplete line in buffer

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.token) {
              onToken(data.token);
            }
            if (data.response) {
              onComplete(data.response);
            }
            if (data.flagged) {
              onComplete(null, data.response, data.flagged);
            }
          } catch (e) {
            console.error("Parse error:", e);
          }
        }
      }
    }
  } catch (err) {
    onError(err.message);
  }
}

// ─── Auth Endpoints ───────────────────────────────────────────

export const auth = {
  /**
   * Register new account with email + password
   */
  register: async (email, password) => {
    return fetchWithAuth("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  /**
   * Login with email + password
   */
  login: async (email, password) => {
    return fetchWithAuth("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  /**
   * Create anonymous session (no email/password needed)
   */
  anonymous: async () => {
    return fetchWithAuth("/api/auth/anonymous", {
      method: "POST",
      body: JSON.stringify({}),
    });
  },

  /**
   * Get current user info from token
   */
  me: async () => {
    return fetchWithAuth("/api/auth/me");
  },
};

// ─── Chat Endpoints ───────────────────────────────────────────

export const chat = {
  /**
   * Send message and stream response
   */
  sendMessage: async (message, onToken, onComplete, onError) => {
    return chatStream(message, onToken, onComplete, onError);
  },

  /**
   * Get chat history (last 50 messages)
   */
  history: async () => {
    return fetchWithAuth("/api/chat/history");
  },
};

// ─── Mood Endpoints ───────────────────────────────────────────

export const mood = {
  /**
   * Log a mood score (1-5) with optional note
   */
  log: async (score, note = null) => {
    return fetchWithAuth("/api/mood", {
      method: "POST",
      body: JSON.stringify({ score, note }),
    });
  },

  /**
   * Get last 30 mood entries
   */
  getAll: async () => {
    return fetchWithAuth("/api/mood");
  },

  /**
   * Get 7-day mood summary
   */
  summary: async () => {
    return fetchWithAuth("/api/mood/summary");
  },
};

// ─── Health Check ─────────────────────────────────────────────

export const health = async () => {
  const response = await fetch(`${API_BASE}/api/health`);
  return response.json();
};

export default {
  auth,
  chat,
  mood,
  health,
};
