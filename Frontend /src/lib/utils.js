const API_BASE = "http://localhost:4000/api";

export async function createShortLink({ destination, shortcode, validityMinutes }) {
  const res = await fetch(`${API_BASE}/shorten`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ destination, shortcode, validityMinutes })
  });
  return await res.json();
}

export async function listAllLinks() {
  const res = await fetch(`${API_BASE}/list`);
  return await res.json();
}

export async function getLogs() {
  const res = await fetch(`${API_BASE}/logs`);
  return await res.text();
}
