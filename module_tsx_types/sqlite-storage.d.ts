declare module 'react-native-sqlite-storage' {
  export interface SQLiteDatabase {
    transaction(
      fn: (tx: SQLTransaction) => void,
      error?: (error: Error) => void,
      success?: () => void,
    ): void;
    readTransaction(
      fn: (tx: SQLTransaction) => void,
      error?: (error: Error) => void,
      success?: () => void,
    ): void;
    close(): Promise<void>;
  }

  export interface SQLTransaction {
    executeSql(
      sql: string,
      params?: any[],
      success?: (tx: SQLTransaction, results: SQLResultSet) => void,
      error?: (error: Error) => void,
    ): void;
  }

  export interface SQLResultSet {
    insertId?: number;
    rowsAffected: number;
    rows: {
      length: number;
      item: (idx: number) => any;
      raw: () => any[];
    };
  }

  export interface SQLiteParams {
    name: string;
    location?: string;
    createFromLocation?: number | string;
  }

  export function openDatabase(
    params: SQLiteParams,
    success?: (db: SQLiteDatabase) => void,
    error?: (error: Error) => void,
  ): Promise<SQLiteDatabase>;

  export function deleteDatabase(
    params: SQLiteParams,
    success?: () => void,
    error?: (error: Error) => void,
  ): Promise<void>;

  export function enablePromise(enabled: boolean): void;
}
