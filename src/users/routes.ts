import {
  Body,
  Controller,
  Delete,
  Example,
  Get,
  Middlewares,
  Path,
  Post,
  Put,
  Route,
  SuccessResponse,
} from "tsoa";
import { UserService } from "./services";
import { exampleUser, exampleUsers } from "./examples";
import { User } from "./models";
import { UserCreationParams, UserLoginParams, UserUpdateParams } from "./types";
import { Types } from "mongoose";
import { authMiddleware } from "../middleware/authMiddleware";

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
  @Middlewares(authMiddleware)
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
  @Middlewares(authMiddleware)
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
  @Middlewares(authMiddleware)
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
  @Middlewares(authMiddleware)
  @Example(exampleUser)
  public async deleteUser(@Path() userId: Types.ObjectId): Promise<User> {
    return this.userService.deleteUser(userId);
  }

  /**
   * Authenticate a user when logged in.
   *
   * @param req The user login data in the request body.
   * @returns A User object.
   */
  @Post("login")
  @Middlewares(authMiddleware)
  @Example(exampleUser)
  public async authenticateUser(@Body() req: UserLoginParams): Promise<User> {
    // Get user by email and update
    const user = await this.userService.getUserByEmail(req.email);
    const updatedUser = await this.userService.updateUser(user._id, {
      name: req.name,
      imageUrl: req.imageUrl,
    });
    return updatedUser;
  }
}
