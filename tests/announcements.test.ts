import {
  describe,
  beforeAll,
  afterAll,
  expect,
  it,
  beforeEach,
} from "@jest/globals";
import { connectDB, disconnectDB } from "./utils/dbConnection";
import { Types } from "mongoose";
import { InvalidArgumentError } from "../src/utils/errors";
import { faker } from "@faker-js/faker";
import { AnnouncementModel } from "../src/announcements/models";
import { AnnouncementService } from "../src/announcements/services";
import AnnouncementFactory from "./mocks/AnnouncementFactory";

describe("getAnnouncements", () => {
  let announcementService: AnnouncementService;

  beforeAll(async () => {
    await connectDB();
    await AnnouncementModel.createCollection();
    await AnnouncementModel.syncIndexes();
    announcementService = new AnnouncementService();
  });

  afterAll(async () => {
    await AnnouncementModel.deleteMany({});
    await disconnectDB();
  });

  beforeEach(async () => {
    await AnnouncementModel.deleteMany({});
  });

  it("should return no announcements no debug", async () => {
    // given
    const isDebug = false;

    // when
    const getResponse = await announcementService.getAnnouncements(isDebug);

    // then
    expect(getResponse).toHaveLength(0);
  });

  it("should return 5 announcements no debug", async () => {
    // given
    const announcements = await AnnouncementFactory.create(5);
    const isDebug = false;
    await AnnouncementModel.create(announcements);

    // when
    const getResponse = await announcementService.getAnnouncements(isDebug);

    // then
    expect(getResponse).toHaveLength(5);
  });

  it("should return 5 announcements with debug", async () => {
    // given
    const announcements = await AnnouncementFactory.create(5);
    announcements.forEach((ann) => (ann.isDebug = true));
    const isDebug = true;
    await AnnouncementModel.create(announcements);

    // when
    const getResponse = await announcementService.getAnnouncements(isDebug);

    // then
    expect(getResponse).toHaveLength(5);
  });
});

describe("insertAnnouncements", () => {
  let announcementService: AnnouncementService;

  beforeAll(async () => {
    await connectDB();
    await AnnouncementModel.createCollection();
    await AnnouncementModel.syncIndexes();
    announcementService = new AnnouncementService();
  });

  afterAll(async () => {
    await AnnouncementModel.deleteMany({});
    await disconnectDB();
  });

  beforeEach(async () => {
    await AnnouncementModel.deleteMany({});
  });

  it("should have the same fields as the mock no debug", async () => {
    // given
    const mocks = await AnnouncementFactory.create(1);
    const mockAnnouncement = mocks[0];

    // when
    const insertResponse = await announcementService.insertAnnouncement(
      mockAnnouncement
    );

    // then
    expect(insertResponse.apps).toStrictEqual(mockAnnouncement.apps);
    expect(insertResponse.body).toStrictEqual(mockAnnouncement.body);
    expect(insertResponse.endDate).toStrictEqual(mockAnnouncement.endDate);
    expect(insertResponse.imageUrl).toStrictEqual(mockAnnouncement.imageUrl);
    expect(insertResponse.isDebug).toStrictEqual(mockAnnouncement.isDebug);
    expect(insertResponse.link).toStrictEqual(mockAnnouncement.link);
    expect(insertResponse.startDate).toStrictEqual(mockAnnouncement.startDate);
    expect(insertResponse.title).toStrictEqual(mockAnnouncement.title);
  });

  it("should have the same fields as the mock with debug", async () => {
    // given
    const mocks = await AnnouncementFactory.create(1);
    const mockAnnouncement = mocks[0];
    mockAnnouncement.isDebug = true;

    // when
    const insertResponse = await announcementService.insertAnnouncement(
      mockAnnouncement
    );

    // then
    expect(insertResponse.apps).toStrictEqual(mockAnnouncement.apps);
    expect(insertResponse.body).toStrictEqual(mockAnnouncement.body);
    expect(insertResponse.endDate).toStrictEqual(mockAnnouncement.endDate);
    expect(insertResponse.imageUrl).toStrictEqual(mockAnnouncement.imageUrl);
    expect(insertResponse.isDebug).toStrictEqual(mockAnnouncement.isDebug);
    expect(insertResponse.link).toStrictEqual(mockAnnouncement.link);
    expect(insertResponse.startDate).toStrictEqual(mockAnnouncement.startDate);
    expect(insertResponse.title).toStrictEqual(mockAnnouncement.title);
  });

  it("should throw an error if start date is after end date", async () => {
    // given
    const mocks = await AnnouncementFactory.create(1);
    const mockAnnouncement = mocks[0];
    mockAnnouncement.startDate = faker.date.between({
      from: mockAnnouncement.endDate,
      to: new Date().getTime() + 1000 * 60 * 60 * 24 * 365 * 1000,
    });

    // when
    const insertRequest = async () => {
      await announcementService.insertAnnouncement(mockAnnouncement);
    };

    // then
    await expect(insertRequest).rejects.toThrow(InvalidArgumentError);
  });
});

