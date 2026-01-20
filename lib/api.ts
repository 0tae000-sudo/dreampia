// lib/api-client.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const loginUser = async (userData: {
  email: string;
  password: string;
}) => {
  console.log(userData);
  const response = await fetch(`${API_BASE_URL}/www/users/`, {
    method: "POST",
    body: JSON.stringify(userData),
  });

  if (!response.ok) throw new Error("로그인 실패");
  return response.json();
};
