import {
  describe,
  beforeAll,
  afterAll,
  expect,
  it,
  beforeEach,
} from "@jest/globals";
import { connectDB, disconnectDB } from "./utils/dbConnection";
import { UserService } from "../src/users/services";
import { UserModel } from "../src/users/models";
import UserFactory from "./mocks/UserFactory";
import { Types } from "mongoose";
import { InvalidArgumentError } from "../src/utils/errors";
import { faker } from "@faker-js/faker";

describe("getUsers", () => {
  let userService: UserService;

  beforeAll(async () => {
    await connectDB();
    await UserModel.createCollection();
    await UserModel.syncIndexes();
    userService = new UserService();
  });

  afterAll(async () => {
    await UserModel.deleteMany({});
    await disconnectDB();
  });

  beforeEach(async () => {
    await UserModel.deleteMany({});
  });

  it("should return no users", async () => {
    // when
    const getResponse = await userService.getUsers();

    // then
    expect(getResponse).toHaveLength(0);
  });

  it("should return 5 users", async () => {
    // given
    const users = await UserFactory.create(5);
    await UserModel.create(users);

    // when
    const getResponse = await userService.getUsers();

    // then
    expect(getResponse).toHaveLength(5);
  });
});

describe("insertUser", () => {
  let userService: UserService;

  beforeAll(async () => {
    await connectDB();
    await UserModel.createCollection();
    await UserModel.syncIndexes();
    userService = new UserService();
  });

  afterAll(async () => {
    await UserModel.deleteMany({});
    await disconnectDB();
  });

  beforeEach(async () => {
    await UserModel.deleteMany({});
  });

  it("should have the same fields as the mock", async () => {
    // given
    const mocks = await UserFactory.create(1);
    const mockUser = mocks[0];

    // when
    const insertResponse = await userService.insertUser(mockUser);

    // then
    expect(insertResponse.email).toStrictEqual(mockUser.email);
    expect(insertResponse.imageUrl).toStrictEqual(mockUser.imageUrl);
    expect(insertResponse.isAdmin).toStrictEqual(mockUser.isAdmin);
    expect(insertResponse.name).toStrictEqual(mockUser.name);
  });

  it("should throw an error for duplicate email", async () => {
    // given
    const mocks = await UserFactory.create(2);
    mocks[1].email = mocks[0].email;
    await userService.insertUser(mocks[0]);

    // when
    const insertRequest = async () => await userService.insertUser(mocks[1]);

    // then
    await expect(insertRequest).rejects.toThrow();
  });
});

