import { NextFunction, Request, Response } from "express";
import { authClient } from "../utils/auth";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  // Check if auth token was provided
  if (
    !req.headers.authorization ||
    req.headers.authorization.split(" ")[0] !== "Bearer"
  ) {
    return res.status(401).json({
      name: "Authorization required",
      details: "There is no token or the provided token is invalid",
    });
  }
  const token = req.headers.authorization.split(" ")[1];

  // Verify auth token
  try {
    const ticket = await authClient.verifyIdToken({
      idToken: token,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(401).json({
        name: "Authentication error",
        details: "Unable to validate auth token or extract user information",
      });
    }

    if (req.path === "/users/login") {
      // Add user information to request body for authentication
      req.body = {
        email: payload.email,
        imageUrl: payload.picture,
        name: payload.name,
      };
    }

    // Add user information to request body for creating announcement
    if (req.path === "/announcements" && req.method === "POST") {
      req.body.creator = payload.email;
    }

    // Add user information to request body for creating a user
    if (req.path === "/users" && req.method === "POST") {
      req.body.imageUrl = payload.picture;
      req.body.name = "";
    }
  } catch (err) {
    console.error(err);
    if (err instanceof Error) {
      return res.status(500).json({
        name: err.name,
        details: err.message,
      });
    } else {
      return res.status(500).json({
        // More specific error for non-Error instances
        name: "Internal Server Error",
        details: "An unexpected error occurred during authentication",
      });
    }
  }

  next();
};
