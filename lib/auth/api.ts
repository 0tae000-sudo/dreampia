// lib/api-client.ts
import { ApiError } from "../api-utils";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const loginUser = async (userData: {
  email: string;
  password: string;
}) => {
  const response = await fetch(`${API_BASE_URL}/www/users/login/`, {
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
  const response = await fetch(`${API_BASE_URL}/www/users/signup`, {
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

export const verifyPhone = async (userData: Record<string, string>) => {
  const response = await fetch(`${API_BASE_URL}/www/users/verifyPhone/`, {
    method: "POST",
    body: JSON.stringify(userData),
  });

  const payload = await response.json().catch(() => null);
  return payload;
};

export const findId = async (userData: Record<string, string>) => {
  const response = await fetch(`${API_BASE_URL}/www/users/findId/`, {
    method: "POST",
    body: JSON.stringify(userData),
  });

  const payload = await response.json().catch(() => null);
  return payload;
};
