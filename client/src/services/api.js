const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

function getToken() {
  return localStorage.getItem("yaar_token");
}

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Something went wrong.");
  return data;
}

export async function apiRegister(email, password) {
  const res = await fetch(`${BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
}

export async function apiLogin(email, password) {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
}

export async function apiLoginAnonymous() {
  const res = await fetch(`${BASE}/api/auth/anonymous`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  return handleResponse(res);
}

export async function apiSendMessage(message) {
  const res = await fetch(`${BASE}/api/chat/message`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ message }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to send message.");
  }
  return res;
}

export async function apiGetHistory() {
  const res = await fetch(`${BASE}/api/chat/history`, { headers: authHeaders() });
  return handleResponse(res);
}

export async function apiLogMood(score, label, note = "") {
  const res = await fetch(`${BASE}/api/mood`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ score, label, note }),
  });
  return handleResponse(res);
}

export async function apiGetMoodSummary() {
  const res = await fetch(`${BASE}/api/mood/summary`, { headers: authHeaders() });
  return handleResponse(res);
}

export async function apiGetJournal(date) {
  const params = date ? `?date=${date}` : "";
  const res = await fetch(`${BASE}/api/journal${params}`, { headers: authHeaders() });
  return handleResponse(res);
}

export async function apiSaveJournal(content, date) {
  const res = await fetch(`${BASE}/api/journal`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ content, date }),
  });
  return handleResponse(res);
}

export async function apiGetJournalDates() {
  const res = await fetch(`${BASE}/api/journal/dates`, { headers: authHeaders() });
  return handleResponse(res);
}