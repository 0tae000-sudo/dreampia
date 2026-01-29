"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, logoutUser } from "@/lib/auth/api";

type User = {
  id: number;
  name: string;
  email: string | null;
  role: string | null;
  isTeacher: boolean | null;
  isMentor: boolean | null;
};

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    console.log("useEffect");
    let isMounted = true;
    const fetchUser = async () => {
      try {
        console.log("fetchUser");
        const payload = await getCurrentUser();
        console.log("payload", payload);
        if (isMounted) {
          setUser(payload.data as User);
        }
      } catch (error) {
        if (isMounted) {
          const message =
            typeof error === "object" && error !== null && "message" in error
              ? String((error as { message?: string }).message)
              : "로그인이 필요합니다.";
          setErrorMessage(message);
          router.replace("/auth/login");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    fetchUser();
    return () => {
      isMounted = false;
    };
  }, [router]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.replace("/");
    } catch (error) {
      const message =
        typeof error === "object" && error !== null && "message" in error
          ? String((error as { message?: string }).message)
          : "로그아웃 실패";
      setErrorMessage(message);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>{errorMessage ?? "로그인이 필요합니다."}</div>;
  }

  return (
    <div>
      <h1>Welcome! {user.name}!</h1>
      <button type="button" onClick={handleLogout}>
        Log out
      </button>
    </div>
  );
}