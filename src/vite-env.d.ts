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
  avatar: string | null;
  phoneNumber: string | null;
  isEmailVerified: boolean;
  roles: Role[];
  createdAt: string;
  updatedAt: string;
};

type IBlogCategory = {
  id: string;
  title: string;
  type: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
};

type IBlog = {
  id: string;
  category: string;
  title: string;
  imageUrl: string;
  description: string;
  status: boolean;
  isBanner: boolean;
  createdAt: string;
  updatedAt: string;
};

type IDealerCategory = {
  id: string;
  title: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
};

type IDealer = {
  id: string;
  category: string;
  fullName: string;
  imageUrl: string;
  address: string;
  lat: string;
  lng: string;
  phoneNumber: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
};

type INews = {
  id: string;
  title: string;
  imageUrl: string;
  newsLink: string;
  status: boolean;
  isBanner: boolean;
  createdAt: string;
  updatedAt: string;
};


type KeyValue = {
  value: string;
  label: string;
}

// Define your schema column type as returned by the backend API
type SchemaColumn = {
  name: string;
  title: string;
  type: string;
  inputType: string;
  options: KeyValue[] | null;
}