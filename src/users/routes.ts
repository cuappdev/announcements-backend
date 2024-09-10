import {
  Body,
  Controller,
  Example,
  Get,
  Post,
  Route,
  SuccessResponse,
} from "tsoa";
import { UserService } from "./services";
import { exampleUser, exampleUsers } from "./examples";
import { User } from "./models";
import { UserCreationParams } from "./types";

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
}
