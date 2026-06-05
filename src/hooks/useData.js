import useSWR from "swr";
import { useAuth } from "@/lib/AuthContext";

// All fetches go to relative /api/* paths — same origin, no CORS needed
function fetcher(url, token) {
  return fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((r) => {
    if (!r.ok) throw new Error("Fetch failed");
    return r.json();
  });
}

export function useAlerts(n = 10) {
  const { token } = useAuth();
  return useSWR(
    token ? `/api/alerts/latest?n=${n}` : null,
    (url) => fetcher(url, token),
    { refreshInterval: 5000 }
  );
}

export function useAllAlerts(page = 1) {
  const { token } = useAuth();
  return useSWR(
    token ? `/api/alerts?page=${page}` : null,
    (url) => fetcher(url, token),
    { refreshInterval: 10000 }
  );
}

export function useTelemetry() {
  const { token } = useAuth();
  return useSWR(
    token ? "/api/telemetry/current" : null,
    (url) => fetcher(url, token),
    { refreshInterval: 5000 }
  );
}

export function useTelemetryHistory(limit = 50) {
  const { token } = useAuth();
  return useSWR(
    token ? `/api/telemetry/history?limit=${limit}` : null,
    (url) => fetcher(url, token),
    { refreshInterval: 5000 }
  );
}
