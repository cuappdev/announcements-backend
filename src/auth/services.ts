import { authClient } from "../utils/auth";
import { AuthError } from "../utils/errors";

export class AuthService {
  /**
   * Get the login URL for Google Auth.
   *
   * @returns The URL generated by Google OAuth for users to log in.
   */
  public getLoginUrl = async () => {
    return authClient.generateAuthUrl({
      access_type: "online",
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ],
    });
  };

  /**
   * Get the auth token for a user.
   *
   * @param code The code provided by Google sign-in.
   * @throws AuthError if the OAuth2 request fails.
   * @returns The auth token.
   */
  public getToken = async (code: string) => {
    const tokenData = await authClient.getToken(code);
    authClient.setCredentials(tokenData.tokens);
    const { id_token } = authClient.credentials;

    if (!id_token) {
      throw new AuthError("Incorrectly formatted OAuth2 request");
    }

    return id_token;
  };
}
