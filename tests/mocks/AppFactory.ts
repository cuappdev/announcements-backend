import { faker } from "@faker-js/faker";
import { App } from "../../src/apps/models";
import FactoryUtils from "../utils/FactoryUtils";

class AppFactory {
  /**
   * Returns a list of random App objects.
   *
   * @param n The number of random App objects.
   * @returns A promise of n number of random App objects.
   */
  public static async create(n: number): Promise<App[]> {
    return Promise.all(FactoryUtils.create(n, AppFactory.mock));
  }

  /**
   * Returns an App initialized with random values.
   *
   * @returns A promise containing a mock App object.
   */
  public static async mock(): Promise<App> {
    const mockApp = new App();
    mockApp.name = faker.string.alpha({ length: { min: 5, max: 10 } });
    mockApp.slug = faker.string.alpha({ length: { min: 5, max: 10 } });
    return mockApp;
  }
}

export default AppFactory;
