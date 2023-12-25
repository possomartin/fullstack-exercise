import bcrypt from "bcrypt";
import dbConnection from "../../config/connection.js";
import { User, UserService } from "../types/user.js";

const register = async (user: Omit<User, "id">): Promise<User | void> => {
  try {
    const client = await dbConnection.connect();
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(user.password, salt);

    const response = await client.query(
      'INSERT INTO public."User"(username, password, admin) VALUES ($1, $2, $3) Returning *',
      [user.username, hashedPassword, user.admin]
    );

    const resUser = response.rows[0];

    if (!!resUser) {
      return resUser;
    }

    return;
  } catch (e: unknown) {
    console.error(e);
  }
};

const checkUser = async (user: Omit<User, "id">): Promise<User | void> => {
  try {
    const client = await dbConnection.connect();

    const query = await client.query(
      'Select * from public."User" where username=$1',
      [user.username]
    );
    const foundUser = query.rows[0];

    client.release();

    if (!!foundUser) {
      if (await bcrypt.compare(user.password, foundUser.password)) {
        return foundUser;
      }
    }
    return;
  } catch (e: unknown) {
    console.error(e);
  }
};

const userService: UserService = {
  register: register,
  checkUser: checkUser,
};

export default userService;
