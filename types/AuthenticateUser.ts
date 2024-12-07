import type { UserCredential, Auth } from 'firebase/auth';

export type AuthenticateUserProps = (
  auth: Auth,
  email: string,
  password: string
) => Promise<UserCredential>;
