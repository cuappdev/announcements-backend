import {
  Body,
  Controller,
  Delete,
  Example,
  Get,
  Path,
  Post,
  Put,
  Route,
  SuccessResponse,
} from "tsoa";
import { UserService } from "./services";
import { exampleUser, exampleUsers } from "./examples";
import { User } from "./models";
import { UserCreationParams, UserUpdateParams } from "./types";
import { Types } from "mongoose";

@Route("users")
export class UserController extends Controller {
  private userService;

  constructor() {
    super();
    this.userService = new UserService();
  }

  /**
   * Get all users.
   *
   * @returns An array containing all userse.
   */
  @Get()
  @Example(exampleUsers)
  public async getAllUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }

  /**
   * Create a user.
   *
   * @param req The user data in the request body.
   * @returns The User object that was created.
   */
  @Post()
  @Example(exampleUser)
  @SuccessResponse(201, "Created")
  public async createUser(@Body() req: UserCreationParams): Promise<User> {
    this.setStatus(201);
    return this.userService.insertUser(req);
  }

  /**
   * Update a user with the given ID.
   *
   * @param userId The ID of the user to update.
   * @param req The user data in the request body.
   * @returns The updated User object.
   */
  @Put("{userId}")
  @Example(exampleUser)
  public async updateUser(
    @Path() userId: Types.ObjectId,
    @Body() req: UserUpdateParams
  ): Promise<User> {
    return this.userService.updateUser(userId, req);
  }

  /**
   * Delete a user.
   *
   * @returns The User object that was deleted.
   */
  @Delete("{userId}")
  @Example(exampleUser)
  public async deleteUser(@Path() userId: Types.ObjectId): Promise<User> {
    return this.userService.deleteUser(userId);
  }

  /**
   * Get a user by ID.
   *
   * @param userId The ID of the user to fetch.
   * @returns A User object.
   */
  @Get("{userId}")
  @Example(exampleUser)
  public async getUser(@Path() userId: Types.ObjectId): Promise<User> {
    return this.userService.getUserById(userId);
  }
}
