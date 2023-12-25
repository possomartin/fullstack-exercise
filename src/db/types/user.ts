import "express-session";

export type User = {
  id: number;
  username: string;
  password: string;
  admin: boolean;
};

declare module "express-session" {
  interface SessionData {
    user: User | Partial<User>;
    isAuth: boolean;
  }
}
