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