describe("updateUser", () => {
  let userService: UserService;

  beforeAll(async () => {
    await connectDB();
    await UserModel.createCollection();
    await UserModel.syncIndexes();
    userService = new UserService();
  });

  afterAll(async () => {
    await UserModel.deleteMany({});
    await disconnectDB();
  });

  beforeEach(async () => {
    await UserModel.deleteMany({});
  });

  it("should throw an error for invalid id", async () => {
    // given
    const mocks = await UserFactory.create(1);
    const mockUser = mocks[0];
    const mockId = new Types.ObjectId();
    await UserModel.create(mocks);

    // when
    const updateRequest = async () =>
      await userService.updateUser(mockId, {
        email: mockUser.email,
        name: mockUser.name,
      });

    // then
    await expect(updateRequest).rejects.toThrow(InvalidArgumentError);

    // when
    const getResponse = await UserModel.find();

    // then
    expect(getResponse[0].email).toStrictEqual(mockUser.email);
    expect(getResponse[0].imageUrl).toStrictEqual(mockUser.imageUrl);
    expect(getResponse[0].isAdmin).toStrictEqual(mockUser.isAdmin);
    expect(getResponse[0].name).toStrictEqual(mockUser.name);
  });

  it("should throw an error for duplicate email", async () => {
    // given
    const mocks = await UserFactory.create(2);
    const email = mocks[0].email;
    await UserModel.create(mocks[0]);
    const mockUser2 = await UserModel.create(mocks[1]);

    // when
    const updateRequest = async () =>
      await userService.updateUser(mockUser2._id, { email });

    // then
    await expect(updateRequest).rejects.toThrow();
  });

  it("should properly update a single field only", async () => {
    // given
    const mocks = await UserFactory.create(1);
    const mockUser = mocks[0];
    const newName = faker.string.alpha({ length: { min: 5, max: 10 } });
    const insertResponse = await UserModel.create(mockUser);

    // when
    const updateRequest = await userService.updateUser(insertResponse._id, {
      name: newName,
    });

    // then
    expect(updateRequest._id).toStrictEqual(insertResponse._id);
    expect(updateRequest.email).toStrictEqual(mockUser.email);
    expect(updateRequest.imageUrl).toStrictEqual(mockUser.imageUrl);
    expect(updateRequest.isAdmin).toStrictEqual(mockUser.isAdmin);
    expect(updateRequest.name).toStrictEqual(newName);

    // when
    const getRequest = await UserModel.find();

    // then
    expect(getRequest[0]._id).toStrictEqual(insertResponse._id);
    expect(getRequest[0].email).toStrictEqual(mockUser.email);
    expect(getRequest[0].imageUrl).toStrictEqual(mockUser.imageUrl);
    expect(getRequest[0].isAdmin).toStrictEqual(mockUser.isAdmin);
    expect(getRequest[0].name).toStrictEqual(newName);
  });

  it("should properly update multiple fields", async () => {
    // given
    const mocks = await UserFactory.create(1);
    const mockUser = mocks[0];
    const newName = faker.string.alpha({ length: { min: 5, max: 10 } });
    const newEmail = faker.string.alpha({ length: { min: 5, max: 10 } });
    const newImageUrl = faker.image.url();
    const newIsAdmin = false;

    const insertResponse = await UserModel.create(mockUser);

    // when
    const updateRequest = await userService.updateUser(insertResponse._id, {
      email: newEmail,
      imageUrl: newImageUrl,
      isAdmin: newIsAdmin,
      name: newName,
    });

    // then
    expect(updateRequest._id).toStrictEqual(insertResponse._id);
    expect(updateRequest.email).toStrictEqual(newEmail);
    expect(updateRequest.imageUrl).toStrictEqual(newImageUrl);
    expect(updateRequest.isAdmin).toStrictEqual(newIsAdmin);
    expect(updateRequest.name).toStrictEqual(newName);

    // when
    const getRequest = await UserModel.find();

    // then
    expect(getRequest[0]._id).toStrictEqual(insertResponse._id);
    expect(getRequest[0].email).toStrictEqual(newEmail);
    expect(getRequest[0].imageUrl).toStrictEqual(newImageUrl);
    expect(getRequest[0].isAdmin).toStrictEqual(newIsAdmin);
    expect(getRequest[0].name).toStrictEqual(newName);
  });
});

describe("deleteUser", () => {
  let userService: UserService;

  beforeAll(async () => {
    await connectDB();
    await UserModel.createCollection();
    await UserModel.syncIndexes();
    userService = new UserService();
  });

  afterAll(async () => {
    await UserModel.deleteMany({});
    await disconnectDB();
  });

  beforeEach(async () => {
    await UserModel.deleteMany({});
  });

  it("should throw an error for invalid id", async () => {
    // given
    const mocks = await UserFactory.create(1);
    const mockUser = mocks[0];
    const mockId = new Types.ObjectId();
    await UserModel.create(mockUser);

    // when
    const deleteRequest = async () => await userService.deleteUser(mockId);

    // then
    await expect(deleteRequest).rejects.toThrow(InvalidArgumentError);

    // when
    const getResponse = await UserModel.find();

    // then
    expect(getResponse[0].email).toStrictEqual(mockUser.email);
    expect(getResponse[0].imageUrl).toStrictEqual(mockUser.imageUrl);
    expect(getResponse[0].isAdmin).toStrictEqual(mockUser.isAdmin);
    expect(getResponse[0].name).toStrictEqual(mockUser.name);
  });

  it("should delete the mock user", async () => {
    // given
    const mocks = await UserFactory.create(1);
    const mockUser = mocks[0];
    const insertResponse = await UserModel.create(mockUser);

    // when
    const deleteResponse = await userService.deleteUser(insertResponse._id);
    const getResponse = await UserModel.find();

    // then
    expect(deleteResponse._id).toStrictEqual(insertResponse._id);
    expect(deleteResponse.email).toStrictEqual(mockUser.email);
    expect(deleteResponse.imageUrl).toStrictEqual(mockUser.imageUrl);
    expect(deleteResponse.isAdmin).toStrictEqual(mockUser.isAdmin);
    expect(deleteResponse.name).toStrictEqual(mockUser.name);
    expect(getResponse).toHaveLength(0);
  });
});
