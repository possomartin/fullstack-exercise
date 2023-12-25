import "express-session";

export type User = {
  id: number;
  username: string;
  password: string;
  admin: boolean;
};

export type UserService = {
  register: (user: Omit<User, "id">) => Promise<User | void>;
  checkUser: (user: Omit<User, "id">) => Promise<User | void>;
};

declare module "express-session" {
  interface SessionData {
    user: User | Partial<User>;
    isAuth: boolean;
  }
}
