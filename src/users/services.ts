import { UserModel } from "./models";

export class UserService {
  /**
   * Fetch all users from the database.
   *
   * @returns A promise resolving to all users or error.
   */
  public getUsers = async () => {
    return await UserModel.find();
  };
}
