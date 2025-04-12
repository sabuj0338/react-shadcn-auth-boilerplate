import { friday } from "@/lib/Friday";

const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL;

export async function login(body: object): Promise<IAuth | undefined> {
  const res = await friday.post(new URL(`${AUTH_API_URL}/login`), {
    body,
  });

  return res?.data?.data;
}

export async function register(body: object) {
  const res = await friday.post(new URL(`${AUTH_API_URL}/register`), { body });

  return res?.data;
}

export async function forgotPassword(body: object) {
  const res = await friday.post(new URL(`${AUTH_API_URL}/forgot-password`), {
    body,
  });

  return res?.data;
}

export async function resetPassword(body: object) {
  const res = await friday.post(new URL(`${AUTH_API_URL}/reset-password`), {
    body,
  });

  return res?.data;
}

export async function sendVerificationEmail() {
  const res = await friday.post(
    new URL(`${AUTH_API_URL}/send-verification-email`)
  );

  return res?.data;
}

export async function verifyEmail(body: object) {
  const res = await friday.post(new URL(`${AUTH_API_URL}/verify-email`), {
    body,
  });

  return res?.data;
}

export async function getProfile(): Promise<IAuth | undefined> {
  const res = await friday.get(new URL(`${AUTH_API_URL}/profile`));

  return res?.data;
}

export async function update(body: object) {
  const res = await friday.put(new URL(`${AUTH_API_URL}/update`), {
    body,
  });

  return res?.data;
}

export async function uploadAvatar(body: FormData) {
  const res = await friday.upload(new URL(`${AUTH_API_URL}/upload-avatar`), body);

  return res?.data;
}
