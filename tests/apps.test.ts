import {
  describe,
  beforeAll,
  afterAll,
  expect,
  it,
  beforeEach,
} from "@jest/globals";
import { connectDB, disconnectDB } from "./utils/dbConnection";
import { AppModel } from "../src/apps/models";
import { AppService } from "../src/apps/services";
import AppFactory from "./mocks/AppFactory";
import { Types } from "mongoose";
import { InvalidArgumentError } from "../src/utils/errors";
import { faker } from "@faker-js/faker";
import AnnouncementFactory from "./mocks/AnnouncementFactory";
import { AnnouncementModel } from "../src/announcements/models";

describe("getApps", () => {
  let appService: AppService;

  beforeAll(async () => {
    await connectDB();
    await AppModel.createCollection();
    await AppModel.syncIndexes();
    appService = new AppService();
  });

  afterAll(async () => {
    await AppModel.deleteMany({});
    await disconnectDB();
  });

  beforeEach(async () => {
    await AppModel.deleteMany({});
  });

  it("should return no apps", async () => {
    // when
    const getResponse = await appService.getApps();

    // then
    expect(getResponse).toHaveLength(0);
  });

  it("should return 5 apps", async () => {
    // given
    const apps = await AppFactory.create(5);
    await AppModel.create(apps);

    // when
    const getResponse = await appService.getApps();

    // then
    expect(getResponse).toHaveLength(5);
  });
});

describe("insertApp", () => {
  let appService: AppService;

  beforeAll(async () => {
    await connectDB();
    await AppModel.createCollection();
    await AppModel.syncIndexes();
    appService = new AppService();
  });

  afterAll(async () => {
    await AppModel.deleteMany({});
    await disconnectDB();
  });

  beforeEach(async () => {
    await AppModel.deleteMany({});
  });

  it("should have the same fields as the mock", async () => {
    // given
    const mocks = await AppFactory.create(1);
    const mockApp = mocks[0];

    // when
    const insertResponse = await appService.insertApp(mockApp);

    // then
    expect(insertResponse.name).toStrictEqual(mockApp.name);
    expect(insertResponse.slug).toStrictEqual(mockApp.slug);
  });

  it("should throw an error for duplicate slug", async () => {
    // given
    const mocks = await AppFactory.create(2);
    mocks[1].slug = mocks[0].slug;
    await appService.insertApp(mocks[0]);

    // when
    const insertRequest = async () => await appService.insertApp(mocks[1]);

    // then
    await expect(insertRequest).rejects.toThrow();
  });
});

describe("updateApp", () => {
  let appService: AppService;

  beforeAll(async () => {
    await connectDB();
    await AppModel.createCollection();
    await AppModel.syncIndexes();
    appService = new AppService();
  });

  afterAll(async () => {
    await AppModel.deleteMany({});
    await disconnectDB();
  });

  beforeEach(async () => {
    await AppModel.deleteMany({});
  });

  it("should throw an error for invalid id", async () => {
    // given
    const mocks = await AppFactory.create(1);
    const mockApp = mocks[0];
    const mockId = new Types.ObjectId();
    await AppModel.create(mocks);

    // when
    const updateRequest = async () =>
      await appService.updateApp(mockId, {
        name: mockApp.name,
        slug: mockApp.slug,
      });

    // then
    await expect(updateRequest).rejects.toThrow(InvalidArgumentError);

    // when
    const getResponse = await AppModel.find();

    // then
    expect(getResponse[0].name).toStrictEqual(mockApp.name);
    expect(getResponse[0].slug).toStrictEqual(mockApp.slug);
  });

  it("should throw an error for duplicate slug", async () => {
    // given
    const mocks = await AppFactory.create(2);
    const slug = mocks[0].slug;
    await AppModel.create(mocks[0]);
    const mockApp2 = await AppModel.create(mocks[1]);

    // when
    const updateRequest = async () =>
      await appService.updateApp(mockApp2._id, { slug });

    // then
    await expect(updateRequest).rejects.toThrow();
  });

  it("should properly update a single field only", async () => {
    // given
    const mocks = await AppFactory.create(1);
    const mockApp = mocks[0];
    const newName = faker.string.alpha({ length: { min: 5, max: 10 } });
    const insertResponse = await AppModel.create(mockApp);

    // when
    const updateRequest = await appService.updateApp(insertResponse._id, {
      name: newName,
    });

    // then
    expect(updateRequest._id).toStrictEqual(insertResponse._id);
    expect(updateRequest.name).toStrictEqual(newName);
    expect(updateRequest.slug).toStrictEqual(mockApp.slug);

    // when
    const getRequest = await AppModel.find();

    // then
    expect(getRequest[0]._id).toStrictEqual(insertResponse._id);
    expect(getRequest[0].name).toStrictEqual(newName);
    expect(getRequest[0].slug).toStrictEqual(mockApp.slug);
  });

  it("should properly update multiple fields", async () => {
    // given
    const mocks = await AppFactory.create(1);
    const mockApp = mocks[0];
    const newName = faker.string.alpha({ length: { min: 5, max: 10 } });
    const newSlug = faker.string.alpha({ length: { min: 5, max: 10 } });
    const insertResponse = await AppModel.create(mockApp);

    // when
    const updateRequest = await appService.updateApp(insertResponse._id, {
      name: newName,
      slug: newSlug,
    });

    // then
    expect(updateRequest._id).toStrictEqual(insertResponse._id);
    expect(updateRequest.name).toStrictEqual(newName);
    expect(updateRequest.slug).toStrictEqual(newSlug);

    // when
    const getRequest = await AppModel.find();

    // then
    expect(getRequest[0]._id).toStrictEqual(insertResponse._id);
    expect(getRequest[0].name).toStrictEqual(newName);
    expect(getRequest[0].slug).toStrictEqual(newSlug);
  });
});

