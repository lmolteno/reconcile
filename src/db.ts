import Dexie, { Table } from 'dexie';

export class ReconcileDexie extends Dexie {
  transactions!: Table<Transaction>;
  categories!: Table<Category>;
  rules!: Table<Rule>;

  constructor() {
    super('reconcile');
    this.version(3).stores({
      transactions: '++id, date, description, amount, categoryId',
      categories: '++id, name, parentId',
      rules: '++id, name, categoryId'
    });
  }
}

export const db = new ReconcileDexie();