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
   * Find a user from the database.
   *
   * @param userId The ID of the user to find.
   * @throws InvalidArgumentError when an invalid id is supplied.
   * @returns A promise resolving to the user document or error.
   */
  public getUserById = async (userId: Types.ObjectId) => {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new InvalidArgumentError("Invalid userId supplied");
    }
    return user;
  };

  /**
   * Insert a user into the database.
   *
   * @param userData The data for the new user.
   * @returns A promise resolving to the new user document.
   */
  public insertUser = async (userData: UserCreationParams) => {
    return await UserModel.create({ userData });
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
        firstName: userData.firstName,
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
}