describe("deleteApp", () => {
  let appService: AppService;

  beforeAll(async () => {
    await connectDB();
    await AppModel.createCollection();
    await AppModel.syncIndexes();
    appService = new AppService();
  });

  afterAll(async () => {
    await AppModel.deleteMany({});
    await disconnectDB();
  });

  beforeEach(async () => {
    await AppModel.deleteMany({});
  });

  it("should throw an error for invalid id", async () => {
    // given
    const mocks = await AppFactory.create(1);
    const mockApp = mocks[0];
    const mockId = new Types.ObjectId();
    await AppModel.create(mockApp);

    // when
    const deleteRequest = async () => await appService.deleteApp(mockId);

    // then
    await expect(deleteRequest).rejects.toThrow(InvalidArgumentError);

    // when
    const getResponse = await AppModel.find();

    // then
    expect(getResponse[0].name).toStrictEqual(mockApp.name);
    expect(getResponse[0].slug).toStrictEqual(mockApp.slug);
  });

  it("should delete the mock app", async () => {
    // given
    const mocks = await AppFactory.create(1);
    const mockApp = mocks[0];
    const insertResponse = await AppModel.create(mockApp);

    // when
    const deleteResponse = await appService.deleteApp(insertResponse._id);
    const getResponse = await AppModel.find();

    // then
    expect(deleteResponse._id).toStrictEqual(insertResponse._id);
    expect(deleteResponse.slug).toStrictEqual(mockApp.slug);
    expect(deleteResponse.name).toStrictEqual(mockApp.name);
    expect(getResponse).toHaveLength(0);
  });
});

