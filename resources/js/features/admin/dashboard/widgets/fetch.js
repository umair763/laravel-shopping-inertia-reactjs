// Tiny JSON-fetch helper for dashboard widgets.
// All endpoints are GET; sends Inertia/X-Requested-With headers so Laravel
// returns JSON rather than redirecting on auth challenges.
export async function getJson(url, params = {}) {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v == null || v === "") continue;
    qs.append(k, String(v));
  }
  const full = qs.toString() ? `${url}?${qs.toString()}` : url;
  const res = await fetch(full, {
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Request failed: ${res.status}`);
  }
  return res.json();
}

export function formatCurrency(value, currency = "USD") {
  const num = Number(value || 0);
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(num);
  } catch {
    return `$${num.toFixed(2)}`;
  }
}

export function formatNumber(value) {
  return new Intl.NumberFormat().format(Number(value || 0));
}

export function formatPercent(value, digits = 1) {
  const num = Number(value || 0);
  return `${num.toFixed(digits)}%`;
}

/**
 * Build startDate/endDate query params from a preset key or { start, end } pair.
 */
export function rangeFromPreset(preset) {
  const end = new Date();
  const start = new Date();
  switch (preset) {
    case "7d":
      start.setDate(end.getDate() - 6);
      break;
    case "30d":
      start.setDate(end.getDate() - 29);
      break;
    case "90d":
      start.setDate(end.getDate() - 89);
      break;
    case "ytd":
      start.setMonth(0, 1);
      break;
    case "1y":
      start.setFullYear(end.getFullYear() - 1);
      break;
    default:
      start.setDate(end.getDate() - 29);
  }
  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
}
