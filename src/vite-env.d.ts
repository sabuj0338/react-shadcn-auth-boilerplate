/// <reference types="vite/client" />

type IAuth = {
  user: IUser;
  accessToken: string
  refreshToken: string
};

type Role = "customer" | "admin" | "super-admin";

type IUser = {
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
  phoneNumber?: string;
  isEmailVerified: boolean;
  roles: Role[];
  createdAt: string;
  updatedAt: string;
};