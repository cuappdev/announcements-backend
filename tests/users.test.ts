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
