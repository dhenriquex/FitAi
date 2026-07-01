import { getAuth } from "firebase/auth";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? "http://192.168.0.119:3000";

class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, message: string, body?: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

async function getIdToken(): Promise<string> {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Nenhum usuário autenticado no Firebase");
  }

  return user.getIdToken();
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await getIdToken();
  console.log("Requisição para:", `${API_BASE_URL}${path}`);
  console.log("Token:", token ? "OK" : "AUSENTE");

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  const text = await res.text();
  console.log("Status:", res.status);
  console.log("Resposta bruta:", text);

  let data: any = null;
  try {
    data = JSON.parse(text);
  } catch {}

  if (!res.ok) {
    throw new ApiError(
      res.status,
      data?.error ?? "Erro desconhecido na API",
      data,
    );
  }

  return data as T;

}

export { ApiError };

export function get<T>(path: string) {
  return request<T>(path, { method: "GET" });
}

export function post<T>(path: string, body: unknown) {
  return request<T>(path, { method: "POST", body: JSON.stringify(body) });
}