describe("updateAnnouncements", () => {
  let announcementService: AnnouncementService;

  beforeAll(async () => {
    await connectDB();
    await AnnouncementModel.createCollection();
    await AnnouncementModel.syncIndexes();
    announcementService = new AnnouncementService();
  });

  afterAll(async () => {
    await AnnouncementModel.deleteMany({});
    await disconnectDB();
  });

  beforeEach(async () => {
    await AnnouncementModel.deleteMany({});
  });

  it("should throw an error for invalid id", async () => {
    // given
    const mocks = await AnnouncementFactory.create(1);
    const mockAnnouncement = mocks[0];
    const mockId = new Types.ObjectId();
    await AnnouncementModel.create(mocks);

    // when
    const updateRequest = async () =>
      await announcementService.updateAnnouncement(mockId, {
        title: mockAnnouncement.title,
        body: mockAnnouncement.body,
      });

    // then
    await expect(updateRequest).rejects.toThrow(InvalidArgumentError);

    // when
    const getResponse = await AnnouncementModel.find();

    // then
    expect(getResponse[0].title).toStrictEqual(mockAnnouncement.title);
    expect(getResponse[0].body).toStrictEqual(mockAnnouncement.body);
  });

  it("should throw an error if start date is after end date", async () => {
    // given
    const mocks = await AnnouncementFactory.create(1);
    const mockAnnouncement = mocks[0];
    const insertResponse = await AnnouncementModel.create(mockAnnouncement);
    const futureDate = faker.date.between({
      from: mockAnnouncement.endDate,
      to: new Date().getTime() + 1000 * 60 * 60 * 24 * 365 * 1000,
    });
    const pastDate = faker.date.between({
      from: new Date().getTime() - 1000 * 60 * 60 * 24 * 365 * 1000,
      to: mockAnnouncement.startDate,
    });

    // when
    const updateRequest1 = async () =>
      await announcementService.updateAnnouncement(insertResponse._id, {
        startDate: futureDate,
      });
    const updateRequest2 = async () =>
      await announcementService.updateAnnouncement(insertResponse._id, {
        endDate: pastDate,
      });
    const updateRequest3 = async () =>
      await announcementService.updateAnnouncement(insertResponse._id, {
        startDate: futureDate,
        endDate: pastDate,
      });

    // then
    await expect(updateRequest1).rejects.toThrow(InvalidArgumentError);
    await expect(updateRequest2).rejects.toThrow(InvalidArgumentError);
    await expect(updateRequest3).rejects.toThrow(InvalidArgumentError);

    // when
    const getResponse = await AnnouncementModel.find();

    // then
    expect(getResponse[0].title).toStrictEqual(mockAnnouncement.title);
    expect(getResponse[0].body).toStrictEqual(mockAnnouncement.body);
  });

  it("should properly update a single field only", async () => {
    // given
    const mocks = await AnnouncementFactory.create(1);
    const mockAnnouncement = mocks[0];
    const newBody = faker.string.alpha({ length: { min: 5, max: 10 } });
    const insertResponse = await AnnouncementModel.create(mockAnnouncement);

    // when
    const updateRequest = await announcementService.updateAnnouncement(
      insertResponse._id,
      {
        body: newBody,
      }
    );

    // then
    expect(updateRequest._id).toStrictEqual(insertResponse._id);
    expect(updateRequest.apps).toStrictEqual(mockAnnouncement.apps);
    expect(updateRequest.body).toStrictEqual(newBody);
    expect(updateRequest.endDate).toStrictEqual(mockAnnouncement.endDate);
    expect(updateRequest.imageUrl).toStrictEqual(mockAnnouncement.imageUrl);
    expect(updateRequest.isDebug).toStrictEqual(mockAnnouncement.isDebug);
    expect(updateRequest.link).toStrictEqual(mockAnnouncement.link);
    expect(updateRequest.startDate).toStrictEqual(mockAnnouncement.startDate);
    expect(updateRequest.title).toStrictEqual(mockAnnouncement.title);

    // when
    const getRequest = await AnnouncementModel.find();

    // then
    expect(getRequest[0]._id).toStrictEqual(insertResponse._id);
    expect(getRequest[0].apps).toStrictEqual(mockAnnouncement.apps);
    expect(getRequest[0].body).toStrictEqual(newBody);
    expect(getRequest[0].endDate).toStrictEqual(mockAnnouncement.endDate);
    expect(getRequest[0].imageUrl).toStrictEqual(mockAnnouncement.imageUrl);
    expect(getRequest[0].isDebug).toStrictEqual(mockAnnouncement.isDebug);
    expect(getRequest[0].link).toStrictEqual(mockAnnouncement.link);
    expect(getRequest[0].startDate).toStrictEqual(mockAnnouncement.startDate);
    expect(getRequest[0].title).toStrictEqual(mockAnnouncement.title);
  });

  it("should properly update multiple fields", async () => {
    // given
    const mocks = await AnnouncementFactory.create(1);
    const mockAnnouncement = mocks[0];
    const newBody = faker.string.alpha({ length: { min: 5, max: 10 } });
    const newTitle = faker.string.alpha({ length: { min: 5, max: 10 } });
    const insertResponse = await AnnouncementModel.create(mockAnnouncement);

    // when
    const updateRequest = await announcementService.updateAnnouncement(
      insertResponse._id,
      {
        body: newBody,
        title: newTitle,
      }
    );

    // then
    expect(updateRequest._id).toStrictEqual(insertResponse._id);
    expect(updateRequest.apps).toStrictEqual(mockAnnouncement.apps);
    expect(updateRequest.body).toStrictEqual(newBody);
    expect(updateRequest.endDate).toStrictEqual(mockAnnouncement.endDate);
    expect(updateRequest.imageUrl).toStrictEqual(mockAnnouncement.imageUrl);
    expect(updateRequest.isDebug).toStrictEqual(mockAnnouncement.isDebug);
    expect(updateRequest.link).toStrictEqual(mockAnnouncement.link);
    expect(updateRequest.startDate).toStrictEqual(mockAnnouncement.startDate);
    expect(updateRequest.title).toStrictEqual(newTitle);

    // when
    const getRequest = await AnnouncementModel.find();

    // then
    expect(getRequest[0]._id).toStrictEqual(insertResponse._id);
    expect(getRequest[0].apps).toStrictEqual(mockAnnouncement.apps);
    expect(getRequest[0].body).toStrictEqual(newBody);
    expect(getRequest[0].endDate).toStrictEqual(mockAnnouncement.endDate);
    expect(getRequest[0].imageUrl).toStrictEqual(mockAnnouncement.imageUrl);
    expect(getRequest[0].isDebug).toStrictEqual(mockAnnouncement.isDebug);
    expect(getRequest[0].link).toStrictEqual(mockAnnouncement.link);
    expect(getRequest[0].startDate).toStrictEqual(mockAnnouncement.startDate);
    expect(getRequest[0].title).toStrictEqual(newTitle);
  });
});

