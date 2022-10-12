interface UnmergedData {
  name: string,
  columns: string[],
  data: Transaction[],
  rawData: any[],
}

interface Transaction {
  id?: number;
  amount: number;
  date: Date;
  description: string;
  balance?: number;
  inParticulars: string;
  outParticulars: string;
  categoryId?: number;
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
