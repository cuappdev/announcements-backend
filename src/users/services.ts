import { Types } from "mongoose";
import { UserModel } from "./models";
import { UserCreationParams, UserUpdateParams } from "./types";
import { InvalidArgumentError } from "../utils/errors";

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

  /**
   * Update a user in the database.
   *
   * @param userId The ID of the user to update.
   * @param userData The data for the updated user.
   * @throws InvalidArgumentError when an invalid id is supplied.
   * @returns A promise resolving to the updated user document or error.
   */
  public updateUser = async (
    userId: Types.ObjectId,
    userData: UserUpdateParams
  ) => {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        email: userData.email,
        imageUrl: userData.imageUrl,
        isAdmin: userData.isAdmin,
        name: userData.name,
      },
      { new: true }
    );
    if (!updatedUser) {
      throw new InvalidArgumentError("Invalid userId supplied");
    }
    return updatedUser;
  };

  /**
   * Delete a user in the database.
   *
   * @param userId The ID of the user to delete.
   * @throws InvalidArgumentError when an invalid id is supplied.
   * @returns A promise resolving to the deleted user document.
   */
  public deleteUser = async (userId: Types.ObjectId) => {
    const deletedUser = await UserModel.findByIdAndDelete(userId);
    if (!deletedUser) {
      throw new InvalidArgumentError("Invalid userId supplied");
    }
    return deletedUser;
  };

  /**
   * Fetch a user from the database.
   *
   * @param email The email of the user to fetch.
   * @throws InvalidArgumentError when an invalid id is supplied.
   * @returns A promise resolving to the user document or error.
   */
  public getUserByEmail = async (email: string) => {
    const fetchedUser = await UserModel.findOne({ email });
    if (!fetchedUser) {
      throw new InvalidArgumentError("Invalid email supplied");
    }
    return fetchedUser;
  };
}
