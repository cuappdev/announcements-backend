import { Types } from "mongoose";
import { Announcement } from "./models";
import { AnnouncementCreationParams, AnnouncementUpdateParams } from "./types";
import { AnnouncementService } from "./services";
import {
  Body,
  Controller,
  Delete,
  Example,
  Get,
  Path,
  Post,
  Put,
  Query,
  Route,
  SuccessResponse,
} from "tsoa";
import { exampleAnnouncement, exampleAnnouncements } from "./examples";
import { AppService } from "../apps/services";

@Route("announcements")
export class AnnouncementController extends Controller {
  private announcementService;
  private appService;

  constructor() {
    super();
    this.announcementService = new AnnouncementService();
    this.appService = new AppService();
  }

  /**
   * Get all announcements.
   *
   * @returns An array containing all announcements.
   */
  @Get()
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
  @Example(exampleAnnouncement)
  @SuccessResponse(201, "Created")
  public async createAnnouncement(
    @Body() req: AnnouncementCreationParams
  ): Promise<Announcement> {
    this.setStatus(201);

    // Validate app slugs
    await this.appService.validateAppSlugs(req.apps);
    return this.announcementService.insertAnnouncement(req);
  }

  /**
   * Update an announcement with the given ID.
   *
   * @param announcementId The ID of the announcement to update.
   * @param req The announcement data in the request body.
   * @returns The updated Announcement object.
   */
  @Put("{announcementId}")
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
