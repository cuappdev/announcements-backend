import { Controller, Get, Post, Query, Route } from "tsoa";
import { AuthService } from "./services";

@Route("auth")
export class AuthController extends Controller {
  private authService;

  constructor() {
    super();
    this.authService = new AuthService();
  }

  /**
   * Get the login URL for Google Auth.
   *
   * @returns The URL generated by Google OAuth for users to log in.
   */
  @Get("url")
  public async getLoginUrl(): Promise<string> {
    return this.authService.getLoginUrl();
  }

  /**
   * Get the auth token for a user.
   *
   * @returns The auth token.
   */
  @Post("token")
  public async getToken(@Query() code: string): Promise<string> {
    return this.authService.getToken(code);
  }
}
