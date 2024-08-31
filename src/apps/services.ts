import { Types } from "mongoose";
import { AnnouncementModel } from "../announcements/models";
import { App, AppModel } from "./models";
import { AppCreationParams, AppUpdateParams } from "./types";
import { InvalidArgumentError } from "../utils/errors";

export class AppService {
  /**
   * Fetch all apps from the database.
   *
   * @returns A promise resolving to all apps or error.
   */
  public getApps = async () => {
    return await AppModel.find();
  };

  /**
   * Insert an app into the database.
   *
   * @param appData The data for the new app.
   * @throws InvalidArgumentError when invalid inputs are supplied.
   * @returns A promise resolving to the new app document.
   */
  public insertApp = async (appData: AppCreationParams) => {
    return await AppModel.create(appData);
  };

  /**
   * Update an app in the database.
   *
   * @param appId The ID of the app to update.
   * @param appData The data for the updated app.
   * @throws InvalidArgumentError when an invalid id is supplied.
   * @returns A promise resolving to the updated app document or error.
   */
  public updateApp = async (
    appId: Types.ObjectId,
    appData: AppUpdateParams
  ) => {
    const updatedApp = await AppModel.findByIdAndUpdate(
      appId,
      {
        name: appData.name,
        slug: appData.slug,
      },
      { new: true }
    );
    if (!updatedApp) {
      throw new InvalidArgumentError("Invalid appId supplied");
    }
    return updatedApp;
  };

  /**
   * Delete an app in the database.
   *
   * @param appId The ID of the app to delete.
   * @throws InvalidArgumentError when an invalid id is supplied.
   * @returns A promise resolving to the deleted app document.
   */
  public deleteApp = async (appId: Types.ObjectId) => {
    const deletedApp = await AppModel.findByIdAndDelete(appId);
    if (!deletedApp) {
      throw new InvalidArgumentError("Invalid appId supplied");
    }
    return deletedApp;
  };

  /**
   * Fetch all active announcements from the database for a given app.
   *
   * @param slug The slug nickname of the app.
   * @returns A promise resolving to the active announcements or error.
   */
  public getActiveAnnouncements = async (slug: string) => {
    return await AnnouncementModel.find({
      apps: slug,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() },
    });
  };

  /**
   * Validate if the given app slugs exist.
   *
   * @param slugs The slug nicknames of the app.
   * @throws InvalidArgumentError when invalid slugs (existing) are supplied,
   *  otherwise promise of true.
   */
  public validateAppSlugs = async (slugs: string[]): Promise<boolean> => {
    const apps = await AppModel.find().select("slug");
    const allSlugs = apps.map((d: App) => d.slug);

    for (const slug of slugs) {
      if (!allSlugs.includes(slug)) {
        throw new InvalidArgumentError(`The slug [${slug}] does not exist.`);
      }
    }
    return true;
  };
}