describe("deleteAnnouncements", () => {
  let announcementService: AnnouncementService;

  beforeAll(async () => {
    await connectDB();
    await AnnouncementModel.createCollection();
    await AnnouncementModel.syncIndexes();
    announcementService = new AnnouncementService();
  });

  afterAll(async () => {
    await AnnouncementModel.deleteMany({});
    await disconnectDB();
  });

  beforeEach(async () => {
    await AnnouncementModel.deleteMany({});
  });

  it("should throw an error for invalid id", async () => {
    // given
    const mocks = await AnnouncementFactory.create(1);
    const mockAnnouncement = mocks[0];
    const mockId = new Types.ObjectId();
    await AnnouncementModel.create(mocks);

    // when
    const deleteRequest = async () =>
      await announcementService.updateAnnouncement(mockId, {
        title: mockAnnouncement.title,
        body: mockAnnouncement.body,
      });

    // then
    await expect(deleteRequest).rejects.toThrow(InvalidArgumentError);

    // when
    const getResponse = await AnnouncementModel.find();

    // then
    expect(getResponse[0].title).toStrictEqual(mockAnnouncement.title);
    expect(getResponse[0].body).toStrictEqual(mockAnnouncement.body);
  });

  it("should delete the mock app", async () => {
    // given
    const mocks = await AnnouncementFactory.create(1);
    const mockAnnouncement = mocks[0];
    const insertResponse = await AnnouncementModel.create(mockAnnouncement);

    // when
    const deleteResponse = await announcementService.deleteAnnouncement(
      insertResponse._id
    );
    const getResponse = await AnnouncementModel.find();

    // then
    expect(deleteResponse._id).toStrictEqual(insertResponse._id);
    expect(deleteResponse.apps).toStrictEqual(mockAnnouncement.apps);
    expect(deleteResponse.body).toStrictEqual(mockAnnouncement.body);
    expect(deleteResponse.endDate).toStrictEqual(mockAnnouncement.endDate);
    expect(deleteResponse.imageUrl).toStrictEqual(mockAnnouncement.imageUrl);
    expect(deleteResponse.isDebug).toStrictEqual(mockAnnouncement.isDebug);
    expect(deleteResponse.link).toStrictEqual(mockAnnouncement.link);
    expect(deleteResponse.startDate).toStrictEqual(mockAnnouncement.startDate);
    expect(deleteResponse.title).toStrictEqual(mockAnnouncement.title);
    expect(getResponse).toHaveLength(0);
  });
});
