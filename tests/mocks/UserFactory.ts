import { faker } from "@faker-js/faker";
import { User } from "../../src/users/models";
import FactoryUtils from "../utils/FactoryUtils";

class UserFactory {
  /**
   * Returns a list of random User objects.
   *
   * @param n The number of random User objects.
   * @returns A promise of n number of random User objects.
   */
  public static async create(n: number): Promise<User[]> {
    return Promise.all(FactoryUtils.create(n, UserFactory.mock));
  }

  /**
   * Returns a User initialized with random values.
   *
   * @returns A promise containing a mock User object.
   */
  public static async mock(): Promise<User> {
    const mockUser = new User();
    mockUser.email = faker.internet.email();
    mockUser.imageUrl = faker.image.url();
    mockUser.isAdmin = true;
    mockUser.name = faker.string.alpha({ length: { min: 5, max: 10 } });
    return mockUser;
  }
}

export default UserFactory;
