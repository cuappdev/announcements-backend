import { UserModel } from "./models";
import { UserCreationParams } from "./types";

export class UserService {
  /**
   * Fetch all users from the database.
   *
   * @returns A promise resolving to all users or error.
   */
  public getUsers = async () => {
    return await UserModel.find();
  };

  /**
   * Insert a user into the database.
   *
   * @param userData The data for the new user.
   * @throws InvalidArgumentError when invalid inputs are supplied.
   * @returns A promise resolving to the new user document.
   */
  public insertUser = async (userData: UserCreationParams) => {
    return await UserModel.create(userData);
  };
}
