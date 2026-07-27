const DEFAULT_API_URL = "http://localhost:5001/api/v1";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? DEFAULT_API_URL;

type ApiEnvelope<T> = {
  success: boolean;
  data?: T;
  message?: string;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status = 0) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const contentType = response.headers.get("content-type") ?? "";
  const payload: ApiEnvelope<T> | null = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok || payload?.success === false) {
    throw new ApiError(
      payload?.message ?? `La solicitud no pudo completarse (${response.status})`,
      response.status,
    );
  }

  if (!payload || payload.data === undefined) {
    throw new ApiError("La API devolvió una respuesta inesperada", response.status);
  }

  return payload.data;
}

export function getEntityId(entity: { _id?: string; id?: string } | null) {
  return entity?._id ?? entity?.id ?? "";
}

export function postJson<T>(path: string, body: unknown) {
  return apiRequest<T>(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function putJson<T>(path: string, body: unknown) {
  return apiRequest<T>(path, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

