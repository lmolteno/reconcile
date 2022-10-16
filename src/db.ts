import Dexie, { Table } from 'dexie';

export class ReconcileDexie extends Dexie {
  transactions!: Table<Transaction>;
  categories!: Table<Category>;
  rules!: Table<Rule>;
  files!: Table<ImportedFile>;

  constructor() {
    super('reconcile');
    this.version(1).stores({
      transactions: '++id, date, amount, categoryId, fileId',
      categories: '++id, name, parentId',
      rules: '++id, name, categoryId',
      files: '++id, name',
    });
  }
}

export const db = new ReconcileDexie();