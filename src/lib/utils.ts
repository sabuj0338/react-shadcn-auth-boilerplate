import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// src/utils/authUtils.ts
/**
 * Checks if a JWT token is expired.
 * @param token The JWT token string.
 * @returns True if the token is expired or invalid, false otherwise.
 */
export function checkTokenExpired(token: string | null | undefined): boolean {
  if (!token) {
    return true; // No token is treated as expired/invalid
  }
  try {
    const expiry = JSON.parse(atob(token.split('.')[1])).exp;
    const nowInSeconds = Math.floor(new Date().getTime() / 1000);
    return nowInSeconds >= expiry;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true; // Treat decoding errors as expired/invalid
  }
}