declare global {

  interface Transaction {
    id?: number;
    amount: number;
    date: Date;
    description: string;
    balance?: number;
    inParticulars: string;
    outParticulars: string;
    categoryId?: number;
    fileId: number;
  }

  interface Category {
    id?: number;
    name: string;
    color: string;
    parentId?: number;
  }

  interface Rule {
    id?: number;
    name: string;
    regex: string;
    categoryId: number;
  }

  interface ImportedFile {
    id?: number;
    name: string;
    rawData: any[];
    columns: string[];
  }
}

export {}