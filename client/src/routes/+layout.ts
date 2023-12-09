import { base } from "$app/paths";
import { defaultUser, type User } from '../lib/auth/user';
import type { LayoutLoad } from './$types';

export const ssr = false;

export const load: LayoutLoad = async ({ fetch }) => {
  try {
    const [{ name, avatarUrl }, backups] = await Promise.all([
      fetch(`${base}/api/user`).then(res => res.json()),
      fetch(`${base}/api/backups`).then(res => res.json())
    ])
    return {
      user: <User>{
        isAuthenticated: true,
        name,
        avatarUrl
      },
      backups
    }
  } catch (err) {
    return {
      user: defaultUser,
      backups: []
    }
  }
};