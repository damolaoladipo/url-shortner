import { ENVType } from "./enums.util";

class AppEnv {
  constructor(){}
  /**
   * @name isProduction
   * @description Determines if app is in production
   * @returns {boolean} -boolean (true if app is in production, false otherwise)
   */
  public isProduction(): boolean {
    let result: boolean = false;
    if (process.env.APP_ENV === ENVType.PRODUCTION) {
      result = true;
    }
    return result;
  }
  /**
   * @name isStaging
   * @description Determines if app is in production
   * @returns  {boolean} -boolean (true if app is in staging, false otherwise)
   */
  public isStaging(): boolean {
    let result: boolean = false;
    if (process.env.APP_ENV === ENVType.STAGING) {
      result = true;
    }

    return result;
  }

  /**
   * @name
   * @description
   * @returns
   */
  public isDev(): boolean {
    let result: boolean = false;
    if (process.env.APP_ENV === ENVType.DEVELOPMENT) {
      result = true;
    }
    return result;
  }
}

export  default new AppEnv;
