// lib/api-utils.ts
import { NextResponse } from "next/server";

export const getCorsHeaders = (origin?: string | null) => {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
  };
  if (origin) {
    headers["Access-Control-Allow-Origin"] = origin;
  }
  return headers;
};

export function createResponse(data: any, status = 200, origin?: string | null) {
  return NextResponse.json(data, {
    status,
    headers: getCorsHeaders(origin),
  });
}

export function corsOptionsResponse(origin?: string | null) {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(origin),
  });
}

export type ApiError = {
  message: string;
  fieldErrors?: Record<string, string[]>;
};
