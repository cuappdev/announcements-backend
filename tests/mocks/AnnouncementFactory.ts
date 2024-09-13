import { faker } from "@faker-js/faker";
import { Announcement } from "../../src/announcements/models";
import FactoryUtils from "../utils/FactoryUtils";
import AppFactory from "./AppFactory";

class AnnouncementFactory {
  /**
   * Returns a list of random Announcement objects.
   *
   * @param n The number of random Announcement objects.
   * @returns A promise of n number of random Announcement objects.
   */
  public static async create(n: number): Promise<Announcement[]> {
    return Promise.all(FactoryUtils.create(n, AnnouncementFactory.mock));
  }

  /**
   * Returns an Announcement initialized with random values.
   *
   * @returns A promise containing a mock Announcement object.
   */
  public static async mock(): Promise<Announcement> {
    const mockAnnouncement = new Announcement();
    mockAnnouncement.apps = (await AppFactory.create(4)).map((app) => app.slug);
    mockAnnouncement.body = faker.string.alpha({ length: { min: 5, max: 10 } });
    mockAnnouncement.endDate = faker.date.future();
    mockAnnouncement.imageUrl = faker.image.url();
    mockAnnouncement.isDebug = false;
    mockAnnouncement.link = faker.internet.url();
    mockAnnouncement.startDate = faker.date.between({
      from: new Date(),
      to: mockAnnouncement.endDate,
    });
    mockAnnouncement.title = faker.string.alpha({
      length: { min: 5, max: 10 },
    });
    return mockAnnouncement;
  }
}

export default AnnouncementFactory;
