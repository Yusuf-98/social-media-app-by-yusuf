import { getStoredToken } from "@/lib/auth-storage";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Response envelope
interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T | null;
}

// Error type
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

// Unauthorized (401) callback registry
let unauthorizedHandler: (() => void) | null = null;

export function setUnauthorizedHandler(handler: () => void) {
  unauthorizedHandler = handler;
}

// Query string helper
export function buildQuery(params?: Record<string, string | number | undefined>): string {
  if (!params) return "";
  const entries = Object.entries(params).filter(([, v]) => v !== undefined) as [
    string,
    string | number,
  ][];
  if (entries.length === 0) return "";
  const qs = new URLSearchParams(entries.map(([k, v]) => [k, String(v)])).toString();
  return `?${qs}`;
}

// Fetch wrapper
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });

  let json: ApiEnvelope<T>;
  try {
    json = await res.json();
  } catch {
    throw new ApiError("Something went wrong. Please try again.", res.status);
  }

  if (!res.ok || !json.success) {
    if (res.status === 401 && token) unauthorizedHandler?.();
    throw new ApiError(json.message || "Request failed", res.status);
  }
  return json.data as T;
}

// HTTP verb helpers
export const apiGet = <T>(path: string) => request<T>(path);

export const apiPost = <T>(path: string, body?: unknown) =>
  request<T>(path, {
    method: "POST",
    body: body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
  });

export const apiPatch = <T>(path: string, body?: unknown) =>
  request<T>(path, {
    method: "PATCH",
    body: body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
  });

export const apiDelete = <T>(path: string) => request<T>(path, { method: "DELETE" });