describe("getActiveAnnouncements", () => {
  let appService: AppService;

  beforeAll(async () => {
    await connectDB();
    await AppModel.createCollection();
    await AppModel.syncIndexes();
    appService = new AppService();
  });

  afterAll(async () => {
    await AppModel.deleteMany({});
    await disconnectDB();
  });

  beforeEach(async () => {
    await AppModel.deleteMany({});
  });

  it("should return no active announcements with incorrect slug no debug", async () => {
    // given
    const mockApp = (await AppFactory.create(1))[0];
    const mockAnnouncement = (await AnnouncementFactory.create(1))[0];
    await AppModel.create(mockApp);
    await AnnouncementModel.create(mockAnnouncement);
    const isDebug = false;

    // when
    const response = await appService.getActiveAnnouncements(
      mockApp.slug,
      isDebug
    );

    // then
    expect(response).toHaveLength(0);
  });

  it("should return no active announcements with correct slug no debug", async () => {
    // given
    const mockApp = (await AppFactory.create(1))[0];
    const mockAnnouncement = (await AnnouncementFactory.create(1))[0];
    mockAnnouncement.apps.push(mockApp.slug);
    mockAnnouncement.startDate = mockAnnouncement.endDate;
    await AppModel.create(mockApp);
    await AnnouncementModel.create(mockAnnouncement);
    const isDebug = false;

    // when
    const response = await appService.getActiveAnnouncements(
      mockApp.slug,
      isDebug
    );

    // then
    expect(response).toHaveLength(0);
  });

  it("should return one active announcement with correct slug no debug", async () => {
    // given
    const mockApp = (await AppFactory.create(1))[0];
    const mockAnnouncements = await AnnouncementFactory.create(2);
    mockAnnouncements[0].apps.push(mockApp.slug);
    mockAnnouncements[1].apps.push(mockApp.slug);
    mockAnnouncements[0].startDate = mockAnnouncements[0].endDate;
    mockAnnouncements[1].startDate = faker.date.between({
      from: new Date().getTime() - 1000 * 60 * 60 * 24 * 365 * 1000,
      to: mockAnnouncements[1].startDate,
    });
    mockAnnouncements[1].endDate = faker.date.between({
      from: mockAnnouncements[1].endDate,
      to: new Date().getTime() + 1000 * 60 * 60 * 24 * 365 * 1000,
    });
    await AppModel.create(mockApp);
    await AnnouncementModel.create(mockAnnouncements[0]);
    const activeAnnouncement = await AnnouncementModel.create(
      mockAnnouncements[1]
    );
    const isDebug = false;

    // when
    const response = await appService.getActiveAnnouncements(
      mockApp.slug,
      isDebug
    );

    // then
    expect(response).toHaveLength(1);
    expect(response[0]._id).toStrictEqual(activeAnnouncement._id);
  });

  it("should return many active announcements with correct slug no debug", async () => {
    // given
    const mockApp = (await AppFactory.create(1))[0];
    const mockAnnouncements = await AnnouncementFactory.create(2);
    mockAnnouncements[0].apps.push(mockApp.slug);
    mockAnnouncements[1].apps.push(mockApp.slug);
    mockAnnouncements[0].startDate = faker.date.between({
      from: new Date().getTime() - 1000 * 60 * 60 * 24 * 365 * 1000,
      to: mockAnnouncements[1].startDate,
    });
    mockAnnouncements[0].endDate = faker.date.between({
      from: mockAnnouncements[1].endDate,
      to: new Date().getTime() + 1000 * 60 * 60 * 24 * 365 * 1000,
    });
    mockAnnouncements[1].startDate = faker.date.between({
      from: new Date().getTime() - 1000 * 60 * 60 * 24 * 365 * 1000,
      to: mockAnnouncements[1].startDate,
    });
    mockAnnouncements[1].endDate = faker.date.between({
      from: mockAnnouncements[1].endDate,
      to: new Date().getTime() + 1000 * 60 * 60 * 24 * 365 * 1000,
    });
    await AppModel.create(mockApp);
    await AnnouncementModel.create(mockAnnouncements);
    const isDebug = false;

    // when
    const response = await appService.getActiveAnnouncements(
      mockApp.slug,
      isDebug
    );

    // then
    expect(response).toHaveLength(2);
  });

  it("should return many active announcements with correct slug with debug", async () => {
    // given
    const mockApp = (await AppFactory.create(1))[0];
    const mockAnnouncements = await AnnouncementFactory.create(2);
    mockAnnouncements[0].apps.push(mockApp.slug);
    mockAnnouncements[1].apps.push(mockApp.slug);
    mockAnnouncements[0].startDate = faker.date.between({
      from: new Date().getTime() - 1000 * 60 * 60 * 24 * 365 * 1000,
      to: mockAnnouncements[1].startDate,
    });
    mockAnnouncements[0].endDate = faker.date.between({
      from: mockAnnouncements[1].endDate,
      to: new Date().getTime() + 1000 * 60 * 60 * 24 * 365 * 1000,
    });
    mockAnnouncements[1].startDate = faker.date.between({
      from: new Date().getTime() - 1000 * 60 * 60 * 24 * 365 * 1000,
      to: mockAnnouncements[1].startDate,
    });
    mockAnnouncements[1].endDate = faker.date.between({
      from: mockAnnouncements[1].endDate,
      to: new Date().getTime() + 1000 * 60 * 60 * 24 * 365 * 1000,
    });
    mockAnnouncements.forEach((ann) => (ann.isDebug = true));
    await AppModel.create(mockApp);
    await AnnouncementModel.create(mockAnnouncements);
    const isDebug = true;

    // when
    const response = await appService.getActiveAnnouncements(
      mockApp.slug,
      isDebug
    );

    // then
    expect(response).toHaveLength(2);
  });
});

describe("validateAppSlugs", () => {
  let appService: AppService;

  beforeAll(async () => {
    await connectDB();
    await AppModel.createCollection();
    await AppModel.syncIndexes();
    appService = new AppService();
  });

  afterAll(async () => {
    await AppModel.deleteMany({});
    await disconnectDB();
  });

  beforeEach(async () => {
    await AppModel.deleteMany({});
  });

  it("should return true for existing slugs", async () => {
    // given
    const mocks = await AppFactory.create(1);
    const mockApp = mocks[0];
    const slug = faker.string.alpha({ length: { min: 5, max: 10 } });
    mockApp.slug = slug;
    await AppModel.create(mockApp);

    // when
    const validateResponse = await appService.validateAppSlugs([slug]);

    // then
    await expect(validateResponse).toStrictEqual(true);
  });

  it("should return true for no slugs provided", async () => {
    // given
    const mocks = await AppFactory.create(1);
    const mockApp = mocks[0];
    await AppModel.create(mockApp);

    // when
    const validateResponse = await appService.validateAppSlugs([]);

    // then
    await expect(validateResponse).toStrictEqual(true);
  });

  it("should throw an error for non-existing slugs provided", async () => {
    // given
    const mocks = await AppFactory.create(2);
    const slug = faker.string.alpha({ length: { min: 5, max: 10 } });
    await AppModel.create(mocks);

    // when
    const validateRequest = async () =>
      await appService.validateAppSlugs([slug]);

    // then
    await expect(validateRequest).rejects.toThrow(InvalidArgumentError);
  });
});
