import AsyncStorage from '@react-native-async-storage/async-storage';

export default class LogService {
  private static readonly file: string = 'log.txt';

  private static readonly USERS_KEY = '@users';
  private static readonly LOGIN_LOGS_KEY = '@login_logs';
  private static readonly ELECTIONS_KEY = '@elections';

  static info(message: string, ...params: any[]): void {
    const logMessage = `[INFO] ${message}`;
    console.info(logMessage, ...params);
  }

  static warn(message: string, ...params: any[]): void {
    const logMessage = `[WARN] ${message}`;
    console.warn(logMessage, ...params);
  }

  static error(message: string, ...params: any[]): void {
    const logMessage = `[ERROR] ${message}`;
    console.error(logMessage, ...params);
  }
}
