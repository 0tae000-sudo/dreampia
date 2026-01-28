// lib/api-client.ts
import { Capacitor } from "@capacitor/core";
import { ApiError } from "../api-utils";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const getApiBaseUrl = () => {
  if (API_BASE_URL) return API_BASE_URL;
  if (typeof window !== "undefined") {
    const { origin, protocol } = window.location;
    if (protocol === "http:" || protocol === "https:") {
      return origin;
    }
  }
  if (Capacitor.isNativePlatform()) {
    const serverUrl = (Capacitor as { getServerUrl?: () => string })
      .getServerUrl?.();
    if (serverUrl) return serverUrl;
    const platform = Capacitor.getPlatform();
    if (platform === "android") return "http://10.0.2.2:3000";
    if (platform === "ios") return "http://localhost:3000";
  }
  return "";
};

const buildApiUrl = (path: string) => {
  const baseUrl = getApiBaseUrl();
  return baseUrl ? `${baseUrl}${path}` : path;
};

export const loginUser = async (userData: {
  email: string;
  password: string;
}) => {
  const response = await fetch(buildApiUrl("/www/users/login/"), {
    method: "POST",
    body: JSON.stringify(userData),
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const message = payload?.message ?? "로그인 실패";
    const fieldErrors =
      payload?.error && typeof payload.error === "object"
        ? (payload.error as Record<string, string[]>)
        : undefined;
    throw { message, fieldErrors } satisfies ApiError;
  }
  return payload;
};

export const createAccount = async (userData: Record<string, string>) => {
  const response = await fetch(buildApiUrl("/www/users/signup"), {
    method: "POST",
    body: JSON.stringify(userData),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message = payload?.message ?? "회원가입 실패";
    const fieldErrors =
      payload?.error && typeof payload.error === "object"
        ? (payload.error as Record<string, string[]>)
        : undefined;
    throw { message, fieldErrors } satisfies ApiError;
  }

  return payload;
};

export const checkEmail = async (email: string) => {
  const response = await fetch(buildApiUrl("/www/users/check-email"), {
    method: "POST",
    body: JSON.stringify({ email }),
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const message = payload?.message ?? "이메일 중복확인 실패";
    const fieldErrors =
      payload?.error && typeof payload.error === "object"
        ? (payload.error as Record<string, string[]>)
        : undefined;
    throw { message, fieldErrors } satisfies ApiError;
  }
  return payload;
};

export const verifyPhone = async (userData: Record<string, string>) => {
  const response = await fetch(buildApiUrl("/www/users/verifyPhone/"), {
    method: "POST",
    body: JSON.stringify(userData),
  });

  const payload = await response.json().catch(() => null);
  return payload;
};

export const findId = async (userData: Record<string, string>) => {
  const response = await fetch(buildApiUrl("/www/users/findId/"), {
    method: "POST",
    body: JSON.stringify(userData),
  });

  const payload = await response.json().catch(() => null);
  return payload;
};
