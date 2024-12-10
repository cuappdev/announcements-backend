import { App } from "./models";
import { AppService } from "./services";
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
import { exampleApp, exampleApps } from "./examples";
import { AppCreationParams, AppUpdateParams } from "./types";
import { Types } from "mongoose";
import { authMiddleware } from "../middleware/authMiddleware";

@Route("apps")
export class AppController extends Controller {
  private appService;

  constructor() {
    super();
    this.appService = new AppService();
  }

  /**
   * Get all apps.
   *
   * @returns An array containing all apps.
   */
  @Get()
  @Middlewares(authMiddleware)
  @Example(exampleApps)
  public async getAllApps(): Promise<App[]> {
    return this.appService.getApps();
  }

  /**
   * Create an app.
   *
   * @param req The app data in the request body.
   * @returns The App object that was created.
   */
  @Post()
  @Middlewares(authMiddleware)
  @Example(exampleApp)
  @SuccessResponse(201, "Created")
  public async createApp(@Body() req: AppCreationParams): Promise<App> {
    this.setStatus(201);
    return this.appService.insertApp(req);
  }

  /**
   * Update an app with the given ID.
   *
   * @param appId The ID of the app to update.
   * @param req The app data in the request body.
   * @returns The updated App object.
   */
  @Put("{appId}")
  @Middlewares(authMiddleware)
  @Example(exampleApp)
  public async updateApp(
    @Path() appId: Types.ObjectId,
    @Body() req: AppUpdateParams
  ): Promise<App> {
    return this.appService.updateApp(appId, req);
  }

  /**
   * Delete an app.
   *
   * @returns The App object that was deleted.
   */
  @Delete("{appId}")
  @Middlewares(authMiddleware)
  @Example(exampleApp)
  public async deleteApp(@Path() appId: Types.ObjectId): Promise<App> {
    return this.appService.deleteApp(appId);
  }
}
