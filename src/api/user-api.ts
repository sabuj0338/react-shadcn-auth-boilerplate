import { friday } from "@/lib/Friday";

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

export async function create(body: object) {
  const res = await friday.post(new URL(`${BASE_API_URL}/users/create`), {
    body,
  });

  return res?.data;
}