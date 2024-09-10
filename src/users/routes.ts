import { Controller, Example, Get, Route } from "tsoa";
import { UserService } from "./services";
import { exampleUsers } from "./examples";
import { User } from "./models";

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
}
