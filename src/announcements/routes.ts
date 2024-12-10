import { Types } from "mongoose";
import { Announcement } from "./models";
import {
  AnnouncementCreationParamsCreator,
  AnnouncementUpdateParams,
} from "./types";
import { AnnouncementService } from "./services";
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
  Query,
  Route,
  SuccessResponse,
} from "tsoa";
import { exampleAnnouncement, exampleAnnouncements } from "./examples";
import { AppService } from "../apps/services";
import { UserService } from "../users/services";
import { authMiddleware } from "../middleware/authMiddleware";

@Route("announcements")
export class AnnouncementController extends Controller {
  private announcementService;
  private appService;
  private userService;

  constructor() {
    super();
    this.announcementService = new AnnouncementService();
    this.appService = new AppService();
    this.userService = new UserService();
  }

  /**
   * Get all announcements.
   *
   * @returns An array containing all announcements.
   */
  @Get()
  @Middlewares(authMiddleware)
  @Example(exampleAnnouncements)
  public async getAllAnnouncements(
    @Query() debug: boolean
  ): Promise<Announcement[]> {
    return this.announcementService.getAnnouncements(debug);
  }

  /**
   * Create an announcement.
   *
   * @param req The announcement data in the request body.
   * @returns The Announcement object that was created.
   */
  @Post()
  @Middlewares(authMiddleware)
  @Example(exampleAnnouncement)
  @SuccessResponse(201, "Created")
  public async createAnnouncement(
    @Body() req: AnnouncementCreationParamsCreator
  ): Promise<Announcement> {
    this.setStatus(201);

    // Validate app slugs
    await this.appService.validateAppSlugs(req.apps);

    // Fetch email
    const user = await this.userService.getUserByEmail(req.creator);
    return this.announcementService.insertAnnouncement(req, user._id);
  }

  /**
   * Update an announcement with the given ID.
   *
   * @param announcementId The ID of the announcement to update.
   * @param req The announcement data in the request body.
   * @returns The updated Announcement object.
   */
  @Put("{announcementId}")
  @Middlewares(authMiddleware)
  @Example(exampleAnnouncement)
  public async updateAnnouncement(
    @Path() announcementId: Types.ObjectId,
    @Body() req: AnnouncementUpdateParams
  ): Promise<Announcement> {
    // Validate app slugs if given
    if (req.apps) {
      await this.appService.validateAppSlugs(req.apps);
    }
    return this.announcementService.updateAnnouncement(announcementId, req);
  }

  /**
   * Delete an announcement.
   *
   * @returns The Announcement object that was deleted.
   */
  @Delete("{announcementId}")
  @Middlewares(authMiddleware)
  @Example(exampleAnnouncement)
  public async deleteAnnouncement(
    @Path() announcementId: Types.ObjectId
  ): Promise<Announcement> {
    return this.announcementService.deleteAnnouncement(announcementId);
  }

  /**
   * Get all active announcements for an app slug.
   *
   * @param slug The slug nickname for an app.
   * @returns An array containing the active announcements.
   */
  @Get("{slug}")
  public async activeAnnouncements(
    @Path() slug: string,
    @Query() debug: boolean
  ): Promise<Announcement[]> {
    return this.appService.getActiveAnnouncements(slug, debug);
  }
}
