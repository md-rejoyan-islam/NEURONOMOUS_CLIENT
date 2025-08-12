"use server";

import { cookies } from "next/headers";
import { permanentRedirect } from "next/navigation";
export const logout = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");

  permanentRedirect("/login");

  // return {
  //   success: true,
  //   message: "Logged out successfully",
  // };
};

export const getGroupById = async (id: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/groups/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getCookie("accessToken")}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch group");
  }
  const result = await res.json();

  return result.data;
};

export const getDeviceById = async (id: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/devices/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getCookie("accessToken")}`,
      },
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch device");
  }
  const result = await res.json();

  return result.data;
};

export const getCookie = async (name: string) => {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(name);
  return cookie ? cookie.value : null;
};
