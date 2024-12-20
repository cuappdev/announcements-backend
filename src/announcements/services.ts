import { Types } from "mongoose";
import { AnnouncementModel } from "./models";
import { AnnouncementCreationParams, AnnouncementUpdateParams } from "./types";
import { InvalidArgumentError } from "../utils/errors";
import { isDateBefore } from "../utils/helpers";

export class AnnouncementService {
  /**
   * Fetch all announcements from the database.
   *
   * @param isDebug Whether to fetch announcements that are for debugging purposes.
   * @returns A promise resolving to all announcements or error.
   */
  public getAnnouncements = async (isDebug: boolean) => {
    if (isDebug) {
      return await AnnouncementModel.find({ isDebug: true }).populate(
        "creator"
      );
    }
    return await AnnouncementModel.find({ isDebug: false }).populate("creator");
  };

  /**
   * Insert an announcement into the database.
   *
   * @param announcementData The data for the new announcement.
   * @param creatorId The ID of the user creating this announcement.
   * @throws InvalidArgumentError when invalid inputs are supplied.
   * @returns A promise resolving to the new announcement document.
   */
  public insertAnnouncement = async (
    announcementData: AnnouncementCreationParams,
    creatorId: Types.ObjectId
  ) => {
    // Validate dates
    if (!isDateBefore(announcementData.startDate, announcementData.endDate)) {
      throw new InvalidArgumentError("Start date must be before end date");
    }

    const announcement = await AnnouncementModel.create({
      ...announcementData,
      creator: creatorId,
    });
    await announcement.populate("creator");

    return announcement;
  };

  /**
   * Update an announcement in the database.
   *
   * @param announcementId The ID of the announcement to update.
   * @param announcementData The data for the updated announcement.
   * @throws InvalidArgumentError when an invalid id is supplied.
   * @returns A promise resolving to the updated announcement document or error.
   */
  public updateAnnouncement = async (
    announcementId: Types.ObjectId,
    announcementData: AnnouncementUpdateParams
  ) => {
    const oldAnnouncement = await AnnouncementModel.findById(announcementId);
    if (!oldAnnouncement) {
      throw new InvalidArgumentError("Invalid announcementId supplied");
    }

    // Validate dates
    if (announcementData.startDate && announcementData.endDate) {
      // Pass in both start and end
      if (!isDateBefore(announcementData.startDate, announcementData.endDate)) {
        throw new InvalidArgumentError("Start date must be before end date");
      }
    } else if (announcementData.startDate) {
      // Pass in start only
      if (!isDateBefore(announcementData.startDate, oldAnnouncement.endDate)) {
        throw new InvalidArgumentError("Start date must be before end date");
      }
    } else if (announcementData.endDate) {
      // Pass in end only
      if (!isDateBefore(oldAnnouncement.startDate, announcementData.endDate)) {
        throw new InvalidArgumentError("Start date must be before end date");
      }
    }

    const updatedAnnouncement = await AnnouncementModel.findByIdAndUpdate(
      announcementId,
      {
        apps: announcementData.apps,
        body: announcementData.body,
        endDate: announcementData.endDate,
        imageUrl: announcementData.imageUrl,
        link: announcementData.link,
        startDate: announcementData.startDate,
        title: announcementData.title,
      },
      { new: true }
    );
    if (!updatedAnnouncement) {
      throw new InvalidArgumentError("Invalid announcementId supplied");
    }
    await updatedAnnouncement.populate("creator");
    return updatedAnnouncement;
  };

  /**
   * Delete an announcement in the database.
   *
   * @param announcementId The ID of the announcement to delete.
   * @throws InvalidArgumentError when an invalid id is supplied.
   * @returns A promise resolving to the deleted announcement document.
   */
  public deleteAnnouncement = async (announcementId: Types.ObjectId) => {
    const deletedAnnouncement = await AnnouncementModel.findByIdAndDelete(
      announcementId
    );
    if (!deletedAnnouncement) {
      throw new InvalidArgumentError("Invalid announcementId supplied");
    }
    await deletedAnnouncement.populate("creator");
    return deletedAnnouncement;
  };
}
