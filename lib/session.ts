import { getIronSession, SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

interface SessionContent {
  id?: number;
  rememberMe?: boolean;
}

export const sessionOptions: SessionOptions = {
  cookieName: "dreampia",
  password: process.env.COOKIE_PASSWORD!,
  cookieOptions: {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
  },
};

export default async function getSession() {
  return getIronSession<SessionContent>(await cookies(), sessionOptions);
}