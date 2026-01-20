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

import { z } from "zod";

const emailSchema = z.email();
const passwordSchema = z.string().min(8);
const nameSchema = z.string();
const phoneSchema = z.string();
const addressSchema = z.string();
const detailAddressSchema = z.string();
const teacherNameSchema = z.string();
const positionSchema = z.string();
const schoolNameSchema = z.string();
export const createAccount = async (userData: {
  email: string;
  password: string;
  name: string;
  phone: string;
  address: string;
  detailAddress: string;
  teacherName: string;
  position: string;
  schoolName: string;
  schoolLevel: string;
  postcode: string;
}) => {
  const data = {
    email: userData.email,
    password: userData.password,
    name: userData.name,
    phone: userData.phone,
    address: userData.address,
    detailAddress: userData.detailAddress,
    teacherName: userData.teacherName,
    position: userData.position,
    schoolName: userData.schoolName,
    schoolLevel: userData.schoolLevel,
    postcode: userData.postcode,
  };
};
