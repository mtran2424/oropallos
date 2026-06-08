import { Config, ConfigRequest } from "@/components/global.utils";

export const getConfigs = async (user: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/config/get/user/${user}`, {
    method: 'GET',
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch configs');
  }
  return res.json();
}

export const createConfig = async (config: ConfigRequest) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/config/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'applications/json'
    },
    body: JSON.stringify({ config }),
  });

  if (!res.ok) {
    throw new Error('Failed to create config');
  }
  return res;
}